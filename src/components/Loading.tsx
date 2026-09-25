import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import LoadingLines from "@/components/ui/loading-lines";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;

  if (percent >= 100 && !isLoaded) {
    setTimeout(() => {
      setIsLoaded(true);
    }, isMobile ? 350 : 700);
  }

  useEffect(() => {
    import("./utils/initialFX").then((module) => {
      if (isLoaded) {
        setClicked(true);
        setTimeout(() => {
          if (module.initialFX) {
            module.initialFX();
          }
          setIsLoading(false);
        }, isMobile ? 500 : 800);
      }
    });
  }, [isLoaded, isMobile]);

  return (
    <div
      className={`loading-screen-wrap ${clicked ? "loading-screen-exit" : ""}`}
      aria-label="Loading"
      aria-busy={percent < 100}
    >
      {/* Top Header Logo */}
      <header className="loading-screen-header">
        <a href="/#" className="loader-title" data-cursor="disable" aria-label="Howard Wilyman">
          <img src="/images/logo.png" alt="Howard Wilyman" className="loader-logo" />
        </a>
      </header>

      {/* Main Center Area with LoadingLines component */}
      <main className="loading-screen-center">
        <div className="loading-lines-container">
          <LoadingLines />
        </div>
      </main>

      {/* Ambient background glow */}
      <div className="loading-screen-ambient" aria-hidden="true" />
    </div>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 1024;
  let percent: number = 0;

  let interval = setInterval(() => {
    if (percent <= 50) {
      let rand = Math.round(Math.random() * (isMobile ? 8 : 5));
      percent = percent + rand;
      setLoading(percent);
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random() * (isMobile ? 3 : 1));
        setLoading(percent);
        if (percent > 91) {
          clearInterval(interval);
        }
      }, isMobile ? 300 : 2000);
    }
  }, isMobile ? 60 : 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }
  return { loaded, percent, clear };
};
