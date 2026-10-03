import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Work = () => {
  useGSAP(() => {
    function calculateTranslateX(): number {
      const container = document.querySelector(".work-container") as HTMLElement;
      const flex = document.querySelector(".work-flex") as HTMLElement;
      const boxes = document.querySelectorAll(".work-box");

      if (!container || !flex || boxes.length === 0) return 0;

      const lastBox = boxes[boxes.length - 1] as HTMLElement;
      const currentX = (gsap.getProperty(flex, "x") as number) || 0;
      const lastBoxRight = lastBox.getBoundingClientRect().right - currentX;
      const containerRight = container.getBoundingClientRect().right;
      const paddingRight =
        parseFloat(window.getComputedStyle(flex).paddingRight) || 0;

      // Full distance to ensure the last project box plus right padding is completely in view
      const distance = lastBoxRight - containerRight + paddingRight;
      return Math.max(0, distance);
    }

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: () => `+=${calculateTranslateX() + 300}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        id: "work",
      },
    });

    timeline
      .to(".work-flex", {
        x: () => -calculateTranslateX(),
        ease: "none",
        duration: 1,
      })
      .to({}, { duration: 0.15 });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          <span>Gallery</span>
        </h2>
        <div className="work-flex">
          {[...Array(6)].map((_value, index) => (
            <div className="work-box" key={index}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>Project Name</h4>
                    <p>Category</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>Javascript, TypeScript, React, Threejs</p>
              </div>
              <WorkImage image="/images/placeholder.webp" alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;