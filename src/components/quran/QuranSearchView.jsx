import React, { useMemo, useState } from "react";
import { GOLD, headerStyle, screenStyle, t } from "../../theme";
import { normalizeArabic, toEasternDigits } from "../../utils/arabic";

var MAX_RESULTS = 50;

export default function QuranSearchView({ lang, text, surahs, pageOfAyah, onSelectResult, onBack }) {
  const [query, setQuery] = useState("");

  var results = useMemo(function () {
    var needle = normalizeArabic(query.trim());
    if (needle.length < 2) return [];
    var out = [];
    for (var s = 0; s < text.length && out.length < MAX_RESULTS; s++) {
      var ayahs = text[s];
      for (var a = 0; a < ayahs.length; a++) {
        if (normalizeArabic(ayahs[a]).indexOf(needle) !== -1) {
          out.push({ sura: s + 1, ayah: a + 1, text: ayahs[a] });
          if (out.length >= MAX_RESULTS) break;
        }
      }
    }
    return out;
  }, [query, text]);

  return (
    <div style={screenStyle} className="fin">
      <div style={headerStyle}>
        <button style={{ background: "rgba(139,105,20,0.12)", border: "1px solid rgba(139,105,20,0.25)", color: GOLD, fontSize: 13, cursor: "pointer", borderRadius: 10, padding: "6px 14px" }} onClick={onBack}>
          {"< " + t(lang, "الفهرس", "Index", "Index")}
        </button>
        <div style={{ fontSize: 16, color: GOLD, fontFamily: "Amiri,serif" }}>{t(lang, "البحث", "Search", "Suche")}</div>
        <div style={{ width: 60 }} />
      </div>

      <div style={{ padding: "14px 16px 0" }}>
        <input
          autoFocus
          type="text"
          value={query}
          onChange={function (e) {
            setQuery(e.target.value);
          }}
          placeholder={t(lang, "اكتب كلمة أو جزء من آية...", "Type a word or part of an ayah...", "Wort oder Ayah-Teil eingeben...")}
          style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid rgba(139,105,20,0.3)", fontSize: 16, fontFamily: "Amiri,serif", direction: "rtl", textAlign: "right" }}
        />
      </div>

      <div style={{ padding: "14px 16px" }}>
        {query.trim().length >= 2 && results.length === 0 && (
          <div style={{ textAlign: "center", color: "#9a8878", fontSize: 13, marginTop: 20 }}>{t(lang, "لا توجد نتائج.", "No results.", "Keine Ergebnisse.")}</div>
        )}
        {results.length === MAX_RESULTS && (
          <div style={{ textAlign: "center", color: "#9a8878", fontSize: 11, marginBottom: 10 }}>
            {t(lang, "أول " + MAX_RESULTS + " نتيجة — دقّق بحثك لتضييق النتائج.", "First " + MAX_RESULTS + " results — refine your search to narrow them down.", "Erste " + MAX_RESULTS + " Ergebnisse.")}
          </div>
        )}
        {results.map(function (r) {
          var page = pageOfAyah[r.sura + ":" + r.ayah];
          var surahName = surahs[r.sura - 1].name;
          return (
            <button
              key={r.sura + "-" + r.ayah}
              onClick={function () {
                onSelectResult(page);
              }}
              style={{ width: "100%", textAlign: "right", background: "rgba(255,252,245,0.9)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 14, padding: "14px 16px", marginBottom: 8, cursor: "pointer" }}
            >
              <div style={{ fontSize: 17, fontFamily: "Amiri,serif", color: "#2c1810", lineHeight: 1.9, direction: "rtl" }}>{r.text}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: GOLD }}>
                <span>
                  {surahName} {toEasternDigits(r.ayah)}
                </span>
                <span style={{ color: "#9a8878" }}>{t(lang, "صفحة " + toEasternDigits(page), "page " + page, "Seite " + page)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
