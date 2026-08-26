// -- ASTRONOMICAL PRAYER TIME CALCULATOR --------------
//
// Computes the five daily prayer times (plus sunrise) for a given date,
// geographic location and calculation method, entirely on-device — no
// network call or external API involved.
//
// The method follows the standard low-precision solar-position equations
// (equivalent to the series in Meeus, "Astronomical Algorithms") and the
// conventional "hour angle" construction used by prayer-time calculators
// worldwide: the sun's declination and the equation of time are derived
// for the given date, then each prayer is the moment the sun crosses a
// specific angle relative to the local horizon (below it for Fajr/Isha,
// at the horizon for Sunrise/Maghrib, or a shadow-length-derived altitude
// for Asr), offset from local solar noon (Dhuhr) by that angle's hour
// angle at the given latitude.

var DEG2RAD = Math.PI / 180;
var RAD2DEG = 180 / Math.PI;

function sinDeg(d) {
  return Math.sin(d * DEG2RAD);
}
function cosDeg(d) {
  return Math.cos(d * DEG2RAD);
}
function tanDeg(d) {
  return Math.tan(d * DEG2RAD);
}
function asinDeg(x) {
  return Math.asin(x) * RAD2DEG;
}
function acosDeg(x) {
  return Math.acos(x) * RAD2DEG;
}
function atan2Deg(y, x) {
  return Math.atan2(y, x) * RAD2DEG;
}

function fixAngle(a) {
  a = a % 360;
  return a < 0 ? a + 360 : a;
}
function fixHour(h) {
  h = h % 24;
  return h < 0 ? h + 24 : h;
}

// Julian Day Number at 0h UT for a Gregorian calendar date.
function julianDay(year, month, day) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  var a = Math.floor(year / 100);
  var b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

// Sun's declination (degrees) and the equation of time (hours, "apparent
// minus mean" convention) for the given Julian Day.
function sunPosition(jd) {
  var d = jd - 2451545.0; // days since J2000.0
  var meanAnomaly = fixAngle(357.529 + 0.98560028 * d);
  var meanLongitude = fixAngle(280.459 + 0.98564736 * d);
  var eclipticLongitude = fixAngle(meanLongitude + 1.915 * sinDeg(meanAnomaly) + 0.02 * sinDeg(2 * meanAnomaly));
  var obliquity = 23.439 - 0.00000036 * d;

  var rightAscension = atan2Deg(cosDeg(obliquity) * sinDeg(eclipticLongitude), cosDeg(eclipticLongitude)) / 15;
  var declination = asinDeg(sinDeg(obliquity) * sinDeg(eclipticLongitude));
  var equationOfTime = meanLongitude / 15 - fixHour(rightAscension);

  return { declination: declination, equationOfTime: equationOfTime };
}

// Hours (from local solar noon) at which the sun's altitude equals
// `-angle` degrees (i.e. `angle` degrees below the horizon when angle is
// positive) at the given latitude/declination. Returns null when the sun
// never reaches that angle that day (can happen at high latitudes).
function hourAngle(angle, latitude, declination) {
  var cosH = (-sinDeg(angle) - sinDeg(latitude) * sinDeg(declination)) / (cosDeg(latitude) * cosDeg(declination));
  if (cosH < -1 || cosH > 1 || isNaN(cosH)) return null;
  return acosDeg(cosH) / 15;
}

// Hours (from local solar noon) at which an object's shadow reaches
// `shadowFactor` times its own length plus its noon shadow (the
// conventional Asr definition: shadowFactor 1 = Shafi/Maliki/Hanbali,
// 2 = Hanafi).
function asrHourAngle(shadowFactor, latitude, declination) {
  var t = Math.abs(latitude - declination);
  var altitude = atan2Deg(1, shadowFactor + tanDeg(t));
  return hourAngle(-altitude, latitude, declination);
}

// Angle pairs (Fajr, Isha) in degrees below the horizon, per calculation
// convention. `ishaMinutes` is used instead of an angle by conventions
// that define Isha as a fixed offset after Maghrib (e.g. Umm al-Qura).
export var CALC_METHODS = {
  MWL: { fajrAngle: 18, ishaAngle: 17, label: { ar: "رابطة العالم الإسلامي", en: "Muslim World League", de: "Muslimische Weltliga" } },
  ISNA: { fajrAngle: 15, ishaAngle: 15, label: { ar: "الجمعية الإسلامية لأمريكا الشمالية", en: "ISNA (North America)", de: "ISNA (Nordamerika)" } },
  EGYPT: { fajrAngle: 19.5, ishaAngle: 17.5, label: { ar: "الهيئة المصرية العامة للمساحة", en: "Egyptian General Authority", de: "Ägyptische Generalbehörde" } },
  MAKKAH: { fajrAngle: 18.5, ishaMinutes: 90, label: { ar: "جامعة أم القرى (مكة)", en: "Umm al-Qura (Makkah)", de: "Umm al-Qura (Mekka)" } },
  KARACHI: { fajrAngle: 18, ishaAngle: 18, label: { ar: "جامعة العلوم الإسلامية، كراتشي", en: "University of Karachi", de: "Universität Karatschi" } },
};

