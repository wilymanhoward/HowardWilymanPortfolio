import { useEffect, useRef } from "react";
import { FaGithub, FaGlobe } from "react-icons/fa";
import { getProject, projects } from "../data/projects";
import { navigate } from "../router";
import { smoother } from "./Navbar";
import "./styles/ProjectPage.css";

interface Props {
  slug: string;
  /** Opened directly from a link (no main page underneath). */
  standalone: boolean;
}

const ProjectPage = ({ slug, standalone }: Props) => {
  const pageRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const project = getProject(slug);
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  // Only show the details this project actually has.
  const meta: [string, string][] = [];
  if (project?.role) meta.push(["Role", project.role]);
  if (project?.date) meta.push(["Date", project.date]);
  if (project?.team) meta.push(["Team", project.team]);

  const goBack = () => {
    if (standalone) {
      window.location.href = "/";
    } else {
      window.history.back();
    }
  };

  // While the page is open over the main site, freeze the main page's
  // scrolling and 3D rendering so only this page does any work.
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
    // Per-project description and canonical URL for search results.
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const previousDescription = description?.content;
    const previousCanonical = canonical?.href;
    if (project) {
      document.title = `${project.title} | Howard Wilyman`;
      if (description) description.content = `${project.title}: ${project.summary}`;
      if (canonical) canonical.href = `https://howardw.web.app/project/${project.slug}`;
    }
    pageRef.current?.scrollTo({ top: 0 });
    backRef.current?.focus({ preventScroll: true });
    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.content = previousDescription;
      if (canonical && previousCanonical) canonical.href = previousCanonical;
    };
  }, [project]);

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
      ref={pageRef}
      role={standalone ? undefined : "dialog"}
      aria-modal={standalone ? undefined : true}
      aria-label={project ? project.title : "Project not found"}
    >
      <header className="project-top">
        <button
          type="button"
          className="project-back"
          ref={backRef}
          onClick={goBack}
          data-cursor="disable"
        >
          Back to gallery
        </button>
        <img src="/images/logo.png" alt="Howard Wilyman" className="project-logo" />
      </header>

      {!project ? (
        <main className="project-article">
          <h1>Project not found</h1>
          <p className="project-lead">
            This project link doesn't exist. Head back to the gallery to see all
            projects.
          </p>
        </main>
      ) : (
        <main className="project-article">
          <p className="project-count">
            {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </p>
          <h1>{project.title}</h1>
          <p className="project-lead">{project.type}</p>

          {meta.length > 0 && (
            <dl className="project-meta">
              {meta.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="project-tags">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          {(project.website || project.github) && (
            <a
              className="project-back project-github"
              href={project.website ?? project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={project.website
                ? `Open ${project.title} website (opens in a new tab)`
                : `View ${project.title} on GitHub (opens in a new tab)`}
              data-cursor="disable"
            >
              {project.website ? (
                <>Open website <FaGlobe aria-hidden="true" /></>
              ) : (
                <>View on <FaGithub aria-hidden="true" /> GitHub</>
              )}
            </a>
          )}

          <section className="project-media" aria-label="Media">
            {project.media.length === 0 ? (
              <div className="project-media-empty">Photos and video coming soon</div>
            ) : (
              project.media.map((item) =>
                item.type === "image" ? (
                  <img
                    key={item.src}
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <video
                    key={item.src}
                    src={item.src}
                    poster={item.poster}
                    controls
                    playsInline
                    preload="none"
                  />
                )
              )
            )}
          </section>

          <section className="project-section">
            <h2>Overview</h2>
            <div className="project-paragraphs">
              {project.overview.split(/\n\s*\n/).map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </section>

          {project.features && project.features.length > 0 && (
            <section className="project-section">
              <h2>{project.featuresTitle ?? "Key features"}</h2>
              <ul>
                {project.features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {project.highlights.length > 0 && (
            <section className="project-section">
              <h2>What I did</h2>
              <ul>
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {project.award && (
            <section className="project-section">
              <h2>Award</h2>
              <div className="project-award">
                <p className="project-award-title">{project.award.title}</p>
                <p>{project.award.detail}</p>
                {project.award.image && (
                  <a
                    href={project.award.image}
                    target="_blank"
                    rel="noopener"
                    className="project-award-cert"
                    data-cursor="disable"
                  >
                    <img
                      src={project.award.image}
                      alt={project.award.imageAlt ?? `${project.award.title} certificate`}
                      loading="lazy"
                      decoding="async"
                    />
                    <span>View certificate</span>
                  </a>
                )}
              </div>
            </section>
          )}

          {project.credits && project.credits.length > 0 && (
            <section className="project-section">
              <h2>Credits</h2>
              <ul className="project-credits">
                {project.credits.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </section>
          )}

          {next && next.slug !== project.slug && (
            <a
              className="project-next"
              href={`/project/${next.slug}`}
              data-cursor="disable"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                // Replace, so "Back to gallery" still returns to the gallery.
                navigate(`/project/${next.slug}`, { replace: true });
              }}
            >
              <span>Next project</span>
              <strong>{next.title}</strong>
            </a>
          )}
        </main>
      )}
    </div>
  );
};

export default ProjectPage;
