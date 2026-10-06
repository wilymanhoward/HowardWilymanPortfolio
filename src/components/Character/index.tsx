import { useEffect, useState } from "react";
import Scene from "./Scene";
import { isMobileLayout } from "../utils/layout";

const CharacterModel = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(
    () => !isMobileLayout()
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(!isMobileLayout());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Remount the scene when crossing the breakpoint so it picks up the
  // matching renderer settings (mobile: no head tracking, lower resolution).
  return <Scene key={isDesktop ? "desktop" : "mobile"} />;
};

export default CharacterModel;
