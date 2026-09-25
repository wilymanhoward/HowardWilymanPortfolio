import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

function createPupilTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, size, size);

  const center = size / 2;
  const irisRadius = size * 0.44;
  const pupilRadius = size * 0.27;

  // Iris: warm rich dark brown radial gradient
  const irisGrad = ctx.createRadialGradient(
    center,
    center,
    pupilRadius * 0.3,
    center,
    center,
    irisRadius
  );
  irisGrad.addColorStop(0, "#4a2812"); // warm chocolate brown
  irisGrad.addColorStop(0.65, "#30180a"); // deep rich brown
  irisGrad.addColorStop(0.92, "#180a03"); // crisp dark outer ring
  irisGrad.addColorStop(1, "rgba(20, 8, 3, 0.95)");

  ctx.beginPath();
  ctx.arc(center, center, irisRadius, 0, Math.PI * 2);
  ctx.fillStyle = irisGrad;
  ctx.fill();

  // Subtle radial depth lines on iris
  ctx.strokeStyle = "rgba(110, 55, 20, 0.3)";
  ctx.lineWidth = 1.5;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
    ctx.beginPath();
    ctx.moveTo(
      center + Math.cos(a) * (pupilRadius * 0.8),
      center + Math.sin(a) * (pupilRadius * 0.8)
    );
    ctx.lineTo(
      center + Math.cos(a) * (irisRadius * 0.95),
      center + Math.sin(a) * (irisRadius * 0.95)
    );
    ctx.stroke();
  }

  // Deep dark pupil
  const pupilGrad = ctx.createRadialGradient(
    center,
    center,
    0,
    center,
    center,
    pupilRadius
  );
  pupilGrad.addColorStop(0, "#080402");
  pupilGrad.addColorStop(1, "#140804");

  ctx.beginPath();
  ctx.arc(center, center, pupilRadius, 0, Math.PI * 2);
  ctx.fillStyle = pupilGrad;
  ctx.fill();

  // Primary highlight (glossy cartoon catchlight at top-left)
  const hlX = center - irisRadius * 0.32;
  const hlY = center - irisRadius * 0.32;
  const hlR = irisRadius * 0.22;
  const hlGrad = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, hlR);
  hlGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  hlGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.8)");
  hlGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.beginPath();
  ctx.arc(hlX, hlY, hlR, 0, Math.PI * 2);
  ctx.fillStyle = hlGrad;
  ctx.fill();

  // Secondary subtle highlight at bottom-right
  const hl2X = center + irisRadius * 0.26;
  const hl2Y = center + irisRadius * 0.26;
  const hl2R = irisRadius * 0.10;
  ctx.beginPath();
  ctx.arc(hl2X, hl2Y, hl2R, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function applyPupilTexture(
  eyeMesh: THREE.Mesh,
  pupilCenter: THREE.Vector3,
  pupilRadius: number,
  texture: THREE.CanvasTexture,
  id: string
) {
  const origMat = (
    Array.isArray(eyeMesh.material) ? eyeMesh.material[0] : eyeMesh.material
  ) as THREE.MeshStandardMaterial;
  const mat = origMat.clone();
  mat.customProgramCacheKey = () => id;

  const uniforms = {
    uPupilTex: { value: texture },
    uPupilCenter: { value: pupilCenter },
    uPupilRadius: { value: pupilRadius },
  };

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uPupilTex = uniforms.uPupilTex;
    shader.uniforms.uPupilCenter = uniforms.uPupilCenter;
    shader.uniforms.uPupilRadius = uniforms.uPupilRadius;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
       varying vec3 vEyeLocalPos;`
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
       vEyeLocalPos = position;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
       varying vec3 vEyeLocalPos;
       uniform sampler2D uPupilTex;
       uniform vec3 uPupilCenter;
       uniform float uPupilRadius;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
       vec2 eyeUV = (vEyeLocalPos.xy - uPupilCenter.xy) / (2.0 * uPupilRadius) + 0.5;
       if (eyeUV.x >= 0.0 && eyeUV.x <= 1.0 && eyeUV.y >= 0.0 && eyeUV.y <= 1.0 && vEyeLocalPos.z > (uPupilCenter.z - 0.20)) {
         vec4 texCol = texture2D(uPupilTex, eyeUV);
         diffuseColor.rgb = mix(diffuseColor.rgb, texCol.rgb, texCol.a);
       }`
    );
  };

  mat.needsUpdate = true;
  eyeMesh.material = mat;
}

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [character, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let characterModel: THREE.Object3D | null = null;
      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);

      loadCharacter().then((gltf) => {
        if (gltf) {
          const animations = setAnimations(gltf);
          hoverDivRef.current && animations.hover(gltf, hoverDivRef.current);
          mixer = animations.mixer;
          let character = gltf.scene;
          characterModel = character;
          headBone =
            character.getObjectByName("HeadBone") ||
            character.getObjectByName("rex_head") ||
            character;
          if (headBone) {
            headBone.position.z -= 0.2;
            headBone.position.y -= 0.15;
          }
          setChar(character);
          scene.add(character);
          (window as any).__THREE_CHARACTER__ = character;
          (window as any).__THREE_SCENE__ = scene;
          console.log("[DEBUG] Character loaded. Children of HeadBone:", 
            character.getObjectByName("HeadBone")?.children.map((c: any) => ({ name: c.name, type: c.type, isMesh: !!c.isMesh }))
          );
          const allMeshes: any[] = [];
          character.traverse((child: any) => {
            if (child.isMesh) {
              allMeshes.push({ name: child.name, mat: Array.isArray(child.material) ? child.material.map((m: any) => m.name) : child.material?.name });
            }
          });
          console.log("[DEBUG] All meshes in character:", allMeshes);

          // ── PUPIL SYSTEM: CANVAS TEXTURE ON EYEBALL MESHES ──────────────
          const pupilTexture = createPupilTexture();

          // Left eye:
          const eyeGroupL = character.getObjectByName("rex_eyeL");
          if (eyeGroupL) {
            eyeGroupL.traverse((child: any) => {
              if (child.isMesh) {
                if (child.name.includes("001_1") || child.material?.name === "rex.pupils") {
                  child.visible = false;
                } else {
                  applyPupilTexture(
                    child,
                    new THREE.Vector3(0.170, 1.335, 0.895),
                    0.125,
                    pupilTexture,
                    "pupil_L"
                  );
                }
              }
            });
          }

          // Right eye:
          const eyeGroupR = character.getObjectByName("rex_eyeR");
          if (eyeGroupR) {
            eyeGroupR.traverse((child: any) => {
              if (child.isMesh) {
                if (child.name.includes("001_1") || child.material?.name === "rex.pupils") {
                  child.visible = false;
                } else {
                  applyPupilTexture(
                    child,
                    new THREE.Vector3(-0.170, 1.335, 0.895),
                    0.125,
                    pupilTexture,
                    "pupil_R"
                  );
                }
              }
            });
          }

          // Hide redundant highlight dot meshes
          character.traverse((child: any) => {
            if (child.isMesh && (child.name.includes("eyedot") || child.name.includes("highlights"))) {
              child.visible = false;
            }
          });
          // ─────────────────────────────────────────────────────────────────

          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            setTimeout(() => {
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
          window.addEventListener("resize", () =>
            handleResize(renderer, camera, canvasDiv, character)
          );
        }
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          element?.addEventListener("touchmove", (e: TouchEvent) =>
            handleTouchMove(e, (x, y) => (mouse = { x, y }))
          );
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", (event) => {
        onMouseMove(event);
      });
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }

      const animate = () => {
        requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
        }
        if (characterModel) {
          light.setPointLight(screenLight);
        }

        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        clearTimeout(debounce);
        scene.clear();
        renderer.dispose();
        window.removeEventListener("resize", () =>
          handleResize(renderer, camera, canvasDiv, character!)
        );
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        if (landingDiv) {
          document.removeEventListener("mousemove", onMouseMove);
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
