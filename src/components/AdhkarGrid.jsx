import React from "react";
import { CATEGORIES, ADHKAR } from "../data";
import { t } from "../theme";

export default function AdhkarGrid({ lang, done, onSelectCategory }) {
  return (
    <div style={{ padding: "4px 16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {CATEGORIES.map(function (cat) {
          var items = ADHKAR[cat.id] || [];
          var doneCount = items.filter(function (_, i) {
            return done[cat.id + "-" + i];
          }).length;
          var pct = items.length > 0 ? (doneCount / items.length) * 100 : 0;
          return (
            <button
              key={cat.id}
              onClick={function () {
                onSelectCategory(cat.id);
              }}
              style={{
                background: "linear-gradient(135deg,rgba(255,252,245,0.9) 0%,rgba(245,240,228,0.95) 100%)",
                border: "1px solid rgba(139,105,20,0.25)",
                borderRadius: 16,
                padding: "16px 14px",
                cursor: "pointer",
                textAlign: "right",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {pct > 0 && <div style={{ position: "absolute", bottom: 0, left: 0, height: 3, width: pct + "%", background: "linear-gradient(90deg,#8b6914,#c49a28)", borderRadius: 3, transition: "width 0.5s" }} />}
              <div style={{ fontSize: 14, fontFamily: "Amiri,serif", color: "#2c1810", fontWeight: 600 }}>{t(lang, cat.ar, cat.en, cat.de)}</div>
              <div style={{ fontSize: 11, color: "#9a8878", marginTop: 4 }}>
                {items.length} {t(lang, "ذكر", "adhkar", "Adhkar")}
                {pct === 100 ? " ✓" : ""}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
