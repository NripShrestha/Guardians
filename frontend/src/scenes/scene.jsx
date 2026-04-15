import { useEffect, useState } from "react";
import { useMission } from "./missions/MissionContext";
import {
  getCurrentTaskConfig,
  isPlayerLocked,
  shouldShowUSBModel,
} from "./missions/tasks/TaskRegistry";

// Components
import Office from "./gameModels/office";
import CharacterController from "./gameModels/CharacterController";
import Npc from "./gameModels/npc";
import SceneEnvironment from "./SceneEnvironment";
import TriggerManager from "./triggers/TriggerManager";
import MarkerManager from "./triggers/MarkerManager";
import CameraManager from "./triggers/CameraManager";
import USB from "./gameModels/usb";
import SittingGuy from "./gameModels/sittingGuy";
import TalkingNPC from "./gameModels/talkingNPC";
import TalkingNPC2 from "./gameModels/talkingNPC2";

// Cyber Shooter
import CyberShooterTrigger from "./gameUI/tasksUI/shooter/CyberShooterTrigger";

/**
 * Main Scene Component
 * Clean orchestrator that delegates to specialized components
 */
export default function Scene({ onOpenCyberShooter }) {
  const { mission, isPhoneModalOpen, isTutorialOpen, savedCharacter, setSavedCharacter } =
    useMission();

  const [activeCharacter, setActiveCharacter] = useState(null);

  // Get current task configuration
  const taskConfig = getCurrentTaskConfig(mission.id);

  // Player is locked if stage requires it OR phone modal is open OR tutorial is open
  const playerLocked =
    isPlayerLocked(mission.id, mission.stage) || isPhoneModalOpen || isTutorialOpen;

  // USB is only visible before picked up in Task 9
  const showUSB = shouldShowUSBModel(mission.id, mission.stage);

  // Sync character between DB, Context, and Session
  useEffect(() => {
    if (savedCharacter) {
      setActiveCharacter(savedCharacter);
      sessionStorage.setItem("selectedCharacter", savedCharacter);
    } else {
      const sessionChar = sessionStorage.getItem("selectedCharacter");
      if (sessionChar) {
        setActiveCharacter(sessionChar);
        setSavedCharacter(sessionChar);
      } else {
        setActiveCharacter("timmy");
      }
    }
  }, [savedCharacter, setSavedCharacter]);

  return (
    <>
      {/* ================= CAMERAS ================= */}
      <CameraManager playerLocked={playerLocked} />

      {/* ================= ENVIRONMENT ================= */}
      <SceneEnvironment />

      {/* ================= PLAYER CHARACTER ================= */}
      {activeCharacter && (
        <CharacterController
          characterType={activeCharacter}
          scale={1}
          position={[-2, 2.5, 3]}
          disabled={playerLocked}
        />
      )}

      {/* ================= USB MODEL (only after Task 8 completed) ================= */}
      {showUSB && <USB scale={0.05} position={[-6.5, 0.0, 3.99]} />}
      <SittingGuy scale={1.2} position={[-5.9, 0.04, 5.2]} rotation={[0, 1.5, 0]} />
      

      <TalkingNPC scale={1.2} position={[-13.4, 0.0, 3.2]} rotation={[0, 0.4, 0]} />
      <TalkingNPC2 scale={1.2} position={[-13.4, 0.0, 4.8]} rotation={[0, 2.8, 0]} />
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

      {/* ================= CYBER SHOOTER MINIGAME TRIGGER ================= */}
      <CyberShooterTrigger onTrigger={onOpenCyberShooter} />
    </>
  );
}
