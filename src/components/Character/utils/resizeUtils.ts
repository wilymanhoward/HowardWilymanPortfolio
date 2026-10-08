import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { isMobileLayout } from "../../utils/layout";

// The camera's vertical view is fixed, so on wide screens the character takes
// a fixed share of the width. As the window gets closer to square it would
// take a bigger and bigger share and run into the text and cards, so scale
// the character down to keep its share of the width the same as on a
// 16:10 screen (where the layout was designed).
const BASE_ZOOM = 1.1;
const REFERENCE_ASPECT = 1.6;

export function fitCameraZoom(camera: THREE.PerspectiveCamera) {
  // Slightly steeper than proportional so the character keeps clear of the
  // text on both sides, even in near-square windows.
  const scale = Math.min(1, Math.max(0.45, Math.pow(camera.aspect / REFERENCE_ASPECT, 1.4)));
  camera.zoom = BASE_ZOOM * scale;
  camera.updateProjectionMatrix();
  fitLegsMask(camera.zoom);
}

// On the landing screen the character should look like a bust at the desk:
// keyboard and hands, never the desk slab and legs. When the window is wide
// the frame already ends above the desk; in squarer windows the character is
// drawn smaller (see above) and the desk would come into view, so fade the
// model out just below the hands. The line follows the character's size:
// the desk's near edge sits at about 0.5 + 0.69 * zoom of the screen height.
// The glow behind the character is separate and stays untouched, and the
// mask is released on scroll (see setCharTimeline) so the seated character
// still shows in the later sections.
function fitLegsMask(zoom: number) {
  const canvas = document.querySelector<HTMLElement>(".character-model canvas");
  if (!canvas) return;
  if (isMobileLayout()) {
    canvas.style.removeProperty("--legs-top");
    canvas.style.removeProperty("--legs-fade");
    return;
  }
  // Start the fade a little above the desk edge so the desk surface goes too.
  const fadeStart = 0.5 + 0.69 * zoom - 0.025;
  canvas.style.setProperty("--legs-top", `${(fadeStart * 100).toFixed(1)}%`);
  canvas.style.setProperty("--legs-fade", "5%");
}

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;
  let canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width;
  const height = canvas3d.height;
  const isMobile = isMobileLayout();
  renderer.setPixelRatio(
    isMobile ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio
  );
  renderer.setSize(width, height);
  camera.aspect = width / height;
  fitCameraZoom(camera);
  const workTrigger = ScrollTrigger.getById("work");
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger != workTrigger) {
      trigger.kill();
    }
  });
  setCharTimeline(character, camera);
  setAllTimeline();
}
