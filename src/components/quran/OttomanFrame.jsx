import React from "react";
import { GOLD } from "../../theme";

var BAND = 26; // thickness (px) of the decorative border band

// A small 6-petal blossom with a leaf nub at each edge, repeated edge to
// edge to form a continuous floral garland -- requested after a
// reference screenshot of another Quran app's floral-vine border, kept
// in the app's own gold palette (GOLD for the leaves/center, the same
// secondary gold the scrollbar thumb already uses for the petals)
// instead of that reference's green/pink. The 4-way symmetric leaf nubs
// mean the exact same tile works for both the horizontal (repeat-x) and
// vertical (repeat-y) bands with no extra rotation logic needed.
var PETAL = "M16,13 Q19,7 16,4 Q13,7 16,13 Z";
var PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
var petals = PETAL_ANGLES.map(function (deg) {
  return "<path d='" + PETAL + "' transform='rotate(" + deg + " 16 16)' fill='#c9a84c'/>";
}).join("");
var TILE_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'>" +
  petals +
  "<circle cx='16' cy='16' r='3' fill='#8b6914'/>" +
  "<path d='M16,4 Q18,2 16,0 Q14,2 16,4 Z' fill='#8b6914' opacity='0.8'/>" +
  "<path d='M16,28 Q18,30 16,32 Q14,30 16,28 Z' fill='#8b6914' opacity='0.8'/>" +
  "<path d='M4,16 Q2,18 0,16 Q2,14 4,16 Z' fill='#8b6914' opacity='0.8'/>" +
  "<path d='M28,16 Q30,18 32,16 Q30,14 28,16 Z' fill='#8b6914' opacity='0.8'/>" +
  "</svg>";
var TILE_URL = "url(\"data:image/svg+xml," + encodeURIComponent(TILE_SVG) + "\")";

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

// A decorative floral-garland border (repeating blossom bands with a
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
