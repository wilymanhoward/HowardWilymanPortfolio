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

function applySmileMorph(mesh: THREE.Mesh) {
  const pos = mesh.geometry.attributes.position;
  const count = pos.count;
  const morphPos = new Float32Array(count * 3);

  // In Three.js, non-relative morph target positions are absolute (base + delta).
  // Non-deformed vertices MUST keep their base position (x, y, z) so they do NOT collapse to (0,0,0)!
  mesh.geometry.morphTargetsRelative = false;

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    let deltaX = 0;
    let deltaY = 0;
    let deltaZ = 0;

    const dY = Math.abs(y - (-0.26));
    const dZ = Math.abs(z - 0.50);

    // Mouth region envelope: covers lips, cheeks, chin, and inner mouth
    if (dY < 0.28 && dZ < 0.28 && Math.abs(x) < 0.65 && z > 0.30) {
      const dist = Math.hypot(dY / 0.25, dZ / 0.25);
      if (dist < 1.0) {
        const falloff = 1.0 - dist;
        const cornerFactor = Math.min(1.0, Math.pow(Math.abs(x) / 0.35, 1.3));

        // Mouth corners lift into a cheerful smile
        const cornerLift = falloff * cornerFactor * 0.090;

        // Open mouth: upper lip raises slightly, lower lip drops down cleanly
        let openY = 0.0;
        if (y >= -0.26) {
          openY = falloff * (1.0 - cornerFactor) * 0.025;
        } else {
          openY = -falloff * (1.0 - cornerFactor) * 0.065;
        }

        deltaY = cornerLift + openY;
        deltaX = (x > 0 ? 1 : -1) * falloff * cornerFactor * 0.025;
        deltaZ = falloff * cornerFactor * 0.015;
      }
    }

    // Absolute position for Three.js morph target: base + delta
    morphPos[i * 3] = x + deltaX;
    morphPos[i * 3 + 1] = y + deltaY;
    morphPos[i * 3 + 2] = z + deltaZ;
  }

  mesh.geometry.morphAttributes.position = [
    new THREE.BufferAttribute(morphPos, 3),
  ];
  mesh.updateMorphTargets();

  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((m) => {
        m.needsUpdate = true;
      });
    } else {
      mesh.material.needsUpdate = true;
    }
  }
}

