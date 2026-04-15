import { createContext, useContext, useState, useEffect } from "react";

const MissionContext = createContext();

const API_BASE = "http://localhost:3001";

// Stages that signal a task has been evaluated and feedback is being shown
const DEBRIEFING_STAGES = new Set([
  "DEBRIEFING",
  "TASK2_DEBRIEFING",
  "TASK3_DEBRIEFING",
  "TASK4_DEBRIEFING",
  "TASK5_DEBRIEFING",
  "TASK6_DEBRIEFING",
  "TASK7_DEBRIEFING",
  "TASK8_DEBRIEFING",
  "TASK9_DEBRIEFING_FAIL",
  "TASK9_DEBRIEFING_PASS",
]);

export function getAuthToken() {
  return localStorage.getItem("guardians_token");
}

export function MissionProvider({ children }) {
  const [mission, setMission] = useState(null);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Saved from DB — shared with Scene and CharacterSelection
  const [savedCharacter, setSavedCharacter] = useState(null); // "timmy" | "girl" | null
  const [savedPosition, setSavedPosition] = useState({ x: -2, y: 2.5, z: 3 });
  const [savedHighScore, setSavedHighScore] = useState(0);
  const [shooterPlays, setShooterPlays] = useState(0);
  const [shooterHighscoreCount, setShooterHighscoreCount] = useState(0);
  const [taskResults, setTaskResults] = useState([]);
  const [quizScore, setQuizScore] = useState(null);
  const [quizHighScore, setQuizHighScore] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizCompletedOnce, setQuizCompletedOnce] = useState(false);
  const [quizPerfectOnce, setQuizPerfectOnce] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

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
          setShooterPlays(data.progress.shooterPlays || 0);
          setShooterHighscoreCount(data.progress.shooterHighscoreCount || 0);
          setTaskResults(data.progress.taskResults || []);
          setQuizScore(data.progress.quizScore ?? null);
          setQuizHighScore(data.progress.quizHighScore ?? null);
          setQuizAnswers(data.progress.quizAnswers || []);
          setQuizCompletedOnce(data.progress.quizCompletedOnce || false);
          setQuizPerfectOnce(data.progress.quizPerfectOnce || false);
          setHasSeenTutorial(data.progress.hasSeenTutorial || false);
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

  // ── RECORD TASK RESULT WHEN DEBRIEFING STAGE IS REACHED ──────────────────
  // This fires whenever any task reaches its debriefing stage with a valid result.
  // Each task component only needs to set mission.result — recording is handled here.
  useEffect(() => {
    if (!mission) return;
    if (!DEBRIEFING_STAGES.has(mission.stage)) return;
    if (!mission.result || mission.result === "CANCELLED") return;

    setTaskResults((prev) => {
      const existing = prev.findIndex((r) => r.taskId === mission.id);

      const entry = {
        taskId: mission.id,
        result: mission.result,
        completedAt: new Date().toISOString(),
        // Task-specific detail fields (safe to include regardless of task type)
        unsafeFields: mission.unsafeFields ?? [],
        selectedUrl: mission.selectedUrl ?? null,
        emailActions: mission.emailActions ?? {},
        incorrectlyHandled: mission.incorrectlyHandled ?? [],
      };

      if (existing >= 0) {
        // Overwrite if the task was already recorded (e.g. player replayed)
        const updated = [...prev];
        updated[existing] = entry;
        return updated;
      }

      return [...prev, entry];
    });
  }, [mission?.stage, mission?.result]); // eslint-disable-line react-hooks/exhaustive-deps

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
        isTutorialOpen,
        setIsTutorialOpen,
        savedCharacter,
        setSavedCharacter,
        savedPosition,
        setSavedPosition,
        savedHighScore,
        setSavedHighScore,
        shooterPlays,
        setShooterPlays,
        shooterHighscoreCount,
        setShooterHighscoreCount,
        taskResults,
        setTaskResults,
        quizScore,
        setQuizScore,
        quizHighScore,
        setQuizHighScore,
        quizAnswers,
        setQuizAnswers,
        quizCompletedOnce,
        setQuizCompletedOnce,
        quizPerfectOnce,
        setQuizPerfectOnce,
        hasSeenTutorial,
        setHasSeenTutorial,
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
