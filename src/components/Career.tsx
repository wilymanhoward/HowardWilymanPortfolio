import "./styles/Career.css";

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
  return (
    <div className="career-section section-container" id="projects">
      <div className="career-container">
        <h2>
          My <span>Projects</span>
        </h2>
        <div className="career-info">
          <div className="career-timeline">
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
