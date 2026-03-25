import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
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

// ── Inner component — must be inside MissionProvider to use useMission ──
function AppContent() {
  const [cyberShooterOpen, setCyberShooterOpen] = useState(false);
  const { savedHighScore, setSavedHighScore } = useMission(); // ← now valid

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

      <DialogueScene />
      <DesktopSimulation />
      <FormPopup />
      <EmailClient />
      <PhoneMessenger />
      <LaptopLocked />
      <ITSupportMessenger />
      <MalvertisingClient />
      <FakeModeratorClient />
      <HUD />

      {cyberShooterOpen && (
        <CyberShooterGame
          onClose={() => setCyberShooterOpen(false)}
          initialHighScore={savedHighScore}
          onScoreSubmit={(score) => {
            if (score > savedHighScore) setSavedHighScore(score);
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
