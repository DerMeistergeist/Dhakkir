import React from "react";
import { GOLD, t } from "../../theme";
import { toEasternDigits } from "../../utils/arabic";

var SURAH_TYPE_LABEL = { ar: { meccan: "مكية", medinan: "مدنية" }, en: { meccan: "Meccan", medinan: "Medinan" }, de: { meccan: "mekkanisch", medinan: "medinensisch" } };

export default function SurahIndex({ lang, surahs, lastPage, onOpenSurah, onContinueReading, onOpenSearch }) {
  return (
    <div style={{ padding: "0 16px 16px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button
          onClick={onOpenSearch}
          style={{ flex: 1, background: "rgba(139,105,20,0.08)", border: "1px solid rgba(139,105,20,0.2)", borderRadius: 12, padding: "12px 16px", color: "#5a4a3a", fontSize: 13, cursor: "pointer", textAlign: "right" }}
        >
          {t(lang, "🔍 البحث في القرآن الكريم", "🔍 Search the Quran", "🔍 Im Koran suchen")}
        </button>
      </div>

      {lastPage && (
        <button
          onClick={onContinueReading}
          style={{ width: "100%", background: "rgba(139,105,20,0.16)", border: "1px solid rgba(139,105,20,0.35)", borderRadius: 14, padding: "14px 16px", marginBottom: 16, color: GOLD, fontSize: 14, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span>{t(lang, "متابعة القراءة", "Continue Reading", "Weiterlesen")}</span>
          <span style={{ fontFamily: "Amiri,serif", direction: "ltr", unicodeBidi: "isolate" }}>{t(lang, "صفحة " + toEasternDigits(lastPage), "Page " + lastPage, "Seite " + lastPage)}</span>
        </button>
      )}

      <div>
        {surahs.map(function (s) {
          return (
            <button
              key={s.id}
              onClick={function () {
                onOpenSurah(s);
              }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, background: "rgba(255,252,245,0.9)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 14, padding: "12px 14px", marginBottom: 8, cursor: "pointer", textAlign: "right" }}
            >
              <div style={{ minWidth: 30, height: 30, borderRadius: "50%", background: "rgba(139,105,20,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: GOLD, flexShrink: 0, fontFamily: "Amiri,serif", direction: "ltr", unicodeBidi: "isolate" }}>
                {toEasternDigits(s.id)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontFamily: "Amiri,serif", color: "#2c1810" }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "#9a8878", marginTop: 2 }}>
                  {s.transliteration} · {t(lang, SURAH_TYPE_LABEL.ar[s.type], SURAH_TYPE_LABEL.en[s.type], SURAH_TYPE_LABEL.de[s.type])} · {s.totalVerses} {t(lang, "آية", "verses", "Verse")}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#9a8878", direction: "ltr", unicodeBidi: "isolate" }}>{t(lang, "ص " + toEasternDigits(s.startPage), "p." + s.startPage, "S. " + s.startPage)}</div>
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: "center", fontSize: 10, color: "#c0b4a4", marginTop: 16, lineHeight: 1.7 }}>
        {t(
          lang,
          "نص القرآن: مشروع quran-json (رخصة CC-BY-4.0) · تخطيط صفحات المصحف: مشروع mushaf-engine (رخصة MIT) · الجزء والحزب: مشروع quran-meta (رخصة MIT)",
          "Quran text: the quran-json project (CC-BY-4.0 license) · Mushaf page layout: the mushaf-engine project (MIT license) · Juz'/Hizb data: the quran-meta project (MIT license)",
          "Korantext: quran-json-Projekt (CC-BY-4.0) · Mushaf-Seitenlayout: mushaf-engine-Projekt (MIT) · Juz'/Hizb-Daten: quran-meta-Projekt (MIT)"
        )}
      </div>
    </div>
  );
}
