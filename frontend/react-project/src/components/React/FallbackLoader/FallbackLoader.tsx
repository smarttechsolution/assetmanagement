import Loader from "components/UI/Loader";
import React from "react";
import logo from "assets/images/AMS-LOGO-ORIGINAL.png";

interface FallbackProps {
  h?: number;
  styles?: React.CSSProperties;
}

export default function FallbackLoader({ h, styles }: FallbackProps) {
  return (
    <div
      className="blinking"
      style={{ position: "relative", width: "100%", height: (h ? h : 100) + "vh", ...styles }}
    >
      <img
        src={logo}
        alt="Loader"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: " translate(-50%, -50%)",
          width: 150, 
        }}
      />
    </div>
  );
}
