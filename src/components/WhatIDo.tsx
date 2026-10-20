import { MdArrowForward } from "react-icons/md";
import "./styles/WhatIDo.css";
import { smoother } from "./Navbar";
import { isMobileLayout } from "./utils/layout";

// What I Do: the 3D character on the left edge, the real Howard on the right
// edge, and the two halves of the work between them, facing each other.
const columns = [
  {
    key: "develop",
    title: "Develop",
    text: "Responsive gameplay systems, core character mechanics and interactive web software, written as clean, modular C# for real-time engines and structured web apps.",
    tags: ["C#", "Unity", "Photon Engine", "React.js", "JavaScript", "HTML/CSS", "Git"],
    link: "#projects",
    linkLabel: "See my projects",
  },
  {
    key: "design",
    title: "Design",
    text: "Game mechanics meet 3D art: hard-surface modelling, rigging and keyframe animation, plus sound design that pulls the whole experience together.",
    tags: ["Autodesk Maya", "3D Modeling", "Rigging & Animation", "Adobe Audition", "UI/UX Design", "Audio Design"],
    link: "#work",
    linkLabel: "See the gallery",
  },
];

const WhatIDo = () => {
  // The smoother moves the page with transforms, so jumps go through it on
  // desktop; phones use the plain anchor.
  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (isMobileLayout() || !smoother) return;
    e.preventDefault();
    smoother.scrollTo(target, true, "top top");
  };

  return (
    <div className="whatIDO" id="whatido">
      <h2 className="visually-hidden">What I Do</h2>

      {/* A still render of the 3D character's head, mirroring the photo. */}
      <img
        className="what-head"
        src="/images/howard-3d-head.webp"
        alt="Howard's 3D character in profile"
        width="526"
        height="757"
        loading="lazy"
        decoding="async"
      />

      <img
        className="what-portrait"
        src="/images/howard-portrait.webp"
        alt="Howard Wilyman in profile"
        width="880"
        height="1100"
        loading="lazy"
        decoding="async"
      />

      <div className="what-cols">
        {columns.map((col) => (
          <div className={`what-col what-col-${col.key}`} key={col.key}>
            <h3 className="what-title">
              <span className="what-title-small">What I</span>
              <span className="what-title-big">{col.title}</span>
            </h3>
            <p className="what-text">{col.text}</p>
            <ul className="what-tags-list" aria-label={`${col.title} tools`}>
              {col.tags.map((tag) => (
                <li className="what-tag" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
            <a
              className="what-go"
              href={col.link}
              onClick={(e) => goTo(e, col.link)}
              aria-label={col.linkLabel}
              data-cursor="disable"
            >
              <MdArrowForward />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatIDo;
