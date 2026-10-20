import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  const directionalLight = new THREE.DirectionalLight(0x82b4ff, 0);
  directionalLight.intensity = 0;
  directionalLight.position.set(-0.47, -0.32, -1);
  // Shadows are on for the screen light only (addScreenLight); these two
  // never cast any before, so they stay that way.
  directionalLight.castShadow = false;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x4f8cff, 0, 100, 3);
  pointLight.position.set(3, 12, 4);
  pointLight.castShadow = false;
  scene.add(pointLight);

  // The monitor's light in the About view: a spotlight at the screen, aimed
  // past the character onto the floor, so the floor gets a pool of light
  // with his shadow in it. It flickers with the screen, and its strength is
  // screenLight.userData.aboutGlow (0 to 1), which the scroll timeline raises
  // for About and lowers again for What I Do.
  const screenSpot = new THREE.SpotLight(0xc4d9ff, 0, 60, 0.8, 0.9, 2);
  screenSpot.castShadow = true;
  screenSpot.shadow.mapSize.set(1024, 1024);
  screenSpot.shadow.bias = -0.0005;
  screenSpot.shadow.radius = 4;
  screenSpot.visible = false;

  // The model's own "ground" is only a small soft-shadow decal, so the light
  // gets a floor of its own. It only ever adds light: black (unlit) parts
  // add nothing and leave the page showing through, so there is no visible
  // floor edge, just the pool of light and his shadow in it.
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    // Lambert, not Standard: the scene's environment map lights every
    // Standard material evenly, which would show the whole floor.
    new THREE.MeshLambertMaterial({
      color: 0x8a8a8a,
      transparent: true,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendSrcAlpha: THREE.ZeroFactor,
      blendDstAlpha: THREE.OneFactor,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.visible = false;

  // The monitor's own screen surface (the "Material.028" plane inside the
  // bezel) is kept invisible by the scroll timeline. In About it is shown
  // as a glowing white screen. Unlit (Basic), so it stays bright whatever
  // the lights do.
  let screenFront: THREE.Mesh | null = null;

  function addScreenLight(character: THREE.Object3D) {
    // Model-space points: just in front of the screen, and the floor
    // behind the chair.
    screenSpot.position.set(-0.05, 9.6, 4.6);
    screenSpot.target.position.set(0, 2.75, -5);
    floor.position.set(0, 2.76, 0);
    character.add(screenSpot, screenSpot.target, floor);
    character.traverse((child: any) => {
      if (child.isMesh && child.material?.name === "Material.028") screenFront = child;
    });
    if (screenFront) {
      screenFront.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        toneMapped: false,
      });
      screenFront.visible = false;
    }
    // Only he (and his chair) cast the silhouette; the desk, monitor and
    // keyboard sit between the screen and the floor and would block it.
    const blockers = /^(Plane|Plane002|Plane003|Keyboard|KEYS|screenlight|ground)/;
    character.traverse((child: any) => {
      if (child.isMesh && child !== floor && !blockers.test(child.name)) {
        child.castShadow = true;
      }
    });
  }

  new RGBELoader()
    .setPath("/models/")
    .setDataType(THREE.FloatType)
    .load("char_enviorment.hdr", function (texture) {
      // The HDR is strongly magenta, which tinted the skin and every edge
      // pink. Keep its brightness but drop the colour.
      const data = texture.image.data as unknown as Float32Array;
      for (let i = 0; i < data.length; i += 4) {
        const grey = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = grey;
      }
      texture.needsUpdate = true;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

  function setPointLight(screenLight: any) {
    if (screenLight.material.opacity > 0.9) {
      pointLight.intensity = screenLight.material.emissiveIntensity * 20;
    } else {
      pointLight.intensity = 0;
    }
    // A steady base plus the screen's flicker (emissiveIntensity runs 0-8).
    const glow = screenLight.userData.aboutGlow ?? 0;
    screenSpot.visible = floor.visible = glow > 0.01;
    const flicker = screenLight.material.emissiveIntensity / 8;
    screenSpot.intensity = glow * SCREEN_SPOT_STRENGTH * (0.45 + flicker);
    if (screenFront) {
      const material = screenFront.material as THREE.MeshBasicMaterial;
      material.opacity = glow;
      // Bright white that dips a little as the screen flickers.
      material.color.setScalar(0.8 + 0.2 * flicker);
      screenFront.visible = glow > 0.01;
    }
  }
  const duration = 2;
  const ease = "power2.inOut";
  function turnOnLights() {
    gsap.to(scene, {
      environmentIntensity: 0.64,
      duration: duration,
      ease: ease,
    });
    gsap.to(directionalLight, {
      intensity: 1,
      duration: duration,
      ease: ease,
    });
    gsap.fromTo(
      ".character-rim",
      { opacity: 0, scale: 0.85, xPercent: -50, yPercent: -50 },
      {
        opacity: 1,
        scale: 1,
        xPercent: -50,
        yPercent: -50,
        delay: 0.2,
        duration: 2,
        ease: ease,
      }
    );
  }

  return { setPointLight, turnOnLights, addScreenLight };
};

const SCREEN_SPOT_STRENGTH = 400;

export default setLighting;
