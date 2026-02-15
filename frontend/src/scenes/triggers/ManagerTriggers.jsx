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
          // First conversation
          setMission({ ...mission, stage: "GO_TO_WORKSPACE" });
        } else if (mission.stage === "RETURN_TO_MANAGER") {
          // Show result after form
          if (mission.result === "PASS") {
            console.log("Manager says: You passed! The form was a test.");
          } else {
            console.log("Manager says: The form was a test. You failed.");
          }
          // Then lecture about personal info (you'll add dialogue later)
          setMission({ ...mission, stage: "COMPLETED" });
        }
      }}
    >
      <mesh position={position}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial transparent opacity={0.3} />
      </mesh>
    </RigidBody>
  );
}
