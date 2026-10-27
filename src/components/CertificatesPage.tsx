import { useEffect, useRef } from "react";
import { certificates } from "../data/certificates";
import { CERTIFICATES_SEO } from "../seo";
import { smoother } from "./Navbar";
import "./styles/ProjectPage.css";

// Same shell as ProjectPage: an overlay over the main site, or a page of its
// own when opened from a link.
const CertificatesPage = ({ standalone }: { standalone: boolean }) => {
  const backRef = useRef<HTMLButtonElement>(null);

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
      if (e.key === "Escape") goBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div
      className="project-page"
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

      <main className="project-article">
        <h1>Certificates</h1>
        <p className="project-lead">Awards and recognition I've received.</p>

        <section className="cert-list" aria-label="Certificates">
          {certificates.map((cert) => (
            <figure className="cert" key={cert.image}>
              <a
                href={cert.image}
                target="_blank"
                rel="noopener"
                data-cursor="disable"
                aria-label={`Open ${cert.title} certificate full size (opens in a new tab)`}
              >
                <img src={cert.image} alt={cert.alt} loading="lazy" decoding="async" />
              </a>
              <figcaption>
                <h2>{cert.title}</h2>
                <p>
                  {cert.kind} · {cert.issuer}
                </p>
                <p className="cert-date">{cert.date}</p>
              </figcaption>
            </figure>
          ))}
        </section>
      </main>
    </div>
  );
};

export default CertificatesPage;
