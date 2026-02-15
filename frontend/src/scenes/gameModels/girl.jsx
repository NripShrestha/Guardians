// import React, { useRef, useEffect, useState } from "react";
// import { useGLTF, useAnimations } from "@react-three/drei";
// import { RigidBody, CapsuleCollider } from "@react-three/rapier";
// import { useFrame } from "@react-three/fiber";
// import * as THREE from "three";

// export default function GirlCharacterController({ scale, position, onPositionUpdate }) {
//   const group = useRef();
//   const rigidBodyRef = useRef();

//   const { nodes, materials, animations } = useGLTF("/models/Woman.glb");
//   const { actions } = useAnimations(animations, group);

//   // Movement state
//   const [currentAnimation, setCurrentAnimation] = useState("idle");
//   const moveDirection = useRef(new THREE.Vector3());
//   const velocity = useRef(new THREE.Vector3());
//   const targetRotation = useRef(0);
//   const currentRotation = useRef(0);

//   // Keyboard state
//   const keys = useRef({
//     w: false,
//     a: false,
//     s: false,
//     d: false,
//     shift: false,
//   });

//   // Idle timer
//   const idleTimer = useRef(0);
//   const isMoving = useRef(false);

//   // Movement speeds
//   const WALK_SPEED = 1;
//   const RUN_SPEED = 2;
//   const ROTATION_SPEED = 3;
//   const GRAVITY_SCALE = 2.0;

//   // Animation names (matching your Woman.glb animations)
//   const ANIMATIONS = {
//     IDLE: "idle",
//     WALK: "walking",
//     RUN: "Run",
//     SAD_IDLE: "sad idle",
//   };

//   // Store RigidBody reference in userData for camera to find
//   useEffect(() => {
//     if (rigidBodyRef.current && group.current) {
//       group.current.userData.rapierRigidBody = rigidBodyRef.current;
//     }
//   }, []);

//   // Keyboard event handlers
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       const key = e.key.toLowerCase();
//       if (key === "w") keys.current.w = true;
//       if (key === "a") keys.current.a = true;
//       if (key === "s") keys.current.s = true;
//       if (key === "d") keys.current.d = true;
//       if (key === "shift") keys.current.shift = true;
//     };

//     const handleKeyUp = (e) => {
//       const key = e.key.toLowerCase();
//       if (key === "w") keys.current.w = false;
//       if (key === "a") keys.current.a = false;
//       if (key === "s") keys.current.s = false;
//       if (key === "d") keys.current.d = false;
//       if (key === "shift") keys.current.shift = false;
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, []);

//   // Animation switching with blending
//   useEffect(() => {
//     if (!actions[currentAnimation]) return;

//     // Fade out all animations
//     Object.values(actions).forEach((action) => {
//       if (action !== actions[currentAnimation]) {
//         action.fadeOut(0.2);
//       }
//     });

//     // Fade in current animation
//     actions[currentAnimation].reset().fadeIn(0.2).play();

//     return () => {
//       if (actions[currentAnimation]) {
//         actions[currentAnimation].fadeOut(0.2);
//       }
//     };
//   }, [currentAnimation, actions]);

//   // Per-frame movement and animation logic
//   useFrame((state, delta) => {
//     if (!rigidBodyRef.current) return;

//     const { w, a, s, d, shift } = keys.current;

//     // Check if any movement key is pressed
//     const hasInput = w || a || s || d;
//     isMoving.current = hasInput;

//     // Reset idle timer if moving
//     if (hasInput) {
//       idleTimer.current = 0;
//     } else {
//       // Increment idle timer when not moving
//       idleTimer.current += delta;
//     }

//     // Determine movement direction relative to camera
//     moveDirection.current.set(0, 0, 0);

//     if (w) moveDirection.current.z -= 1;
//     if (s) moveDirection.current.z += 1;
//     if (a) moveDirection.current.x -= 1;
//     if (d) moveDirection.current.x += 1;

//     // Normalize diagonal movement
//     if (moveDirection.current.length() > 0) {
//       moveDirection.current.normalize();
//     }

//     // Get camera direction
//     const camera = state.camera;
//     const cameraDirection = new THREE.Vector3();
//     camera.getWorldDirection(cameraDirection);
//     cameraDirection.y = 0;
//     cameraDirection.normalize();

//     // Calculate right vector for strafing
//     const cameraRight = new THREE.Vector3();
//     cameraRight.crossVectors(camera.up, cameraDirection).normalize();

