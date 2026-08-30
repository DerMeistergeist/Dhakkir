import React from "react";
import { ALLAH_RED } from "../../theme";
import { splitAllahHighlights } from "../../utils/arabic";

// Renders Quran text with every standalone occurrence of "الله" (Lafẓ
// al-Jalālah) in red -- see splitAllahHighlights for exactly which forms
// count and why (validated against the whole Quran text dataset).
export default function AllahText({ text }) {
  return splitAllahHighlights(text).map(function (seg, i) {
    return seg.isAllah ? (
      <span key={i} style={{ color: ALLAH_RED }}>
        {seg.text}
      </span>
    ) : (
      <React.Fragment key={i}>{seg.text}</React.Fragment>
    );
  });
}
