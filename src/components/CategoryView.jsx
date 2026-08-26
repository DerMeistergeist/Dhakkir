import React from "react";
import { GOLD, TEXT, CARD, screenStyle, headerStyle, t } from "../theme";
import { truncateArabic } from "../utils/text";

export default function CategoryView({ lang, category, list, counts, done, doneInCat, onSelectDhikr, onBack, onOpenSettings }) {
  return (
    <div style={Object.assign({}, screenStyle, { paddingBottom: 80 })} className="fin">
      <div style={headerStyle}>
        <button
          style={{ background: "rgba(139,105,20,0.12)", border: "1px solid rgba(139,105,20,0.25)", color: GOLD, fontSize: 13, cursor: "pointer", borderRadius: 10, padding: "6px 14px" }}
          onClick={onBack}
        >
          {"< " + t(lang, "رجوع", "Back", "Zurück")}
        </button>
        <div style={{ fontSize: 16, color: GOLD, fontFamily: "Amiri,serif" }}>{category ? t(lang, category.ar, category.en, category.de) : ""}</div>
        <button aria-label={t(lang, "الاعدادات", "Settings", "Einstellungen")} style={{ background: "none", border: "none", color: "#9a8878", fontSize: 16, cursor: "pointer" }} onClick={onOpenSettings}>
          {"⚙"}
        </button>
      </div>
      <div style={{ padding: "16px" }}>
        <div style={{ background: "rgba(139,105,20,0.1)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, border: "1px solid rgba(201,168,76,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9a8878", marginBottom: 6 }}>
            <span>{t(lang, "التقدم", "Progress", "Fortschritt")}</span>
            <span style={{ color: GOLD, direction: "ltr", unicodeBidi: "isolate" }}>
              {doneInCat} / {list.length}
            </span>
          </div>
          <div style={{ height: 5, background: "rgba(139,105,20,0.1)", borderRadius: 3 }}>
            <div style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#8b6914,#c49a28)", width: (list.length > 0 ? (doneInCat / list.length) * 100 : 0) + "%", transition: "width 0.5s" }} />
          </div>
        </div>
        {list.map(function (d, i) {
          var key = (category ? category.id : "") + "-" + i;
          var isDk = done[key];
          var cnt = counts[key] || 0;
          return (
            <button
              key={i}
              onClick={function () {
                onSelectDhikr(i);
              }}
              style={{
                width: "100%",
                textAlign: "right",
                background: isDk ? "rgba(139,105,20,0.1)" : CARD,
                border: "1px solid " + (isDk ? "rgba(139,105,20,0.3)" : "rgba(139,105,20,0.1)"),
                borderRadius: 16,
                padding: "16px 18px",
                marginBottom: 10,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, flexDirection: "row-reverse" }}>
                <div style={{ minWidth: 28, height: 28, borderRadius: "50%", background: isDk ? GOLD : "rgba(139,105,20,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: isDk ? "#f5f0e8" : "#9a8878", flexShrink: 0 }}>
                  {isDk ? "✓" : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontFamily: "Amiri,serif", color: isDk ? GOLD : TEXT, lineHeight: 1.7, direction: "rtl", marginBottom: 4 }}>{truncateArabic(d.arabic, 55)}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, color: GOLD, background: "rgba(139,105,20,0.12)", padding: "2px 8px", borderRadius: 20 }}>x{d.count}</span>
                    {cnt > 0 && cnt < d.count && (
                      <span style={{ fontSize: 11, color: "#9a8878", direction: "ltr", unicodeBidi: "isolate" }}>
                        {cnt}/{d.count}
                      </span>
                    )}
                    <span style={{ fontSize: 10, color: "#9a8878" }}>{d.source}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
