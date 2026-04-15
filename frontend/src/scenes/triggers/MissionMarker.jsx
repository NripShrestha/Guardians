import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function MissionMarker({ position, visible }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current || !visible) return;
    meshRef.current.rotation.y += delta * 1.5;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.15;
  });

  if (!visible) return null;

  return (
    <group position={position}>
      <mesh ref={meshRef} rotation-x={Math.PI}>
        <coneGeometry args={[0.25, 0.5, 4]} />
        <meshStandardMaterial 
          color="yellow" 
          emissive="yellow" 
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}
