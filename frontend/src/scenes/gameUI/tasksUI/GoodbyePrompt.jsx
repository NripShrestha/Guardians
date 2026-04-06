import { useMission } from "../../missions/MissionContext";
import { shouldShowGoodbyePrompt } from "../../missions/tasks/TaskRegistry";

export default function GoodbyePrompt() {
  const { mission, setMission } = useMission();

  if (!shouldShowGoodbyePrompt(mission.id, mission.stage)) return null;

  const handleStay = () => {
    // Go back to roaming — set to TASK10_COMPLETED so user can explore
    setMission({
      id: "TASK_11_OUTRO",
      stage: "TASK11_GO_TO_MANAGER",
      result: null,
      unsafeFields: [],
      selectedUrl: null,
      emailActions: {},
      incorrectlyHandled: [],
    });
  };

  const handleGoodbye = () => {
    // Fire event to reset position (handled by CharacterController)
    window.dispatchEvent(new CustomEvent("reset-player-position"));
    window.dispatchEvent(new CustomEvent("reset-game-ui"));
    
    setMission({
      ...mission,
      stage: "TASK11_GOODBYE_DIALOGUE",
    });
  };

  return (
    <div className="fixed inset-0 z-[950] flex items-center justify-center bg-black/50 backdrop-blur-sm font-sans p-4">
      <div className="bg-white rounded-[2rem] border-4 border-indigo-900 shadow-[10px_10px_0_0_#4338ca] p-8 w-full max-w-md flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="text-6xl mb-2 drop-shadow-[2px_2px_0_rgba(67,56,202,0.5)] animate-bounce hover:animate-none">
            👋
          </div>
          <h2 className="text-2xl font-black text-indigo-900 uppercase tracking-wide">
            Ready to Say Goodbye?
          </h2>
          <p className="text-sm font-bold text-indigo-700/80">
            It's been an incredible journey. Are you ready to head home?
          </p>
        </div>

        {/* Warning Box */}
        <div className="bg-red-50 border-4 border-red-200 rounded-2xl p-4 flex gap-3 items-start">
          <span className="text-2xl mt-1">⚠️</span>
          <p className="text-xs font-bold text-red-900 leading-relaxed">
            <span className="uppercase text-red-600 font-black block mb-1">Warning:</span>
            Saying goodbye will reset all your task progress, mission history, and quiz results.
            Only your <span className="text-indigo-900 font-black bg-yellow-200 px-1 rounded-sm mx-1">high scores</span> 
            will be preserved. This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-2">
          <button
            onClick={handleStay}
            className="flex-1 bg-white text-indigo-900 border-4 border-indigo-900 shadow-[4px_4px_0_0_#4338ca] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] py-3.5 rounded-2xl text-sm font-black uppercase tracking-wide transition-all active:shadow-none"
          >
            🏢 Stay
          </button>
          <button
            onClick={handleGoodbye}
            className="flex-1 bg-red-500 text-white border-4 border-indigo-900 shadow-[4px_4px_0_0_#4338ca] hover:bg-red-600 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] py-3.5 rounded-2xl text-sm font-black uppercase tracking-wide transition-all active:shadow-none"
          >
            👋 Goodbye
          </button>
        </div>
        
      </div>
    </div>
  );
}
