import React from "react";
import { GOLD, PATTERN_BG, t } from "../theme";
import { CALC_METHODS, ASR_MADHABS } from "../utils/prayerTimes";

export default function Settings({ lang, setLang, showTr, setShowTr, remindersOn, setRemindersOn, calcMethod, setCalcMethod, asrMadhab, setAsrMadhab, geolocation, onBack }) {
  var notificationsSupported = typeof window !== "undefined" && "Notification" in window;

  var toggles = [
    { lbl: t(lang, "اظهار الترجمة", "Show Translation", "Übersetzung"), val: showTr, set: setShowTr },
  ];
  if (notificationsSupported) {
    toggles.push({
      lbl: t(lang, "تذكيرات الأذكار", "Adhkar Reminders", "Erinnerungen"),
      val: remindersOn,
      set: setRemindersOn,
    });
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f3e8", backgroundImage: PATTERN_BG, backgroundSize: "60px 60px" }}>
      <div style={{ padding: "12px 16px", background: "#f8f3e8", borderBottom: "1px solid rgba(139,105,20,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0 }}>
        <button
          aria-label={t(lang, "رجوع", "Back", "Zurück")}
          style={{ background: "rgba(139,105,20,0.12)", border: "1px solid rgba(139,105,20,0.25)", color: GOLD, borderRadius: 10, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}
          onClick={onBack}
        >
          {t(lang, "رجوع", "Back", "Zurück")}
        </button>
        <div style={{ fontSize: 16, color: GOLD, fontFamily: "Amiri,serif" }}>{t(lang, "الاعدادات", "Settings", "Einstellungen")}</div>
        <div style={{ width: 60 }} />
      </div>
      <div style={{ padding: "24px 20px" }}>
        <div style={{ fontSize: 11, color: "#9a8878", letterSpacing: 1, marginBottom: 10 }}>{t(lang, "اللغة", "LANGUAGE", "SPRACHE")}</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {["ar", "en", "de"].map(function (l) {
            return (
              <button
                key={l}
                onClick={function () {
                  setLang(l);
                }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  background: lang === l ? "rgba(139,105,20,0.25)" : "rgba(139,105,20,0.06)",
                  border: "1px solid " + (lang === l ? "rgba(139,105,20,0.5)" : "rgba(139,105,20,0.1)"),
                  borderRadius: 12,
                  color: lang === l ? GOLD : "#9a8878",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {l === "ar" ? "العربية" : l === "en" ? "English" : "Deutsch"}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "#9a8878", letterSpacing: 1, marginBottom: 10 }}>{t(lang, "خيارات العرض", "DISPLAY", "ANZEIGEOPTIONEN")}</div>
        {toggles.map(function (o) {
          return (
            <div key={o.lbl} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontSize: 13, color: "#2c1810" }}>{o.lbl}</span>
              <button
                aria-label={o.lbl}
                aria-pressed={o.val}
                onClick={function () {
                  o.set(!o.val);
                }}
                style={{ width: 48, height: 26, borderRadius: 13, background: o.val ? GOLD : "rgba(139,105,20,0.12)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s" }}
              >
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: o.val ? 24 : 4, transition: "left 0.2s" }} />
              </button>
            </div>
          );
        })}
        {notificationsSupported && remindersOn && typeof Notification !== "undefined" && Notification.permission === "denied" && (
          <div style={{ fontSize: 12, color: "#a03a2c", marginTop: 8, lineHeight: 1.6 }}>
            {t(
              lang,
              "الإشعارات محظورة من إعدادات المتصفح — فعّلها من هناك لتصلك التذكيرات.",
              "Notifications are blocked in your browser settings — enable them there to receive reminders.",
              "Benachrichtigungen sind in den Browsereinstellungen blockiert."
            )}
          </div>
        )}

        <div style={{ fontSize: 11, color: "#9a8878", letterSpacing: 1, margin: "28px 0 10px" }}>{t(lang, "مواعيد الصلاة", "PRAYER TIMES", "GEBETSZEITEN")}</div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: "#2c1810", marginBottom: 6 }}>{t(lang, "طريقة الحساب", "Calculation Method", "Berechnungsmethode")}</div>
          <select
            value={calcMethod}
            onChange={function (e) {
              setCalcMethod(e.target.value);
            }}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(139,105,20,0.25)", background: "rgba(139,105,20,0.06)", color: "#2c1810", fontSize: 13 }}
          >
            {Object.keys(CALC_METHODS).map(function (key) {
              return (
                <option key={key} value={key}>
                  {t(lang, CALC_METHODS[key].label.ar, CALC_METHODS[key].label.en, CALC_METHODS[key].label.de)}
                </option>
              );
            })}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "#2c1810", marginBottom: 6 }}>{t(lang, "مذهب العصر", "Asr Calculation", "Asr-Berechnung")}</div>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.keys(ASR_MADHABS).map(function (key) {
              return (
                <button
                  key={key}
                  onClick={function () {
                    setAsrMadhab(key);
                  }}
                  style={{
                    flex: 1,
                    padding: "9px 4px",
                    background: asrMadhab === key ? "rgba(139,105,20,0.25)" : "rgba(139,105,20,0.06)",
                    border: "1px solid " + (asrMadhab === key ? "rgba(139,105,20,0.5)" : "rgba(139,105,20,0.1)"),
                    borderRadius: 10,
                    color: asrMadhab === key ? GOLD : "#9a8878",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  {t(lang, ASR_MADHABS[key].label.ar, ASR_MADHABS[key].label.en, ASR_MADHABS[key].label.de)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, color: "#2c1810", marginBottom: 6 }}>{t(lang, "الموقع الجغرافي", "Location", "Standort")}</div>
          {geolocation.coords ? (
            <div style={{ fontSize: 12, color: "#9a8878", marginBottom: 8, direction: "ltr", unicodeBidi: "isolate", textAlign: lang === "ar" ? "right" : "left" }}>
              {geolocation.coords.latitude.toFixed(3)}, {geolocation.coords.longitude.toFixed(3)}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "#9a8878", marginBottom: 8 }}>{t(lang, "لم يتم تحديد الموقع بعد.", "Location not set yet.", "Standort noch nicht festgelegt.")}</div>
          )}
          <button
            onClick={geolocation.request}
            disabled={geolocation.status === "locating"}
            style={{ background: "rgba(139,105,20,0.12)", border: "1px solid rgba(139,105,20,0.25)", color: GOLD, borderRadius: 10, padding: "8px 16px", cursor: "pointer", fontSize: 12 }}
          >
            {geolocation.coords ? t(lang, "تحديث الموقع", "Refresh Location", "Standort aktualisieren") : t(lang, "تفعيل الموقع", "Enable Location", "Standort aktivieren")}
          </button>
        </div>
      </div>
    </div>
  );
}
