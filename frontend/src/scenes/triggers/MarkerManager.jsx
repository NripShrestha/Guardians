import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useMission } from "../missions/MissionContext";

/**
 * Single Mission Marker
 */
function Marker({ position, color }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 1.5;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.15;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} rotation-x={Math.PI}>
        <coneGeometry args={[0.25, 0.5, 4]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
}

/**
 * Marker Manager
 * Renders all markers for the current task based on stage
 */
export default function MarkerManager({ taskConfig }) {
  const { mission } = useMission();

  if (!taskConfig?.markers) return null;

  return (
    <>
      {taskConfig.markers.map((marker, index) => {
        const isVisible = marker.visibleInStages.includes(mission.stage);

        if (!isVisible) return null;

        return (
          <Marker
            key={`${taskConfig.id}-marker-${index}`}
            position={marker.position}
            color={marker.color}
          />
        );
      })}
    </>
  );
}
