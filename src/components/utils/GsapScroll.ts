import * as THREE from "three";
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
  let neckBone =
    character?.getObjectByName("HeadBone") ||
    character?.getObjectByName("spine005") ||
    character?.getObjectByName("FK-Neck") ||
    character?.getObjectByName("FK-Head") ||
    null;
  if (!isMobileLayout()) {
    if (character) {
      tl1
        .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
        .to(camera.position, { z: 22 }, 0)
        .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
        .to([".landing-container", ".landing-decorations"], { opacity: 0, duration: 0.4 }, 0)
        .to([".landing-container", ".landing-decorations"], { y: "40%", duration: 0.8 }, 0)
        .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

      tl2
        .to(
          camera.position,
          { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" },
          0
        )
        .to(".about-section", { y: "30%", duration: 6 }, 0)
        .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
        .fromTo(
          ".character-model",
          { pointerEvents: "inherit" },
          { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 },
          0
        )
        .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0);

      if (neckBone) {
        tl2.to(neckBone.rotation, { x: 0, y: 0, delay: 2, duration: 3 }, 0);
      }
      if (monitor?.material) {
        tl2.to(monitor.material, { opacity: 1, duration: 0.8, delay: 3.2 }, 0);
      }
      if (screenLight?.material) {
        tl2.to(screenLight.material, { opacity: 1, duration: 0.8, delay: 4.5 }, 0);
      }
      if (monitor?.position) {
        tl2.fromTo(
          monitor.position,
          { y: -10, z: 2 },
          { y: 0, z: 0, delay: 1.5, duration: 3 },
          0
        );
      }

      tl2
        .fromTo(
          ".what-box-in",
          { display: "none" },
          { display: "flex", duration: 0.1, delay: 6 },
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
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);
    }
  } else {
    const tM2 = gsap.timeline({
      scrollTrigger: {
        trigger: ".what-box-in",
        start: "top 70%",
        end: "bottom top",
      },
    });
    tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);
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
  sectionTimelines.push(careerTimeline, lineTimeline);

  // Re-measure every trigger (including the pinned Gallery) now that the
  // page has its final layout; otherwise pins measured during loading keep
  // a zero scroll length and overlap the sections after them.
  ScrollTrigger.refresh();
}
