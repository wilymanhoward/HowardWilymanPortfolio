import type * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isMobileLayout } from "./layout";

let intensity = 0;
let intensityTimer: ReturnType<typeof setInterval> | null = null;

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (!intensityTimer) {
    intensityTimer = setInterval(() => {
      intensity = Math.random();
    }, 200);
  }
  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  let screenLight: any, monitor: any;
  character?.traverse((object: any) => {
    if (object.name === "Plane004" || object.name === "Plane.004") {
      if (object.children && object.children.length > 0) {
        object.children.forEach((child: any) => {
          if (child.material) {
            child.material.transparent = true;
            child.material.opacity = 0;
            if (child.material.name === "Material.027") {
              monitor = child;
              child.material.color.set("#26282e");
              child.material.roughness = 0.5;
              child.material.metalness = 0.15;
              child.material.envMapIntensity = 0.4;
            }
          }
        });
      } else if (object.material) {
        object.material.transparent = true;
        object.material.opacity = 0;
        monitor = object;
        if (Array.isArray(object.material)) {
          object.material.forEach((m: any) => {
            if (m.name === "Material.027") {
              m.color.set("#26282e");
              m.roughness = 0.5;
              m.metalness = 0.15;
              m.envMapIntensity = 0.4;
            }
          });
        } else if (object.material.name === "Material.027") {
          object.material.color.set("#26282e");
          object.material.roughness = 0.5;
          object.material.metalness = 0.15;
          object.material.envMapIntensity = 0.4;
        }
      }
    }
    if (object.name === "screenlight" && object.material) {
      object.material.transparent = true;
      object.material.opacity = 0;
      object.material.emissive?.set("#4f8cff");
      gsap.killTweensOf(object.material);
      gsap.timeline({ repeat: -1, repeatRefresh: true }).to(object.material, {
        emissiveIntensity: () => intensity * 8,
        duration: () => Math.random() * 0.6,
        delay: () => Math.random() * 0.1,
      });
      screenLight = object;
    }
  });
  if (!isMobileLayout()) {
    if (character) {
      // Slide the character sideways by panning the camera's view inside a
      // canvas that always fills the screen. (Sliding the canvas itself left
      // its right edge slicing through the desk.) `view.x` is the shift as a
      // share of the screen width, to the left; `view.y` lifts him the same
      // way, as a share of the screen height.
      const view = { x: 0, y: 0 };
      const applyView = () => {
        const canvas = document.querySelector<HTMLElement>(".character-model canvas");
        const w = canvas?.clientWidth;
        const h = canvas?.clientHeight;
        if (!w || !h) return;
        camera.setViewOffset(w, h, view.x * w, view.y * h, w, h);
        // The glow behind the character and the face's hover area are separate
        // elements, so they follow the same shift.
        gsap.set(".character-rim, .character-hover", { x: -view.x * w });
      };

      // Hero to About: the camera pulls far back and up and looks down on
      // him at his desk from behind, small and centred above the big
      // "About Me". He turns his back to us, with the monitor on his right.
      tl1
        .fromTo(character.rotation, { y: 0 }, { y: Math.PI - 0.6, duration: 1 }, 0)
        .to(camera.position, { y: 42, z: 108, duration: 1 }, 0)
        .to(camera.rotation, { x: -0.3, duration: 1 }, 0)
        .fromTo(
          view,
          { x: 0, y: 0 },
          { x: 0, y: 0.04, duration: 1, onUpdate: applyView },
          0
        )
        .fromTo(
          ".character-model canvas",
          { "--legs-shift": 0 },
          { "--legs-shift": 1, duration: 0.3, ease: "none" },
          0
        )
        .to([".landing-container", ".landing-decorations"], { opacity: 0, duration: 0.4 }, 0)
        .to([".landing-container", ".landing-decorations"], { y: "40%", duration: 0.8 }, 0)
        .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0)
        // The face hover area (eyebrow raise) only belongs to the hero; off
        // as soon as he moves, so it never sits over the About button.
        .fromTo(
          ".character-hover",
          { pointerEvents: "auto" },
          { pointerEvents: "none", duration: 0.05 },
          0.05
        )
        // The text and button arrive as the camera settles on the About view.
        .fromTo(".about-side", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.5 }, 0.5);

      // About to What I Do: the camera stays where it is and the whole scene
      // (him, the chair, the desk and its lit monitor) slides out to the left.
      // What I Do then shows a still render of his head instead of the 3D one.
      tl2
        .to(".about-section", { y: "30%", duration: 6 }, 0)
        .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
        // Once faded out, About stops taking clicks meant for What I Do.
        .fromTo(
          ".about-section",
          { pointerEvents: "auto" },
          { pointerEvents: "none", delay: 4.9, duration: 0.1 },
          0
        )
        .to(view, { x: 1, delay: 2, duration: 4, ease: "power2.in", onUpdate: applyView }, 0);

      // The monitor rises onto the desk and switches on during the pull-back
      // to the About view, so it is already there in About and What I Do.
      if (monitor?.position) {
        tl1.fromTo(monitor.position, { y: -10, z: 2 }, { y: 0, z: 0, duration: 0.5 }, 0.3);
      }
      if (monitor?.material) {
        tl1.fromTo(monitor.material, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.45);
      }
      if (screenLight?.material) {
        tl1.fromTo(screenLight.material, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.7);
        // The screen floods the floor with flickering light in About, then
        // calms back down for What I Do.
        tl1.fromTo(screenLight.userData, { aboutGlow: 0 }, { aboutGlow: 1, duration: 0.3 }, 0.7);
      }

      tl2
        .fromTo(
          ".what-cols",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 1.5, delay: 5 },
          0
        )
        .fromTo(
          ".what-portrait",
          { opacity: 0, x: "12%" },
          { opacity: 1, x: "0%", duration: 2, delay: 4.5 },
          0
        )
        .fromTo(
          ".what-head",
          { opacity: 0, x: "-12%" },
          { opacity: 1, x: "0%", duration: 2, delay: 4.5 },
          0
        )
        .fromTo(
          ".character-rim",
          { opacity: 1, scaleX: 1.4 },
          { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
          0.3
        );

      tl3
        .fromTo(
          ".character-model",
          { y: "0%" },
          { y: "-100%", duration: 4, ease: "none", delay: 1 },
          0
        )
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);
    }
  }
}

