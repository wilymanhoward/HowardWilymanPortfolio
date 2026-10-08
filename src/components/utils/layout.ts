// Single source of truth for the mobile/desktop switch. Phones and tall
// portrait screens (e.g. tablets held upright) use the stacked mobile layout.
// Keep in sync with the media queries in the component stylesheets:
//   mobile:  (max-width: 768px), (max-aspect-ratio: 4/5)
//   desktop: (min-width: 769px) and (min-aspect-ratio: 801/1000)
export const DESKTOP_QUERY = "(min-width: 769px) and (min-aspect-ratio: 801/1000)";

// Phones (600px wide or less) get a pre-rendered picture of the character
// instead of the live 3D model. Wider windows, even in the stacked layout
// (tablets, narrow desktop windows), are big enough for the real model.
export const usesStaticCharacter = () =>
  isMobileLayout() && window.innerWidth <= 600;

export const isMobileLayout = () =>
  typeof window !== "undefined" && !window.matchMedia(DESKTOP_QUERY).matches;
