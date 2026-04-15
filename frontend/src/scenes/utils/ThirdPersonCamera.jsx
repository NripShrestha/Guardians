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

  const targetBody = useRef(null);
  const characterGroup = useRef(null);

  const currentDistance = useRef(null);

  const SAFETY_OFFSET = 0.3; // Give a bit more room
  const MIN_DISTANCE = 0.8;

  const { scene, camera } = useThree();

  useFrame((state, delta) => {
    if (!enabled) return;

    // ── Find character references ────────────────────────────────
    if (!targetBody.current || !characterGroup.current) {
      scene.traverse((child) => {
        if (child.userData?.rapierRigidBody && !targetBody.current) {
          targetBody.current = child.userData.rapierRigidBody;
        }
        if (
          child.isGroup &&
          child.children.length > 0 &&
          child.userData?.rapierRigidBody
        ) {
          characterGroup.current = child;
        }
      });
      if (!targetBody.current || !characterGroup.current) return;
    }

    // ── Character position & rotation ────────────────────────────
    let characterPosition;
    try {
      characterPosition = targetBody.current.translation();
    } catch {
      targetBody.current = null;
      characterGroup.current = null;
      return;
    }
    if (!characterPosition) return;

    const characterYRotation = characterGroup.current.rotation.y;

    // ── Build ideal camera position ──────────────────────────────
    const localOffset = new THREE.Vector3(offset.x, offset.y, offset.z);
    const rotatedOffset = localOffset
      .clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), characterYRotation);

    const lookAtTarget = new THREE.Vector3(
      characterPosition.x + lookAtOffset.x,
      characterPosition.y + lookAtOffset.y,
      characterPosition.z + lookAtOffset.z,
    );

    const idealCameraPosition = new THREE.Vector3(
      characterPosition.x + rotatedOffset.x,
      characterPosition.y + rotatedOffset.y,
      characterPosition.z + rotatedOffset.z,
    );

    const idealDistance = lookAtTarget.distanceTo(idealCameraPosition);
    if (currentDistance.current === null)
      currentDistance.current = idealDistance;

    // Direction from character (look-at point) → ideal camera
    const rayDirection = new THREE.Vector3()
      .subVectors(idealCameraPosition, lookAtTarget)
      .normalize();

    // ── Three.js Obstruction raycast ─────────────────────────────
    // Cast FROM character TOWARD camera to find the first thing in the way.
    // Use Three.js Raycaster for exact visual bounds since physics colliders 
    // might be missing or approximations.
    const RAY_ORIGIN_OFFSET = 0.2; // skip character's own center
    const rayDistance = idealDistance - RAY_ORIGIN_OFFSET;

    let targetDistance = idealDistance;

    if (rayDistance > 0) {
      const rayOrigin = lookAtTarget
        .clone()
        .add(rayDirection.clone().multiplyScalar(RAY_ORIGIN_OFFSET));

      const raycaster = new THREE.Raycaster(rayOrigin, rayDirection, 0, rayDistance);
      // Optional: limit to only meshes (no sensors, lines, etc.) if needed.
      const hits = raycaster.intersectObjects(scene.children, true);

      // Find the first valid hit that isn't the character itself
      let minHitDistance = rayDistance;
      let hasHit = false;

      for (const hit of hits) {
        // Exclude the character group
        let isCharacter = false;
        let obj = hit.object;
        while (obj) {
          if (obj === characterGroup.current) {
            isCharacter = true;
            break;
          }
          // Optional: Exclude certain non-solid things if they have specific userData
          if (obj.userData?.isTrigger || obj.userData?.isSensor) {
            isCharacter = true;
            break;
          }
          obj = obj.parent;
        }

        if (!isCharacter && hit.object.isMesh && hit.distance < minHitDistance) {
          minHitDistance = hit.distance;
          hasHit = true;
        }
      }

      if (hasHit) {
        const hitDistance = minHitDistance + RAY_ORIGIN_OFFSET;
        if (hitDistance < idealDistance) {
          // Pull camera in front of the obstruction
          targetDistance = Math.max(hitDistance - SAFETY_OFFSET, MIN_DISTANCE);
        }
      }
    }

    // Smoothly interpolate distance
    const distanceSmoothness = Math.min(smoothness * 2.5, 0.8);
    currentDistance.current = THREE.MathUtils.lerp(
      currentDistance.current,
      targetDistance,
      distanceSmoothness,
    );

    // ── Final camera position along the ray ─────────────────────
    const actualCameraPosition = lookAtTarget
      .clone()
      .add(rayDirection.clone().multiplyScalar(currentDistance.current));

    // ── Lerp camera into place ───────────────────────────────────
    if (!initialized.current) {
      currentPosition.current.copy(actualCameraPosition);
      currentLookAt.current.copy(lookAtTarget);
      camera.position.copy(actualCameraPosition);
      camera.lookAt(lookAtTarget);
      initialized.current = true;
      return;
    }

    currentPosition.current.lerp(actualCameraPosition, smoothness);
    currentLookAt.current.lerp(lookAtTarget, smoothness);

    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
