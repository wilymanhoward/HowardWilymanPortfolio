import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TbNotes } from "react-icons/tb";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";
import { isMobileLayout } from "./utils/layout";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    const onLinkClick = (e: Event) => {
      if (!isMobileLayout()) {
        e.preventDefault();
        const elem = e.currentTarget as HTMLAnchorElement;
        const section = elem.getAttribute("data-href");
        smoother.scrollTo(section, true, "top top");
      }
    };
    const links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => elem.addEventListener("click", onLinkClick));
    const onResize = () => ScrollSmoother.refresh(true);
    window.addEventListener("resize", onResize);

    return () => {
      links.forEach((elem) => elem.removeEventListener("click", onLinkClick));
      window.removeEventListener("resize", onResize);
      smoother.kill();
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable" aria-label="Howard Wilyman">
          <img
            src="/images/logo.png"
            alt="Howard Wilyman"
            className="navbar-logo"
          />
        </a>
        <a
          href="mailto:wilymanhoward@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          wilymanhoward@gmail.com
        </a>
        {/* Phones only: the floating resume button would cover content there. */}
        <a
          href="/Howard_Wilyman_Resume.pdf"
          className="navbar-resume"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Howard Wilyman Resume (PDF)"
        >
          RESUME <TbNotes />
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#projects" href="#projects">
              <HoverLinks text="PROJECTS" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="GALLERY" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
