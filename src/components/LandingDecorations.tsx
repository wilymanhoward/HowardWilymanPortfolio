import React from "react";
import "./styles/LandingDecorations.css";

const LandingDecorations: React.FC = () => {
  return (
    <div className="landing-decorations" aria-hidden="true">
      {/* Radiant Cosmic Aurora Glow Behind Character */}
      <div className="landing-character-aura">
        <div className="aura-core" />
        <div className="aura-beam-left" />
        <div className="aura-beam-right" />
      </div>
    </div>
  );
};

export default LandingDecorations;
