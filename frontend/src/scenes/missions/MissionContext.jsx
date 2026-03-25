import { createContext, useContext, useState, useEffect } from "react";

const MissionContext = createContext();

const API_BASE = "http://localhost:3001";

export function getAuthToken() {
  return localStorage.getItem("guardians_token");
}

export function MissionProvider({ children }) {
  const [mission, setMission] = useState(null);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Saved from DB — shared with Scene and CharacterSelection
  const [savedCharacter, setSavedCharacter] = useState(null); // "timmy" | "girl" | null
  const [savedPosition, setSavedPosition] = useState({ x: -2, y: 2.5, z: 3 });
  const [savedHighScore, setSavedHighScore] = useState(0);

  // ── LOAD PROGRESS ON MOUNT ────────────────────────────────────────────────
  useEffect(() => {
    async function loadProgress() {
      const token = getAuthToken();

      if (!token) {
        setMission(defaultMission());
        setIsLoaded(true);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          setMission({
            id: data.progress.currentMissionId,
            stage: data.progress.currentStage,
            result: null,
            unsafeFields: [],
            selectedUrl: null,
            emailActions: {},
            incorrectlyHandled: [],
          });

          // Store character and position so Scene / CharacterSelection can use them
          setSavedCharacter(data.progress.characterType); // null if never chosen
          setSavedPosition(
            data.progress.playerPosition || { x: -2, y: 2.5, z: 3 },
          );
          setSavedHighScore(data.progress.shooterHighscore || 0);
        } else {
          setMission(defaultMission());
        }
      } catch (err) {
        console.error("Failed to load progress:", err);
        setMission(defaultMission());
      }

      setIsLoaded(true);
    }

    loadProgress();
  }, []);

  if (!isLoaded) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          gap: 12,
          zIndex: 9999,
        }}
      >
        <div style={{ fontSize: 36 }}>🛡️</div>
        <div style={{ fontSize: 18, fontWeight: "bold" }}>
          Loading your progress...
        </div>
      </div>
    );
  }

  return (
    <MissionContext.Provider
      value={{
        mission,
        setMission,
        isPhoneModalOpen,
        setIsPhoneModalOpen,
        savedCharacter,
        setSavedCharacter,
        savedPosition,
        setSavedPosition,
        savedHighScore,
        setSavedHighScore,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export const useMission = () => useContext(MissionContext);

function defaultMission() {
  return {
    id: "TASK_1_PERSONAL_DATA",
    stage: "TALK_TO_MANAGER",
    result: null,
    unsafeFields: [],
    selectedUrl: null,
    emailActions: {},
    incorrectlyHandled: [],
  };
}
