import { useEffect, useRef } from "react";
import "./styles/Career.css";
import { setAllTimeline } from "./utils/GsapScroll";
import { isMobileLayout } from "./utils/layout";

const projects = [
  {
    title: "We Were Mummies",
    role: "Multiplayer Lead",
    date: "Jun 2026",
    tags: ["Unity", "C#", "Networking"],
    description:
      "Co-op escape game where one player is blind and the other is deaf. Awarded “Best Game”.",
  },
  {
    title: "AquaStrike",
    role: "Solo Developer",
    date: "Jul 2026",
    tags: ["Unity", "C#"],
    description:
      "Online 1v1 water-gun battle in a water-park arena, built end-to-end.",
  },
  {
    title: "CODU",
    role: "Fullstack Developer",
    date: "Jul 2026",
    tags: ["Flutter", "Firebase"],
    description:
      "Duolingo-style Android app for learning to code, with live PvP duels.",
  },
  {
    title: "Mixed Reality Museum",
    role: "Development Assistant",
    date: "Jul 2026 – Now",
    tags: ["Unity", "XR Toolkit", "AR Foundation"],
    description:
      "18 interactive 3D exhibits for a Master’s MR research project, running on Meta Quest 3.",
  },
];

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
          {projects.map((project) => (
            <div className="career-info-box" key={project.title}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{project.title}</h4>
                  <h5>{project.role}</h5>
                  <div className="career-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <h3>{project.date}</h3>
              </div>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