function applyPupilTexture(
  eyeMesh: THREE.Mesh,
  pupilCenterUniform: { value: THREE.Vector3 },
  pupilRadius: number,
  texture: THREE.CanvasTexture,
  blinkUniform: { value: number },
  smileUniform: { value: number },
  id: string
) {
  const origMat = (
    Array.isArray(eyeMesh.material) ? eyeMesh.material[0] : eyeMesh.material
  ) as THREE.MeshStandardMaterial;
  const mat = origMat.clone();
  mat.customProgramCacheKey = () => id;

  const uniforms = {
    uPupilTex: { value: texture },
    uPupilCenter: pupilCenterUniform,
    uPupilRadius: { value: pupilRadius },
    uBlink: blinkUniform,
    uSmile: smileUniform,
  };

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uPupilTex = uniforms.uPupilTex;
    shader.uniforms.uPupilCenter = uniforms.uPupilCenter;
    shader.uniforms.uPupilRadius = uniforms.uPupilRadius;
    shader.uniforms.uBlink = uniforms.uBlink;
    shader.uniforms.uSmile = uniforms.uSmile;

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
       uniform float uPupilRadius;
       uniform float uBlink;
       uniform float uSmile;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
       vec2 eyeUV = (vEyeLocalPos.xy - uPupilCenter.xy) / (2.0 * uPupilRadius) + 0.5;
       if (eyeUV.x >= 0.0 && eyeUV.x <= 1.0 && eyeUV.y >= 0.0 && eyeUV.y <= 1.0 && vEyeLocalPos.z > (uPupilCenter.z - 0.20)) {
         vec4 texCol = texture2D(uPupilTex, eyeUV);
         diffuseColor.rgb = mix(diffuseColor.rgb, texCol.rgb, texCol.a);
       }
       if (uBlink > 0.001) {
         float dx = (vEyeLocalPos.x - uPupilCenter.x) / 0.12;
         float closeY = 1.22 - dx * dx * 0.012;
         float upperLid = mix(1.55, closeY, uBlink);
         float lowerLid = mix(1.05, closeY, uBlink);
         float inUpperLid = smoothstep(upperLid - 0.006, upperLid + 0.006, vEyeLocalPos.y);
         float inLowerLid = smoothstep(lowerLid + 0.006, lowerLid - 0.006, vEyeLocalPos.y);
         float lidCover = clamp(inUpperLid + inLowerLid, 0.0, 1.0);
         if (lidCover > 0.001) {
           vec3 skinColor = vec3(0.58, 0.33, 0.20);
           float dCrease = abs(vEyeLocalPos.y - closeY);
           float crease = smoothstep(0.012, 0.002, dCrease) * smoothstep(0.7, 1.0, uBlink);
           vec3 lidColor = mix(skinColor, vec3(0.35, 0.18, 0.10), crease * 0.65);
           diffuseColor.rgb = mix(diffuseColor.rgb, lidColor, lidCover);
         }
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

      // Base pupil positions on the eye sphere surfaces and dynamic uniforms
      // Lowered Y to 1.25 so pupils are centered vertically in the eye opening
      const basePupilL = new THREE.Vector3(0.165, 1.25, 0.885);
      const basePupilR = new THREE.Vector3(-0.165, 1.25, 0.885);
      const pupilUniformL = { value: basePupilL.clone() };
      const pupilUniformR = { value: basePupilR.clone() };
      const blinkUniform = { value: 0.0 };
      const smileUniform = { value: 0.0 };
      const currentPupilOffset = { x: 0, y: 0 };

      // Smiling state (triggered when cursor points at social links tray)
      const smileMeshes: THREE.Mesh[] = [];
      let eyebrowsMesh: THREE.Mesh | null = null;
      let baseEyebrowY = 0;
      let isSmiling = false;
      let currentSmile = 0;

      // Natural eye blinking timer state
      let nextBlinkTime = performance.now() + 2500 + Math.random() * 2000;
      let blinkStartTime = 0;
      let isBlinking = false;
      let isDoubleBlink = false;

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

          // ── SETUP SMILE MORPH TARGETS ON MOUTH & HEAD MESHES ────────────
          const headGroup = character.getObjectByName("rex_head");
          if (headGroup) {
            if ((headGroup as any).isMesh) {
              applySmileMorph(headGroup as THREE.Mesh);
              smileMeshes.push(headGroup as THREE.Mesh);
            }
            headGroup.children.forEach((child: any) => {
              if (child.isMesh) {
                applySmileMorph(child);
                smileMeshes.push(child);
              }
            });
          }
          eyebrowsMesh = character.getObjectByName("rex_eyebrows") as THREE.Mesh | null;
          if (eyebrowsMesh) {
            baseEyebrowY = eyebrowsMesh.position.y;
          }
          // ─────────────────────────────────────────────────────────────────

          // ── CUSTOMIZE CHARACTER COLORS ──────────────────────────────────
          // Black hair and eyebrows, rich dark navy blue shirt/sweater vest
          character.traverse((child: any) => {
            if (!child.isMesh) return;
            const name = (child.name || "").toLowerCase();
            const matName = (child.material?.name || "").toLowerCase();

            // Black hair:
            if (name.includes("hair") || matName.includes("hair")) {
              if (child.material) {
                child.material = child.material.clone();
                child.material.color.set("#141416");
                child.material.roughness = 0.55;
              }
            }

            // Black eyebrows:
            if (name.includes("eyebrow") || matName.includes("eyebrow")) {
              if (child.material) {
                child.material = child.material.clone();
                child.material.color.set("#141416");
                child.material.roughness = 0.65;
              }
            }

            // Dark blue shirt and sweater vest:
            if (
              name.includes("shirt") ||
              name.includes("sweater") ||
              name.includes("vest") ||
              matName.includes("shirt") ||
              matName.includes("sweater") ||
              matName.includes("vest")
            ) {
              if (child.material && !name.includes("button")) {
                child.material = child.material.clone();
                child.material.color.set("#131f37");
                child.material.roughness = 0.65;
              }
            }
          });
          // ─────────────────────────────────────────────────────────────────

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
                    pupilUniformL,
                    0.125,
                    pupilTexture,
                    blinkUniform,
                    smileUniform,
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
                    pupilUniformR,
                    0.125,
                    pupilTexture,
                    blinkUniform,
                    smileUniform,
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
        const target = event.target as HTMLElement | null;
        if (target?.closest("#social, .social-icons, .icons-section a, .icons-section span, a[href*='github'], a[href*='linkedin'], a[href*='instagram'], .contact-social")) {
          isSmiling = true;
        }
      });

      // ── Social Icons Hover Detection (Triggers Smiling) ────────────────
      const onSocialEnter = () => {
        isSmiling = true;
      };
      const onSocialLeave = () => {
        isSmiling = false;
      };

      const socialContainer = document.getElementById("social") || document.querySelector(".social-icons");
      if (socialContainer) {
        socialContainer.addEventListener("mouseenter", onSocialEnter);
        socialContainer.addEventListener("mouseleave", onSocialLeave);
      }

      // Delegate hover check for any dynamic icon links in tray
      const onGlobalMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest("#social, .social-icons, .icons-section a, .icons-section span, a[href*='github'], a[href*='linkedin'], a[href*='instagram'], .contact-social")) {
          isSmiling = true;
        }
      };
      const onGlobalMouseOut = (e: MouseEvent) => {
        const next = e.relatedTarget as HTMLElement | null;
        if (!next || !next.closest("#social, .social-icons, .icons-section a, .icons-section span, a[href*='github'], a[href*='linkedin'], a[href*='instagram'], .contact-social")) {
          isSmiling = false;
        }
      };
      document.addEventListener("mouseover", onGlobalMouseOver);
      document.addEventListener("mouseout", onGlobalMouseOut);
      // ───────────────────────────────────────────────────────────────────

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

        // ── Smooth smile animation when hovering over social tray ────────
        const targetSmile = isSmiling ? 1.0 : 0.0;
        currentSmile = THREE.MathUtils.lerp(currentSmile, targetSmile, 0.08);

        smileMeshes.forEach((mesh) => {
          if (mesh.morphTargetInfluences) {
            mesh.morphTargetInfluences[0] = currentSmile;
          }
        });
        if (eyebrowsMesh) {
          eyebrowsMesh.position.y = baseEyebrowY + currentSmile * 0.042;
        }
        smileUniform.value = currentSmile;
        // ─────────────────────────────────────────────────────────────────

        // ── Follow cursor with pupils ─────────────────────────────────────
        const isScrolled = window.scrollY >= 200;
        const targetPupilX = isScrolled ? 0 : mouse.x * 0.035;
        const targetPupilY = isScrolled ? 0 : mouse.y * 0.045;

        currentPupilOffset.x = THREE.MathUtils.lerp(
          currentPupilOffset.x,
          targetPupilX,
          0.1
        );
        currentPupilOffset.y = THREE.MathUtils.lerp(
          currentPupilOffset.y,
          targetPupilY,
          0.1
        );

        pupilUniformL.value.set(
          basePupilL.x + currentPupilOffset.x,
          basePupilL.y + currentPupilOffset.y,
          basePupilL.z
        );
        pupilUniformR.value.set(
          basePupilR.x + currentPupilOffset.x,
          basePupilR.y + currentPupilOffset.y,
          basePupilR.z
        );
        // ─────────────────────────────────────────────────────────────────

        // ── Periodic natural eye blinking ─────────────────────────────────
        const now = performance.now();
        if (!isBlinking && now >= nextBlinkTime) {
          isBlinking = true;
          blinkStartTime = now;
          isDoubleBlink = Math.random() < 0.22; // ~22% chance of natural double-blink
        }

        let blinkProgress = 0;
        if (isBlinking) {
          const blinkDuration = 180; // 180ms snappy blink
          const elapsed = now - blinkStartTime;

          if (isDoubleBlink) {
            const totalDuration = blinkDuration * 2 + 70;
            if (elapsed < blinkDuration) {
              const phase = elapsed / blinkDuration;
              blinkProgress = Math.sin(phase * Math.PI);
            } else if (elapsed < blinkDuration + 70) {
              blinkProgress = 0;
            } else if (elapsed < totalDuration) {
              const phase = (elapsed - (blinkDuration + 70)) / blinkDuration;
              blinkProgress = Math.sin(phase * Math.PI);
            } else {
              isBlinking = false;
              blinkProgress = 0;
              nextBlinkTime = now + 2500 + Math.random() * 3500;
            }
          } else {
            if (elapsed < blinkDuration) {
              const phase = elapsed / blinkDuration;
              blinkProgress = Math.sin(phase * Math.PI);
            } else {
              isBlinking = false;
              blinkProgress = 0;
              nextBlinkTime = now + 2500 + Math.random() * 3500;
            }
          }
        }
        blinkUniform.value = blinkProgress;
        // ─────────────────────────────────────────────────────────────────

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