//     // Apply camera-relative movement
//     const worldMoveDirection = new THREE.Vector3();
//     worldMoveDirection.addScaledVector(
//       cameraDirection,
//       -moveDirection.current.z
//     );
//     worldMoveDirection.addScaledVector(cameraRight, -moveDirection.current.x);
//     worldMoveDirection.normalize();

//     // Get current velocity from physics body
//     const currentVelocity = rigidBodyRef.current.linvel();

//     // Determine animation based on movement
//     let targetAnimation = ANIMATIONS.IDLE;

//     if (hasInput) {
//       // Moving - choose walk or run
//       const speed = shift ? RUN_SPEED : WALK_SPEED;
//       velocity.current.copy(worldMoveDirection).multiplyScalar(speed);

//       targetAnimation = shift ? ANIMATIONS.RUN : ANIMATIONS.WALK;

//       // Only rotate character when moving forward or sideways
//       const isMovingForward = w;
//       const isStrafing = a || d;

//       if (isMovingForward || isStrafing) {
//         // Calculate target rotation towards movement direction
//         if (worldMoveDirection.length() > 0.1) {
//           targetRotation.current = Math.atan2(
//             worldMoveDirection.x,
//             worldMoveDirection.z
//           );
//         }
//       }

//       // Apply velocity to rigid body (preserve Y velocity for gravity)
//       rigidBodyRef.current.setLinvel({
//         x: velocity.current.x,
//         y: currentVelocity.y,
//         z: velocity.current.z,
//       });

//       // Wake up physics body
//       rigidBodyRef.current.wakeUp();
//     } else {
//       // Not moving - apply friction
//       const frictionFactor = 0.85;
//       rigidBodyRef.current.setLinvel({
//         x: currentVelocity.x * frictionFactor,
//         y: currentVelocity.y,
//         z: currentVelocity.z * frictionFactor,
//       });

//       // Stop completely if velocity is very low
//       if (
//         Math.abs(currentVelocity.x) < 0.01 &&
//         Math.abs(currentVelocity.z) < 0.01
//       ) {
//         rigidBodyRef.current.setLinvel({
//           x: 0,
//           y: currentVelocity.y,
//           z: 0,
//         });
//       }

//       // Switch to sad idle after 15 seconds
//       if (idleTimer.current >= 15) {
//         targetAnimation = ANIMATIONS.SAD_IDLE;
//       } else {
//         targetAnimation = ANIMATIONS.IDLE;
//       }
//     }

//     // Switch animation if needed
//     if (targetAnimation !== currentAnimation) {
//       setCurrentAnimation(targetAnimation);
//     }

//     // Smooth rotation interpolation
//     if (hasInput && (w || a || d)) {
//       let rotationDiff = targetRotation.current - currentRotation.current;

//       // Normalize rotation difference to [-PI, PI]
//       while (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
//       while (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;

//       currentRotation.current += rotationDiff * ROTATION_SPEED * delta;
//     }

//     // Apply rotation to character
//     if (group.current) {
//       group.current.rotation.y = currentRotation.current;
//     }

//     // Report physics position to parent every frame (if a callback was provided)
//     if (rigidBodyRef.current && typeof onPositionUpdate === "function") {
//       const t = rigidBodyRef.current.translation();
//       onPositionUpdate(t);
//     }
//   });

//   return (
//     <RigidBody
//       ref={rigidBodyRef}
//       type="dynamic"
//       colliders={false}
//       mass={1}
//       lockRotations={true}
//       friction={0.6}
//       restitution={0.01}
//       gravityScale={GRAVITY_SCALE}
//       canSleep={false}
//       position={position}
//     >
//       <CapsuleCollider args={[0.7, 0.15]} position={[0, 0.8, 0]} />

//       <group ref={group} dispose={null} position={[0, 0, 0]} scale={scale}>
//         <group name="Scene">
//           <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
//             <group name="Ch46">
//               <skinnedMesh
//                 name="Mesh"
//                 geometry={nodes.Mesh.geometry}
//                 material={materials.Ch46_body}
//                 skeleton={nodes.Mesh.skeleton}
//               />
//               <skinnedMesh
//                 name="Mesh_1"
//                 geometry={nodes.Mesh_1.geometry}
//                 material={materials["Material.001"]}
//                 skeleton={nodes.Mesh_1.skeleton}
//               />
//             </group>
//             <primitive object={nodes.mixamorigHips} />
//           </group>
//         </group>
//       </group>
//     </RigidBody>
//   );
// }

// useGLTF.preload("/models/Woman.glb");
