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

  const introText = new SplitText(
    [".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  const prefCreative = new SplitText(".landing-prefix-1", {
    type: "chars,lines",
    linesClass: "split-line",
  });
  const prefInteractive = new SplitText(".landing-prefix-2", {
    type: "chars,lines",
    linesClass: "split-line",
  });

  gsap.fromTo(
    [...introText.chars, ...prefCreative.chars],
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

  const TextProps = { type: "chars,lines", linesClass: "split-h2" };

  // Phrase 1: Gameplay Programmer
  const top1 = new SplitText(".landing-h2-1", TextProps);
  const bot1 = new SplitText(".landing-h2-info", TextProps);

  gsap.fromTo(
    [...top1.chars, ...bot1.chars],
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

  // Phrase 2: Technical Designer
  const top2 = new SplitText(".landing-h2-2", TextProps);
  const bot2 = new SplitText(".landing-h2-info-2", TextProps);

  // Phrase 3: Software Developer
  const top3 = new SplitText(".landing-h2-3", TextProps);
  const bot3 = new SplitText(".landing-h2-info-3", TextProps);

  // Phrase 4: Technologist
  const top4 = new SplitText(".landing-h2-4", TextProps);
  const bot4 = new SplitText(".landing-h2-info-4", TextProps);

  LoopText(
    prefCreative,
    prefInteractive,
    top1,
    bot1,
    top2,
    bot2,
    top3,
    bot3,
    top4,
    bot4
  );
}

function LoopText(
  pref1: SplitText,
  pref2: SplitText,
  top1: SplitText,
  bot1: SplitText,
  top2: SplitText,
  bot2: SplitText,
  top3: SplitText,
  bot3: SplitText,
  top4: SplitText,
  bot4: SplitText
) {
  const tl = gsap.timeline({ repeat: -1 });
  const displayDuration = 3.0; // Rapidly changing every 3 seconds
  const animDuration = 0.5;   // Crisp, fast animation
  const stagger = 0.02;

  // Ensure phrases 2, 3, 4 and prefix 2 start hidden
  gsap.set(
    [
      ...pref2.chars,
      ...top2.chars,
      ...bot2.chars,
      ...top3.chars,
      ...bot3.chars,
      ...top4.chars,
      ...bot4.chars,
    ],
    {
      opacity: 0,
      y: 80,
      filter: "blur(4px)",
    }
  );

  const t1 = displayDuration;
  const t2 = t1 + animDuration + displayDuration;
  const t3 = t2 + animDuration + displayDuration;
  const t4 = t3 + animDuration + displayDuration;

  // Phase 1 (at 3.0s): Phrase 1 (Gameplay Programmer) -> Phrase 2 (Technical Designer)
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
    t1
  ).fromTo(
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
    t1
  );

  // Phase 2 (at 6.5s): Phrase 2 (Technical Designer) -> Phrase 3 (An Interactive / Software Developer)
  tl.to(
    [...top2.chars, ...bot2.chars],
    {
      y: -80,
      opacity: 0,
      filter: "blur(4px)",
      duration: animDuration,
      ease: "power3.inOut",
      stagger: stagger,
    },
    t2
  )
    .to(
      pref1.chars,
      {
        y: -40,
        opacity: 0,
        filter: "blur(4px)",
        duration: animDuration,
        ease: "power3.inOut",
        stagger: stagger,
      },
      t2
    )
    .fromTo(
      pref2.chars,
      { y: 40, opacity: 0, filter: "blur(4px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: animDuration,
        ease: "power3.inOut",
        stagger: stagger,
      },
      t2
    )
    .fromTo(
      [...top3.chars, ...bot3.chars],
      { y: 80, opacity: 0, filter: "blur(4px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: animDuration,
        ease: "power3.inOut",
        stagger: stagger,
      },
      t2
    );

  // Phase 3 (at 10.0s): Phrase 3 (Software Developer) -> Phrase 4 (A Creative / Technologist)
  tl.to(
    [...top3.chars, ...bot3.chars],
    {
      y: -80,
      opacity: 0,
      filter: "blur(4px)",
      duration: animDuration,
      ease: "power3.inOut",
      stagger: stagger,
    },
    t3
  )
    .to(
      pref2.chars,
      {
        y: -40,
        opacity: 0,
        filter: "blur(4px)",
        duration: animDuration,
        ease: "power3.inOut",
        stagger: stagger,
      },
      t3
    )
    .fromTo(
      pref1.chars,
      { y: 40, opacity: 0, filter: "blur(4px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: animDuration,
        ease: "power3.inOut",
        stagger: stagger,
      },
      t3
    )
    .fromTo(
      top4.chars,
      { y: 80, opacity: 0, filter: "blur(4px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: animDuration,
        ease: "power3.inOut",
        stagger: stagger,
      },
      t3
    );

  // Phase 4 (at 13.5s): Phrase 4 (Technologist) -> Phrase 1 (A Creative / Gameplay Programmer)
  tl.to(
    top4.chars,
    {
      y: -80,
      opacity: 0,
      filter: "blur(4px)",
      duration: animDuration,
      ease: "power3.inOut",
      stagger: stagger,
    },
    t4
  ).fromTo(
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
    t4
  );
}
