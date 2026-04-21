import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Character configuration mapping
const CHARACTER_CONFIGS = {
  timmy: {
    modelPath: "/models/NewTimmy.glb",
    animations: {
      IDLE: "Armature.001|mixamo.com|Layer0.004",
      WALK: "walking",
      RUN: "run",
      SAD_IDLE: "sad idle",
    },
    renderCharacter: (nodes, materials) => (
      <>
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorig6Hips} />
        </group>
        <skinnedMesh
          name="Ch09"
          geometry={nodes.Ch09.geometry}
          material={materials.Ch09_body}
          skeleton={nodes.Ch09.skeleton}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        />
      </>
    ),
  },
  girl: {
    modelPath: "/models/Woman.glb",
    animations: {
      IDLE: "idle",
      WALK: "walking",
      RUN: "Run",
      SAD_IDLE: "sad idle",
    },
    renderCharacter: (nodes, materials) => (
      <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
        <group name="Ch46">
          <skinnedMesh
            name="Mesh"
            geometry={nodes.Mesh.geometry}
            material={materials.Ch46_body}
            skeleton={nodes.Mesh.skeleton}
          />
          <skinnedMesh
            name="Mesh_1"
            geometry={nodes.Mesh_1.geometry}
            material={materials["Material.001"]}
            skeleton={nodes.Mesh_1.skeleton}
          />
        </group>
        <primitive object={nodes.mixamorigHips} />
      </group>
    ),
  },
};

// ─────────────────────────────────────────────────────────────────
// Mouse / Touchpad drag state (module-level so it persists across renders)
// Left-button drag on the canvas → virtual joystick axis
// ─────────────────────────────────────────────────────────────────
const dragState = {
  active: false,
  startX: 0,
  startY: 0,
  deltaX: 0,
  deltaY: 0,
};

// Dead-zone radius in px before drag registers as movement
const DRAG_DEAD_ZONE = 8;
// Max drag distance mapped to full-speed (px)
const DRAG_MAX_DISTANCE = 80;

function setupDragListeners() {
  const onPointerDown = (e) => {
    // Only left button (mouse) or first touch
    if (e.button !== undefined && e.button !== 0) return;
    dragState.active = true;
    dragState.startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    dragState.startY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    dragState.deltaX = 0;
    dragState.deltaY = 0;
  };

  const onPointerMove = (e) => {
    if (!dragState.active) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? dragState.startX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? dragState.startY;
    dragState.deltaX = clientX - dragState.startX;
    dragState.deltaY = clientY - dragState.startY;
  };

  const onPointerUp = () => {
    dragState.active = false;
    dragState.deltaX = 0;
    dragState.deltaY = 0;
  };

  window.addEventListener("mousedown", onPointerDown);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);
  window.addEventListener("touchstart", onPointerDown, { passive: true });
  window.addEventListener("touchmove", onPointerMove, { passive: true });
  window.addEventListener("touchend", onPointerUp);

  return () => {
    window.removeEventListener("mousedown", onPointerDown);
    window.removeEventListener("mousemove", onPointerMove);
    window.removeEventListener("mouseup", onPointerUp);
    window.removeEventListener("touchstart", onPointerDown);
    window.removeEventListener("touchmove", onPointerMove);
    window.removeEventListener("touchend", onPointerUp);
  };
}

// ─────────────────────────────────────────────────────────────────
// Helper: normalise drag delta → [-1, 1] axis value
// ─────────────────────────────────────────────────────────────────
function normaliseDrag(value) {
  const abs = Math.abs(value);
  if (abs < DRAG_DEAD_ZONE) return 0;
  const clamped = Math.min(abs, DRAG_MAX_DISTANCE);
  return (
    ((clamped - DRAG_DEAD_ZONE) / (DRAG_MAX_DISTANCE - DRAG_DEAD_ZONE)) *
    Math.sign(value)
  );
}

