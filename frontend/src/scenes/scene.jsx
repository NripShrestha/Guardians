import { useEffect, useState, useCallback } from "react";
import { useMission } from "./missions/MissionContext";
import {
  getCurrentTaskConfig,
  isPlayerLocked,
} from "./missions/tasks/TaskRegistry";

// Components
import Office from "./gameModels/office";
import CharacterController from "./gameModels/CharacterController";
import Npc from "./gameModels/npc";
import SceneEnvironment from "./SceneEnvironment";
import TriggerManager from "./triggers/TriggerManager";
import MarkerManager from "./triggers/MarkerManager";
import CameraManager from "./triggers/CameraManager";

/**
 * Main Scene Component
 * Clean orchestrator that delegates to specialized components
 */
export default function Scene() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const { mission, isPhoneModalOpen } = useMission();

  // Get current task configuration
  const taskConfig = getCurrentTaskConfig(mission.id);

  // Player is locked if stage requires it OR phone modal is open
  const playerLocked =
    isPlayerLocked(mission.id, mission.stage) || isPhoneModalOpen;

  // Load selected character from session
  useEffect(() => {
    const character = sessionStorage.getItem("selectedCharacter");
    setSelectedCharacter(character || "timmy");
  }, []);

  const handlePositionUpdate = useCallback(() => {}, []);

  return (
    <>
      {/* ================= CAMERAS ================= */}
      <CameraManager playerLocked={playerLocked} />

      {/* ================= ENVIRONMENT ================= */}
      <SceneEnvironment />

      {/* ================= PLAYER CHARACTER ================= */}
      {selectedCharacter && (
        <CharacterController
          characterType={selectedCharacter}
          scale={1}
          position={[-2, 2.5, 3]}
          onPositionUpdate={handlePositionUpdate}
          disabled={playerLocked}
        />
      )}

      {/* ================= NPC ================= */}
      <Npc
        scale={1.2}
        position={[-7.18, 0.03, 10.17]}
        rotation={[0, 3.5, 0]}
        missionStage={mission.stage}
      />

      {/* ================= WORLD ================= */}
      <Office scale={1.5} position={[0, 0, 0]} />

      {/* ================= TASK-SPECIFIC ELEMENTS ================= */}
      {taskConfig && (
        <>
          <TriggerManager taskConfig={taskConfig} />
          <MarkerManager taskConfig={taskConfig} />
        </>
      )}
    </>
  );
}
