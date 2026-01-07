import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import Office from "./gameModels/office";
import CharacterController from "./gameModels/timmy";
import ThirdPersonCamera from "./utils/ThirdPersonCamera";
import GirlCharacterController from "./gameModels/girl";
import { useEffect } from "react";

export default function Scene() {
  // Debug: Log when Scene mounts
  useEffect(() => {
    console.log("Scene mounted - Camera should initialize");
  }, []);

  return (
    <>
      {/* Third-Person Camera - MUST be at the top, outside Suspense boundaries */}
      <ThirdPersonCamera
        offset={{ x: 0, y: 2, z: -3 }} // 5 units behind, 2.5 up
        lookAtOffset={{ x: 0, y: 1, z: 0 }} // Look at chest height
        smoothness={0.1} // Adjust lag (0.05 = more lag, 0.2 = snappier)
      />

      {/* Lights */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      {/* Character Controller */}
      {/* <CharacterController scale={1} position={[-2, 3, 3]} /> */}
      <GirlCharacterController scale={1} position={[-2, 3, 3]} />

      {/* Environment */}
      <Office scale={1.5} position={[0, 0, 0]} />
    </>
  );
}
