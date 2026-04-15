import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, Fragment } from "react";
import Scene from "./scenes/scene";
import { Physics } from "@react-three/rapier";
import LoadingScreen from "./scenes/gameUI/LoadScreen";
import HUD from "./scenes/gameUI/HUD/Hud";
import { MissionProvider, useMission } from "./scenes/missions/MissionContext";
import MissionDebugger from "./scenes/missions/MissionDebugger";
import DialogueScene from "./scenes/gameUI/tasksUI/DialogueScene";
import FormPopup from "./scenes/gameUI/tasksUI/Form";
import DesktopSimulation from "./scenes/gameUI/tasksUI/DesktopSimulation";
import EmailClient from "./scenes/gameUI/tasksUI/EmailClient";
import PhoneMessenger from "./scenes/gameUI/tasksUI/PhoneMessenger";
import LaptopLocked from "./scenes/gameUI/tasksUI/LaptopLocked";
import ITSupportMessenger from "./scenes/gameUI/tasksUI/ITSupportMessenger";
import MalvertisingClient from "./scenes/gameUI/tasksUI/MalvertisingClient";
import FakeModeratorClient from "./scenes/gameUI/tasksUI/FakeModerator";
import CyberShooterGame from "./scenes/gameUI/tasksUI/shooter/CyberShooterGame";
import CyberbullyingMessenger from "./scenes/gameUI/tasksUI/CyberBullyingmessenger";
import BadUSBDesktop from "./scenes/gameUI/tasksUI/BadUSBDesktop";
import FinalQuiz from "./scenes/gameUI/tasksUI/FinalQuiz";
import GoodbyePrompt from "./scenes/gameUI/tasksUI/GoodbyePrompt";
import CreditsRoll from "./scenes/gameUI/tasksUI/CreditsRoll";
import TutorialOverlay from "./scenes/gameUI/TutorialOverlay";

// ── Inner component — must be inside MissionProvider to use useMission ──
function AppContent() {
  const [cyberShooterOpen, setCyberShooterOpen] = useState(false);
  const { savedHighScore, setSavedHighScore, setShooterPlays, setShooterHighscoreCount } = useMission();

  const [uiKey, setUiKey] = useState(0);

  useEffect(() => {
    const handleReset = () => setUiKey((prev) => prev + 1);
    window.addEventListener("reset-game-ui", handleReset);
    return () => window.removeEventListener("reset-game-ui", handleReset);
  }, []);

  return (
    <>
      {/* <MissionDebugger /> */}
      <Canvas shadows camera={{ fov: 50 }}>
        <Suspense fallback={null}>
          <Physics>
            <Scene onOpenCyberShooter={() => setCyberShooterOpen(true)} />
          </Physics>
        </Suspense>
      </Canvas>
      <Fragment key={uiKey}>
        <DialogueScene />
        <DesktopSimulation />
        <FormPopup />
        <EmailClient />
        <PhoneMessenger />
        <LaptopLocked />
        <ITSupportMessenger />
        <MalvertisingClient />
        <FakeModeratorClient />
        <CyberbullyingMessenger />
        <BadUSBDesktop />
        <FinalQuiz />
        <GoodbyePrompt />
        <CreditsRoll />
        <TutorialOverlay />
      </Fragment>
      <HUD />
      {cyberShooterOpen && (
        <CyberShooterGame
          onClose={() => {
            setCyberShooterOpen(false);
            setShooterPlays((prev) => prev + 1);
          }}
          initialHighScore={savedHighScore}
          onScoreSubmit={(score) => {
            if (score > savedHighScore) {
              setSavedHighScore(score);
              setShooterHighscoreCount((prev) => prev + 1);
            }
          }}
        />
      )}
    </>
  );
}

// ── Outer component — provides context, then renders AppContent inside it ──
export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {!loaded && <LoadingScreen onFinish={() => setLoaded(true)} />}

      <MissionProvider>
        <AppContent />
      </MissionProvider>
    </div>
  );
}
