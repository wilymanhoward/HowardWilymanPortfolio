import { lazy, Suspense, useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingProvider";
import { usesStaticCharacter } from "../utils/layout";

// The 3D scene (three.js, the model, lighting) is a separate chunk that only
// downloads on the desktop layout.
const Scene = lazy(() => import("./Scene"));

// Phones get the pre-rendered picture only: no 3D
// engine, no model download, nothing running on the graphics chip.
const StaticCharacter = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    const img = new Image();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setLoading(100);
    };
    img.onload = finish;
    img.onerror = finish;
    img.src = "/images/character_mobile.webp";
    const fallback = setTimeout(finish, 1500);
    return () => clearTimeout(fallback);
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
          decoding="async"
        />
      </div>
    </div>
  );
};

const CharacterModel = () => {
  const [mobile, setMobile] = useState<boolean>(() => usesStaticCharacter());

  useEffect(() => {
    const handleResize = () => setMobile(usesStaticCharacter());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (mobile) return <StaticCharacter />;
  return (
    <Suspense fallback={null}>
      <Scene />
    </Suspense>
  );
};

export default CharacterModel;