let sectionTimelines: gsap.core.Timeline[] = [];

// Safe to call repeatedly (page mount, model load, resize): each call
// replaces the previous section timelines instead of stacking new ones.
export function setAllTimeline() {
  sectionTimelines.forEach((tl) => {
    tl.scrollTrigger?.kill();
    tl.kill();
  });
  sectionTimelines = [];

  // What I Do holds still once its bottom reaches the bottom of the screen,
  // and My Projects slides up over it like a card (pinSpacing: false lets
  // the next section scroll on top instead of pushing it away).
  const whatPin = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "bottom bottom",
      end: () => `+=${window.innerHeight}`,
      pin: true,
      pinSpacing: false,
      invalidateOnRefresh: true,
    },
  });
  whatPin.to({}, { duration: 1 });
  sectionTimelines.push(whatPin);

  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 60%",
      end: "bottom 70%",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  careerTimeline
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  sectionTimelines.push(careerTimeline);

  // On mobile the line is driven directly by the scroll position in
  // Career.tsx so its tip stays locked to the middle of the screen.
  if (!isMobileLayout()) {
    // The line is tied to the list itself, so it draws downward exactly
    // while the cards scroll through the screen.
    const lineTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".career-info",
        start: "top 65%",
        end: "bottom 65%",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    });
    lineTimeline
      .fromTo(
        ".career-timeline",
        { maxHeight: "0%" },
        { maxHeight: "100%", duration: 1, ease: "none" },
        0
      )
      .fromTo(
        ".career-timeline",
        { opacity: 0 },
        { opacity: 1, duration: 0.05, ease: "none" },
        0
      );
    sectionTimelines.push(lineTimeline);
  }

  // Re-measure every trigger (including the pinned Gallery) now that the
  // page has its final layout; otherwise pins measured during loading keep
  // a zero scroll length and overlap the sections after them.
  ScrollTrigger.refresh();
}
