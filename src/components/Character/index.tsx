import { useEffect, useState } from "react";
import Scene from "./Scene";
import { useLoading } from "../../context/LoadingProvider";
import gsap from "gsap";
import { setCharTimeline, setAllTimeline } from "../utils/GsapScroll";

const MobileCharacter = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    // Initialize GSAP scroll triggers for mobile sections
    setCharTimeline(null, null as any);
    setAllTimeline();

    // Fast and smooth loading sequence for mobile
    const img = new Image();
    img.src = "/images/character_mobile.webp";

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      if (current >= 100) {
        current = 100;
        setLoading(100);
        clearInterval(interval);
      } else {
        setLoading(current);
      }
    }, 40);

    img.onload = () => {
      setLoading(100);
      clearInterval(interval);
    };

    return () => clearInterval(interval);
  }, [setLoading]);

  return (
    <div className="character-container">
      <div className="character-model">
        <img
          src="/images/character_mobile.webp"
          alt="Howard Wilyman"
          className="character-img-mobile"
          width="486"
          height="565"
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </div>
  );
};

const CharacterModel = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth > 1024;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isDesktop) {
    return <MobileCharacter />;
  }

  return <Scene />;
};

export default CharacterModel;
