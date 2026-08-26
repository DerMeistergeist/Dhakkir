import React from "react";
import { GOLD, PATTERN_BG } from "../theme";

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
      <svg width="130" height="130" viewBox="0 0 200 200" style={{ marginBottom: 24 }} aria-hidden="true">
        <polygon
          transform="translate(100,100)"
          fill="rgba(139,105,20,0.15)"
          stroke={GOLD}
          strokeWidth="2"
          strokeLinejoin="miter"
          points="0.0,-77.8 22.8,-55.0 55.0,-55.0 55.0,-22.8 77.8,0.0 55.0,22.8 55.0,55.0 22.8,55.0 0.0,77.8 -22.8,55.0 -55.0,55.0 -55.0,22.8 -77.8,0.0 -55.0,-22.8 -55.0,-55.0 -22.8,-55.0"
        />
      </svg>
      <div style={{ fontSize: 48, fontFamily: "Amiri,serif", fontWeight: 700, color: GOLD, animation: "sIn 0.8s ease 0.3s both" }}>ذكّر</div>
      <div style={{ width: 50, height: 1, background: "linear-gradient(90deg,transparent," + GOLD + ",transparent)", margin: "16px 0" }} />
      <div style={{ fontSize: 19, fontFamily: "Amiri,serif", color: "#2c1810", textAlign: "center", direction: "rtl", lineHeight: 2, animation: "sIn 0.8s ease 0.7s both", padding: "0 40px" }}>
        وَذَكِّرْ فَإِنَّ الذِّكْرَى تَنْفَعُ الْمُؤْمِنِينَ
      </div>
      <div style={{ fontSize: 13, color: GOLD, fontFamily: "Amiri,serif", marginTop: 10 }}>سورة الذاريات - 55</div>
      <div style={{ fontSize: 10, color: "#9a8878", marginTop: 32, letterSpacing: 3 }}>DHAKKIR</div>
    </div>
  );
}
