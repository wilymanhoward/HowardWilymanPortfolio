import { useEffect, useRef } from "react";
import "./styles/Career.css";
import { setAllTimeline } from "./utils/GsapScroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { timelineProjects } from "../data/projects";
import { navigate } from "../router";

const Career = () => {
  // Set up the scroll animations right away instead of waiting for the 3D
  // model, which loads in the background on phones.
  useEffect(() => {
    setAllTimeline();
  }, []);

  const infoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const info = infoRef.current;
    const line = lineRef.current;
    if (!info || !line) return;
    const rows = Array.from(info.querySelectorAll<HTMLElement>(".career-info-box"));
    let active = -1;
    const update = () => {
      const rect = info.getBoundingClientRect();
      const midpoint = window.innerHeight / 2;
      const start = parseFloat(getComputedStyle(info).getPropertyValue("--timeline-start"));
      const length = Math.max(0, rect.height - start);
      const distance = Math.max(0, Math.min(length, midpoint - rect.top - start));
      line.style.transform = `scaleY(${length ? distance / length : 0})`;
      info.style.setProperty("--marker-y", `${start + distance}px`);
      moreRef.current?.classList.toggle("is-reached", distance >= length - 1);
      let nearest = 0;
      let nearestDistance = Infinity;
      rows.forEach((row, index) => {
        const bounds = row.getBoundingClientRect();
        const offset = Math.abs(bounds.top + bounds.height / 2 - midpoint);
        if (offset < nearestDistance) {
          nearest = index;
          nearestDistance = offset;
        }
      });
      if (active !== nearest) {
        rows.forEach((row, index) => row.classList.toggle("is-active", index === nearest));
        active = nearest;
      }
    };
    info.classList.add("spotlight-ready");
    const trigger = ScrollTrigger.create({
      trigger: info,
      start: "top bottom",
      end: "bottom top",
      onUpdate: update,
      onRefresh: update,
    });
    update();
    return () => {
      trigger.kill();
      info.classList.remove("spotlight-ready");
    };
  }, []);

  return (
    <div className="career-section section-container" id="projects">
      <div className="career-container">
        <h2>
          My <span>Projects</span>
        </h2>
        <div className="career-info" ref={infoRef}>
          <div className="career-timeline" ref={lineRef} aria-hidden="true" />
          <div className="career-dot" aria-hidden="true" />
          {timelineProjects.map((project) => (
            <div className="career-info-box" key={project.slug}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>
                    <a
                      className="career-project-link"
                      aria-label={project.title}
                      href={`/project/${project.slug}`}
                      data-cursor="disable"
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                        e.preventDefault();
                        navigate(`/project/${project.slug}`);
                      }}
                    >
                      <span className="career-title-roll" aria-hidden="true">
                        <span>{project.title}</span>
                        <span>{project.title}</span>
                      </span>
                    </a>
                  </h4>
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
        <p className="career-more" ref={moreRef}>and many more</p>
      </div>
    </div>
  );
};

export default Career;
