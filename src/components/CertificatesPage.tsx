import { useEffect, useRef, useState } from "react";
import { certificates, type Certificate } from "../data/certificates";
import { ImageDithering, TiltCard } from "./ui/admit-one-ticket";
import { CERTIFICATES_SEO } from "../seo";
import { smoother } from "./Navbar";
import "./styles/ProjectPage.css";

const last = certificates.length - 1;
const pad = (n: number) => String(n).padStart(2, "0");

// Same shell as ProjectPage: an overlay over the main site, or a page of its
// own when opened from a link.
const CertificatesPage = ({ standalone }: { standalone: boolean }) => {
  const backRef = useRef<HTMLButtonElement>(null);
  const viewerRef = useRef<HTMLDialogElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [viewing, setViewing] = useState<Certificate | null>(null);
  const [index, setIndex] = useState(0);
  const cert = certificates[index];

  const go = (delta: number) =>
    setIndex((i) => Math.min(last, Math.max(0, i + delta)));

  // One wheel gesture = one certificate. A trackpad swipe fires a stream of
  // events (with momentum), so only the first one after a pause counts.
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    let lastStep = 0;
    let lastWheel = 0;
    const onWheel = (e: WheelEvent) => {
      if (!page.contains(e.target as Node)) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (e.ctrlKey || viewerRef.current?.open || Math.abs(delta) < 2) return;
      e.preventDefault();
      const now = performance.now();
      const newGesture = now - lastWheel > 180 && now - lastStep > 650;
      lastWheel = now;
      if (!newGesture) return;
      lastStep = now;
      setIndex((i) => Math.min(last, Math.max(0, i + Math.sign(delta))));
    };
    // Window capture phase: when this page opens over the main site, the
    // paused ScrollSmoother swallows wheel events at the document level, so a
    // listener on the page itself would never hear them.
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
  }, []);

  const open = (c: Certificate) => {
    setViewing(c);
    viewerRef.current?.showModal();
  };

  const goBack = () => {
    if (standalone) {
      window.location.href = "/";
    } else {
      window.history.back();
    }
  };

  useEffect(() => {
    if (standalone) return;
    smoother?.paused(true);
    document.body.classList.add("project-open");
    return () => {
      smoother?.paused(false);
      document.body.classList.remove("project-open");
    };
  }, [standalone]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = CERTIFICATES_SEO.title;
    backRef.current?.focus({ preventScroll: true });
    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // The viewer handles its own keys (Escape closes it).
      if (viewerRef.current?.open) return;
      if (e.key === "Escape") goBack();
      else if (["ArrowRight", "ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        go(1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      className="project-page cert-page"
      ref={pageRef}
      role={standalone ? undefined : "dialog"}
      aria-modal={standalone ? undefined : true}
      aria-label="Certificates"
    >
      <header className="project-top">
        <button
          type="button"
          className="project-back"
          ref={backRef}
          onClick={goBack}
          data-cursor="disable"
        >
          Back to portfolio
        </button>
        <img src="/images/logo.png" alt="Howard Wilyman" className="project-logo" />
      </header>

      <main className="project-article cert-deck">
        <div className="cert-intro">
          <h1>Certificates</h1>
          <p className="project-lead">Awards and recognition I've received.</p>
        </div>

        {/* All certificates stacked in one spot: the current one is on the
            stage, later ones wait off to the right, earlier ones to the left,
            so CSS animates each change like a sheet of paper sliding in. */}
        <section
          className="cert-stage"
          aria-roledescription="carousel"
          aria-label="Certificates"
          onTouchStart={(e) => {
            touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }}
          onTouchEnd={(e) => {
            const start = touchStart.current;
            touchStart.current = null;
            if (!start) return;
            const dx = e.changedTouches[0].clientX - start.x;
            const dy = e.changedTouches[0].clientY - start.y;
            const d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
            // Swiping left (or up) brings the next certificate in from the right.
            if (Math.abs(d) > 40) go(d < 0 ? 1 : -1);
          }}
        >
          {certificates.map((c, i) => {
            const current = i === index;
            return (
              <div
                key={c.image}
                className={`cert-slide ${current ? "is-current" : i < index ? "is-past" : "is-next"}`}
                aria-hidden={!current}
              >
                {/* The certificate drawn through the ticket's dithering shader;
                    the sharp image fades in over it once it's on the stage. */}
                <TiltCard clipPath="inset(0 round 8px)">
                  <button
                    type="button"
                    className="cert-photo"
                    onClick={() => open(c)}
                    tabIndex={current ? 0 : -1}
                    data-cursor="disable"
                    aria-label={`View ${c.title} certificate full size`}
                  >
                    <ImageDithering
                      image={c.image}
                      originalColors
                      type="8x8"
                      size={2.5}
                      colorSteps={3}
                      fit="cover"
                      className="cert-dither"
                      aria-hidden="true"
                    />
                    <img src={c.image} alt={c.alt} decoding="async" />
                  </button>
                </TiltCard>
              </div>
            );
          })}
        </section>

        <div className="cert-caption" key={index} aria-live="polite">
          <p className="cert-count">
            {pad(index + 1)} / {pad(certificates.length)}
            {cert.date && <span> · {cert.date}</span>}
          </p>
          <h2>{cert.title}</h2>
          <p>
            {cert.kind} · {cert.issuer}
          </p>
        </div>

        <div className="cert-controls">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            data-cursor="disable"
            aria-label="Previous certificate"
          >
            ←
          </button>
          <div className="cert-dots">
            {certificates.map((c, i) => (
              <button
                type="button"
                key={c.image}
                className={i === index ? "is-current" : ""}
                onClick={() => setIndex(i)}
                data-cursor="disable"
                aria-label={`Show certificate ${i + 1}: ${c.title}`}
                aria-current={i === index}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index === last}
            data-cursor="disable"
            aria-label="Next certificate"
          >
            →
          </button>
        </div>
      </main>

      <dialog
        ref={viewerRef}
        className="cert-viewer"
        aria-label={viewing ? `${viewing.title} certificate` : "Certificate"}
        onClose={() => setViewing(null)}
        // A click on the dark backdrop (the dialog itself) closes it.
        onClick={(e) => e.target === e.currentTarget && viewerRef.current?.close()}
      >
        {viewing && (
          <>
            <img src={viewing.image} alt={viewing.alt} />
            <div className="cert-viewer-bar">
              <p>
                {viewing.title}
                {viewing.date && <span> · {viewing.date}</span>}
              </p>
              <button
                type="button"
                onClick={() => viewerRef.current?.close()}
                data-cursor="disable"
              >
                Close
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
};

export default CertificatesPage;
