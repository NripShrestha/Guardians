import { RigidBody } from "@react-three/rapier";
import { useMission } from "../missions/MissionContext";

export default function ManagerTrigger({ position }) {
  const { mission, setMission } = useMission();

  return (
    <RigidBody
      type="fixed"
      sensor
      onIntersectionEnter={() => {
        if (mission.stage === "TALK_TO_MANAGER") {
          // Open Scene 1 dialogue
          setMission({ ...mission, stage: "TALKING_TO_MANAGER" });
        } else if (mission.stage === "RETURN_TO_MANAGER") {
          // Open Scene 2 debrief dialogue
          setMission({ ...mission, stage: "DEBRIEFING" });
        }
      }}
    >
      <mesh position={position}>
        <boxGeometry args={[1, 2, 2.3]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </RigidBody>
  );
}
