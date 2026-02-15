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

// Stages where player control is locked
const LOCKED_STAGES = new Set([
  "TALKING_TO_MANAGER",
  "FILL_FORM",
  "DEBRIEFING",
]);

const MANAGER_CAMERA_STAGES = new Set(["TALKING_TO_MANAGER", "DEBRIEFING"]);

export default function Scene() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const { brightness } = useBrightness();
  const { mission } = useMission();

  const playerLocked = LOCKED_STAGES.has(mission.stage);
  const useManagerCamera = MANAGER_CAMERA_STAGES.has(mission.stage);

  const ambientIntensity = (brightness / 50) * 1.6;
  const directionalIntensity = (brightness / 50) * 1;

  useEffect(() => {
    const character = sessionStorage.getItem("selectedCharacter");
    setSelectedCharacter(character || "timmy");
  }, []);

  const handlePositionUpdate = useCallback(() => {}, []);

  return (
    <>
      {/* ================= TPP CAMERA ================= */}
      <ThirdPersonCamera
        offset={{ x: 0, y: 2, z: -3 }}
        lookAtOffset={{ x: 0, y: 1, z: 0 }}
        smoothness={0.1}
        enabled={!playerLocked} // 🔑 THIS NOW WORKS
      />

      {/* ================= MANAGER / LAPTOP CAMERAS ================= */}
      <LaptopCamera
        active={mission.stage === "FILL_FORM"}
        position={[-5.35, 1.44, 1.45]}
        lookAt={[-18, 1.2, 7.4]}
      />

      <LaptopCamera
        active={useManagerCamera}
        position={[-7.25, 1.73, 7.7]}
        lookAt={[-7, 1, 16]}
      />

      {/* ================= AUDIO ================= */}
      <PositionalAudio
        url="/audios/office-audio.mp3"
        position={[-10.69, 2.03, 4.94]}
        refDistance={5}
        maxDistance={10}
        rolloffFactor={1}
        loop
        autoplay
      />

      {/* ================= LIGHTING ================= */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={directionalIntensity}
      />

      {/* ================= CHARACTER (ALWAYS MOUNTED) ================= */}
      {selectedCharacter && (
        <CharacterController
          characterType={selectedCharacter}
          scale={1}
          position={[-2, 2.5, 3]}
          onPositionUpdate={handlePositionUpdate}
          disabled={playerLocked} // 🔑 movement lock only
        />
      )}

      {/* ================= NPC ================= */}
      <Npc
        scale={1.2}
        position={[-7.18, 0.03, 10.17]}
        rotation={[0, 3.5, 0]}
        missionStage={mission.stage}
      />

      <Office scale={1.5} position={[0, 0, 0]} />

      {/* ================= TRIGGERS ================= */}
      <ManagerTrigger position={[-7.18, 0.03, 9.17]} />

      <MissionMarker
        position={[-5.35, 0.03, 1.99]}
        visible={mission.stage === "GO_TO_WORKSPACE"}
      />

      <WorkspaceTrigger position={[-5.35, 0.03, 1.99]} />
    </>
  );
}
