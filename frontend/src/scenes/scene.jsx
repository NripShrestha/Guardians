import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import Office from "./gameModels/office";
import CharacterController from "./gameModels/CharacterController";
import Npc from "./gameModels/npc";
import ThirdPersonCamera from "./utils/ThirdPersonCamera";
import PositionalAudio from "./utils/PositionalAudio";
import { useEffect, useState, useCallback } from "react";
import { useBrightness } from "./utils/BrightnessContext";
import ManagerTrigger from "./triggers/ManagerTriggers";
import WorkspaceTrigger from "./triggers/WorkSpaceTrigger";
import MissionMarker from "./triggers/MissionMarker";
import { useMission } from "./missions/MissionContext";
import LaptopCamera from "./utils/LaptopCamera";

export default function Scene() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const { brightness } = useBrightness();

  const ambientIntensity = (brightness / 50) * 1.6;
  const directionalIntensity = (brightness / 50) * 1;

  useEffect(() => {
    const character = sessionStorage.getItem("selectedCharacter");
    setSelectedCharacter(character || "timmy");
  }, []);

  const handlePositionUpdate = useCallback(
    (pos) => {
      if (!pos) return;

      // Define the same lookAt offset used in the ThirdPersonCamera component
      const lookAtOffset = { x: 0, y: 1, z: 0 };

      // Calculate the LookAt target position
      const lookAt = {
        x: pos.x + lookAtOffset.x,
        y: pos.y + lookAtOffset.y,
        z: pos.z + lookAtOffset.z,
      };

      // console.log(
      //   `selectedCharacter (${selectedCharacter})`,
      //   `| Position: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]`,
      //   `| LookAt: [${lookAt.x.toFixed(2)}, ${lookAt.y.toFixed(2)}, ${lookAt.z.toFixed(2)}]`,
      // );
    },
    [selectedCharacter],
  );

  const { mission } = useMission();

  return (
    <>
      <ThirdPersonCamera
        offset={{ x: 0, y: 2, z: -3 }}
        lookAtOffset={{ x: 0, y: 1, z: 0 }}
        smoothness={0.1}
        enabled={mission.stage !== "FILL_FORM"}
      />

      {/* Positional 3D Audio */}
      <PositionalAudio
        url="/audios/office-audio.mp3"
        position={[-10.69, 2.03, 4.94]}
        refDistance={5}
        maxDistance={10}
        rolloffFactor={1}
        loop={true}
        autoplay={true}
      />

      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={directionalIntensity}
      />

      {/* ✅ Single CharacterController handles both character types */}
      {selectedCharacter && (
        <CharacterController
          characterType={selectedCharacter} // "timmy" or "girl"
          scale={1}
          position={[-2, 2.5, 3]}
          onPositionUpdate={handlePositionUpdate}
          disabled={mission.stage === "FILL_FORM"}
        />
      )}

      <Npc scale={1.2} position={[-7.18, 0.03, 10.17]} rotation={[0, 3.5, 0]} />
      <Office scale={1.5} position={[0, 0, 0]} />

      <ManagerTrigger position={[-7.18, 0.03, 10.17]} />

      <MissionMarker
        position={[-5.35, 0.03, 1.99]}
        visible={mission.stage === "GO_TO_WORKSPACE"}
      />

      <WorkspaceTrigger position={[-5.35, 0.03, 1.99]} />

      <LaptopCamera
        active={mission.stage === "FILL_FORM"}
        position={[-5.35, 1.44, 1.45]}
        lookAt={[-18, 1.2, 7.4]}
      />
    </>
  );
}
