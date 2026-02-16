import { RigidBody } from "@react-three/rapier";
import { useMission } from "../missions/MissionContext";

/**
 * Universal Trigger Component
 * Handles any trigger type based on configuration
 */
function UniversalTrigger({ position, size, stageTransitions }) {
  const { mission, setMission } = useMission();

  const handleIntersection = () => {
    // Check if current stage should trigger a transition
    const nextStage = stageTransitions[mission.stage];

    if (nextStage) {
      setMission({ ...mission, stage: nextStage });
    }
  };

  return (
    <RigidBody type="fixed" sensor onIntersectionEnter={handleIntersection}>
      <mesh position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </RigidBody>
  );
}

/**
 * Trigger Manager
 * Renders all triggers for the current task
 */
export default function TriggerManager({ taskConfig }) {
  if (!taskConfig?.triggers) return null;

  return (
    <>
      {taskConfig.triggers.map((trigger, index) => (
        <UniversalTrigger
          key={`${taskConfig.id}-trigger-${index}`}
          position={trigger.position}
          size={trigger.size}
          stageTransitions={trigger.stages}
        />
      ))}
    </>
  );
}
