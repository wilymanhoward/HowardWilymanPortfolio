import * as THREE from "three";

export const handleMouseMove = (
  event: MouseEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY);
};

export const handleTouchMove = (
  event: TouchEvent,
  setMousePosition: (x: number, y: number) => void
) => {
  const mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  const mouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
  setMousePosition(mouseX, mouseY);
};

export const handleTouchEnd = (
  setMousePosition: (
    x: number,
    y: number,
    interpolationX: number,
    interpolationY: number
  ) => void
) => {
  setTimeout(() => {
    setMousePosition(0, 0, 0.03, 0.03);
    setTimeout(() => {
      setMousePosition(0, 0, 0.1, 0.2);
    }, 1000);
  }, 2000);
};

export const handleHeadRotation = (
  headBone: THREE.Object3D,
  mouseX: number,
  mouseY: number,
  interpolationX: number,
  interpolationY: number,
  lerp: (x: number, y: number, t: number) => number
) => {
  if (!headBone) return;
  if (window.scrollY < 200) {
    // -------------------------------------------------------------------------
    // ADJUST THE LIMITS HERE:
    // maxRotationY: Left/Right turning limit (increase to turn more, decrease to turn less)
    // maxTiltUp: How much the head tilts UP when cursor goes up
    // maxTiltDown: How much the head tilts DOWN when cursor goes down
    // -------------------------------------------------------------------------
    const maxRotationY = Math.PI / 20;
    const maxTiltUp = Math.PI / 30;     // Tilts up when cursor is near the top
    const maxTiltDown = Math.PI / 34;   // Tilts down when cursor is near the bottom

    // Left and Right rotation:
    headBone.rotation.y = lerp(
      headBone.rotation.y,
      mouseX * maxRotationY,
      interpolationY
    );

    // Up and Down tilt:
    const targetTilt = mouseY > 0 ? -mouseY * maxTiltUp : -mouseY * maxTiltDown;
    headBone.rotation.x = lerp(
      headBone.rotation.x,
      targetTilt,
      interpolationX
    );
  } else {
    // When scrolled down, return head to its default resting position (0, 0):
    headBone.rotation.x = lerp(headBone.rotation.x, 0, 0.05);
    headBone.rotation.y = lerp(headBone.rotation.y, 0, 0.05);
  }
};
