import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function ThirdPersonCamera({
  offset = { x: 0, y: 2.5, z: 5 },
  lookAtOffset = { x: 0, y: 1, z: 0 },
  smoothness = 0.1,
  enabled = true, 
}) {
  const currentPosition = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  // Store BOTH RigidBody (for position) and character group (for rotation)
  const targetBody = useRef(null);
  const characterGroup = useRef(null);

  // Raycaster for obstruction detection (reused every frame for performance)
  const raycaster = useRef(new THREE.Raycaster());

  // Current camera distance (smoothly interpolated)
  const currentDistance = useRef(null);

  // Safety margin to prevent camera clipping into walls
  const SAFETY_OFFSET = 0.3;

  // Minimum distance to prevent camera going inside character
  const MIN_DISTANCE = 0.5;

  const { scene, camera } = useThree();

  useEffect(() => {
    console.log("ThirdPersonCamera mounted - searching for character...");
  }, []);

  useFrame((state, delta) => {
    if (!enabled) return;
    // Find character references if not found yet
    if (!targetBody.current || !characterGroup.current) {
      scene.traverse((child) => {
        // Find the RigidBody for position
        if (child.userData?.rapierRigidBody && !targetBody.current) {
          targetBody.current = child.userData.rapierRigidBody;
          console.log("✓ Found RigidBody for position tracking");
        }

        // Find the character group mesh for rotation
        // Look for the group that contains the character (has children and userData)
        if (
          child.isGroup &&
          child.children.length > 0 &&
          child.userData?.rapierRigidBody
        ) {
          characterGroup.current = child;
          console.log("✓ Found character group for rotation tracking");
        }
      });

      if (!targetBody.current || !characterGroup.current) {
        return; // Wait until both are found
      }
    }

    // Get character position from RigidBody (physics position)
    let characterPosition;
    try {
      characterPosition = targetBody.current.translation();
    } catch (error) {
      console.error("Error reading RigidBody position:", error);
      targetBody.current = null;
      characterGroup.current = null;
      return;
    }

    if (!characterPosition) return;

    // Read Y rotation from the CHARACTER MESH, not RigidBody
    // This is the character's actual facing direction
    const characterYRotation = characterGroup.current.rotation.y;

    // Create offset vector in character's LOCAL space (behind = positive Z)
    const localOffset = new THREE.Vector3(offset.x, offset.y, offset.z);

    // Rotate offset by character's facing direction
    // This makes the camera orbit around the character
    const rotatedOffset = localOffset.clone();
    rotatedOffset.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      characterYRotation,
    );

    // Calculate look-at target (character's upper body/chest height)
    // This is our raycast origin point
    const lookAtTarget = new THREE.Vector3(
      characterPosition.x + lookAtOffset.x,
      characterPosition.y + lookAtOffset.y,
      characterPosition.z + lookAtOffset.z,
    );

    // Calculate IDEAL camera position (where we want to be without obstructions)
    const idealCameraPosition = new THREE.Vector3(
      characterPosition.x + rotatedOffset.x,
      characterPosition.y + rotatedOffset.y,
      characterPosition.z + rotatedOffset.z,
    );

    // ═══════════════════════════════════════════════════════════════
    // OBSTRUCTION DETECTION - Core AAA TPP Camera Logic
    // ═══════════════════════════════════════════════════════════════

    // Calculate ideal distance from look-at point to desired camera position
    const idealDistance = lookAtTarget.distanceTo(idealCameraPosition);

    // Initialize current distance on first frame
    if (currentDistance.current === null) {
      currentDistance.current = idealDistance;
    }

    // Direction vector from character to ideal camera position
    const rayDirection = new THREE.Vector3()
      .subVectors(idealCameraPosition, lookAtTarget)
      .normalize();

    // Setup raycaster: shoot ray from character toward ideal camera position
    raycaster.current.set(lookAtTarget, rayDirection);

    // Raycast against all scene objects
    const intersects = raycaster.current.intersectObjects(scene.children, true);

    // Filter out character's own meshes (we don't want to collide with ourselves)
    const validIntersects = intersects.filter((intersect) => {
      // Traverse up the hierarchy to check if this object is part of the character
      let obj = intersect.object;
      while (obj) {
        if (obj === characterGroup.current) {
          return false; // Skip character's own meshes
        }
        obj = obj.parent;
      }
      return true; // Valid obstruction
    });

    // Determine actual camera distance based on obstructions
    let targetDistance = idealDistance;

    if (validIntersects.length > 0) {
      // We hit something! Find the closest obstruction
      const closestHit = validIntersects[0];
      const hitDistance = closestHit.distance;

      // Only adjust if obstruction is between character and ideal camera position
      if (hitDistance < idealDistance) {
        // Pull camera closer, but leave safety margin to prevent wall clipping
        targetDistance = Math.max(hitDistance - SAFETY_OFFSET, MIN_DISTANCE);
      }
    }

    // Smoothly interpolate current distance toward target distance
    // This prevents jarring snaps when obstructions appear/disappear
    // Use a slightly faster lerp for distance to make it feel responsive
    const distanceSmoothness = Math.min(smoothness * 1.5, 0.3);
    currentDistance.current = THREE.MathUtils.lerp(
      currentDistance.current,
      targetDistance,
      distanceSmoothness,
    );

    // ═══════════════════════════════════════════════════════════════
    // CAMERA POSITIONING - Apply obstruction-adjusted distance
    // ═══════════════════════════════════════════════════════════════

    // Calculate actual camera position using adjusted distance
    // Start from look-at point, move in ray direction by current distance
    const actualCameraPosition = new THREE.Vector3()
      .copy(lookAtTarget)
      .add(rayDirection.multiplyScalar(currentDistance.current));

    // Initialize on first frame (no smoothing for instant camera placement)
    if (!initialized.current) {
      currentPosition.current.copy(actualCameraPosition);
      currentLookAt.current.copy(lookAtTarget);
      camera.position.copy(actualCameraPosition);
      camera.lookAt(lookAtTarget);
      initialized.current = true;
      console.log("✓ Camera initialized at:", actualCameraPosition);
      return;
    }

    // Smooth camera movement using LERP (maintains existing feel)
    currentPosition.current.lerp(actualCameraPosition, smoothness);
    currentLookAt.current.lerp(lookAtTarget, smoothness);

    // Apply to camera
    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
