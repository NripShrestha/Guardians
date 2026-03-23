import { useState } from "react";
import { Settings, Save, List } from "lucide-react";
import SettingsModal from "./SettingsModal";
import MissionPopup from "./MissionPopup";
import PhoneMessenger from "../tasksUI/PhoneMessenger";
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
    savedPosition, // live position kept in sync by Scene.jsx
  } = useMission();

  const [showSettings, setShowSettings] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = async () => {
    const token = getAuthToken();
    if (!token) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    setSaveStatus("saving");

    // Build task result only if this session produced one
    let taskResult = null;
    if (mission.result) {
      taskResult = {
        taskId: mission.id,
        result: mission.result,
        unsafeFields: mission.unsafeFields || [],
        selectedUrl: mission.selectedUrl || null,
        emailActions: mission.emailActions || {},
        incorrectlyHandled: mission.incorrectlyHandled || [],
        completedAt: new Date().toISOString(),
      };
    }

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
          characterType: savedCharacter, // "timmy" | "girl"
          playerPosition: savedPosition, // { x, y, z } — updated live by Scene
          taskResult,
        }),
      });

      const data = await res.json();
      setSaveStatus(data.success ? "saved" : "error");
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
      </div>

      {showPhone && <PhoneMessenger />}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
