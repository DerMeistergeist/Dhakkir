import React, { useState } from "react";
import { GOLD, headerStyle, screenStyle, t } from "../../theme";
import { toEasternDigits } from "../../utils/arabic";

var BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

export default function MushafPage({ lang, pageNumber, totalPages, ayahs, text, surahs, onPrev, onNext, onGoToPage, onBack, onOpenSettings }) {
  const [jumpOpen, setJumpOpen] = useState(false);
  const [jumpValue, setJumpValue] = useState("");

  var blocks = [];
  ayahs.forEach(function (entry) {
    var sura = entry[0];
    var ayah = entry[1];
    if (ayah === 1) {
      var surahInfo = surahs[sura - 1];
      blocks.push({ type: "surahHeader", surah: surahInfo });
      // Every surah opens with the Bismillah except At-Tawbah (9). For
      // Al-Fatihah (1) the Bismillah *is* ayah 1, already added below,
      // so it isn't repeated here.
      if (sura !== 9 && sura !== 1) blocks.push({ type: "bismillah" });
    }
    blocks.push({ type: "ayah", sura: sura, ayah: ayah, text: text[sura - 1][ayah - 1] });
  });

  function submitJump() {
    var n = parseInt(jumpValue, 10);
    if (n >= 1 && n <= totalPages) {
      onGoToPage(n);
      setJumpOpen(false);
      setJumpValue("");
    }
  }

  return (
    <div style={Object.assign({}, screenStyle, { paddingBottom: 80 })} className="fin">
      <div style={headerStyle}>
        <button style={{ background: "rgba(139,105,20,0.12)", border: "1px solid rgba(139,105,20,0.25)", color: GOLD, fontSize: 13, cursor: "pointer", borderRadius: 10, padding: "6px 14px" }} onClick={onBack}>
          {"< " + t(lang, "الفهرس", "Index", "Index")}
        </button>
        <button
          onClick={function () {
            setJumpOpen(!jumpOpen);
            setJumpValue("");
          }}
          style={{ background: "none", border: "none", fontSize: 14, color: GOLD, fontFamily: "Amiri,serif", cursor: "pointer", direction: "ltr", unicodeBidi: "isolate" }}
        >
          {t(lang, "صفحة " + toEasternDigits(pageNumber), "Page " + pageNumber, "Seite " + pageNumber)}
        </button>
        <button aria-label={t(lang, "الاعدادات", "Settings", "Einstellungen")} style={{ background: "none", border: "none", color: "#9a8878", fontSize: 16, cursor: "pointer" }} onClick={onOpenSettings}>
          {"⚙"}
        </button>
      </div>

      {jumpOpen && (
        <div style={{ display: "flex", gap: 8, padding: "10px 16px 0" }}>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpValue}
            onChange={function (e) {
              setJumpValue(e.target.value);
            }}
            onKeyDown={function (e) {
              if (e.key === "Enter") submitJump();
            }}
            placeholder={t(lang, "رقم الصفحة (1-" + toEasternDigits(totalPages) + ")", "Page number (1-" + totalPages + ")", "Seitenzahl (1-" + totalPages + ")")}
            style={{ flex: 1, padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(139,105,20,0.25)", fontSize: 13 }}
          />
          <button onClick={submitJump} style={{ background: GOLD, color: "#fff", border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
            {t(lang, "اذهب", "Go", "Los")}
          </button>
        </div>
      )}

      <div style={{ padding: "16px" }}>
        <div
          style={{
            background: "rgba(255,252,245,0.92)",
            border: "1px solid rgba(139,105,20,0.25)",
            borderRadius: 16,
            padding: "20px 18px",
            marginBottom: 14,
            fontSize: 21,
            fontFamily: "Amiri,serif",
            color: "#2c1810",
            lineHeight: 2.3,
            direction: "rtl",
            // Not "justify": web justification stretches inter-word spacing
            // (no kashida/letter-elongation support), which on a narrow
            // mobile column with few words per line produced ugly, uneven
            // gaps -- verified visually. Right-aligned flowing text reads
            // far better here.
            textAlign: "right",
          }}
        >
          {blocks.map(function (block, i) {
            if (block.type === "surahHeader") {
              return (
                <div key={"h" + i} style={{ display: "block", textAlign: "center", margin: "6px 0 10px", padding: "8px 0", borderTop: i > 0 ? "1px solid rgba(139,105,20,0.2)" : "none", borderBottom: "1px solid rgba(139,105,20,0.2)" }}>
                  <span style={{ fontSize: 17, color: GOLD, fontWeight: 700 }}>{"❖ سورة " + block.surah.name + " ❖"}</span>
                </div>
              );
            }
            if (block.type === "bismillah") {
              return (
                <div key={"b" + i} style={{ display: "block", textAlign: "center", fontSize: 19, color: GOLD, margin: "0 0 10px" }}>
                  {BISMILLAH}
                </div>
              );
            }
            return (
              <span key={block.sura + "-" + block.ayah}>
                {block.text + " "}
                {/* Plain parentheses, not the ornate ﴿﴾ Quranic marks: the
                    latter render as the same glyph on both sides (no visual
                    open/close distinction) in this font, verified directly
                    -- plain "(" ")" render correctly and reliably instead. */}
                <span style={{ color: GOLD, fontSize: "0.7em" }}>{"(" + toEasternDigits(block.ayah) + ")"}</span>{" "}
              </span>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button aria-label={t(lang, "الصفحة السابقة", "Previous page", "Vorherige Seite")} onClick={onPrev} disabled={pageNumber <= 1} style={{ background: "rgba(139,105,20,0.1)", border: "none", borderRadius: 10, color: pageNumber > 1 ? GOLD : "#ccc0b0", fontSize: 20, cursor: pageNumber > 1 ? "pointer" : "default", padding: "8px 20px" }}>
            {"<"}
          </button>
          <div style={{ fontSize: 11, color: "#9a8878", direction: "ltr", unicodeBidi: "isolate" }}>
            {pageNumber} / {totalPages}
          </div>
          <button aria-label={t(lang, "الصفحة التالية", "Next page", "Nächste Seite")} onClick={onNext} disabled={pageNumber >= totalPages} style={{ background: "rgba(139,105,20,0.1)", border: "none", borderRadius: 10, color: pageNumber < totalPages ? GOLD : "#ccc0b0", fontSize: 20, cursor: pageNumber < totalPages ? "pointer" : "default", padding: "8px 20px" }}>
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
