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
  github?: string;
  website?: string;
  /** Set to false for Gallery-only work that isn't in "My Projects". */
  inTimeline?: boolean;
  tags: string[];
  /** Shorter role / tags for the compact "My Projects" timeline. */
  shortRole?: string;
  shortTags?: string[];
  /** One line used in the "My Projects" timeline. */
  summary: string;
  /** Overview on the detail page; separate paragraphs with a blank line. */
  overview: string;
  /** Optional "Key features" list on the detail page. */
  features?: string[];
  featuresTitle?: string;
  /** Optional "Credits" list (team members) on the detail page. */
  credits?: string[];
  /** Optional "Award" section, with an optional certificate image. */
  award?: {
    title: string;
    detail: string;
    image?: string;
    imageAlt?: string;
  };
  /** "What I did" bullet points on the detail page. */
  highlights: string[];
  cover?: string;
  media: ProjectMedia[];
}

export const projects: Project[] = [
  {
    slug: "mr-detective",
    title: "Co-located MR Detective",
    role: "Developer & Researcher",
    shortRole: "Developer",
    date: "2026",
    type: "Final Year Project, mixed reality game",
    team: "Solo",
    tags: ["Unity", "C#", "Meta Quest 3", "Netcode for GameObjects", "Meta XR SDK"],
    shortTags: ["Unity", "C#", "Quest 3", "Netcode"],
    summary:
      "My final year project: a two-player detective game in mixed reality, built to study how teams solve problems in the same room.",
    overview:
      "Co-located MR Detective is my Final Year Project. Two players wear Meta Quest 3 headsets in the same physical room and see the same virtual crime scene in the same real spot, with passthrough so they can still see each other and the room around them. They search for clues with their bare hands, tag evidence, and use an evidence board to name the culprit.\n\nThe game is also a research tool for an HCI user study. It compares solving a case alone with solving it as a team of two, using two different cases of equal difficulty: “The Missing Design Award”, set in a design studio, and “The Missing Keris”, set in a heritage gallery. The game records completion time, contamination errors (touching or stepping into evidence that should be left alone), reasoning errors, and the position of the head and hands at 10 Hz.\n\nBoth headsets stay lined up through Shared Spatial Anchors and Meta's colocation session, with game state synced over Netcode for GameObjects on the local network. Participants use hand tracking only, and the experimenter sets up and runs each session from an in-headset control panel.\n\nThe game is built and I'm now preparing the user study. Screenshots and a video are coming soon.",
    features: [
      "Two headsets, one shared scene: players see the crime scene in the same spot of the real room, using Shared Spatial Anchors and colocation.",
      "Hand-tracked interaction through the Meta Interaction SDK: grab clues, inspect them and tag them for the evidence board.",
      "Two matched detective cases, each with four suspects, seven clues (four key pieces of evidence and three red herrings) and three exclusion zones.",
      "An evidence board where players pick a suspect and the evidence behind their answer, shared live between both players in team runs.",
      "A briefing from an animated Inspector Hart character, with voice lines and procedural gestures, synchronised on both headsets.",
      "Depth-based occlusion so virtual props sit behind real hands and furniture.",
      "Study tooling: an in-headset setup panel, a 10 Hz CSV log, per-run summary files, and automatic upload of results to a laptop on the local network.",
    ],
    highlights: [
      "Designed and built the whole system solo, from the Unity project and networking to the study procedure and data logging.",
      "Implemented colocated multiplayer: a Netcode for GameObjects host and client, discovery through Meta's colocation session, and a shared spatial anchor that places the scene in the same physical spot on both headsets.",
      "Kept game state in one place (a single CaseState) and wrote the core logic as plain C# classes covered by EditMode tests, so the study measures are deterministic and testable.",
      "Built the measures for the study: completion time, contamination errors counted as zone entries with a cooldown, reasoning errors, and head and hand tracking logged relative to the scene.",
      "Modelled the props and characters in Maya with a Python script, using low-poly flat shading and a shared palette texture, about 15,000 triangles across both cases.",
      "Targeted a stable 72 fps on Quest 3 with a lightweight URP setup, and fixed headset-only problems such as floor height differences between two headsets and clues that froze in the partner's view.",
    ],
    media: [],
  },
  {
    slug: "we-were-mummies",
    github: "https://github.com/wilymanhoward/We-Were-Mummies",
    title: "We Were Mummies",
    role: "Player & Multiplayer Lead",
    shortRole: "Multiplayer Lead",
    date: "Jun 2026",
    type: "2-player online co-op game",
    team: "Team of 3",
    tags: ["Unity", "C#", "Photon PUN", "Multiplayer Networking"],
    shortTags: ["Unity", "C#", "Networking"],
    summary:
      "Co-op escape game where one player is blind and the other is deaf. Awarded “Best Game”.",
    overview:
      "We Were Mummies is a 2-player online co-op escape game set deep inside an ancient Egyptian tomb. Two mummies wake up under a curse, and each one is missing a sense: for one player, mummy bandages cover part of the screen; for the other, every sound comes through muffled and distorted.\n\nNeither player can get out alone. They have to keep talking, describing what they can see and hear, to find their way through dark corridors, solve puzzles where ancient symbols have to line up, and face the Guardians' wrath in a chamber of fire and lava on the way to the exit.\n\nThe game was built by a team of three for a course project and was named “Best Game” by the course instructor, ranking as the top project across two class cohorts.",
    features: [
      "Asymmetric co-op: the “Blind & Deaf” curse gives each player different information, so working together is the only way through.",
      "Online play for two: create or join a room from the main menu, with built-in voice chat.",
      "Tomb puzzles built around communication, from aligning ancient symbols to crossing a lava chamber.",
      "A torch players can pick up, carry and throw.",
      "Shipped with a gameplay trailer.",
    ],
    highlights: [
      "Designed the asymmetric “Blind & Deaf” curse mechanic: mummy bandages obscure part of the UI and muffled audio distorts sound, forcing the two players to communicate and rely on each other to escape.",
      "Built the full multiplayer backbone: main menu, room creation and joining, real-time 2-player sync, and in-game voice chat.",
      "Implemented the core player systems: movement (walk, run, jump), a torch hold-and-throw interaction system, and the aim reticle.",
      "Solved the project's biggest technical challenge: keeping real-time 2-player sync and voice chat running together within Photon PUN's limits. Compressing the voice chat audio kept it from affecting the gameplay connection.",
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
    github: "https://github.com/wilymanhoward/AquaStrike",
    title: "AquaStrike",
    role: "Solo Developer",
    date: "Jul 2026",
    type: "1v1 online multiplayer game",
    team: "Solo",
    tags: ["Unity", "C#"],
    summary:
      "Online 1v1 water-gun battle in a water-park arena, built end-to-end.",
    overview:
      "AquaStrike is a 1v1 online multiplayer shooter set in a giant inflatable water park. Two players meet in a shared lobby, pick a squad fighter, and battle across slides, tubes, ramps and floating platforms, soaking each other with water guns and water balloons.\n\nMatches are fast and easy to read: each player's health, the round score, a match timer and a minimap are always on screen, along with a water tank gauge for your current weapon. Between matches, players can chat with their squad and browse the water weapon store.\n\nI designed and built the whole game solo, from the arena and characters to the online networking.",
    features: [
      "1v1 online matches with real-time sync of movement, shots and hits.",
      "Physics-based water projectiles: streams from water guns and lobbed water balloons.",
      "Three squad fighters to choose from: Hook, Pyro and Enerzen.",
      "Lobby with rooms, squad chat, character select and a water weapon store.",
      "In-match HUD with both players' health, round score, match timer, minimap, coins and water tank.",
    ],
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
    github: "https://github.com/NelsenKeane/Codu",
    title: "CODU",
    role: "Fullstack Developer",
    date: "Jul 2026",
    type: "Android learning app",
    team: "Solo",
    tags: ["Flutter", "Firebase"],
    summary:
      "Duolingo-style Android app for learning to code, with live PvP duels.",
    overview:
      "CODU is a Duolingo-inspired Android app that teaches Python, C++, JavaScript and Java through short, game-like lessons. Each language has its own learning path of levels, and every lesson is a small coding puzzle: drag the right code blocks into place, run the code, and get instant feedback.\n\nThe twist is competition. Players can jump into real-time PvP duels, where they are matched with an opponent at a similar trophy level and race to solve the same coding challenges. The battle result shows who won, the total time and the accuracy, and wins earn trophies and badges.\n\nI built CODU solo: the Flutter app and the Firebase backend behind it.",
    features: [
      "Learning paths for Python, C++, JavaScript and Java, unlocked level by level.",
      "Drag-and-drop code puzzles with instant right or wrong feedback, stars and daily streaks.",
      "Real-time PvP coding duels with matchmaking, a live countdown and battle results.",
      "Friends: search and add friends, see friends nearby on a map, and challenge them to a duel.",
      "Global and friends leaderboards, trophies, and badges such as First Victory, C++ Master, Sharpshooter and Python Champ.",
      "Profiles with avatars, plus settings and an in-app help centre with FAQs.",
    ],
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
    github: "https://github.com/wilymanhoward/Museum-Exploration-MR",
    title: "Mixed Reality Museum",
    role: "Development Assistant",
    date: "Oct 2026",
    type: "Master’s research project",
    team: "Solo build",
    tags: ["Unity", "XR Interaction Toolkit", "AR Foundation"],
    shortTags: ["Unity", "XR Toolkit", "AR Foundation"],
    summary:
      "18 interactive 3D exhibits for a Master’s MR research project, running on Meta Quest 3.",
    overview:
      "The Mixed Reality Museum brings the collection of Muzium Terengganu, the Terengganu State Museum, into the visitor's own room. Running on Meta Quest 3 in passthrough mixed reality, it places floating museum panels and 3D artifacts around you, all controlled with your hands.\n\nVisitors enter their name, follow a short tutorial, then choose between exploring and playing. Exploring covers five areas: the Textile, Art and Craft galleries, Serambi Mandalika and Terengganu History. Every artifact has a photo and a 3D model you can grab and rotate, along with its period, origin, dimensions, materials and story, and finishing an artifact's story is celebrated with confetti.\n\nThe game side turns the collection into challenges. Teka Artifak asks players to name artifacts from their 3D models, and Langkah & Kisah has them put processes and stories in the right order against the clock, with a scoreboard for the best times. The whole experience is presented in Malay.\n\nI joined this Master's-level research project as a development assistant and built the interactive experience around the 3D models: all 18 artifact exhibits, both games, the menus and the tutorial.",
    features: [
      "Passthrough mixed reality on Meta Quest 3 with hand-tracked interaction.",
      "Five museum areas and 18 artifacts, including the Gamelan Terengganu, Wayang Kulit, Batu Bersurat Terengganu, Kain Songket and Keris.",
      "Grab-and-inspect 3D artifacts with a photo / 3D toggle and detailed artifact information.",
      "Teka Artifak: name the artifact from its 3D model.",
      "Langkah & Kisah: timed puzzles to order the steps of a process, such as batik making, or the events of a story.",
      "Scoreboards that keep the best times.",
    ],
    highlights: [
      "In charge of all 18 interactive artifact exhibits: the photo / 3D views, artifact information, story panels and interactions (the 3D models themselves were made by others).",
      "Built both games: Teka Artifak (name the artifact) and Langkah & Kisah (timed ordering puzzles), including their scoreboards.",
      "Built the menus and the onboarding tutorial, from entering your name to choosing between exploring and playing.",
      "Implemented the grab-and-inspect interactions with XR Interaction Toolkit and AR Foundation, and deployed and tested on Meta Quest 3.",
    ],
    cover: "/projects/mixed-reality-museum/cover.webp",
    media: [
      {
        type: "video",
        src: "/projects/mixed-reality-museum/trailer.mp4",
        poster: "/projects/mixed-reality-museum/trailer-poster.webp",
      },
    ],
  },
  {
    slug: "inner-thoughts",
    title: "Inner Thoughts",
    type: "3D animation",
    role: "Modelling, Animation, Lighting, Sound & Editing",
    date: "Jul 2026",
    team: "Team of 4",
    tags: ["Autodesk Maya"],
    inTimeline: false,
    summary: "A 3D animated short made in Autodesk Maya.",
    overview:
      "Inner Thoughts is a 3D animated short, about three and a half minutes long, made in Autodesk Maya by a team of four.\n\nIn a grand old mansion, a wealthy old man takes a phone call in his library and steps out. The young cleaner tidying up finds an envelope stuffed with his money, and her conscience splits in two: a little devil version of her pictures beach holidays and sparkling jewellery and insists no one will ever know, while an angel version warns her where that road ends.\n\nShe chooses honesty and puts the envelope back, and the owner returns looking for it. It's a simple story about doing the right thing when no one is watching, told through expressive character animation and a detailed mansion set.",
    featuresTitle: "Highlights",
    features: [
      "Four characters: the cleaner, her devil and angel “inner thoughts”, and the mansion's owner.",
      "A detailed mansion set with a book-lined library and period furniture.",
      "Imagined cutaway scenes, a beach holiday and a jail cell, to show what's at stake.",
      "Dialogue with on-screen subtitles.",
    ],
    credits: [
      "Ellen Louise",
      "Gunawan Nelsen Keane",
      "Tando Jocelyne Audrey",
      "Wilyman Howard",
    ],
    highlights: [
      "Modelled the mansion room where the story takes place.",
      "Animated the cleaner's key moment: picking up the envelope, opening it and her shocked reaction.",
      "Lit the scenes.",
      "Created the sound and edited the final film.",
    ],
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
    date: "Sep 2025",
    type: "Adventure game",
    role: "Level 1 Designer",
    team: "Team of 6",
    tags: ["Unity"],
    inTimeline: false,
    summary: "An award-winning adventure game built in Unity by a team of six.",
    overview:
      "Sea Vagabond is a third-person action-adventure game made in Unity by a team of six. It won Best Creative Third-Person Action-Adventure Game at Xiamen University Malaysia's Embedded Game Design and Development event (EGDAD-XMUM 2025).\n\nIt follows Ashford, who inherits his father's unfinished quest. On his deathbed, his father hands him the first relic stone and a map of uncharted waters and forbidden lands. Four relic stones, each guarded by the sea itself, are the key to a sealed cave that holds the Orylius Blade, the golden sword of the first pirate king.\n\nPlayers explore a sunny island town and its jungle, take on missions from the townsfolk, sail through a storm, and push into ruins and lava-lit caves, using abilities and combat to survive and answering relic riddles along the way.",
    features: [
      "A story-driven opening and subtitled dialogue with characters such as Eldon, Silas and Emma.",
      "An island town, jungle paths, a storm at sea, ruins and lava caves to explore.",
      "Mission tracking and a compass to guide the journey.",
      "Abilities and melee combat.",
      "Relic riddles that test what you learned on the journey.",
    ],
    highlights: [
      "Designed the level for Level 1.",
      "Designed all of the gameplay mechanics in Level 1.",
    ],
    credits: [
      "Aidyn Sartayeva",
      "Tando Jocelyne Audrey",
      "Wilyman Howard",
      "Ellen Louise",
      "Gunawan Nelsen Keane",
      "Cao Ziyu",
    ],
    award: {
      title: "Best Creative Third-Person Action-Adventure Game Developed Using Unity 3D",
      detail:
        "Embedded Game Design and Development, Xiamen University Malaysia (EGDAD-XMUM 2025), September 2025",
      image: "/projects/sea-vagabond/certificate.webp",
      imageAlt:
        "Certificate of Achievement from Xiamen University Malaysia's School of Computing and Data Science, awarding Sea Vagabond Best Creative Third-Person Action-Adventure Game Developed Using Unity 3D at EGDAD-XMUM 2025",
    },
    cover: "/projects/sea-vagabond/poster.webp",
    media: [
      {
        type: "video",
        src: "/projects/sea-vagabond/trailer.mp4",
        poster: "/projects/sea-vagabond/trailer-poster.webp",
      },
    ],
  },
  {
    slug: "lily-and-the-veggies",
    title: "Lily and the Veggies",
    type: "2D animation",
    role: "Animator & Audio Lead",
    date: "Jun 2025",
    team: "Team of 4",
    tags: ["Adobe Animate"],
    inTimeline: false,
    summary: "A 2D animated short made in Adobe Animate for an animation class.",
    overview:
      "Lily and the Veggies is a short 2D cartoon for children, about one minute twenty seconds long, made in Adobe Animate by a team of four for an animation class.\n\nLily is about to leave the vegetables on her breakfast plate when the Veggie Fairy appears in the kitchen. When Lily asks why she needs them, the fairy tells her to close her eyes, and a colourful sequence introduces each vegetable: the orange carrot, the green cabbage, the red tomato, the green broccoli, and the eggplant that's good for your brain.\n\nWhen Lily opens her eyes, she happily eats her veggies, and the short ends with a reminder for kids not to forget theirs.",
    featuresTitle: "Highlights",
    features: [
      "Bright, flat cartoon style with expressive close-ups of Lily.",
      "Character animation for Lily, the Veggie Fairy and five vegetable characters, each with its own colour-themed scene.",
      "Animated titles for each vegetable's name and colour.",
      "Subtitled narration aimed at young viewers.",
    ],
    highlights: [
      "Animated the short in Adobe Animate.",
      "Sole lead for audio and music across the whole film.",
    ],
    media: [
      {
        type: "video",
        src: "/projects/lily-and-the-veggies/lily-and-the-veggies.mp4",
        poster: "/projects/lily-and-the-veggies/poster.webp",
      },
    ],
  },
  {
    slug: "deskdeck",
    github: "https://github.com/wilymanhoward/DeskDeck",
    title: "DeskDeck",
    role: "Android Developer",
    date: "Oct 2026",
    type: "Android tablet music dashboard",
    tags: ["Kotlin", "Jetpack Compose", "Android", "Room"],
    inTimeline: false,
    summary:
      "A tablet music dashboard with synced lyrics, media controls, Standby and a morning brief.",
    overview:
      "DeskDeck turns an Android tablet into a music dashboard for a desk or bedside table. It brings album artwork, playback controls, lyrics and everyday information into a landscape interface, with colours drawn from the current album cover. The project is built in Kotlin with Jetpack Compose and Material 3, with a minimum Android version of 8.0.\n\nInstead of playing music itself, DeskDeck follows the media sessions published by other apps, such as Spotify, YouTube Music and Apple Music. A pinned sidebar lets users switch the player they are controlling, while the main screen offers playback, seeking and volume controls. Available commands depend on what each player exposes. Notification access is required to connect to those sessions and show notifications within the dashboard.\n\nLyrics come from LRCLIB and are cached locally for repeat listening. Users can tap a lyric line to seek, adjust the timing for a song and compensate for audio-output delay. Enhanced LRC lyrics retain their supplied word timestamps; other synced lyrics receive estimated word timings. The interface adapts from the full dashboard to a smaller split-screen layout and a compact mini-player as its window changes size.\n\nFor longer desk sessions, DeskDeck includes idle dimming, pixel shifting and an ambient display mode. Standby can show a dim clock, the next alarm and music controls while the app is on screen. A scheduled morning brief brings together weather, a configurable market watchlist and headlines. Optional Spotify library browsing requires its own setup and sign-in; market data also requires configuration.",
    features: [
      "Controls compatible Android media sessions: now playing, album artwork, seeking, volume and supported shuffle / repeat commands.",
      "Time-synced lyrics with line seeking, per-song timing adjustments, offline caching and optional romanization on Android 10 and later.",
      "Full, split-screen and compact mini-player layouts selected from the available window size.",
      "Pinned music sources, notification banners and an in-app notification panel.",
      "WhatsApp incoming-call and ongoing-call cards using the actions supplied by WhatsApp. Music that DeskDeck pauses for a call can be resumed afterwards.",
      "Standby with clock faces, scheduled hours, next-alarm information and music controls while DeskDeck is open.",
      "Morning Brief with weather, market watchlist and headlines, keeping cached data when an individual source fails.",
      "Pixel shifting, brightness limits, idle dimming and ambient display options, plus support for Android's reduced-animation setting.",
    ],
    highlights: [
      "Built a native tablet interface with Jetpack Compose and Material 3, using MVVM, StateFlow, coroutines and Hilt to connect the UI to application state.",
      "Integrated Android MediaSession and MediaController callbacks to follow active players, switch sources and keep playback controls in sync.",
      "Implemented cache-first lyrics retrieval from LRCLIB with Room storage, track matching, LRC parsing and word-timing estimation.",
      "Developed adaptive layouts and display-state rules for active use, idle dimming, ambient mode and Standby.",
      "Integrated weather, market and RSS data for the morning brief, with cached results and scheduled background refresh through WorkManager.",
      "Added optional Spotify authorization using PKCE and Android Keystore-backed token encryption, alongside notification and WhatsApp call integration.",
      "Wrote unit tests for logic including lyric parsing and matching, media-session selection, call transitions, adaptive sizing and display schedules.",
    ],
    cover: "/projects/deskdeck/icon.webp",
    media: [
      {
        type: "video",
        src: "/projects/deskdeck/trailer.mp4",
        poster: "/projects/deskdeck/trailer-poster.webp",
      },
      {
        type: "image",
        src: "/projects/deskdeck/lyrics.webp",
        alt: "DeskDeck dashboard: the sidebar with music sources, the now-playing card with album art and controls, and time-synced lyrics filling in word by word",
      },
      {
        type: "image",
        src: "/projects/deskdeck/sources.webp",
        alt: "DeskDeck switched to YouTube Music, with the background colours taken from the new album art",
      },
      {
        type: "image",
        src: "/projects/deskdeck/settings.webp",
        alt: "DeskDeck settings for screen and burn-in: keep screen on, pixel shift and dim when idle",
      },
    ],
  },
  {
    slug: "reelvault",
    title: "ReelVault",
    role: "Android Developer",
    date: "Oct 2026",
    type: "Android video bookmark organizer",
    website: "https://getreelvault.web.app/",
    inTimeline: false,
    tags: ["Kotlin", "Jetpack Compose", "Room", "Firebase"],
    summary: "An Android app for organizing saved video links, with collections, search and optional cloud sync.",
    overview: "ReelVault brings the short videos saved across TikTok, Instagram, YouTube, Facebook, X, Pinterest and Xiaohongshu into one library. Share a link to the app or paste it in to create a preview card with the available title, author and thumbnail. It organizes bookmarks rather than downloading videos: tapping a save opens the original app, or a browser when that app is unavailable.\n\nThe library is stored locally with Room, so saved information and organization remain available offline. Collections, tags, notes, favorites and pins help users return to useful videos. Search covers titles, captions, authors, notes, tags and links, with platform and collection filters. Short-link resolution, URL cleaning and duplicate detection keep repeat saves from cluttering the library. Fetching new previews and watching the original videos still require a connection.\n\nOptional Firebase authentication and Firestore sync let users carry their library between devices. Collections can be published as web links that others can browse without installing the app, with an option to import them into ReelVault. JSON export and import provide another way to back up or move the library.\n\nBuilt in Kotlin with Jetpack Compose and Material 3, the app uses MVVM, coroutines and Flow, Hilt, Room and WorkManager. The companion website introduces the app and hosts shared collection pages.",
    features: [
      "Quick-save through the Android share sheet, pasted links or a clipboard prompt.",
      "Platform-aware previews, cached thumbnails and fallback cards when metadata is unavailable.",
      "Custom collections, tags, notes, favorites, pins, sorting and bulk actions.",
      "Search and filters across the library, with on-device tagging from hashtags and keyword rules and optional ML Kit thumbnail labeling.",
      "Local-first storage, optional Firebase sync, and JSON export and import.",
      "Share collections as public web pages and import shared collections into the app.",
    ],
    highlights: [
      "Developed the native Android interface with Jetpack Compose, including the library, collections, search, item details and quick-save flow.",
      "Implemented link extraction, short-link resolution, URL normalization and duplicate detection before saving to Room.",
      "Built the preview retrieval and thumbnail caching workflow with background jobs and platform-specific fallbacks.",
      "Connected local storage to Firebase authentication and two-way Firestore sync, including soft deletes and duplicate reconciliation.",
      "Implemented collection sharing, the companion Firebase-hosted website, and JSON backup and restore.",
    ],
    cover: "/projects/reelvault/icon.svg",
    media: [
      {
        type: "video",
        src: "/projects/reelvault/trailer.mp4",
        poster: "/projects/reelvault/trailer-poster.webp",
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
