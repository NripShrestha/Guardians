import { useState } from "react";
import { Settings, Save, List } from "lucide-react";
import SettingsModal from "./SettingsModal";
import MissionPopup from "./MissionPopup";

// Reusable Icon Button Component
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

export default function HUD() {
  const [showSettings, setShowSettings] = useState(false);
  const [showMission, setShowMission] = useState(false);

  const handleSave = () => {
    console.log("Game Progress Saved!");
    // Add your save logic here
  };

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

        {/* Top Right - Icon Menu */}
        <div className="absolute top-8 right-8 flex flex-col gap-4">
          <IconButton
            icon={List}
            onClick={() => setShowMission(!showMission)}
          />
          <IconButton icon={Settings} onClick={() => setShowSettings(true)} />
          {/* Save Button added below Settings */}
          <IconButton icon={Save} onClick={handleSave} />
        </div>

        {/* Mission Panel */}
        {showMission && <MissionPopup />}
      </div>

      {/* Settings Modal */}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
