import { RigidBody } from "@react-three/rapier";
import { useMission } from "../missions/MissionContext";

export default function WorkspaceTrigger({ position }) {
  const { mission, setMission } = useMission();

  return (
    <RigidBody
      type="fixed"
      sensor
      onIntersectionEnter={() => {
        if (mission.stage === "GO_TO_WORKSPACE") {
          setMission({ ...mission, stage: "FILL_FORM" });
        }
      }}
    >
      <mesh position={position}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </RigidBody>
  );
}
