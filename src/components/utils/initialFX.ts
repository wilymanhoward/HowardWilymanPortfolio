import { SplitText } from "gsap-trial/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother.paused(false);
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0b080c",
    duration: 0.5,
    delay: 1,
  });

  var landingText = new SplitText(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  let TextProps = { type: "chars,lines", linesClass: "split-h2" };

  var landingText2 = new SplitText(".landing-h2-info", TextProps);
  var landingText4 = new SplitText(".landing-h2-1", TextProps);
  gsap.fromTo(
    [...landingText2.chars, ...landingText4.chars],
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  var landingText3 = new SplitText(".landing-h2-info-1", TextProps);
  var landingText5 = new SplitText(".landing-h2-2", TextProps);

  LoopText(landingText4, landingText2, landingText5, landingText3);
}

function LoopText(
  top1: SplitText,
  bot1: SplitText,
  top2: SplitText,
  bot2: SplitText
) {
  const tl = gsap.timeline({ repeat: -1 });
  const displayDuration = 3.0; // Rapidly changing every 3 seconds
  const animDuration = 0.5;   // Crisp, fast animation
  const stagger = 0.02;

  // Ensure phrase 2 starts hidden below
  gsap.set([...top2.chars, ...bot2.chars], {
    opacity: 0,
    y: 80,
    filter: "blur(4px)",
  });

  // Phase 1 (at 3.0s): "Game Designer" transitions OUT, "Software Developer" transitions IN
  tl.to(
    [...top1.chars, ...bot1.chars],
    {
      y: -80,
      opacity: 0,
      filter: "blur(4px)",
      duration: animDuration,
      ease: "power3.inOut",
      stagger: stagger,
    },
    displayDuration
  )
    .fromTo(
      [...top2.chars, ...bot2.chars],
      { y: 80, opacity: 0, filter: "blur(4px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: animDuration,
        ease: "power3.inOut",
        stagger: stagger,
      },
      displayDuration
    )
    // Phase 2 (at 6.5s): "Software Developer" transitions OUT, "Game Designer" transitions IN
    .to(
      [...top2.chars, ...bot2.chars],
      {
        y: -80,
        opacity: 0,
        filter: "blur(4px)",
        duration: animDuration,
        ease: "power3.inOut",
        stagger: stagger,
      },
      displayDuration * 2 + animDuration
    )
    .fromTo(
      [...top1.chars, ...bot1.chars],
      { y: 80, opacity: 0, filter: "blur(4px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: animDuration,
        ease: "power3.inOut",
        stagger: stagger,
      },
      displayDuration * 2 + animDuration
    );
}
