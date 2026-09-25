import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              HOWARD
              <br />
              <span>WILYMAN</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3 className="landing-info-h3">
              <span className="landing-prefix-1">A Creative</span>
              <span className="landing-prefix-2">An Interactive</span>
            </h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Gameplay</div>
              <div className="landing-h2-2">Technical</div>
              <div className="landing-h2-3">Software</div>
              <div className="landing-h2-4">Technologist</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Programmer</div>
              <div className="landing-h2-info-2">Designer</div>
              <div className="landing-h2-info-3">Developer</div>
              <div className="landing-h2-info-4"></div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
