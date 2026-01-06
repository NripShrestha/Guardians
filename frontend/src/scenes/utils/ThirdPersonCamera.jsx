import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function ThirdPersonCamera({
  offset = { x: 0, y: 2.5, z: 5 },
  lookAtOffset = { x: 0, y: 1, z: 0 },
  smoothness = 0.1,
}) {
  const currentPosition = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  // Store BOTH RigidBody (for position) and character group (for rotation)
  const targetBody = useRef(null);
  const characterGroup = useRef(null);

  const { scene, camera } = useThree();

  useEffect(() => {
    console.log("ThirdPersonCamera mounted - searching for character...");
  }, []);

  useFrame((state, delta) => {
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

    // ✅ CRITICAL FIX: Read Y rotation from the CHARACTER MESH, not RigidBody
    // This is the character's actual facing direction
    const characterYRotation = characterGroup.current.rotation.y;

    // Create offset vector in character's LOCAL space (behind = positive Z)
    const localOffset = new THREE.Vector3(offset.x, offset.y, offset.z);

    // Rotate offset by character's facing direction
    // This makes the camera orbit around the character
    const rotatedOffset = localOffset.clone();
    rotatedOffset.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      characterYRotation
    );

    // Calculate desired camera position in world space
    const desiredPosition = new THREE.Vector3(
      characterPosition.x + rotatedOffset.x,
      characterPosition.y + rotatedOffset.y,
      characterPosition.z + rotatedOffset.z
    );

    // Calculate look-at target (character's upper body)
    const desiredLookAt = new THREE.Vector3(
      characterPosition.x + lookAtOffset.x,
      characterPosition.y + lookAtOffset.y,
      characterPosition.z + lookAtOffset.z
    );

    // Initialize on first frame (no smoothing for instant camera placement)
    if (!initialized.current) {
      currentPosition.current.copy(desiredPosition);
      currentLookAt.current.copy(desiredLookAt);
      camera.position.copy(desiredPosition);
      camera.lookAt(desiredLookAt);
      initialized.current = true;
      console.log("✓ Camera initialized at:", desiredPosition);
      return;
    }

    // Smooth camera movement using LERP
    currentPosition.current.lerp(desiredPosition, smoothness);
    currentLookAt.current.lerp(desiredLookAt, smoothness);

    // Apply to camera
    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
