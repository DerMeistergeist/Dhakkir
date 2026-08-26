import React from "react";
import { HADITH_CATS, HADITHS } from "../data";
import { GOLD, t } from "../theme";
import { truncateArabic } from "../utils/text";
import OrnateCard from "./OrnateCard";
import Rosette from "./Rosette";

// Renders whichever of the three hadith sub-views is active: the category
// grid, a category's hadith list, or a single hadith's detail view.
export default function HadithsSection({ lang, showTr, hCat, hIdx, hList, onSelectCategory, onSelectHadith, onShowList, onBackToCategories, onPrev, onNext }) {
  if (!hCat) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {HADITH_CATS.map(function (cat) {
          return (
            <button
              key={cat.id}
              onClick={function () {
                onSelectCategory(cat.id);
              }}
              style={{ background: "rgba(255,252,245,0.9)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 16, padding: "16px 14px", cursor: "pointer", textAlign: "right" }}
            >
              <div style={{ fontSize: 14, fontFamily: "Amiri,serif", color: "#2c1810", fontWeight: 600 }}>{t(lang, cat.ar, cat.en, cat.de)}</div>
              <div style={{ fontSize: 11, color: "#9a8878", marginTop: 4 }}>
                {(HADITHS[cat.id] || []).length} {t(lang, "حديث", "hadiths", "Hadithe")}
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  var items = HADITHS[hCat] || [];

  if (hList) {
    return (
      <div>
        <button onClick={onBackToCategories} style={{ background: "none", border: "none", color: GOLD, padding: "10px 0", cursor: "pointer", fontSize: 13, display: "block", marginBottom: 8 }}>
          {"< " + t(lang, "الاحاديث", "Hadiths", "Hadithe")}
        </button>
        {items.map(function (h, i) {
          return (
            <button
              key={i}
              onClick={function () {
                onSelectHadith(i);
              }}
              style={{ width: "100%", textAlign: "right", background: "rgba(255,252,245,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px 18px", marginBottom: 10, cursor: "pointer" }}
            >
              <div style={{ fontSize: 16, fontFamily: "Amiri,serif", color: "#2c1810", lineHeight: 1.8, direction: "rtl", marginBottom: 6 }}>{truncateArabic(h.arabic, 55)}</div>
              <div style={{ fontSize: 11, color: GOLD }}>{h.source}</div>
            </button>
          );
        })}
      </div>
    );
  }

  var h = items[hIdx];
  if (!h) return null;

  return (
    <div>
      <button onClick={onShowList} style={{ background: "none", border: "none", color: GOLD, padding: "10px 0", cursor: "pointer", fontSize: 13, display: "block", marginBottom: 8 }}>
        {"< " + t(lang, "رجوع", "Back", "Zurück")}
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button aria-label={t(lang, "السابق", "Previous", "Zurück")} onClick={onPrev} disabled={hIdx <= 0} style={{ background: "none", border: "none", color: hIdx > 0 ? GOLD : "#ccc0b0", fontSize: 26, cursor: hIdx > 0 ? "pointer" : "default" }}>
          {"<"}
        </button>
        <span style={{ fontSize: 12, color: "#9a8878", direction: "ltr", unicodeBidi: "isolate" }}>
          {hIdx + 1} / {items.length}
        </span>
        <button aria-label={t(lang, "التالي", "Next", "Weiter")} onClick={onNext} disabled={hIdx >= items.length - 1} style={{ background: "none", border: "none", color: hIdx < items.length - 1 ? GOLD : "#ccc0b0", fontSize: 26, cursor: hIdx < items.length - 1 ? "pointer" : "default" }}>
          {">"}
        </button>
      </div>
      <OrnateCard>
        <div style={{ fontSize: 21, fontFamily: "Amiri,serif", color: "#2c1810", lineHeight: 2, direction: "rtl", textAlign: "center", marginBottom: 8 }}>{h.arabic}</div>
        <Rosette size={20} margin="4px 0 12px" />
        {showTr && <div style={{ fontSize: 13, color: "#5a4a3a", lineHeight: 1.7, paddingTop: 12, borderTop: "1px solid rgba(201,168,76,0.1)" }}>{lang === "de" && h.de ? h.de : h.en}</div>}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          <div style={{ fontSize: 11, color: GOLD, background: "rgba(139,105,20,0.12)", padding: "4px 10px", borderRadius: 20 }}>{lang === "ar" ? h.source_ar || h.source : h.source}</div>
          <div style={{ fontSize: 11, color: "#7a6a5a", direction: "rtl", fontFamily: "Amiri,serif" }}>{lang === "ar" ? h.narrator_ar || h.narrator : h.narrator}</div>
        </div>
      </OrnateCard>
    </div>
  );
}
