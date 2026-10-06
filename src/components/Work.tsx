import "./styles/Work.css";
import { projects, projectCover } from "../data/projects";
import { navigate } from "../router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { DESKTOP_QUERY } from "./utils/layout";

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

    // Desktop pins the section and scrolls the row sideways. On phones the
    // row is a native swipe list instead (see Work.css), which is lighter.
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_QUERY, () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top top",
          end: () => `+=${calculateTranslateX() + 300}`,
          scrub: 1,
          pin: true,
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
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          <span>Gallery</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => {
            const cover = projectCover(project);
            const href = `/project/${project.slug}`;
            return (
              <a
                className="work-box"
                key={project.slug}
                href={href}
                data-cursor="disable"
                onClick={(e) => {
                  // Let ctrl/cmd-click open a new tab as usual.
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  navigate(href);
                }}
              >
                <div className="work-info">
                  <div className="work-title">
                    <h3>{String(index + 1).padStart(2, "0")}</h3>

                    <div>
                      <h4>{project.title}</h4>
                      <p>{project.type}</p>
                    </div>
                  </div>
                  <h4>Tools and features</h4>
                  <p>{project.tags.join(", ")}</p>
                  <span className="work-view">View project</span>
                </div>
                <div className="work-image">
                  <div className="work-image-in">
                    {cover ? (
                      <img src={cover} alt={project.title} loading="lazy" decoding="async" />
                    ) : (
                      <div className="work-placeholder">Photos coming soon</div>
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Work;