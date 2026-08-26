import React from "react";
import { SECTIONS } from "../data";
import { GOLD, screenStyle, t } from "../theme";
import AdhkarGrid from "./AdhkarGrid";
import HadithsSection from "./HadithsSection";

export default function HomeView({ lang, setLang, section, setSection, done, onOpenSettings, onSelectAdhkarCategory, hadithsProps }) {
  return (
    <div style={Object.assign({}, screenStyle, { paddingBottom: 80 })}>
      <div style={{ padding: "12px 16px", background: "rgba(250,247,240,0.98)", borderBottom: "1px solid rgba(139,105,20,0.25)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", opacity: 0.06 }} aria-hidden="true">
          <svg width="80" height="80" viewBox="0 0 120 120">
            <g fill={GOLD} transform="translate(60,60)">
              <polygon points="0,-50 11,-22 40,-31 22,-8 40,12 11,8 0,35 -11,8 -40,12 -22,-8 -40,-31 -11,-22" />
              <polygon points="0,-50 11,-22 40,-31 22,-8 40,12 11,8 0,35 -11,8 -40,12 -22,-8 -40,-31 -11,-22" transform="rotate(22.5)" />
            </g>
          </svg>
        </div>
        <div style={{ width: 36 }} />
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: GOLD, fontFamily: "Amiri,serif" }}>ذكّر</div>
          <div style={{ fontSize: 10, color: "#9a8878", letterSpacing: 2 }}>DHAKKIR</div>
        </div>
        <button aria-label={t(lang, "الاعدادات", "Settings", "Einstellungen")} style={{ background: "none", border: "none", color: "#9a8878", fontSize: 16, cursor: "pointer" }} onClick={onOpenSettings}>
          {"⚙"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "14px 16px 0" }}>
        {SECTIONS.map(function (s) {
          return (
            <button
              key={s.id}
              onClick={function () {
                setSection(s.id);
              }}
              style={{
                flex: 1,
                padding: "10px 0",
                background: section === s.id ? "rgba(139,105,20,0.25)" : "rgba(139,105,20,0.06)",
                border: "1px solid " + (section === s.id ? "rgba(139,105,20,0.5)" : "rgba(139,105,20,0.1)"),
                borderRadius: 12,
                cursor: "pointer",
                color: section === s.id ? GOLD : "#9a8878",
                fontSize: 13,
                fontFamily: lang === "ar" ? "Amiri,serif" : "Arial,sans-serif",
              }}
            >
              {lang === "ar" ? s.ar : s.en}
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

      {section === "hadiths" ? (
        <div style={{ padding: "0 16px" }}>
          <HadithsSection lang={lang} {...hadithsProps} />
        </div>
      ) : (
        <AdhkarGrid lang={lang} done={done} onSelectCategory={onSelectAdhkarCategory} />
      )}
    </div>
  );
}
