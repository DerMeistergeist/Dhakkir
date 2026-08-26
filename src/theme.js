// Shared visual constants and small style helpers used across the app.

export var BG = "#f5f0e8";
export var GOLD = "#8b6914";
export var TEXT = "#2c1810";
export var CARD = "rgba(139,105,20,0.06)";

export var FONTS = { amiri: "Amiri,serif", sans: "Arial,sans-serif" };

// The repeating 8-point rosette pattern used as a background watermark
// throughout the app.
export var PATTERN_BG =
  "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='60'%20height='60'%3E%3Cpolygon%20transform='translate(30,30)'%20fill='none'%20stroke='%238b6914'%20stroke-width='0.7'%20opacity='0.28'%20points='0.0,-21.0%206.2,-14.9%2014.9,-14.9%2014.9,-6.2%2021.0,0.0%2014.9,6.2%2014.9,14.9%206.2,14.9%200.0,21.0%20-6.2,14.9%20-14.9,14.9%20-14.9,6.2%20-21.0,0.0%20-14.9,-6.2%20-14.9,-14.9%20-6.2,-14.9'/%3E%3C/svg%3E\")";

export var screenStyle = {
  minHeight: "100vh",
  background: "#f8f3e8",
  backgroundImage: PATTERN_BG,
  backgroundSize: "60px 60px",
};

export var headerStyle = {
  padding: "12px 16px",
  background: "#f8f3e8",
  borderBottom: "1px solid rgba(139,105,20,0.25)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  position: "sticky",
  top: 0,
};

// UI copy shared by more than one view, keyed by language.
export function t(lang, ar, en, de) {
  if (lang === "ar") return ar;
  if (lang === "de") return de || en;
  return en;
}
