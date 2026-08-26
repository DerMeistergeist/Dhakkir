import { computePrayerTimes } from "./prayerTimes";

// Cairo-ish and Mecca coordinates, used across the tests below. Test
// dates are built with the local Date constructor (year, monthIndex, day)
// rather than an ISO UTC string, so `date.getFullYear/getMonth/getDate()`
// -- which computePrayerTimes reads as "today" -- resolve to the intended
// calendar day regardless of the test runner's own time zone.
var CAIRO = { latitude: 30.0444, longitude: 31.2357 };
var MECCA = { latitude: 21.4225, longitude: 39.8262 };
var BERLIN = { latitude: 52.52, longitude: 13.405 };

var JUNE_SOLSTICE = new Date(2024, 5, 15);
var MARCH_EQUINOX = new Date(2024, 2, 20);

// Reads a Date's UTC hour-of-day as a decimal (e.g. 9:30 -> 9.5). Using
// UTC fields (not the local getHours/getMinutes) keeps assertions
// independent of the test runner's own time zone, since the underlying
// instant is a genuine, unambiguous point on the timeline.
function utcHourOfDay(date) {
  return date.getUTCHours() + date.getUTCMinutes() / 60;
}

describe("computePrayerTimes", () => {
  test("prayers fall in the correct chronological order", () => {
    var times = computePrayerTimes(Object.assign({ date: JUNE_SOLSTICE, method: "MWL" }, CAIRO));
    expect(times.fajr.getTime()).toBeLessThan(times.sunrise.getTime());
    expect(times.sunrise.getTime()).toBeLessThan(times.dhuhr.getTime());
    expect(times.dhuhr.getTime()).toBeLessThan(times.asr.getTime());
    expect(times.asr.getTime()).toBeLessThan(times.maghrib.getTime());
    expect(times.maghrib.getTime()).toBeLessThan(times.isha.getTime());
  });

  test("day length is close to 12h at the equator regardless of season", () => {
    [new Date(2024, 0, 10), JUNE_SOLSTICE, new Date(2024, 8, 23)].forEach((date) => {
      var times = computePrayerTimes({ latitude: 0, longitude: 0, date: date, method: "MWL" });
      var dayLengthHours = (times.maghrib.getTime() - times.sunrise.getTime()) / 3600000;
      expect(dayLengthHours).toBeGreaterThan(11.8);
      expect(dayLengthHours).toBeLessThan(12.2);
    });
  });

  test("sunrise/sunset are roughly symmetric around Dhuhr at the equinox", () => {
    var times = computePrayerTimes(Object.assign({ date: MARCH_EQUINOX, method: "MWL" }, CAIRO));
    var beforeNoon = times.dhuhr.getTime() - times.sunrise.getTime();
    var afterNoon = times.maghrib.getTime() - times.dhuhr.getTime();
    expect(Math.abs(beforeNoon - afterNoon)).toBeLessThan(6 * 60000); // within ~6 minutes
  });

  test("Dhuhr in Mecca lands shortly after clock noon, matching its position within its time zone (UTC+3)", () => {
    var times = computePrayerTimes(Object.assign({ date: JUNE_SOLSTICE, method: "MAKKAH" }, MECCA));
    // Real-world Mecca Dhuhr is ~12:15-12:30 local; local = UTC+3, so the
    // absolute instant should land at roughly 9-10 UTC.
    expect(utcHourOfDay(times.dhuhr)).toBeGreaterThan(8.5);
    expect(utcHourOfDay(times.dhuhr)).toBeLessThan(10.5);
  });

  test("Hanafi Asr is always later than the standard (Shafi) Asr", () => {
    var standard = computePrayerTimes(Object.assign({ date: JUNE_SOLSTICE, method: "MWL", asrMadhab: "STANDARD" }, CAIRO));
    var hanafi = computePrayerTimes(Object.assign({ date: JUNE_SOLSTICE, method: "MWL", asrMadhab: "HANAFI" }, CAIRO));
    expect(hanafi.asr.getTime()).toBeGreaterThan(standard.asr.getTime());
  });

  test("a larger Isha twilight angle produces a later Isha time", () => {
    var mwl = computePrayerTimes(Object.assign({ date: JUNE_SOLSTICE, method: "MWL" }, CAIRO)); // 17°
    var egypt = computePrayerTimes(Object.assign({ date: JUNE_SOLSTICE, method: "EGYPT" }, CAIRO)); // 17.5°
    var karachi = computePrayerTimes(Object.assign({ date: JUNE_SOLSTICE, method: "KARACHI" }, CAIRO)); // 18°
    expect(mwl.isha.getTime()).toBeLessThanOrEqual(egypt.isha.getTime());
    expect(egypt.isha.getTime()).toBeLessThanOrEqual(karachi.isha.getTime());
  });

  test("Umm al-Qura Isha is a fixed 90 minutes after Maghrib", () => {
    var times = computePrayerTimes(Object.assign({ date: JUNE_SOLSTICE, method: "MAKKAH" }, MECCA));
    var minutesAfterMaghrib = (times.isha.getTime() - times.maghrib.getTime()) / 60000;
    expect(minutesAfterMaghrib).toBeGreaterThan(89);
    expect(minutesAfterMaghrib).toBeLessThan(91);
  });

  test("falls back gracefully instead of throwing near the poles in summer", () => {
    var opts = { latitude: 78, longitude: 15, date: JUNE_SOLSTICE, method: "MWL" };
    expect(() => computePrayerTimes(opts)).not.toThrow();
    expect(computePrayerTimes(opts).approximate).toBe(true);
  });

  test("Fajr still lands before Sunrise even in the approximate high-latitude fallback", () => {
    // Regression test: a real user at a real, populated mid-latitude city
    // (Berlin, ~52.5°N) hit this in production. Near the June solstice with
    // MWL's 18° Fajr angle, the sun never gets that far below the horizon
    // this far north, so the fallback path kicks in -- and it previously
    // computed Fajr *after* Sunrise (the fallback offset's sign was
    // backwards: `sunriseH - 1.5` instead of `sunriseH + 1.5`, and because
    // fajr = dhuhrUTC - fajrH, a smaller fajrH means a *later* clock time).
    var times = computePrayerTimes(Object.assign({ date: JUNE_SOLSTICE, method: "MWL" }, BERLIN));
    expect(times.approximate).toBe(true); // confirms this test actually exercises the fallback
    // Full chronological order should still hold end to end.
    expect(times.fajr.getTime()).toBeLessThan(times.sunrise.getTime());
    expect(times.sunrise.getTime()).toBeLessThan(times.dhuhr.getTime());
    expect(times.dhuhr.getTime()).toBeLessThan(times.asr.getTime());
    expect(times.asr.getTime()).toBeLessThan(times.maghrib.getTime());
    expect(times.maghrib.getTime()).toBeLessThan(times.isha.getTime());
  });
});
