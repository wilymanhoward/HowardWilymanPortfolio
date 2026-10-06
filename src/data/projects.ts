// Single source for the projects shown in "My Projects" and the Gallery,
// and for each project's detail page (/project/<slug>).
//
// To add photos or videos, put the files in /public/projects/<slug>/ and
// list them in `media`. The first item is used as the Gallery cover unless
// `cover` is set.
//   { type: "image", src: "/projects/aquastrike/arena.webp", alt: "..." }
//   { type: "video", src: "/projects/aquastrike/trailer.mp4", poster: "/projects/aquastrike/poster.webp" }

export type ProjectMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string };

export interface Project {
  slug: string;
  title: string;
  /** Optional details; anything left out is simply not shown. */
  role?: string;
  date?: string;
  type: string;
  team?: string;
  /** Set to false for Gallery-only work that isn't in "My Projects". */
  inTimeline?: boolean;
  tags: string[];
  /** Shorter role / tags for the compact "My Projects" timeline. */
  shortRole?: string;
  shortTags?: string[];
  /** One line used in the "My Projects" timeline. */
  summary: string;
  /** Opening paragraph on the detail page. */
  overview: string;
  /** "What I did" bullet points on the detail page. */
  highlights: string[];
  cover?: string;
  media: ProjectMedia[];
}

