import { useEffect, useRef } from "react";
import "./styles/Career.css";
import { setAllTimeline } from "./utils/GsapScroll";
import { isMobileLayout } from "./utils/layout";
import { timelineProjects } from "../data/projects";

const Career = () => {
  // Set up the scroll animations right away instead of waiting for the 3D
  // model, which loads in the background on phones.
  useEffect(() => {
    setAllTimeline();
  }, []);

  // Mobile: grow the line straight from the scroll position so its glowing
  // tip stays locked to the middle of the screen. Measured live on every
  // scroll, so it stays correct when cards above open and close.
  const infoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const info = infoRef.current;
      const line = lineRef.current;
      if (!info || !line || !isMobileLayout()) return;
      const rect = info.getBoundingClientRect();
      // The line starts 50px above the list (top: -50px in Career.css).
      const lineTop = rect.top - 50;
      const fill = (window.innerHeight / 2 - lineTop) / rect.height;
      const clamped = Math.min(1, Math.max(0, fill));
      line.style.maxHeight = `${clamped * 100}%`;
      line.style.opacity = clamped > 0 ? "1" : "0";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="career-section section-container" id="projects">
      <div className="career-container">
        <h2>
          My <span>Projects</span>
        </h2>
        <div className="career-info" ref={infoRef}>
          <div className="career-timeline" ref={lineRef}>
            <div className="career-dot"></div>
          </div>
          {timelineProjects.map((project) => (
            <div className="career-info-box" key={project.slug}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{project.title}</h4>
                  <h5>{project.shortRole ?? project.role ?? project.type}</h5>
                  <div className="career-tags">
                    {(project.shortTags ?? project.tags).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <h3>{project.date}</h3>
              </div>
              <p>{project.summary}</p>
            </div>
          ))}
        </div>
        <p className="career-more">and many more</p>
      </div>
    </div>
  );
};

export default Career;
