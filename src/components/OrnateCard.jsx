import React from "react";
import { GOLD } from "../theme";

// Decorative card with matching corner flourishes in opposite corners,
// used to frame both a dhikr and a hadith in their detail views.
export default function OrnateCard({ children, style }) {
  return (
    <div
      style={Object.assign(
        {
          background: "rgba(139,105,20,0.08)",
          border: "1px solid rgba(139,105,20,0.25)",
          borderRadius: 20,
          padding: "24px 20px",
          position: "relative",
        },
        style
      )}
    >
      <svg style={{ position: "absolute", top: 0, right: 0, opacity: 0.25 }} width="50" height="50" viewBox="0 0 50 50" fill="none" stroke={GOLD} strokeWidth="0.8" aria-hidden="true">
        <path d="M48,2 L30,2 Q25,2 25,8 L25,15 Q25,22 18,22 L10,22 Q4,22 2,28 L2,48" />
        <path d="M48,8 L35,8 Q30,8 30,15 L30,22 Q30,28 24,28 L15,28 Q8,28 8,35 L8,48" />
        <circle cx="48" cy="2" r="2" fill={GOLD} />
        <circle cx="25" cy="15" r="1.5" fill={GOLD} />
      </svg>
      <svg style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.25, transform: "rotate(180deg)" }} width="50" height="50" viewBox="0 0 50 50" fill="none" stroke={GOLD} strokeWidth="0.8" aria-hidden="true">
        <path d="M48,2 L30,2 Q25,2 25,8 L25,15 Q25,22 18,22 L10,22 Q4,22 2,28 L2,48" />
        <path d="M48,8 L35,8 Q30,8 30,15 L30,22 Q30,28 24,28 L15,28 Q8,28 8,35 L8,48" />
        <circle cx="48" cy="2" r="2" fill={GOLD} />
      </svg>
      {children}
    </div>
  );
}
