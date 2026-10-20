import { MdArrowForward } from "react-icons/md";
import "./styles/About.css";
import { smoother } from "./Navbar";
import { isMobileLayout } from "./utils/layout";

// The camera pulls far back and high above the character (see setCharTimeline
// in GsapScroll.ts), so he sits small in a dark room while the name of the
// section fills the bottom of the screen.
const About = () => {
  // The smoother moves the page with transforms, so the jump goes through it
  // on desktop; phones use the plain anchor.
  const goToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobileLayout() || !smoother) return;
    e.preventDefault();
    smoother.scrollTo("#projects", true, "top top");
  };

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h2 className="about-title title">
          About Me<span className="about-mark">*</span>
        </h2>
        <div className="about-side">
          <p className="about-text">
            I’m a Digital Media Technology student focused on gameplay
            programming, game design, and interactive software development.
            Combining core mechanics implementation in Unity with 3D workflows
            in Maya and modern web tech, I love building engaging, responsive
            systems from the code up.
          </p>
          <a
            className="about-cta"
            href="#projects"
            onClick={goToProjects}
            data-cursor="disable"
          >
            See my projects
            <span className="about-cta-icon" aria-hidden="true">
              <MdArrowForward />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