export var DEFAULT_METHOD = "MWL";

export var PRAYER_LABELS = {
  fajr: { ar: "الفجر", en: "Fajr", de: "Fajr" },
  sunrise: { ar: "الشروق", en: "Sunrise", de: "Sonnenaufgang" },
  dhuhr: { ar: "الظهر", en: "Dhuhr", de: "Dhuhr" },
  asr: { ar: "العصر", en: "Asr", de: "Asr" },
  maghrib: { ar: "المغرب", en: "Maghrib", de: "Maghrib" },
  isha: { ar: "العشاء", en: "Isha", de: "Isha" },
};

export var PRAYER_ORDER = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

// shadowFactor: 1 = Shafi/Maliki/Hanbali (default), 2 = Hanafi.
export var ASR_MADHABS = {
  STANDARD: { shadowFactor: 1, label: { ar: "الجمهور (شافعي/مالكي/حنبلي)", en: "Standard (Shafi/Maliki/Hanbali)", de: "Standard" } },
  HANAFI: { shadowFactor: 2, label: { ar: "حنفي", en: "Hanafi", de: "Hanafi" } },
};

var SUN_ANGLE = 0.833; // refraction + solar radius, used for sunrise/sunset

// Builds the real, absolute-instant Date for a given decimal UTC-hours
// value on `baseDate`'s local calendar day (e.g. 9.25 -> 09:15 UTC on that
// day). Because this is a genuine point on the timeline, it can be
// compared directly against `new Date()` and will display correctly via
// the ordinary local Date getters/formatters -- no manual timezone
// arithmetic needed at the call site.
function toInstant(baseDate, utcHours) {
  var epochAtLocalMidnightUTC = Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  return new Date(epochAtLocalMidnightUTC + Math.round(utcHours * 3600000));
}

/**
 * Computes today's prayer times for a location. The returned Dates are
 * real absolute instants (correct regardless of the caller's own time
 * zone) under the assumption that the device's local time zone matches
 * the given location -- true whenever the coordinates come from the
 * device's own geolocation, which is the only source this app uses.
 *
 * @param {Object} opts
 * @param {number} opts.latitude
 * @param {number} opts.longitude
 * @param {Date}   [opts.date] - defaults to now (read using local
 *   getFullYear/getMonth/getDate, i.e. "today" as the device sees it)
 * @param {string} [opts.method] - key into CALC_METHODS
 * @param {string} [opts.asrMadhab] - key into ASR_MADHABS
 * @returns {{fajr:Date, sunrise:Date, dhuhr:Date, asr:Date, maghrib:Date, isha:Date, approximate:boolean}}
 */
export function computePrayerTimes(opts) {
  var date = opts.date || new Date();
  var latitude = opts.latitude;
  var longitude = opts.longitude;
  var method = CALC_METHODS[opts.method] || CALC_METHODS[DEFAULT_METHOD];
  var madhab = ASR_MADHABS[opts.asrMadhab] || ASR_MADHABS.STANDARD;

  var jd = julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate()) - longitude / (15 * 24);
  var sun = sunPosition(jd);
  var decl = sun.declination;

  var dhuhrUTC = 12 - longitude / 15 - sun.equationOfTime;

  var sunriseH = hourAngle(SUN_ANGLE, latitude, decl);
  var fajrH = hourAngle(method.fajrAngle, latitude, decl);
  var asrH = asrHourAngle(madhab.shadowFactor, latitude, decl);
  var ishaH = method.ishaAngle != null ? hourAngle(method.ishaAngle, latitude, decl) : null;

  var approximate = false;
  if (sunriseH == null || fajrH == null || asrH == null || (method.ishaAngle != null && ishaH == null)) {
    approximate = true;
  }
  // High-latitude fallback: when the sun doesn't reach the twilight angle
  // (midnight sun / polar twilight seasons), approximate Fajr/Isha as a
  // fixed offset from Sunrise/Maghrib rather than producing no time at
  // all. This trades precision for availability; see README for the
  // limitation.
  sunriseH = sunriseH != null ? sunriseH : 6;
  fajrH = fajrH != null ? fajrH : sunriseH - 1.5;
  asrH = asrH != null ? asrH : 3;

  var maghribUTC = dhuhrUTC + sunriseH;
  var ishaMinutesOffset = method.ishaMinutes != null ? method.ishaMinutes / 60 : null;

  var times = {
    fajr: toInstant(date, dhuhrUTC - fajrH),
    sunrise: toInstant(date, dhuhrUTC - sunriseH),
    dhuhr: toInstant(date, dhuhrUTC),
    asr: toInstant(date, dhuhrUTC + asrH),
    maghrib: toInstant(date, maghribUTC),
    isha: toInstant(date, ishaMinutesOffset != null ? maghribUTC + ishaMinutesOffset : dhuhrUTC + (ishaH != null ? ishaH : sunriseH + 1.5)),
    approximate: approximate,
  };

  return times;
}
