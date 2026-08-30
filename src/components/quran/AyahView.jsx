import React from "react";
import { GOLD, headerStyle, screenStyle, t } from "../../theme";
import { toEasternDigits } from "../../utils/arabic";
import useSwipe from "../../hooks/useSwipe";
import AllahText from "./AllahText";

// Given a {sura, ayah} pointer, returns the next/previous ayah's pointer,
// walking across surah boundaries using each surah's totalVerses. Returns
// null past either end of the Mushaf (before 1:1 or after 114:6).
function nextAyah(surahs, sura, ayah) {
  var totalVerses = surahs[sura - 1].totalVerses;
  if (ayah < totalVerses) return { sura: sura, ayah: ayah + 1 };
  if (sura < surahs.length) return { sura: sura + 1, ayah: 1 };
  return null;
}
function prevAyah(surahs, sura, ayah) {
  if (ayah > 1) return { sura: sura, ayah: ayah - 1 };
  if (sura > 1) return { sura: sura - 1, ayah: surahs[sura - 2].totalVerses };
  return null;
}

export default function AyahView({ lang, sura, ayah, text, surahs, pageOfAyah, onNavigate, onViewInPage, onBack }) {
  var surahInfo = surahs[sura - 1];
  var ayahText = text[sura - 1][ayah - 1];
  var page = pageOfAyah[sura + ":" + ayah];
  var next = nextAyah(surahs, sura, ayah);
  var prev = prevAyah(surahs, sura, ayah);

  // Same right-to-left reading convention as the Mushaf page view: swipe
  // right advances to the next ayah, swipe left goes back.
  var swipeHandlers = useSwipe(
    function () {
      if (prev) onNavigate(prev);
    },
    function () {
      if (next) onNavigate(next);
    }
  );

  return (
    <div style={screenStyle} className="fin">
      <div style={headerStyle}>
        <button style={{ background: "rgba(139,105,20,0.12)", border: "1px solid rgba(139,105,20,0.25)", color: GOLD, fontSize: 13, cursor: "pointer", borderRadius: 10, padding: "6px 14px" }} onClick={onBack}>
          {"< " + t(lang, "نتائج البحث", "Search results", "Suchergebnisse")}
        </button>
        <div style={{ fontSize: 16, color: GOLD, fontFamily: "Amiri,serif" }}>{surahInfo.name}</div>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ padding: "20px 16px" }} data-testid="ayah-swipe-area" {...swipeHandlers}>
        <div
          style={{
            background: "rgba(255,252,245,0.92)",
            border: "1px solid rgba(139,105,20,0.25)",
            borderRadius: 16,
            padding: "28px 20px",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 24, fontFamily: "Amiri,serif", color: "#2c1810", lineHeight: 2.1, direction: "rtl" }}>
            <AllahText text={ayahText} />{" "}
            <span style={{ color: GOLD, fontSize: "0.7em" }}>{"(" + toEasternDigits(ayah) + ")"}</span>
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: "#9a8878" }}>
            {surahInfo.name} · {t(lang, "آية " + toEasternDigits(ayah), "ayah " + ayah, "Ayah " + ayah)}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <button
            aria-label={t(lang, "الآية السابقة", "Previous ayah", "Vorherige Ayah")}
            disabled={!prev}
            onClick={function () {
              if (prev) onNavigate(prev);
            }}
            style={{ background: "rgba(139,105,20,0.1)", border: "none", borderRadius: 10, color: prev ? GOLD : "#ccc0b0", fontSize: 14, cursor: prev ? "pointer" : "default", padding: "10px 18px" }}
          >
            {"< " + t(lang, "السابقة", "Previous", "Vorherige")}
          </button>
          <button
            aria-label={t(lang, "الآية التالية", "Next ayah", "Nächste Ayah")}
            disabled={!next}
            onClick={function () {
              if (next) onNavigate(next);
            }}
            style={{ background: "rgba(139,105,20,0.1)", border: "none", borderRadius: 10, color: next ? GOLD : "#ccc0b0", fontSize: 14, cursor: next ? "pointer" : "default", padding: "10px 18px" }}
          >
            {t(lang, "التالية", "Next", "Nächste") + " >"}
          </button>
        </div>

        <button
          onClick={function () {
            onViewInPage(page);
          }}
          style={{ width: "100%", background: GOLD, color: "#fff", border: "none", borderRadius: 12, padding: "13px 16px", fontSize: 14, cursor: "pointer" }}
        >
          {t(lang, "عرض في صفحة المصحف (صفحة " + toEasternDigits(page) + ")", "View in Mushaf page (page " + page + ")", "Im Mushaf-Seitenansicht öffnen (Seite " + page + ")")}
        </button>

        <div style={{ textAlign: "center", fontSize: 10, color: "#c0b4a4", marginTop: 14 }}>
          {t(lang, "اسحب يمينًا أو يسارًا للتنقل بين الآيات", "Swipe left or right to move between ayahs", "Nach links oder rechts wischen für die nächste/vorherige Ayah")}
        </div>
      </div>
    </div>
  );
}
