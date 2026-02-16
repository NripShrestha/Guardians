import { useMission } from "../missions/MissionContext";
import ThirdPersonCamera from "../utils/ThirdPersonCamera";
import LaptopCamera from "../utils/LaptopCamera";
import {
  getCurrentTaskConfig,
  getCameraConfig,
} from "../missions/tasks/TaskRegistry";
/**
 * Camera Manager
 * Dynamically switches between TPP and task-specific cameras
 */
export default function CameraManager({ playerLocked }) {
  const { mission } = useMission();

  // Get camera config for current stage
  const cameraConfig = getCameraConfig(mission.id, mission.stage);

  // Use TPP camera when no special camera is needed
  const useThirdPerson = !cameraConfig;

  return (
    <>
      {/* Third Person Camera (default) */}
      <ThirdPersonCamera
        offset={{ x: 0, y: 2, z: -3 }}
        lookAtOffset={{ x: 0, y: 1, z: 0 }}
        smoothness={0.1}
        enabled={useThirdPerson && !playerLocked}
      />

      {/* Task-Specific Camera */}
      {cameraConfig && (
        <LaptopCamera
          active={true}
          position={cameraConfig.position}
          lookAt={cameraConfig.lookAt}
        />
      )}
    </>
  );
}
