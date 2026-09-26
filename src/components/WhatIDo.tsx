import { useState } from "react";
import "./styles/WhatIDo.css";

const WhatIDo = () => {
  const [openCard, setOpenCard] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenCard((prev) => (prev === index ? null : index));
  };

  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          {/* Card 0: DEVELOP */}
          <div
            className={`what-content what-card-develop ${
              openCard === 0 ? "is-open" : ""
            }`}
            onClick={() => handleToggle(0)}
          >
            <div className="what-content-in">
              <div className="what-card-header">
                <div>
                  <span className="what-card-num">01</span>
                  <h3>DEVELOP</h3>
                </div>
                <button
                  type="button"
                  className="what-arrow"
                  aria-label="Toggle DEVELOP details"
                  title="Expand or minimize"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(0);
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              <div className="what-card-body-wrapper">
                <div className="what-card-body">
                  <h4>Description</h4>
                  <p>
                    Architecting responsive gameplay systems, core character mechanics, and interactive web software. I specialize in writing clean, modular C# for real-time game engines and developing structured web applications with seamless user interaction.
                  </p>
                  <h5>Skillset & tools</h5>
                  <div className="what-content-flex">
                    <div className="what-tags">C#</div>
                    <div className="what-tags">Unity</div>
                    <div className="what-tags">React.js</div>
                    <div className="what-tags">JavaScript</div>
                    <div className="what-tags">Git</div>
                    <div className="what-tags">Photon Engine</div>
                    <div className="what-tags">HTML/CSS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 1: DESIGN */}
          <div
            className={`what-content what-card-design ${
              openCard === 1 ? "is-open" : ""
            }`}
            onClick={() => handleToggle(1)}
          >
            <div className="what-content-in">
              <div className="what-card-header">
                <div>
                  <span className="what-card-num">02</span>
                  <h3>DESIGN</h3>
                </div>
                <button
                  type="button"
                  className="what-arrow"
                  aria-label="Toggle DESIGN details"
                  title="Expand or minimize"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(1);
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              <div className="what-card-body-wrapper">
                <div className="what-card-body">
                  <h4>Description</h4>
                  <p>
                    Bridging game mechanics with 3D art pipelines. Experienced in hard-surface 3D modeling, asset rigging, and keyframe animation, along with soundscape design to create cohesive, immersive digital experiences.
                  </p>
                  <h5>Skillset & tools</h5>
                  <div className="what-content-flex">
                    <div className="what-tags">Autodesk Maya</div>
                    <div className="what-tags">3D Modeling</div>
                    <div className="what-tags">Rigging & Animation</div>
                    <div className="what-tags">Adobe Audition</div>
                    <div className="what-tags">UI/UX Design</div>
                    <div className="what-tags">Audio Design</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;
