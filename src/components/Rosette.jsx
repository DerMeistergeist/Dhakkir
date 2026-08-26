import React from "react";
import { GOLD } from "../theme";

// The small 8-point rosette used as a divider under Arabic text.
export default function Rosette({ size, margin }) {
  return (
    <div style={{ textAlign: "center", margin: margin || "8px 0", opacity: 0.35 }} aria-hidden="true">
      <svg width={size || 24} height={size || 24} viewBox="0 0 160 160">
        <polygon
          transform="translate(80,80)"
          fill={GOLD}
          stroke="none"
          points="0,-77.8 22.8,-55 55,-55 55,-22.8 77.8,0 55,22.8 55,55 22.8,55 0,77.8 -22.8,55 -55,55 -55,22.8 -77.8,0 -55,-22.8 -55,-55 -22.8,-55"
        />
      </svg>
    </div>
  );
}
