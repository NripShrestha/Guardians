import { useState, useMemo } from "react";
import { Settings, Save, List, Award } from "lucide-react";
import SettingsModal from "./SettingsModal";
import MissionPopup from "./MissionPopup";
import PhoneMessenger from "../tasksUI/PhoneMessenger";
import TaskHistoryOverlay from "./TaskHistoryOverlay";
import { useMission, getAuthToken } from "../../missions/MissionContext";
import { shouldShowPhone } from "../../missions/tasks/TaskRegistry";

const API_BASE = "http://localhost:3001";

// Reusable Icon Button
const IconButton = ({ onClick, icon: Icon, color = "bg-white" }) => (
  <button
    onClick={onClick}
    className={`pointer-events-auto p-4 ${color} border-4 border-indigo-900 rounded-2xl 
    shadow-[4px_4px_0_0_#4338ca] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] 
    transition-all group active:shadow-none`}
  >
    <Icon className="w-8 h-8 text-indigo-900 group-hover:scale-110 transition-transform" />
  </button>
);

// Toast notification
function SaveToast({ status }) {
  if (!status) return null;

  const styles = {
    saving: "bg-yellow-100 border-yellow-400 text-yellow-800",
    saved: "bg-green-100  border-green-400  text-green-800",
    error: "bg-red-100    border-red-400    text-red-800",
  };
  const messages = {
    saving: "⏳ Saving...",
    saved: "✅ Progress saved!",
    error: "❌ Save failed. Try again.",
  };

  return (
    <div
      className={`absolute top-8 left-1/2 -translate-x-1/2 px-5 py-2 rounded-xl border-2 
      font-bold text-sm shadow-md pointer-events-none transition-all ${styles[status]}`}
    >
      {messages[status]}
    </div>
  );
}

export default function HUD() {
  const {
    mission,
    savedCharacter,
    savedHighScore,
    taskResults,
    setTaskResults
  } = useMission();

  const [showSettings, setShowSettings] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [showTaskHistory, setShowTaskHistory] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // --- XP & Badge Logic ---
  const passedCount = taskResults.filter((r) => r.result === "PASS").length;
  const xp = passedCount * 100;
  
  const { badgeName, badgeColor } = useMemo(() => {
    if (xp >= 800) return { badgeName: "Diamond", badgeColor: "text-cyan-400 border-cyan-400 bg-cyan-50" };
    if (xp >= 600) return { badgeName: "Platinum", badgeColor: "text-slate-400 border-slate-400 bg-slate-50" };
    if (xp >= 400) return { badgeName: "Gold", badgeColor: "text-yellow-500 border-yellow-500 bg-yellow-50" };
    if (xp >= 200) return { badgeName: "Silver", badgeColor: "text-gray-400 border-gray-400 bg-gray-50" };
    return { badgeName: "Bronze", badgeColor: "text-amber-700 border-amber-700 bg-amber-50" };
  }, [xp]);


  const handleSave = async () => {
    const token = getAuthToken();
    if (!token) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    setSaveStatus("saving");

    try {
      const res = await fetch(`${API_BASE}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentMissionId: mission.id,
          currentStage: mission.stage,
          characterType: savedCharacter, 
          shooterHighscore: savedHighScore,
          taskResults: taskResults, // Save entire task history
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      console.error("Save failed:", err);
      setSaveStatus("error");
    }

    setTimeout(() => setSaveStatus(null), 3000);
  };

  const showPhone = shouldShowPhone(mission.id, mission.stage);

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-50 p-8">
        {/* Top Left - Logo */}
        <div className="absolute top-1 left-8">
          <img
            src="/images/Logo.png"
            alt="Logo"
            className="h-36 w-auto drop-shadow-[4px_4px_0_#4338ca]"
          />
        </div>

        {/* Save Toast */}
        <SaveToast status={saveStatus} />

        {/* Top Right - Icon Menu */}
        <div className="absolute top-8 right-8 flex flex-col gap-4">
          <IconButton
            icon={List}
            onClick={() => setShowMission(!showMission)}
          />
          <IconButton icon={Settings} onClick={() => setShowSettings(true)} />
          <IconButton icon={Save} onClick={handleSave} />
        </div>

        {/* Mission Panel */}
        {showMission && <MissionPopup />}

        {/* Bottom Left - Badge and XP */}
        <div 
          onClick={() => setShowTaskHistory(true)}
          className="absolute bottom-8 left-8 flex items-center gap-4 bg-white p-4 border-4 border-indigo-900 rounded-2xl shadow-[4px_4px_0_0_#4338ca] pointer-events-auto cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:shadow-none"
        >
          <div className={`w-16 h-16 flex items-center justify-center rounded-full border-4 ${badgeColor.split(' ')[1]} ${badgeColor.split(' ')[2]}`}>
            <Award className={`w-10 h-10 ${badgeColor.split(' ')[0]}`} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-indigo-900 uppercase">{badgeName} Defender</span>
            <div className="w-48 h-4 bg-gray-200 rounded-full border-2 border-indigo-900 mt-1 relative overflow-hidden">
              <div 
                className="h-full bg-yellow-400 absolute left-0 top-0 transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min((xp / 900) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="text-xs text-indigo-700 font-bold mt-1 tracking-wide">{xp} / 900 XP</span>
          </div>
        </div>
      </div>

      {showTaskHistory && (
        <TaskHistoryOverlay 
          onClose={() => setShowTaskHistory(false)} 
          taskResults={taskResults}
        />
      )}

      {showPhone && <PhoneMessenger />}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
