import React, { useEffect, useRef, useState } from "react";
import { GOLD, headerStyle, screenStyle, t } from "../../theme";
import { toEasternDigits } from "../../utils/arabic";
import useLocalStorage from "../../hooks/useLocalStorage";
import useSwipe from "../../hooks/useSwipe";
import AllahText from "./AllahText";
import OttomanFrame from "./OttomanFrame";

var BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
var MIN_SCALE = 1;
var MAX_SCALE = 2;

export default function MushafPage({ lang, pageNumber, totalPages, ayahs, text, surahs, juz, hizb, onPrev, onNext, onGoToPage, onBack, onOpenSettings, highlightAyah, onFullscreenChange }) {
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

  // Reversed from the generic left=forward/right=back convention: a
  // printed Mushaf's pages turn right-to-left (page order runs from right
  // toward the left, like any Arabic book), so swiping right advances to
  // the next page and swiping left goes back.
  var swipeHandlers = useSwipe(
    function () {
      onPrev();
    },
    function () {
      onNext();
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
  // The surah shown at the very top of this page (a page can open mid-surah
  // or, on a transition page, right where a new one starts -- either way
  // this is the one whose text the reader's eye lands on first).
  var currentSurahName = surahs[ayahs[0][0] - 1].name;

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

      {/* In fullscreen mode this is the only place showing which surah/juz'
          /hizb the current page is in -- the rest of the app's chrome
          (including the normal-mode header's surah context) is hidden. */}
      {fullscreen && (
        <div style={{ textAlign: "center", fontSize: 12, color: GOLD, fontFamily: "Amiri,serif", padding: "8px 14px 0", direction: "rtl" }}>
          {currentSurahName}
          {" · "}
          <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>{t(lang, "الجزء " + toEasternDigits(juz), "Juz " + juz, "Juz " + juz)}</span>
          {" · "}
          <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>{t(lang, "الحزب " + toEasternDigits(hizb), "Hizb " + hizb, "Hizb " + hizb)}</span>
        </div>
      )}

      <div style={{ padding: fullscreen ? "16px 14px 100px" : "16px" }} data-testid="mushaf-swipe-area" {...swipeHandlers}>
        <OttomanFrame style={{ marginBottom: 14 }}>
          <div
            data-testid="mushaf-page-card"
            style={{
              background: "rgba(255,252,245,0.92)",
              borderRadius: 11,
              padding: fullscreen ? "24px 18px" : "20px 18px",
              fontSize: baseFontSize,
              fontFamily: "Amiri,serif",
              color: "#2c1810",
              lineHeight: 2.3,
              direction: "rtl",
              // Justified so every wrapped line reaches both edges evenly,
              // like a printed Mushaf (requested by a real user, with a
              // reference screenshot). Safari/WebKit (CoreText) -- what iOS,
              // the platform in that reference screenshot, actually renders
              // with -- justifies Arabic script natively via kashida
              // (letter-elongation), same as native Quran apps, so plain
              // `justify` alone already gets the requested look there.
              // Chromium/Android only stretches inter-word spacing for
              // justify (no kashida support), which is less elegant on a
              // line with very few words -- tried CSS's `text-justify:
              // inter-character` as a Chromium-only improvement, but this
              // Blink build silently ignores that property/value entirely
              // (confirmed: never lands in the computed style), so it isn't
              // a real fix, and true kashida rendering needs page-specific
              // glyph fonts out of scope here (see TODO.md) -- left as
              // plain `justify`, which is still strictly better than
              // right-aligned ragged lines on every platform.
              textAlign: "justify",
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
                    <AllahText text={BISMILLAH} />
                  </div>
                );
              }
              var isHighlighted = highlightAyah && highlightAyah.sura === block.sura && highlightAyah.ayah === block.ayah;
              return (
                <span key={block.sura + "-" + block.ayah} style={isHighlighted ? { background: "rgba(201,168,76,0.28)", borderRadius: 4 } : undefined}>
                  <AllahText text={block.text} />{" "}
                  {/* Plain parentheses, not the ornate ﴿﴾ Quranic marks: the
                      latter render as the same glyph on both sides (no visual
                      open/close distinction) in this font, verified directly
                      -- plain "(" ")" render correctly and reliably instead. */}
                  <span style={{ color: GOLD, fontSize: "0.7em" }}>{"(" + toEasternDigits(block.ayah) + ")"}</span>{" "}
                </span>
              );
            })}
          </div>
        </OttomanFrame>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button aria-label={t(lang, "الصفحة السابقة", "Previous page", "Vorherige Seite")} onClick={onPrev} disabled={pageNumber <= 1} style={{ background: "rgba(139,105,20,0.1)", border: "none", borderRadius: 10, color: pageNumber > 1 ? GOLD : "#ccc0b0", fontSize: 20, cursor: pageNumber > 1 ? "pointer" : "default", padding: "8px 20px" }}>
            {"<"}
          </button>
          <div style={{ fontSize: fullscreen ? 13 : 11, color: fullscreen ? GOLD : "#9a8878", fontFamily: "Amiri,serif" }}>
            {t(lang, "صفحة ", "Page ", "Seite ")}
            <span style={{ direction: "ltr", unicodeBidi: "isolate" }}>
              {toEasternDigits(pageNumber)} / {toEasternDigits(totalPages)}
            </span>
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
