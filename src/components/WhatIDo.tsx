import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);
  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };

  useEffect(() => {
    containerRef.current.forEach((container) => {
      if (container) {
        if (ScrollTrigger.isTouch) {
          container.classList.remove("what-noTouch");
        }
        const handler = () => handleClick(container);
        container.addEventListener("click", handler);
        (container as any)._clickHandler = handler;
      }
    });

    return () => {
      containerRef.current.forEach((container) => {
        if (container && (container as any)._clickHandler) {
          container.removeEventListener("click", (container as any)._clickHandler);
        }
      });
    };
  }, []);

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
          <div
            className="what-content what-noTouch what-card-develop"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-content-in">
              <div className="what-card-header">
                <div>
                  <span className="what-card-num">01</span>
                  <h3>DEVELOP</h3>
                </div>
                <div className="what-arrow" aria-label="Expand Develop Details">
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
                </div>
              </div>

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

          <div
            className="what-content what-noTouch what-card-design"
            ref={(el) => setRef(el, 1)}
          >
            <div className="what-content-in">
              <div className="what-card-header">
                <div>
                  <span className="what-card-num">02</span>
                  <h3>DESIGN</h3>
                </div>
                <div className="what-arrow" aria-label="Expand Design Details">
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
                </div>
              </div>

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
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  const isActive = container.classList.contains("what-content-active");
  const parent = container.parentElement;

  if (parent) {
    const cards = Array.from(parent.querySelectorAll<HTMLDivElement>(".what-content"));
    cards.forEach((card) => {
      card.classList.remove("what-content-active");
      card.classList.remove("what-sibling");
    });

    if (!isActive) {
      container.classList.add("what-content-active");
      cards.forEach((card) => {
        if (card !== container) {
          card.classList.add("what-sibling");
        }
      });
    }
  }
}
