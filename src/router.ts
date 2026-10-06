import { useEffect, useState } from "react";

// Minimal path routing for project pages (/project/<slug>), so the site
// doesn't need a router dependency.

export const getProjectSlug = (path = window.location.pathname) =>
  path.match(/^\/project\/([^/]+)\/?$/)?.[1] ?? null;

export const navigate = (to: string, options: { replace?: boolean } = {}) => {
  if (options.replace) {
    window.history.replaceState({}, "", to);
  } else {
    window.history.pushState({}, "", to);
  }
  window.dispatchEvent(new PopStateEvent("popstate"));
};

export const useProjectSlug = () => {
  const [slug, setSlug] = useState(getProjectSlug);
  useEffect(() => {
    const onChange = () => setSlug(getProjectSlug());
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);
  return slug;
};
