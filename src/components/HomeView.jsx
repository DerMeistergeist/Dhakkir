import React, { useState } from "react";
import { SECTIONS } from "../data";
import { GOLD, screenStyle, t } from "../theme";
import AdhkarGrid from "./AdhkarGrid";
import HadithsSection from "./HadithsSection";
import PrayerTimes from "./PrayerTimes";
import QuranSection from "./quran/QuranSection";

export default function HomeView({ lang, setLang, section, setSection, done, onOpenSettings, onSelectAdhkarCategory, hadithsProps, prayerTimesProps, quranProps }) {
  // When the Mushaf page goes fullscreen (for readers who need it, e.g.
  // weak eyesight), hide this component's own chrome too -- the app logo
  // header, section tabs and language switcher -- so "fullscreen" really
  // means the page fills the whole screen, not just MushafPage's header.
  const [quranImmersive, setQuranImmersive] = useState(false);

  return (
    <div style={Object.assign({}, screenStyle, { paddingBottom: quranImmersive ? 0 : 80 })}>
      {!quranImmersive && (
        <>
          <div style={{ padding: "12px 16px", background: "rgba(250,247,240,0.98)", borderBottom: "1px solid rgba(139,105,20,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
            <div style={{ width: 36 }} />
            {/* The star sits directly behind the wordmark (not centered on
                the whole header row) so it lines up with "ذكّر" exactly,
                the same treatment as the splash screen's logo -- same
                16-point rosette shape used app-wide (app icon, tap
                counter, OrnateCard corners), as a soft blurred glow. */}
            <div style={{ position: "relative", width: 110, height: 66, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} aria-hidden="true">
                <filter id="homeLogoGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
                <polygon
                  transform="translate(55,55) scale(0.62)"
                  fill="#e7dbc3"
                  filter="url(#homeLogoGlow)"
                  points="0.0,-77.8 22.8,-55.0 55.0,-55.0 55.0,-22.8 77.8,0.0 55.0,22.8 55.0,55.0 22.8,55.0 0.0,77.8 -22.8,55.0 -55.0,55.0 -55.0,22.8 -77.8,0.0 -55.0,-22.8 -55.0,-55.0 -22.8,-55.0"
                />
              </svg>
              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: GOLD, fontFamily: "Amiri,serif" }}>ذكّر</div>
                <div style={{ fontSize: 10, color: "#9a8878", letterSpacing: 2 }}>DHAKKIR</div>
              </div>
            </div>
            <button aria-label={t(lang, "الاعدادات", "Settings", "Einstellungen")} style={{ background: "none", border: "none", color: "#9a8878", fontSize: 16, cursor: "pointer" }} onClick={onOpenSettings}>
              {"⚙"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "14px 16px 0" }}>
            {SECTIONS.map(function (s) {
              return (
                <button
                  key={s.id}
                  onClick={function () {
                    setSection(s.id);
                  }}
                  style={{
                    padding: "10px 4px",
                    background: section === s.id ? "rgba(139,105,20,0.25)" : "rgba(139,105,20,0.06)",
                    border: "1px solid " + (section === s.id ? "rgba(139,105,20,0.5)" : "rgba(139,105,20,0.1)"),
                    borderRadius: 12,
                    cursor: "pointer",
                    color: section === s.id ? GOLD : "#9a8878",
                    fontSize: 12,
                    fontFamily: lang === "ar" ? "Amiri,serif" : "Arial,sans-serif",
                  }}
                >
                  {t(lang, s.ar, s.en, s.de)}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", gap: 8, padding: "10px 16px" }}>
            {["ar", "en", "de"].map(function (l) {
              return (
                <button
                  key={l}
                  onClick={function () {
                    setLang(l);
                  }}
                  style={{ flex: 1, padding: "7px 0", background: lang === l ? "rgba(139,105,20,0.2)" : "rgba(139,105,20,0.05)", border: "1px solid " + (lang === l ? "rgba(139,105,20,0.35)" : "rgba(139,105,20,0.08)"), borderRadius: 10, color: lang === l ? GOLD : "#9a8878", cursor: "pointer", fontSize: 11 }}
                >
                  {l === "ar" ? "عربي" : l === "en" ? "EN" : "DE"}
                </button>
              );
            })}
          </div>
        </>
      )}

      {section === "hadiths" && !quranImmersive && (
        <div style={{ padding: "0 16px" }}>
          <HadithsSection lang={lang} {...hadithsProps} />
        </div>
      )}
      {section === "prayertimes" && !quranImmersive && <PrayerTimes lang={lang} {...prayerTimesProps} />}
      {section === "quran" && <QuranSection lang={lang} {...quranProps} onFullscreenChange={setQuranImmersive} />}
      {section === "adhkar" && !quranImmersive && <AdhkarGrid lang={lang} done={done} onSelectCategory={onSelectAdhkarCategory} />}
    </div>
  );
}
