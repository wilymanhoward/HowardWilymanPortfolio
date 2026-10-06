import { useEffect, useRef, useState } from "react";
import { getProject, projects } from "../data/projects";
import { navigate } from "../router";
import { smoother } from "./Navbar";
import "./styles/ProjectPage.css";

// Shows the poster with a play button and only loads YouTube's player
// (from the privacy-enhanced youtube-nocookie domain) when clicked.
const YouTubeEmbed = ({ id, title, poster }: { id: string; title: string; poster?: string }) => {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <div className="project-youtube">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <button
      type="button"
      className="project-youtube project-youtube-poster"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      data-cursor="disable"
    >
      <img
        src={poster ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <span className="project-youtube-play" aria-hidden="true" />
    </button>
  );
};

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
    if (project) document.title = `${project.title} | Howard Wilyman`;
    pageRef.current?.scrollTo({ top: 0 });
    backRef.current?.focus({ preventScroll: true });
    return () => {
      document.title = previousTitle;
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

          <section className="project-media" aria-label="Media">
            {project.media.length === 0 ? (
              <div className="project-media-empty">Photos and video coming soon</div>
            ) : (
              project.media.map((item) =>
                item.type === "youtube" ? (
                  <YouTubeEmbed
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    poster={item.poster}
                  />
                ) : item.type === "image" ? (
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
                    preload="metadata"
                  />
                )
              )
            )}
          </section>

          <section className="project-section">
            <h2>Overview</h2>
            <p>{project.overview}</p>
          </section>

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
