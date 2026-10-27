import { useEffect, useState } from "react";

// Minimal path routing for project pages (/project/<slug>) and
// /certificates, so the site doesn't need a router dependency.

export const getProjectSlug = (path = window.location.pathname) =>
  path.match(/^\/project\/([^/]+)\/?$/)?.[1] ?? null;

export const isCertificatesPath = (path = window.location.pathname) =>
  /^\/certificates\/?$/.test(path);

export const navigate = (to: string, options: { replace?: boolean } = {}) => {
  if (options.replace) {
    window.history.replaceState({}, "", to);
  } else {
    window.history.pushState({}, "", to);
  }
  window.dispatchEvent(new PopStateEvent("popstate"));
};

export const usePathname = () => {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onChange = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);
  return path;
};