export default function CharacterController({
  characterType = "timmy",
  scale,
  position,
  onPositionUpdate,
  disabled = false,
}) {
  const group = useRef();
  const rigidBodyRef = useRef();

  const config = CHARACTER_CONFIGS[characterType];
  if (!config) {
    console.error(`Unknown character type: ${characterType}`);
    return null;
  }

  const { nodes, materials, animations } = useGLTF(config.modelPath);
  const { actions } = useAnimations(animations, group);

  const [currentAnimation, setCurrentAnimation] = useState(
    config.animations.IDLE,
  );
  const moveDirection = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);

  // Cached vectors for useFrame
  const cameraDirectionRef = useRef(new THREE.Vector3());
  const cameraRightRef = useRef(new THREE.Vector3());
  const worldMoveDirectionRef = useRef(new THREE.Vector3());

  // Keyboard state — WASD + Arrow Keys
  const keys = useRef({
    forward: false, // W or ArrowUp
    backward: false, // S or ArrowDown
    left: false, // A or ArrowLeft
    right: false, // D or ArrowRight
    shift: false,
  });

  const idleTimer = useRef(0);
  const isMoving = useRef(false);

  const WALK_SPEED = 1;
  const RUN_SPEED = 2;
  const ROTATION_SPEED = 3;
  const GRAVITY_SCALE = 2.0;

  // Store RigidBody reference in userData for camera to find
  useEffect(() => {
    if (rigidBodyRef.current && group.current) {
      group.current.userData.rapierRigidBody = rigidBodyRef.current;
    }
  }, []);

  // Listen for reset player position event
  useEffect(() => {
    const handleReset = () => {
      if (rigidBodyRef.current && position) {
        // Reset rigid body position to the default position
        rigidBodyRef.current.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
        // Also wipe velocity to prevent sliding
        rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
    };

    window.addEventListener("reset-player-position", handleReset);
    return () => {
      window.removeEventListener("reset-player-position", handleReset);
    };
  }, [position]);

  // Set up mouse / touchpad drag listeners (once)
  useEffect(() => {
    const cleanup = setupDragListeners();
    return cleanup;
  }, []);

  // Keyboard event handlers — WASD + Arrow Keys
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case "w":
        case "W":
        case "ArrowUp":
          keys.current.forward = true;
          break;
        case "s":
        case "S":
        case "ArrowDown":
          keys.current.backward = true;
          break;
        case "a":
        case "A":
        case "ArrowLeft":
          keys.current.left = true;
          break;
        case "d":
        case "D":
        case "ArrowRight":
          keys.current.right = true;
          break;
        case "Shift":
          keys.current.shift = true;
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key) {
        case "w":
        case "W":
        case "ArrowUp":
          keys.current.forward = false;
          break;
        case "s":
        case "S":
        case "ArrowDown":
          keys.current.backward = false;
          break;
        case "a":
        case "A":
        case "ArrowLeft":
          keys.current.left = false;
          break;
        case "d":
        case "D":
        case "ArrowRight":
          keys.current.right = false;
          break;
        case "Shift":
          keys.current.shift = false;
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [disabled]);

  // Animation switching with blending
  useEffect(() => {
    if (!actions[currentAnimation]) return;

    Object.values(actions).forEach((action) => {
      if (action !== actions[currentAnimation]) action.fadeOut(0.2);
    });

    actions[currentAnimation].reset().fadeIn(0.2).play();

    return () => {
      if (actions[currentAnimation]) actions[currentAnimation].fadeOut(0.2);
    };
  }, [currentAnimation, actions]);

  // Per-frame movement and animation logic
  useFrame((state, delta) => {
    if (!rigidBodyRef.current) return;

    if (disabled) {
      rigidBodyRef.current.setLinvel({ x: 0, y: 0, z: 0 });
      if (currentAnimation !== config.animations.IDLE) {
        setCurrentAnimation(config.animations.IDLE);
      }
      return;
    }

    const { forward, backward, left, right, shift } = keys.current;

    // ── Drag / touch axis ────────────────────────────────────────
    const dragX = normaliseDrag(dragState.deltaX); // left/right
    const dragZ = normaliseDrag(dragState.deltaY); // forward/backward

    // Combine keyboard + drag inputs into a single [-1,1] axis each
    let axisZ = 0; // negative = forward, positive = backward
    let axisX = 0; // negative = left,    positive = right

    if (forward) axisZ -= 1;
    if (backward) axisZ += 1;
    if (left) axisX -= 1;
    if (right) axisX += 1;

    // Drag: dragging UP (negative deltaY) moves forward
    axisZ += dragZ;
    axisX += dragX;

    // Clamp composite axes to [-1, 1]
    axisZ = Math.max(-1, Math.min(1, axisZ));
    axisX = Math.max(-1, Math.min(1, axisX));

    const hasInput = Math.abs(axisZ) > 0.01 || Math.abs(axisX) > 0.01;
    // Run if shift held OR drag extends beyond 60 % of max distance
    const isDraggingFast =
      dragState.active &&
      Math.sqrt(dragState.deltaX ** 2 + dragState.deltaY ** 2) >
        DRAG_MAX_DISTANCE * 0.6;
    const isRunning = shift || isDraggingFast;

    isMoving.current = hasInput;

    if (hasInput) {
      idleTimer.current = 0;
    } else {
      idleTimer.current += delta;
    }

    // Build move direction vector
    moveDirection.current.set(axisX, 0, axisZ);
    if (moveDirection.current.length() > 1) moveDirection.current.normalize();

    // Get camera-relative world direction
    const camera = state.camera;
    const cameraDirection = cameraDirectionRef.current;
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    const cameraRight = cameraRightRef.current;
    cameraRight.crossVectors(camera.up, cameraDirection).normalize();

    const worldMoveDirection = worldMoveDirectionRef.current;
    worldMoveDirection.set(0, 0, 0);
    worldMoveDirection.addScaledVector(
      cameraDirection,
      -moveDirection.current.z,
    );
    worldMoveDirection.addScaledVector(cameraRight, -moveDirection.current.x);
    worldMoveDirection.normalize();

    const currentVelocity = rigidBodyRef.current.linvel();
    let targetAnimation = config.animations.IDLE;

    if (hasInput) {
      const speed = isRunning ? RUN_SPEED : WALK_SPEED;
      velocity.current.copy(worldMoveDirection).multiplyScalar(speed);

      targetAnimation = isRunning
        ? config.animations.RUN
        : config.animations.WALK;

      // Rotate toward movement direction (not when moving purely backward)
      const movingForward = axisZ < -0.01;
      const strafing = Math.abs(axisX) > 0.01;

      if (movingForward || strafing) {
        if (worldMoveDirection.length() > 0.1) {
          targetRotation.current = Math.atan2(
            worldMoveDirection.x,
            worldMoveDirection.z,
          );
        }
      }

      rigidBodyRef.current.setLinvel({
        x: velocity.current.x,
        y: currentVelocity.y,
        z: velocity.current.z,
      });
      rigidBodyRef.current.wakeUp();
    } else {
      const frictionFactor = 0.85;
      rigidBodyRef.current.setLinvel({
        x: currentVelocity.x * frictionFactor,
        y: currentVelocity.y,
        z: currentVelocity.z * frictionFactor,
      });

      if (
        Math.abs(currentVelocity.x) < 0.01 &&
        Math.abs(currentVelocity.z) < 0.01
      ) {
        rigidBodyRef.current.setLinvel({ x: 0, y: currentVelocity.y, z: 0 });
      }

      targetAnimation =
        idleTimer.current >= 15
          ? config.animations.SAD_IDLE
          : config.animations.IDLE;
    }

    if (targetAnimation !== currentAnimation) {
      setCurrentAnimation(targetAnimation);
    }

    // Smooth rotation
    if (hasInput && (axisZ < -0.01 || Math.abs(axisX) > 0.01)) {
      let rotationDiff = targetRotation.current - currentRotation.current;
      while (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
      while (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;
      currentRotation.current += rotationDiff * ROTATION_SPEED * delta;
    }

    if (group.current) {
      group.current.rotation.y = currentRotation.current;
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="dynamic"
      colliders={false}
      mass={1}
      lockRotations={true}
      friction={0.6}
      restitution={0.01}
      gravityScale={GRAVITY_SCALE}
      canSleep={false}
      position={position}
    >
      <CapsuleCollider args={[0.7, 0.15]} position={[0, 0.8, 0]} />

      <group ref={group} dispose={null} position={[0, 0, 0]} scale={scale}>
        <group name="Scene">{config.renderCharacter(nodes, materials)}</group>
      </group>
    </RigidBody>
  );
}

useGLTF.preload("/models/NewTimmy.glb");
useGLTF.preload("/models/Woman.glb");
