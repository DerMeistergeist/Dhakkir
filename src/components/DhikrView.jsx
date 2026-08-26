import React from "react";
import { GOLD, screenStyle, headerStyle, t } from "../theme";
import OrnateCard from "./OrnateCard";
import Rosette from "./Rosette";

export default function DhikrView({
  lang,
  category,
  dhikr,
  dhikrIdx,
  listLength,
  cCount,
  req,
  isDone,
  pct,
  showTr,
  onPrev,
  onNext,
  onTap,
  onReset,
  onBack,
  onOpenSettings,
}) {
  if (!dhikr) return null;

  return (
    <div style={Object.assign({}, screenStyle, { paddingBottom: 80 })} className="fin">
      <div style={headerStyle}>
        <button
          style={{ background: "rgba(139,105,20,0.12)", border: "1px solid rgba(139,105,20,0.25)", color: GOLD, fontSize: 16, cursor: "pointer", borderRadius: 10, padding: "6px 14px", fontFamily: "Arial,sans-serif" }}
          onClick={onBack}
        >
          {"< " + t(lang, "رجوع", "Back", "Zurück")}
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#9a8878", direction: "ltr", unicodeBidi: "isolate" }}>
            {dhikrIdx + 1} / {listLength}
          </div>
          <div style={{ fontSize: 14, color: GOLD, fontFamily: "Amiri,serif" }}>{category ? t(lang, category.ar, category.en, category.de) : ""}</div>
        </div>
        <button aria-label={t(lang, "الاعدادات", "Settings", "Einstellungen")} style={{ background: "none", border: "none", color: "#9a8878", fontSize: 16, cursor: "pointer" }} onClick={onOpenSettings}>
          {"⚙"}
        </button>
      </div>
      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <button aria-label={t(lang, "السابق", "Previous", "Zurück")} onClick={onPrev} disabled={dhikrIdx <= 0} style={{ background: "none", border: "none", color: dhikrIdx > 0 ? GOLD : "#ccc0b0", fontSize: 24, cursor: dhikrIdx > 0 ? "pointer" : "default" }}>
            {"<"}
          </button>
          <div style={{ height: 4, flex: 1, margin: "0 8px", background: "rgba(139,105,20,0.1)", borderRadius: 2 }}>
            <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg,#8b6914,#c49a28)", width: pct + "%", transition: "width 0.4s" }} />
          </div>
          <button aria-label={t(lang, "التالي", "Next", "Weiter")} onClick={onNext} disabled={dhikrIdx >= listLength - 1} style={{ background: "none", border: "none", color: dhikrIdx < listLength - 1 ? GOLD : "#ccc0b0", fontSize: 24, cursor: dhikrIdx < listLength - 1 ? "pointer" : "default" }}>
            {">"}
          </button>
        </div>
        <OrnateCard style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontFamily: "Amiri,serif", color: "#2c1810", lineHeight: 2, direction: "rtl", textAlign: "center" }}>{dhikr.arabic}</div>
          <Rosette size={24} />
          {dhikr.translit && <div style={{ fontSize: 13, color: "#6a5a4a", fontStyle: "italic", textAlign: "center", marginTop: 10, lineHeight: 1.8, wordBreak: "break-word" }}>{dhikr.translit}</div>}
          {showTr && dhikr.en && (
            <div style={{ fontSize: 13, color: "#5a4a3a", marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(201,168,76,0.1)", lineHeight: 1.7 }}>{lang === "de" && dhikr.de ? dhikr.de : dhikr.en}</div>
          )}
          <div style={{ fontSize: 11, color: GOLD, textAlign: "center", marginTop: 10 }}>{dhikr.source}</div>
        </OrnateCard>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={onTap}
            aria-label={t(lang, "اضغط للعد", "Tap to count", "Zum Zählen tippen")}
            style={{ background: "none", border: "none", cursor: isDone ? "default" : "pointer", padding: 0, margin: "0 auto", display: "block" }}
          >
            <svg width="150" height="150" viewBox="0 0 160 160" style={{ display: "block", filter: isDone ? "drop-shadow(0 0 10px rgba(139,105,20,0.5))" : "none", transition: "filter 0.3s" }}>
              <polygon
                transform="translate(80,80)"
                points="0,-77.8 22.8,-55 55,-55 55,-22.8 77.8,0 55,22.8 55,55 22.8,55 0,77.8 -22.8,55 -55,55 -55,22.8 -77.8,0 -55,-22.8 -55,-55 -22.8,-55"
                fill={isDone ? "rgba(139,105,20,0.18)" : "rgba(139,105,20,0.06)"}
                stroke={GOLD}
                strokeWidth="2"
                strokeLinejoin="miter"
              />
              <text x="80" y="74" textAnchor="middle" fontFamily="Amiri,serif" fontSize="30" fill={GOLD} fontWeight="bold">
                {cCount}
              </text>
              <line x1="58" y1="83" x2="102" y2="83" stroke={GOLD} strokeWidth="0.8" opacity="0.5" />
              <text x="80" y="97" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="15" fill={GOLD} opacity="0.7">
                {req}
              </text>
              {isDone && (
                <text x="80" y="116" textAnchor="middle" fontSize="12" fill={GOLD} opacity="0.8">
                  {t(lang, "تم", "done", "fertig")}
                </text>
              )}
              {!isDone && (
                <text x="80" y="116" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="9" fill="#9a8878">
                  {t(lang, "اضغط", "tap", "tippen")}
                </text>
              )}
            </svg>
          </button>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
            <button onClick={onReset} style={{ background: "rgba(139,105,20,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#9a8878", borderRadius: 10, padding: "7px 18px", cursor: "pointer", fontSize: 12 }}>
              {t(lang, "اعادة", "Reset", "Reset")}
            </button>
            {isDone && dhikrIdx < listLength - 1 && (
              <button onClick={onNext} style={{ background: "rgba(139,105,20,0.2)", border: "1px solid rgba(201,168,76,0.3)", color: GOLD, borderRadius: 10, padding: "7px 18px", cursor: "pointer", fontSize: 12 }}>
                {t(lang, "التالي", "Next", "Weiter")} {">"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
