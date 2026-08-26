import React from "react";
import { GOLD, PATTERN_BG } from "../theme";

// The app's 16-point rosette (same shape used for the app icon, the tap
// counter, and every OrnateCard corner) drawn once here as the splash's
// soft background glow, with "ذكّر" centered exactly on top of it.
var ROSETTE_POINTS =
  "0.0,-77.8 22.8,-55.0 55.0,-55.0 55.0,-22.8 77.8,0.0 55.0,22.8 55.0,55.0 22.8,55.0 0.0,77.8 -22.8,55.0 -55.0,55.0 -55.0,22.8 -77.8,0.0 -55.0,-22.8 -55.0,-55.0 -22.8,-55.0";

export default function Splash({ fade }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#f8f3e8",
        backgroundImage: PATTERN_BG,
        backgroundSize: "60px 60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        opacity: fade ? 0 : 1,
        transition: "opacity 0.7s ease",
      }}
    >
      <div style={{ position: "relative", width: 280, height: 280, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
        <svg width="280" height="280" viewBox="0 0 280 280" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
          <filter id="splashGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <polygon transform="translate(140,140) scale(1.55)" points={ROSETTE_POINTS} fill="#e7dbc3" filter="url(#splashGlow)" />
        </svg>
        <div style={{ position: "relative", zIndex: 1, fontSize: 64, fontFamily: "Amiri,serif", fontWeight: 700, color: GOLD, animation: "sIn 0.8s ease 0.3s both" }}>ذكّر</div>
      </div>
      <div style={{ fontSize: 11, color: "#9a8878", letterSpacing: 4, marginBottom: 20 }}>DHAKKIR</div>
      <div style={{ width: 50, height: 1, background: "linear-gradient(90deg,transparent," + GOLD + ",transparent)", margin: "0 0 16px" }} />
      <div style={{ fontSize: 19, fontFamily: "Amiri,serif", color: "#2c1810", textAlign: "center", direction: "rtl", lineHeight: 2, animation: "sIn 0.8s ease 0.7s both", padding: "0 40px" }}>
        وَذَكِّرْ فَإِنَّ الذِّكْرَى تَنْفَعُ الْمُؤْمِنِينَ
      </div>
      <div style={{ fontSize: 13, color: GOLD, fontFamily: "Amiri,serif", marginTop: 10 }}>سورة الذاريات - 55</div>
    </div>
  );
}
