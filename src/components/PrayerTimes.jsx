import React from "react";
import { PRAYER_LABELS, PRAYER_ORDER, CALC_METHODS } from "../utils/prayerTimes";
import { formatClock, formatDuration } from "../utils/time";
import { GOLD, t } from "../theme";

export default function PrayerTimes({ lang, geolocation, method, times, next, now }) {
  var coords = geolocation.coords;
  var status = geolocation.status;
  var request = geolocation.request;

  if (!coords) {
    return (
      <div style={{ padding: "24px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "#5a4a3a", lineHeight: 1.8, marginBottom: 16 }}>
          {t(
            lang,
            "لعرض مواعيد الصلاة بالحساب الفلكي لموقعك، يحتاج التطبيق إذن الوصول لموقعك الجغرافي. لا تُرسَل بياناتك لأي خادم — كل الحساب يتم داخل جهازك.",
            "To show astronomically-calculated prayer times for your location, the app needs access to your geographic location. Nothing is sent to a server — everything is calculated on your device.",
            "Um astronomisch berechnete Gebetszeiten für deinen Standort anzuzeigen, benötigt die App Zugriff auf deinen Standort. Es werden keine Daten an einen Server gesendet."
          )}
        </div>
        <button
          onClick={request}
          disabled={status === "locating"}
          style={{ background: GOLD, color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 14, cursor: status === "locating" ? "default" : "pointer", opacity: status === "locating" ? 0.7 : 1 }}
        >
          {status === "locating" ? t(lang, "جاري تحديد الموقع...", "Locating...", "Standort wird ermittelt...") : t(lang, "تفعيل الموقع", "Enable Location", "Standort aktivieren")}
        </button>
        {status === "denied" && (
          <div style={{ fontSize: 12, color: "#a03a2c", marginTop: 14, lineHeight: 1.6 }}>
            {t(
              lang,
              "تم رفض إذن الموقع. فعّله من إعدادات المتصفح لهذا الموقع ثم أعد المحاولة.",
              "Location permission was denied. Enable it in your browser's site settings, then try again.",
              "Der Standortzugriff wurde verweigert. Aktiviere ihn in den Browsereinstellungen und versuche es erneut."
            )}
          </div>
        )}
        {status === "unsupported" && (
          <div style={{ fontSize: 12, color: "#a03a2c", marginTop: 14 }}>
            {t(lang, "متصفحك لا يدعم تحديد الموقع الجغرافي.", "Your browser doesn't support geolocation.", "Dein Browser unterstützt keine Standortermittlung.")}
          </div>
        )}
      </div>
    );
  }

  if (!times) return null;

  var methodLabel = CALC_METHODS[method] ? t(lang, CALC_METHODS[method].label.ar, CALC_METHODS[method].label.en, CALC_METHODS[method].label.de) : "";

  return (
    <div style={{ padding: "4px 16px 16px" }}>
      {times.approximate && (
        <div style={{ fontSize: 11, color: "#a07a2c", background: "rgba(139,105,20,0.1)", borderRadius: 10, padding: "8px 12px", marginBottom: 12, lineHeight: 1.6 }}>
          {t(
            lang,
            "موقعك في خط عرض مرتفع؛ بعض الأوقات تقريبية بسبب عدم وصول الشمس للزاوية الفلكية المطلوبة في هذا الفصل.",
            "Your location is at a high latitude; some times are approximate because the sun doesn't reach the required astronomical angle this time of year.",
            "Dein Standort liegt in hohen Breiten; einige Zeiten sind Näherungswerte."
          )}
        </div>
      )}
      {PRAYER_ORDER.map(function (key) {
        var isNext = key === next;
        return (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: isNext ? "rgba(139,105,20,0.14)" : "rgba(255,252,245,0.9)",
              border: "1px solid " + (isNext ? "rgba(139,105,20,0.4)" : "rgba(201,168,76,0.12)"),
              borderRadius: 14,
              padding: "12px 16px",
              marginBottom: 8,
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontFamily: "Amiri,serif", color: isNext ? GOLD : "#2c1810", fontWeight: isNext ? 700 : 400 }}>{t(lang, PRAYER_LABELS[key].ar, PRAYER_LABELS[key].en, PRAYER_LABELS[key].de)}</div>
              {isNext && (
                <div style={{ fontSize: 11, color: GOLD, marginTop: 2, direction: "ltr", unicodeBidi: "isolate" }}>
                  {t(lang, "بعد ", "in ", "in ")}
                  {formatDuration(times[key].getTime() - now.getTime(), lang)}
                </div>
              )}
            </div>
            <div style={{ fontSize: 18, color: isNext ? GOLD : "#5a4a3a", fontWeight: isNext ? 700 : 400, direction: "ltr", unicodeBidi: "isolate" }}>{formatClock(times[key], lang)}</div>
          </div>
        );
      })}
      <div style={{ fontSize: 11, color: "#9a8878", textAlign: "center", marginTop: 12, lineHeight: 1.6 }}>
        {t(lang, "طريقة الحساب: ", "Method: ", "Methode: ") + methodLabel}
        <br />
        {t(lang, "يمكنك تغييرها من الإعدادات.", "You can change it in Settings.", "Du kannst dies in den Einstellungen ändern.")}
      </div>
      <button
        onClick={geolocation.request}
        style={{ display: "block", margin: "14px auto 0", background: "none", border: "1px solid rgba(139,105,20,0.25)", color: GOLD, borderRadius: 10, padding: "7px 16px", fontSize: 12, cursor: "pointer" }}
      >
        {t(lang, "تحديث الموقع", "Refresh Location", "Standort aktualisieren")}
      </button>
    </div>
  );
}
