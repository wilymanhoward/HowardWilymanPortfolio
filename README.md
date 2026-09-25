# Howard Wilyman — Personal Portfolio 🚀

<div align="center">

![Portfolio Banner](https://github.com/user-attachments/assets/3c4557e7-6392-4928-b8a9-7b2476ef4edd)

### **Interactive Technologist • Gameplay Programmer • Technical Designer • Software Developer**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://greensock.com/gsap/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[Live Demo](https://wilymanhoward.github.io/) • [Resume (PDF)](public/Howard_Wilyman_Resume.pdf) • [LinkedIn](https://www.linkedin.com/in/howard-wilyman-595833297/) • [Instagram](https://www.instagram.com/howardd_wilymann/) • [Email](mailto:wilymanhoward@gmail.com)

</div>

---

## 🌟 Overview

Welcome to the official repository for **Howard Wilyman's** personal portfolio. Designed to bridge the gap between creative visual computing and high-performance game programming, this website delivers an immersive, interactive 3D web experience powered by **React**, **Three.js / WebGL**, **GSAP**, and modern typography.

---

## ✨ Key Features

- 🎮 **Interactive 3D Avatar (Rex):**
  - Custom WebGL 3D character with interactive head-tracking and dynamic gaze following the cursor.
  - Realistic procedural eye blinking and breathing animations.
  - Configured three-point Three.js lighting and ambient rim illumination.

- 🌌 **Cosmic Aurora Backlight & Silhouettes:**
  - Layered radiant backlight gradient behind the character body.
  - Stylized game controller and Unity C# script card silhouettes with soft glassmorphic backdrops.

- 📜 **Cinematic GSAP Scroll Journey:**
  - Ultra-smooth momentum scrolling powered by GSAP `ScrollSmoother` and `ScrollTrigger`.
  - Dynamic kinetic typography with `SplitText` revealing skills and narrative milestones.

- ⚡ **Modern Typography & 21st.dev Components:**
  - High-impact, contemporary typography driven by **Clash Display** and **Geist**.
  - Spectral animated loading screen powered by **21st.dev** `LoadingLines` UI primitives.
  - Interactive magnetic cursor and floating hover effects.

- 📱 **Fully Responsive & Adaptive:**
  - Seamless experience calibrated for desktop workstations, tablets, and mobile devices.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Core** | React 18, TypeScript, Vite |
| **3D & WebGL** | Three.js, React Three Fiber, React Three Drei, WebGL Shaders |
| **Animation & Scroll** | GSAP, ScrollTrigger, ScrollSmoother, SplitText |
| **Styling & UI** | Tailwind CSS v4, Vanilla CSS, Clash Display, 21st.dev UI components |
| **Icons & Media** | React Icons (FontAwesome, Tabler Icons) |

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version `18.0.0` or higher recommended)
- `npm` or `yarn` / `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/wilymanhoward/Portfolio-Website-main.git
   cd Portfolio-Website-main
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to view the portfolio.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
├── public/
│   ├── images/              # Static icons, brand logo, and textures
│   └── models/              # 3D models and GLTF assets (Rex character rig)
├── src/
│   ├── components/
│   │   ├── Character/       # Three.js scene, camera controls, lighting & shaders
│   │   ├── styles/          # Modular component CSS stylesheets
│   │   ├── ui/              # Reusable UI primitives (21st.dev / shadcn standard)
│   │   │   └── loading-lines.tsx
│   │   ├── About.tsx        # Bio & personal introduction
│   │   ├── Career.tsx       # Timeline and experience milestones
│   │   ├── Contact.tsx      # Contact form & social connections
│   │   ├── Landing.tsx      # Hero section & interactive 3D stage
│   │   ├── LandingDecorations.tsx # Silhouettes & atmospheric aurora aura
│   │   ├── Loading.tsx      # Intro transition loader
│   │   ├── Navbar.tsx       # Top navigation header
│   │   ├── TechStack.tsx    # Technical skills breakdown
│   │   └── Work.tsx         # Featured gameplay and software projects
│   ├── context/             # Global React state providers (LoadingProvider)
│   ├── App.tsx              # Main application root
│   ├── main.tsx             # Application bootstrap
│   └── index.css            # Design tokens, Tailwind CSS & typography imports
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript compiler configuration
└── vite.config.ts           # Vite configuration & path alias (@/)
```

---

## 📬 Contact & Connect

Feel free to reach out for collaborations, gameplay engineering discussions, or general inquiries:

- **Portfolio:** [Howard Wilyman](https://wilymanhoward.github.io/)
- **Email:** [wilymanhoward@gmail.com](mailto:wilymanhoward@gmail.com)
- **LinkedIn:** [linkedin.com/in/howard-wilyman-595833297](https://www.linkedin.com/in/howard-wilyman-595833297/)
- **GitHub:** [@wilymanhoward](https://github.com/wilymanhoward)
- **Instagram:** [@howardd_wilymann](https://www.instagram.com/howardd_wilymann/)

---

## 📄 License & Credits

- This repository is licensed under the [Personal Portfolio License (PPL) v1.0](LICENSE).
- GSAP plugins are used under trial configuration for learning and evaluation. For production licenses, refer to [GreenSock GSAP](https://gsap.com/).
- UI elements and components inspired by the [21st.dev](https://21st.dev/) creative ecosystem.

---

<div align="center">
  <sub>Crafted with passion by <b>Howard Wilyman</b>. All rights reserved.</sub>
</div>