export const projects: Project[] = [
  {
    slug: "we-were-mummies",
    title: "We Were Mummies",
    role: "Player & Multiplayer Lead",
    shortRole: "Multiplayer Lead",
    date: "Jun 2026",
    type: "2-player online co-op game",
    team: "Team of 3",
    tags: ["Unity", "C#", "Multiplayer Networking"],
    shortTags: ["Unity", "C#", "Networking"],
    summary:
      "Co-op escape game where one player is blind and the other is deaf. Awarded “Best Game”.",
    overview:
      "A 2-player online co-op game where two mummies have to escape together. Each player is cursed differently, so neither can do it alone: they have to talk, guide and rely on each other the whole way out.",
    highlights: [
      "Designed the asymmetric “Blind & Deaf” curse mechanic: mummy bandages obscure part of the UI and muffled audio distorts sound, forcing the two players to communicate and rely on each other to escape.",
      "Built the full multiplayer backbone: main menu, room creation and joining, real-time 2-player sync, and in-game voice chat.",
      "Implemented the core player systems: movement (walk, run, jump), a torch hold-and-throw interaction system, and the aim reticle.",
      "Graded 4.0 and awarded a “Best Game” certificate by the course instructor, recognised as the top project across two class cohorts. Shipped with a gameplay trailer.",
    ],
    media: [
      {
        type: "video",
        src: "/projects/we-were-mummies/trailer.mp4",
        poster: "/projects/we-were-mummies/poster.webp",
      },
    ],
  },
  {
    slug: "aquastrike",
    title: "AquaStrike",
    role: "Solo Developer",
    date: "Jul 2026",
    type: "1v1 online multiplayer game",
    team: "Solo",
    tags: ["Unity", "C#"],
    summary:
      "Online 1v1 water-gun battle in a water-park arena, built end-to-end.",
    overview:
      "A 1v1 online multiplayer combat game where two players battle with water guns and balloons in a bright water-park arena. Designed and built solo.",
    highlights: [
      "Solo-designed and built the whole game, from the water-park arena to the water-gun and balloon combat.",
      "Built every system end-to-end: physics-based projectile combat, real-time multiplayer sync, UI, and the game loop.",
    ],
    media: [
      {
        type: "video",
        src: "/projects/aquastrike/gameplay.mp4",
        poster: "/projects/aquastrike/gameplay.webp",
      },
      {
        type: "image",
        src: "/projects/aquastrike/gameplay.webp",
        alt: "AquaStrike first-person gameplay: aiming a water gun across the water-park arena, with health bars, match timer and minimap",
      },
      {
        type: "image",
        src: "/projects/aquastrike/lobby.webp",
        alt: "AquaStrike lobby: the player character in the water-park arena with Shop, Character, Join Room and Play buttons",
      },
      {
        type: "image",
        src: "/projects/aquastrike/characters.webp",
        alt: "AquaStrike character select: choosing between the Hook, Pyro and Enerzen squad fighters",
      },
    ],
  },
  {
    slug: "codu",
    title: "CODU",
    role: "Fullstack Developer",
    date: "Jul 2026",
    type: "Android learning app",
    team: "Solo",
    tags: ["Flutter", "Firebase"],
    summary:
      "Duolingo-style Android app for learning to code, with live PvP duels.",
    overview:
      "A Duolingo-inspired Android app for learning Python, C++, JavaScript and Java through short, gamified lessons.",
    highlights: [
      "Owned the full stack solo: designed the Flutter frontend and built the Firebase backend (data, auth, real-time logic).",
      "Developed a real-time PvP “duel” mode where users compete head-to-head solving coding challenges live.",
    ],
    cover: "/projects/codu/lessons.webp",
    media: [
      {
        type: "video",
        src: "/projects/codu/trailer.mp4",
        poster: "/projects/codu/trailer-poster.webp",
      },
      {
        type: "image",
        src: "/projects/codu/lessons.webp",
        alt: "CODU app screens: home with subjects and history, a fill-in-the-code lesson with correct and incorrect answers, and the level complete screen",
      },
      {
        type: "image",
        src: "/projects/codu/duels.webp",
        alt: "CODU app screens: nearby friends map, a duel challenge invite, choosing a subject for the duel, and the global leaderboard",
      },
    ],
  },
  {
    slug: "mixed-reality-museum",
    title: "Mixed Reality Museum",
    role: "Development Assistant",
    date: "Jul 2026 – Now",
    type: "Master’s research project",
    team: "Solo build",
    tags: ["Unity", "XR Interaction Toolkit", "AR Foundation"],
    shortTags: ["Unity", "XR Toolkit", "AR Foundation"],
    summary:
      "18 interactive 3D exhibits for a Master’s MR research project, running on Meta Quest 3.",
    overview:
      "A mixed reality museum built for a Master’s-level research project, recreating a museum visit that can be experienced from anywhere.",
    highlights: [
      "Independently built 18 interactive 3D artifact exhibits.",
      "Implemented grab-and-inspect interactions using XR Interaction Toolkit and AR Foundation.",
      "Deployed and tested on Meta Quest 3.",
    ],
    media: [],
  },
  {
    slug: "inner-thoughts",
    title: "Inner Thoughts",
    type: "3D animation",
    tags: ["Autodesk Maya"],
    inTimeline: false,
    summary: "A 3D animated short made in Autodesk Maya.",
    overview: "A 3D animated short made in Autodesk Maya.",
    highlights: [],
    media: [
      {
        type: "video",
        src: "/projects/inner-thoughts/inner-thoughts.mp4",
        poster: "/projects/inner-thoughts/poster.webp",
      },
    ],
  },
  {
    slug: "sea-vagabond",
    title: "Sea Vagabond",
    date: "Dec 2025",
    type: "Adventure game",
    team: "Team of 6",
    tags: ["Unity"],
    inTimeline: false,
    summary: "An adventure game built in Unity by a team of six.",
    overview: "An adventure game built in Unity by a team of six.",
    highlights: [],
    cover: "/projects/sea-vagabond/poster.webp",
    media: [
      {
        type: "video",
        src: "/projects/sea-vagabond/trailer.mp4",
        poster: "/projects/sea-vagabond/trailer-poster.webp",
      },
    ],
  },
];

export const timelineProjects = projects.filter(
  (project) => project.inTimeline !== false
);

export const getProject = (slug: string | null) =>
  projects.find((project) => project.slug === slug) ?? null;

export const projectCover = (project: Project) => {
  if (project.cover) return project.cover;
  const first = project.media[0];
  if (!first) return null;
  return first.type === "image" ? first.src : first.poster ?? null;
};
