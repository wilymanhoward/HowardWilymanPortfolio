import "./styles/Career.css";

const projects = [
  {
    title: "We Were Mummies",
    role: "Player & Multiplayer Lead · Unity, C#, Multiplayer Networking",
    date: "Jun 2026",
    description:
      "2-Player online co-op game, team of 3. Designed the asymmetric \"Blind & Deaf\" curse mechanic, built the multiplayer backbone (lobby, 2-player sync, in-game voice chat) and core player systems. Awarded \"Best Game\" by the course instructor and graded 4.0.",
  },
  {
    title: "AquaStrike",
    role: "Solo Developer · Unity, C#",
    date: "Jul 2026",
    description:
      "1v1 online multiplayer combat game set in a water-park arena, where two players battle with water guns and balloons. Built every system end-to-end: physics-based projectile combat, real-time multiplayer sync, UI, and game loop.",
  },
  {
    title: "CODU",
    role: "Fullstack Developer · Flutter, Firebase",
    date: "Jul 2026",
    description:
      "Duolingo-inspired Android app for learning Python, C++, JavaScript, and Java through gamified lessons. Designed the Flutter frontend, built the Firebase backend solo, and added a real-time PvP duel mode for live coding challenges.",
  },
  {
    title: "Mixed Reality Virtual Museum",
    role: "Development Assistant · Unity, XR Interaction Toolkit, AR Foundation",
    date: "Jul 2026 - Now",
    description:
      "Master's research project recreating a museum experience accessible from anywhere. Independently built 18 interactive 3D artifact exhibits with grab-and-inspect interactions, deployed and tested on Meta Quest 3.",
  },
];

const Career = () => {
  return (
    <div className="career-section section-container">
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
