import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  dracoLoader.preload();
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;
            const isMobile = window.innerWidth <= 1024;
            if (isMobile) {
              const hiddenOnMobilePrefixes = [
                "key",
                "plane",
                "cube",
                "ground",
                "rex_shoes",
                "rex_shorts",
                "rex_socks",
                "rex_belt",
                "rex_rolex",
              ];
              character.traverse((child: any) => {
                if (child.isMesh) {
                  const nameLower = (child.name || "").toLowerCase();
                  if (hiddenOnMobilePrefixes.some((p) => nameLower.startsWith(p) || nameLower.includes(p))) {
                    if (!nameLower.includes("screenlight")) {
                      child.visible = false;
                      child.matrixAutoUpdate = false;
                    }
                  }
                }
              });
            }
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.frustumCulled = true;
              }
            });
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            const footR = character?.getObjectByName("footR");
            if (footR) footR.position.y = 3.36;
            const footL = character?.getObjectByName("footL");
            if (footL) footL.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
