import React, { useEffect, useRef, useState } from "react";
import { GOLD, headerStyle, screenStyle, t } from "../../theme";
import { toEasternDigits } from "../../utils/arabic";
import useLocalStorage from "../../hooks/useLocalStorage";
import useSwipe from "../../hooks/useSwipe";

var BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
var MIN_SCALE = 1;
var MAX_SCALE = 2;

export default function MushafPage({ lang, pageNumber, totalPages, ayahs, text, surahs, onPrev, onNext, onGoToPage, onBack, onOpenSettings, highlightAyah, onFullscreenChange }) {
  const [jumpOpen, setJumpOpen] = useState(false);
  const [jumpValue, setJumpValue] = useState("");
  const [fullscreen, setFullscreenState] = useState(false);

  // Also hides the app's own outer chrome (logo header, section tabs,
  // language switcher) via HomeView, so "fullscreen" really means the page
  // fills the whole screen -- not just this component's own header.
  function setFullscreen(next) {
    setFullscreenState(next);
    if (onFullscreenChange) onFullscreenChange(next);
  }
  // Persisted so a user who bumps the text size once (e.g. for weak
  // eyesight) doesn't have to redo it every visit.
  const [fontScale, setFontScale] = useLocalStorage("dhakkir_quran_font_scale", 1);

  // Safety net: if this page unmounts (back navigation, page change) while
  // still in fullscreen, make sure the app's outer chrome comes back too.
  // A ref (not the `fullscreen` state itself) is read in the cleanup so it
  // sees the latest value rather than the one from the mount-time closure.
  var fullscreenRef = useRef(fullscreen);
  fullscreenRef.current = fullscreen;
  useEffect(function () {
    return function () {
      if (fullscreenRef.current && onFullscreenChange) onFullscreenChange(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  var swipeHandlers = useSwipe(
    function () {
      onNext();
    },
    function () {
      onPrev();
    }
  );

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

  function bumpFont(delta) {
    var next = Math.round((fontScale + delta) * 10) / 10;
    if (next < MIN_SCALE) next = MIN_SCALE;
    if (next > MAX_SCALE) next = MAX_SCALE;
    setFontScale(next);
  }

  var baseFontSize = 21 * fontScale;

  return (
    <div style={Object.assign({}, screenStyle, { paddingBottom: fullscreen ? 0 : 80 })} className="fin">
      {!fullscreen && (
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
          <div style={{ display: "flex", gap: 4 }}>
            <button
              aria-label={t(lang, "وضع ملء الشاشة", "Fullscreen mode", "Vollbildmodus")}
              style={{ background: "none", border: "none", color: "#9a8878", fontSize: 16, cursor: "pointer" }}
              onClick={function () {
                setFullscreen(true);
              }}
            >
              {"⛶"}
            </button>
            <button aria-label={t(lang, "الاعدادات", "Settings", "Einstellungen")} style={{ background: "none", border: "none", color: "#9a8878", fontSize: 16, cursor: "pointer" }} onClick={onOpenSettings}>
              {"⚙"}
            </button>
          </div>
        </div>
      )}

      {jumpOpen && !fullscreen && (
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

      {fullscreen && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#f8f3e8", borderBottom: "1px solid rgba(139,105,20,0.2)", position: "sticky", top: 0, zIndex: 2 }}>
          <button
            aria-label={t(lang, "الخروج من ملء الشاشة", "Exit fullscreen", "Vollbild beenden")}
            style={{ background: "rgba(139,105,20,0.12)", border: "1px solid rgba(139,105,20,0.25)", color: GOLD, fontSize: 13, cursor: "pointer", borderRadius: 10, padding: "6px 14px" }}
            onClick={function () {
              setFullscreen(false);
            }}
          >
            {"✕ " + t(lang, "إغلاق", "Close", "Schließen")}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              aria-label={t(lang, "تصغير الخط", "Smaller text", "Kleinerer Text")}
              disabled={fontScale <= MIN_SCALE}
              onClick={function () {
                bumpFont(-0.1);
              }}
              style={{ background: "rgba(139,105,20,0.1)", border: "none", borderRadius: 8, color: fontScale > MIN_SCALE ? GOLD : "#ccc0b0", fontSize: 13, cursor: fontScale > MIN_SCALE ? "pointer" : "default", padding: "6px 10px" }}
            >
              {"A-"}
            </button>
            <button
              aria-label={t(lang, "تكبير الخط", "Larger text", "Größerer Text")}
              disabled={fontScale >= MAX_SCALE}
              onClick={function () {
                bumpFont(0.1);
              }}
              style={{ background: "rgba(139,105,20,0.1)", border: "none", borderRadius: 8, color: fontScale < MAX_SCALE ? GOLD : "#ccc0b0", fontSize: 13, cursor: fontScale < MAX_SCALE ? "pointer" : "default", padding: "6px 10px" }}
            >
              {"A+"}
            </button>
          </div>
        </div>
      )}

      <div style={{ padding: fullscreen ? "16px 14px 100px" : "16px" }} data-testid="mushaf-swipe-area" {...swipeHandlers}>
        <div
          style={{
            background: "rgba(255,252,245,0.92)",
            border: "1px solid rgba(139,105,20,0.25)",
            borderRadius: 16,
            padding: fullscreen ? "24px 18px" : "20px 18px",
            marginBottom: 14,
            fontSize: baseFontSize,
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
                  <span style={{ fontSize: baseFontSize * 0.8, color: GOLD, fontWeight: 700 }}>{"❖ سورة " + block.surah.name + " ❖"}</span>
                </div>
              );
            }
            if (block.type === "bismillah") {
              return (
                <div key={"b" + i} style={{ display: "block", textAlign: "center", fontSize: baseFontSize * 0.9, color: GOLD, margin: "0 0 10px" }}>
                  {BISMILLAH}
                </div>
              );
            }
            var isHighlighted = highlightAyah && highlightAyah.sura === block.sura && highlightAyah.ayah === block.ayah;
            return (
              <span key={block.sura + "-" + block.ayah} style={isHighlighted ? { background: "rgba(201,168,76,0.28)", borderRadius: 4 } : undefined}>
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
        {!fullscreen && (
          <div style={{ textAlign: "center", fontSize: 10, color: "#c0b4a4", marginTop: 10 }}>
            {t(lang, "اسحب يمينًا أو يسارًا للتنقل بين الصفحات", "Swipe left or right to turn the page", "Nach links oder rechts wischen zum Blättern")}
          </div>
        )}
      </div>
    </div>
  );
}
