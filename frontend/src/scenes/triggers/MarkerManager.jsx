import { useMission } from "../missions/MissionContext";

/**
 * Single Mission Marker
 */
function Marker({ position, color }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.2, 0.2, 1]} />
      <meshStandardMaterial color={color} emissive={color} />
    </mesh>
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
