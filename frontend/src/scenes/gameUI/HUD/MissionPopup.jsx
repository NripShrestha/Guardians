import {
  getCurrentTaskConfig,
  getStageInstruction,
} from "../../missions/tasks/TaskRegistry";
import { useMission } from "../../missions/MissionContext";

/**
 * Mission Popup - Shows current task and instruction
 * Automatically updates based on mission stage
 */
export default function MissionPopup() {
  const { mission } = useMission();
  const taskConfig = getCurrentTaskConfig(mission.id);
  const instruction = getStageInstruction(mission.id, mission.stage);

  // After quiz is done — show goodbye prompt instruction
  if (
    mission.id === "TASK_11_OUTRO" &&
    mission.stage === "TASK11_GO_TO_MANAGER"
  ) {
    return (
      <div className="absolute top-8 right-32 w-72 bg-white border-4 border-indigo-900 p-6 rounded-[2rem] shadow-[8px_8px_0_0_#4338ca] pointer-events-auto animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tighter mb-2">
          Time to Go Home 🏠
        </h3>
        <p className="font-bold text-indigo-700/70">{instruction}</p>
      </div>
    );
  }

  // Credits / goodbye dialogue — hide popup
  if (
    mission.stage === "TASK11_GOODBYE_PROMPT" ||
    mission.stage === "TASK11_GOODBYE_DIALOGUE" ||
    mission.stage === "TASK11_CREDITS"
  ) {
    return null;
  }

  // Quiz completed state
  if (
    mission.id === "TASK_10_FINAL_QUIZ" &&
    mission.stage === "TASK10_COMPLETED"
  ) {
    return (
      <div className="absolute top-8 right-32 w-72 bg-white border-4 border-indigo-900 p-6 rounded-[2rem] shadow-[8px_8px_0_0_#4338ca] pointer-events-auto animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tighter mb-2">
          Quiz Complete! 🎉
        </h3>
        <p className="font-bold text-indigo-700/70">{instruction}</p>
      </div>
    );
  }

  // Show "Coming soon" message if mission is completed (legacy)
  if (mission.stage === "COMPLETED") {
    return (
      <div className="absolute top-8 right-32 w-72 bg-white border-4 border-indigo-900 p-6 rounded-[2rem] shadow-[8px_8px_0_0_#4338ca] pointer-events-auto animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tighter mb-2">
          Task Complete! 🎉
        </h3>
        <p className="font-bold text-indigo-700/70">More tasks coming soon</p>
      </div>
    );
  }

  return (
    <div className="absolute top-8 right-32 w-72 bg-white border-4 border-indigo-900 p-6 rounded-[2rem] shadow-[8px_8px_0_0_#4338ca] pointer-events-auto animate-in fade-in zoom-in duration-200">
      <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tighter mb-2">
        {taskConfig?.name || "Mission Active"}
      </h3>
      <p className="font-bold text-indigo-700/70">{instruction}</p>
    </div>
  );
}
