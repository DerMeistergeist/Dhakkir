import React from "react";
import { GOLD } from "../../theme";

// One corner's flourish, drawn once for the top-right corner and mirrored
// via CSS transforms for the other three -- adapted from OrnateCard's
// single-pair flourish, extended to all four corners here for a
// traditional Ottoman-manuscript-style page border.
var CORNER_POSITION = {
  tr: { top: -2, right: -2, transform: "none" },
  tl: { top: -2, left: -2, transform: "scaleX(-1)" },
  br: { bottom: -2, right: -2, transform: "scaleY(-1)" },
  bl: { bottom: -2, left: -2, transform: "scale(-1,-1)" },
};

function Corner({ id }) {
  return (
    <svg style={Object.assign({ position: "absolute" }, CORNER_POSITION[id])} width="32" height="32" viewBox="0 0 50 50" fill="none" stroke={GOLD} strokeWidth="1.3" opacity="0.75" aria-hidden="true">
      <path d="M48,2 L30,2 Q25,2 25,8 L25,15 Q25,22 18,22 L10,22 Q4,22 2,28 L2,48" />
      <path d="M48,8 L35,8 Q30,8 30,15 L30,22 Q30,28 24,28 L15,28 Q8,28 8,35 L8,48" />
      <circle cx="48" cy="2" r="2.4" fill={GOLD} />
      <circle cx="25" cy="15" r="1.6" fill={GOLD} />
    </svg>
  );
}

// A decorative double-rule border with a corner flourish in each corner,
// wrapping the Mushaf page -- a nod to the illuminated borders found on
// Ottoman-era Mushaf pages -- built entirely from CSS + inline SVG so it
// doesn't need an external image asset.
export default function OttomanFrame({ children, style }) {
  return (
    <div style={Object.assign({ border: "2px solid rgba(139,105,20,0.55)", borderRadius: 16, padding: 6 }, style)}>
      <div style={{ position: "relative", border: "1px solid rgba(139,105,20,0.4)", borderRadius: 11 }}>
        <Corner id="tr" />
        <Corner id="tl" />
        <Corner id="br" />
        <Corner id="bl" />
        {children}
      </div>
    </div>
  );
}
