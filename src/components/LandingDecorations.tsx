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

      {/* Game Controller / Joystick Silhouette (Behind Character's Right Arm) */}
      <div className="landing-deco-gamepad">
        <svg
          viewBox="0 0 260 180"
          className="deco-gamepad-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="gamepad-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="gamepad-stroke-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#82b4ff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#4f8cff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Top Cable & Strain Relief */}
          <path
            d="M 130 60 L 130 18 C 130 10 123 6 123 0"
            stroke="url(#gamepad-stroke-grad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <rect
            x="126"
            y="44"
            width="8"
            height="14"
            rx="2"
            stroke="url(#gamepad-stroke-grad)"
            strokeWidth="1.5"
            fill="rgba(10, 15, 30, 0.7)"
          />

          {/* Top Bumpers & Triggers */}
          <path
            d="M 56 46 C 60 28 78 20 100 23 L 103 46"
            stroke="url(#gamepad-stroke-grad)"
            strokeWidth="1.6"
            strokeOpacity="0.7"
            fill="none"
          />
          <path
            d="M 204 46 C 200 28 182 20 160 23 L 157 46"
            stroke="url(#gamepad-stroke-grad)"
            strokeWidth="1.6"
            strokeOpacity="0.7"
            fill="none"
          />

          {/* Main Controller Ergonomic Body */}
          <path
            d="M 40 166 C 22 163 8 134 14 93 C 18 63 36 46 64 42 C 78 40 94 46 110 54 C 117 57 123 59 130 59 C 137 59 143 57 150 54 C 166 46 182 40 196 42 C 224 46 242 63 246 93 C 252 134 238 163 220 166 C 202 169 190 142 180 120 C 174 107 167 102 156 102 C 147 102 140 106 130 106 C 120 106 113 102 104 102 C 93 102 86 107 80 120 C 70 142 58 169 40 166 Z"
            stroke="url(#gamepad-stroke-grad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(10, 15, 30, 0.45)"
            filter="url(#gamepad-glow)"
          />

          {/* Inner Grip Contour Lines */}
          <path
            d="M 44 142 C 54 108 66 90 92 86"
            stroke="#82b4ff"
            strokeWidth="1.2"
            strokeOpacity="0.45"
            strokeDasharray="4 3"
            fill="none"
          />
          <path
            d="M 216 142 C 206 108 194 90 168 86"
            stroke="#82b4ff"
            strokeWidth="1.2"
            strokeOpacity="0.45"
            strokeDasharray="4 3"
            fill="none"
          />

          {/* D-Pad (Left) */}
          <g transform="translate(60, 84)">
            <path
              d="M -7 -23 L 7 -23 L 7 -7 L 23 -7 L 23 7 L 7 7 L 7 23 L -7 23 L -7 7 L -23 7 L -23 -7 L -7 -7 Z"
              stroke="#82b4ff"
              strokeWidth="2"
              fill="rgba(20, 32, 64, 0.6)"
              strokeLinejoin="round"
            />
            <circle cx="0" cy="0" r="3.5" fill="#4f8cff" fillOpacity="0.75" />
            <path
              d="M 0 -19 L 0 -13 M 0 19 L 0 13 M -19 0 L -13 0 M 19 0 L 13 0"
              stroke="#82b4ff"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </g>

          {/* Action Buttons (Right: Y, B, A, X) */}
          <g transform="translate(200, 84)">
            {/* Top Y */}
            <circle cx="0" cy="-16" r="7" stroke="#82b4ff" strokeWidth="1.6" fill="rgba(20, 32, 64, 0.6)" />
            <text x="0" y="-13" fontFamily="system-ui, sans-serif" fontSize="8.5" fontWeight="bold" fill="#a8c7fa" textAnchor="middle">Y</text>
            {/* Bottom A */}
            <circle cx="0" cy="16" r="7" stroke="#82b4ff" strokeWidth="1.6" fill="rgba(20, 32, 64, 0.6)" />
            <text x="0" y="19" fontFamily="system-ui, sans-serif" fontSize="8.5" fontWeight="bold" fill="#a8c7fa" textAnchor="middle">A</text>
            {/* Left X */}
            <circle cx="-16" cy="0" r="7" stroke="#82b4ff" strokeWidth="1.6" fill="rgba(20, 32, 64, 0.6)" />
            <text x="-16" y="3" fontFamily="system-ui, sans-serif" fontSize="8.5" fontWeight="bold" fill="#a8c7fa" textAnchor="middle">X</text>
            {/* Right B */}
            <circle cx="16" cy="0" r="7" stroke="#82b4ff" strokeWidth="1.6" fill="rgba(20, 32, 64, 0.6)" />
            <text x="16" y="3" fontFamily="system-ui, sans-serif" fontSize="8.5" fontWeight="bold" fill="#a8c7fa" textAnchor="middle">B</text>
          </g>

          {/* Left Analog Joystick */}
          <g transform="translate(102, 116)">
            <circle cx="0" cy="0" r="16.5" stroke="#4f8cff" strokeWidth="1.4" strokeDasharray="4 2.5" fill="rgba(12, 18, 36, 0.5)" />
            <circle cx="0" cy="0" r="12" stroke="#82b4ff" strokeWidth="2" fill="rgba(22, 36, 72, 0.7)" />
            <circle cx="0" cy="0" r="7" stroke="#82b4ff" strokeWidth="1.2" strokeOpacity="0.8" fill="none" />
            <path d="M 0 -7 L 0 -3.5 M 0 7 L 0 3.5 M -7 0 L -3.5 0 M 7 0 L 3.5 0" stroke="#82b4ff" strokeWidth="1.4" strokeLinecap="round" />
          </g>

          {/* Right Analog Joystick */}
          <g transform="translate(158, 116)">
            <circle cx="0" cy="0" r="16.5" stroke="#4f8cff" strokeWidth="1.4" strokeDasharray="4 2.5" fill="rgba(12, 18, 36, 0.5)" />
            <circle cx="0" cy="0" r="12" stroke="#82b4ff" strokeWidth="2" fill="rgba(22, 36, 72, 0.7)" />
            <circle cx="0" cy="0" r="7" stroke="#82b4ff" strokeWidth="1.2" strokeOpacity="0.8" fill="none" />
            <path d="M 0 -7 L 0 -3.5 M 0 7 L 0 3.5 M -7 0 L -3.5 0 M 7 0 L 3.5 0" stroke="#82b4ff" strokeWidth="1.4" strokeLinecap="round" />
          </g>

          {/* Center Touchpad & System Buttons */}
          <rect
            x="108"
            y="68"
            width="44"
            height="23"
            rx="4.5"
            stroke="url(#gamepad-stroke-grad)"
            strokeWidth="1.5"
            fill="rgba(16, 26, 52, 0.5)"
          />
          <circle cx="130" cy="79.5" r="4.5" stroke="#82b4ff" strokeWidth="1.2" fill="none" />
          <circle cx="95" cy="74" r="3" fill="#4f8cff" fillOpacity="0.75" />
          <circle cx="165" cy="74" r="3" fill="#4f8cff" fillOpacity="0.75" />
        </svg>
      </div>

      {/* Code Snapshot Silhouette Card (Behind Character's Left Arm) */}
      <div className="landing-deco-code">
        <div className="deco-code-window">
          {/* Window Titlebar */}
          <div className="deco-code-header">
            <div className="deco-code-dots">
              <span className="dot dot-close" />
              <span className="dot dot-min" />
              <span className="dot dot-max" />
            </div>
            <span className="deco-code-title">PlayerController.cs</span>
          </div>

          {/* Monospace Code Snapshot */}
          <div className="deco-code-content">
            <pre>
              <code>
                <span className="code-kw">using</span> <span className="code-type">UnityEngine</span>;{"\n"}
                {"\n"}
                <span className="code-kw">public class</span> <span className="code-type">PlayerController</span> : <span className="code-type">MonoBehaviour</span> {"{\n"}
                {"  "}<span className="code-attr">[SerializeField]</span> <span className="code-kw">private float</span> speed = <span className="code-num">8.5f</span>;{"\n"}
                {"  "}<span className="code-kw">public</span> <span className="code-type">Animator</span> anim;{"\n"}
                {"\n"}
                {"  "}<span className="code-kw">void</span> <span className="code-func">Update</span>() {"{\n"}
                {"    "}<span className="code-kw">float</span> move = <span className="code-type">Input</span>.<span className="code-func">GetAxis</span>(<span className="code-str">"Vertical"</span>);{"\n"}
                {"    "}anim.<span className="code-func">SetFloat</span>(<span className="code-str">"Speed"</span>, <span className="code-type">Mathf</span>.<span className="code-func">Abs</span>(move));{"\n"}
                {"  }"}{"\n"}
                {"}"}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingDecorations;
