import React from "react";
import { GOLD } from "../../theme";

var BAND = 20; // thickness (px) of the decorative border band

// A small diamond-and-dot tile, repeated edge to edge to form a
// continuous interlaced lattice -- a classic Ottoman/Islamic manuscript
// border motif. It's rotationally symmetric (90°), so the exact same
// tile image works for both the horizontal (repeat-x) and vertical
// (repeat-y) bands with no extra rotation logic needed.
var TILE_URL =
  "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='28'%20height='28'%3E%3Cpath%20d='M14,1%20L27,14%20L14,27%20L1,14%20Z'%20fill='none'%20stroke='%238b6914'%20stroke-width='1.6'%20opacity='0.85'/%3E%3Ccircle%20cx='14'%20cy='14'%20r='2'%20fill='%238b6914'%20opacity='0.85'/%3E%3C/svg%3E\")";

var bandStyle = { position: "absolute", backgroundImage: TILE_URL, backgroundSize: BAND + "px " + BAND + "px", backgroundPosition: "center" };

// The 16-point rosette used app-wide (app icon, tap counter, OrnateCard),
// used here small as a corner medallion -- covers the square left empty
// where the two perpendicular bands meet, the traditional way manuscript
// borders resolve their corners without mitering the repeating pattern.
var ROSETTE_POINTS = "0.0,-77.8 22.8,-55.0 55.0,-55.0 55.0,-22.8 77.8,0.0 55.0,22.8 55.0,55.0 22.8,55.0 0.0,77.8 -22.8,55.0 -55.0,55.0 -55.0,22.8 -77.8,0.0 -55.0,-22.8 -55.0,-55.0 -22.8,-55.0";

function CornerMedallion({ top, bottom, left, right }) {
  var pos = { position: "absolute", width: BAND, height: BAND };
  if (top != null) pos.top = top;
  if (bottom != null) pos.bottom = bottom;
  if (left != null) pos.left = left;
  if (right != null) pos.right = right;
  return (
    <svg style={pos} viewBox="0 0 160 160" aria-hidden="true">
      <polygon transform="translate(80,80) scale(0.62)" fill={GOLD} opacity="0.85" points={ROSETTE_POINTS} />
    </svg>
  );
}

// A decorative interlaced border (repeating diamond-chain bands with a
// small rosette medallion at each corner) wrapping the Mushaf page -- a
// nod to the illuminated borders found on Ottoman-era Mushaf pages --
// built entirely from CSS + inline SVG so it doesn't need an external
// image asset.
export default function OttomanFrame({ children, style }) {
  return (
    <div style={Object.assign({ position: "relative", padding: BAND, background: "rgba(139,105,20,0.06)", borderRadius: 14 }, style)}>
      <div style={Object.assign({ top: 0, left: BAND, right: BAND, height: BAND, backgroundRepeat: "repeat-x" }, bandStyle)} />
      <div style={Object.assign({ bottom: 0, left: BAND, right: BAND, height: BAND, backgroundRepeat: "repeat-x" }, bandStyle)} />
      <div style={Object.assign({ top: BAND, bottom: BAND, left: 0, width: BAND, backgroundRepeat: "repeat-y" }, bandStyle)} />
      <div style={Object.assign({ top: BAND, bottom: BAND, right: 0, width: BAND, backgroundRepeat: "repeat-y" }, bandStyle)} />
      <CornerMedallion top={0} left={0} />
      <CornerMedallion top={0} right={0} />
      <CornerMedallion bottom={0} left={0} />
      <CornerMedallion bottom={0} right={0} />
      {children}
    </div>
  );
}
