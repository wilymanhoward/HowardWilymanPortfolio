import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;
    if (!social) return;

    const cleanupFns: Array<() => void> = [];

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;
      if (!link) return;

      const initialCenter = 25; // 50px / 2
      let mouseX = initialCenter;
      let mouseY = initialCenter;
      let currentX = initialCenter;
      let currentY = initialCenter;
      let animId: number;

      link.style.setProperty("--siLeft", `${initialCenter}px`);
      link.style.setProperty("--siTop", `${initialCenter}px`);

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.15;
        currentY += (mouseY - currentY) * 0.15;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        animId = requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          mouseX = centerX + (x - centerX) * 0.35;
          mouseY = centerY + (y - centerY) * 0.35;
        } else {
          mouseX = rect.width > 0 ? rect.width / 2 : initialCenter;
          mouseY = rect.height > 0 ? rect.height / 2 : initialCenter;
        }
      };

      const onMouseLeave = () => {
        const rect = elem.getBoundingClientRect();
        mouseX = rect.width > 0 ? rect.width / 2 : initialCenter;
        mouseY = rect.height > 0 ? rect.height / 2 : initialCenter;
      };

      elem.addEventListener("mousemove", onMouseMove);
      elem.addEventListener("mouseleave", onMouseLeave);

      animId = requestAnimationFrame(updatePosition);

      cleanupFns.push(() => {
        cancelAnimationFrame(animId);
        elem.removeEventListener("mousemove", onMouseMove);
        elem.removeEventListener("mouseleave", onMouseLeave);
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://github.com/wilymanhoward" target="_blank">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href="https://www.linkedin.com/in/howard-wilyman-595833297/" target="_blank">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href="https://www.instagram.com/howardd_wilymann/" target="_blank">
            <FaInstagram />
          </a>
        </span>
      </div>
      <a className="resume-button" href="#">
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
