import { useEffect, useRef } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Touch screens have no pointer to follow.
    if (!window.matchMedia("(hover: hover)").matches) return;

    let hover = false;
    const cursor = cursorRef.current!;
    const mousePos = { x: 0, y: 0 };
    const cursorPos = { x: 0, y: 0 };
    // quickTo reuses one tween instead of creating a new one every frame.
    const moveX = gsap.quickTo(cursor, "x", { duration: 0.1 });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.1 });

    let animId = 0;
    const loop = () => {
      animId = 0;
      if (hover) return;
      const delay = 6;
      cursorPos.x += (mousePos.x - cursorPos.x) / delay;
      cursorPos.y += (mousePos.y - cursorPos.y) / delay;
      moveX(cursorPos.x);
      moveY(cursorPos.y);
      // Keep easing until the cursor catches up, then sleep until the mouse moves.
      if (
        Math.abs(mousePos.x - cursorPos.x) > 0.1 ||
        Math.abs(mousePos.y - cursorPos.y) > 0.1
      ) {
        animId = requestAnimationFrame(loop);
      }
    };
    const wake = () => {
      if (!animId) animId = requestAnimationFrame(loop);
    };
    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      wake();
    };
    document.addEventListener("mousemove", onMouseMove);

    const cleanupFns: Array<() => void> = [];

    document.querySelectorAll("[data-cursor]").forEach((item) => {
      const element = item as HTMLElement;
      const onMouseEnter = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        if (element.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");

          gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.1 });
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          hover = true;
        }
        if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      };

      const onMouseLeave = () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hover = false;
        wake();
      };

      element.addEventListener("mouseenter", onMouseEnter as EventListener);
      element.addEventListener("mouseleave", onMouseLeave as EventListener);

      cleanupFns.push(() => {
        element.removeEventListener("mouseenter", onMouseEnter as EventListener);
        element.removeEventListener("mouseleave", onMouseLeave as EventListener);
      });
    });

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener("mousemove", onMouseMove);
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
