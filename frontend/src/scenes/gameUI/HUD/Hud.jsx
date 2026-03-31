import { useState, useMemo, useEffect, useRef } from "react";
import { Settings, Save, List, Award } from "lucide-react";
import SettingsModal from "./SettingsModal";
import MissionPopup from "./MissionPopup";
import PhoneMessenger from "../tasksUI/PhoneMessenger";
import TaskHistoryOverlay from "./TaskHistoryOverlay";
import BadgeUpgradeAnimation from "./BadgeUpgradeAnimation";
import { useMission, getAuthToken } from "../../missions/MissionContext";
import {
  shouldShowPhone,
  isPlayerLocked,
} from "../../missions/tasks/TaskRegistry";

const API_BASE = "http://localhost:3001";

// Reusable Icon Button
const IconButton = ({ onClick, icon: Icon, color = "bg-white" }) => (
  <button
    onClick={onClick}
    className={`pointer-events-auto p-3 ${color} border-4 border-indigo-900 rounded-xl 
    shadow-[3px_3px_0_0_#4338ca] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] 
    transition-all group active:shadow-none`}
  >
    <Icon className="w-6 h-6 text-indigo-900 group-hover:scale-110 transition-transform" />
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
    shooterPlays,
    shooterHighscoreCount,
    taskResults,
    setTaskResults,
  } = useMission();

  const [showSettings, setShowSettings] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [showTaskHistory, setShowTaskHistory] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [upgradedBadge, setUpgradedBadge] = useState(null);
  const prevBadgeRef = useRef(null);
  const pendingBadgeRef = useRef(null); // queued badge to show once player is free

  // --- XP & Badge Logic ---
  const passedCount = taskResults.filter((r) => r.result === "PASS").length;
  const xp = passedCount * 100 + shooterPlays * 5 + shooterHighscoreCount * 50;

  const { badgeName, badgeColor, tierMin, tierMax } = useMemo(() => {
    if (xp >= 1200)
      return {
        badgeName: "Legendary",
        badgeColor: "text-fuchsia-500 border-fuchsia-500 bg-fuchsia-50",
        tierMin: 1200,
        tierMax: 1500,
      };
    if (xp >= 1000)
      return {
        badgeName: "Master",
        badgeColor: "text-purple-500 border-purple-500 bg-purple-50",
        tierMin: 1000,
        tierMax: 1200,
      };
    if (xp >= 800)
      return {
        badgeName: "Diamond",
        badgeColor: "text-cyan-400 border-cyan-400 bg-cyan-50",
        tierMin: 800,
        tierMax: 1000,
      };
    if (xp >= 600)
      return {
        badgeName: "Platinum",
        badgeColor: "text-slate-400 border-slate-400 bg-slate-50",
        tierMin: 600,
        tierMax: 800,
      };
    if (xp >= 400)
      return {
        badgeName: "Gold",
        badgeColor: "text-yellow-500 border-yellow-500 bg-yellow-50",
        tierMin: 400,
        tierMax: 600,
      };
    if (xp >= 200)
      return {
        badgeName: "Silver",
        badgeColor: "text-gray-400 border-gray-400 bg-gray-50",
        tierMin: 200,
        tierMax: 400,
      };
    return {
      badgeName: "Bronze",
      badgeColor: "text-amber-700 border-amber-700 bg-amber-50",
      tierMin: 0,
      tierMax: 200,
    };
  }, [xp]);

  // Detect badge upgrades — queue if player is mid-dialogue
  const BADGE_ORDER = ["Bronze", "Silver", "Gold", "Platinum", "Diamond", "Master", "Legendary"];
  useEffect(() => {
    const prev = prevBadgeRef.current;
    if (prev !== null && prev !== badgeName) {
      const prevRank = BADGE_ORDER.indexOf(prev);
      const newRank = BADGE_ORDER.indexOf(badgeName);
      if (newRank > prevRank) {
        if (isPlayerLocked(mission.id, mission.stage)) {
          // Player is in dialogue — hold the animation until they're free
          pendingBadgeRef.current = badgeName;
        } else {
          setUpgradedBadge(badgeName);
        }
      }
    }
    prevBadgeRef.current = badgeName;
  }, [badgeName]); // eslint-disable-line react-hooks/exhaustive-deps

  // Flush queued badge animation when player regains control
  useEffect(() => {
    if (!mission) return;
    if (isPlayerLocked(mission.id, mission.stage)) return;
    if (!pendingBadgeRef.current) return;
    setUpgradedBadge(pendingBadgeRef.current);
    pendingBadgeRef.current = null;
  }, [mission?.stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const tierXP = xp - tierMin;
  const tierRange = tierMax - tierMin;
  const tierProgress = Math.min((tierXP / tierRange) * 100, 100);

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
          shooterPlays: shooterPlays,
          shooterHighscoreCount: shooterHighscoreCount,
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
            className="h-28 w-auto drop-shadow-[4px_4px_0_#4338ca]"
          />
        </div>

        {/* Save Toast */}
        <SaveToast status={saveStatus} />

        {/* Top Right - Icon Menu */}
        <div className="absolute top-6 right-6 flex flex-col gap-3">
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
          className="absolute bottom-6 left-6 flex items-center gap-3 bg-white p-3 border-4 border-indigo-900 rounded-xl shadow-[3px_3px_0_0_#4338ca] pointer-events-auto cursor-pointer hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:shadow-none"
        >
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full border-4 ${badgeColor.split(" ")[1]} ${badgeColor.split(" ")[2]}`}
          >
            <Award className={`w-7 h-7 ${badgeColor.split(" ")[0]}`} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-sm text-indigo-900 uppercase">
              {badgeName} Defender
            </span>
            <div className="w-36 h-3 bg-gray-200 rounded-full border-2 border-indigo-900 mt-1 relative overflow-hidden">
              <div
                className="h-full bg-yellow-400 absolute left-0 top-0 transition-all duration-1000 ease-out"
                style={{ width: `${tierProgress}%` }}
              ></div>
            </div>
            <span className="text-xs text-indigo-700 font-bold mt-1 tracking-wide">
              {tierXP} / {tierRange} XP
            </span>
          </div>
        </div>
      </div>

      {upgradedBadge && (
        <BadgeUpgradeAnimation
          badgeName={upgradedBadge}
          onDone={() => setUpgradedBadge(null)}
        />
      )}

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
