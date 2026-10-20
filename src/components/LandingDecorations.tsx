import { useEffect, useRef, useState } from "react";
import "./styles/LandingDecorations.css";

// Footage from the games, played one after another behind the character.
// Kept dim (see LandingDecorations.css) so it reads as atmosphere, not content.
const clips = [
  { src: "/projects/we-were-mummies/trailer.mp4", poster: "/projects/we-were-mummies/poster.webp" },
  { src: "/projects/aquastrike/gameplay.mp4", poster: "/projects/aquastrike/gameplay.webp" },
  { src: "/projects/sea-vagabond/trailer.mp4", poster: "/projects/sea-vagabond/poster.webp" },
];

const LandingDecorations = () => {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Pause while the landing is off screen, so it costs nothing further down.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion, index]);

  const clip = clips[index];
  return (
    <div className="landing-decorations" aria-hidden="true">
      <video
        ref={videoRef}
        className="landing-bg-video"
        key={clip.src}
        src={clip.src}
        poster={clip.poster}
        autoPlay={!reducedMotion}
        muted
        playsInline
        preload="metadata"
        onEnded={() => setIndex((i) => (i + 1) % clips.length)}
      />
      <div className="landing-bg-shade" />
    </div>
  );
};

export default LandingDecorations;
