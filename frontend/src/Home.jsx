import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import Scene from "./scenes/scene";
import { Physics } from "@react-three/rapier";
import LoadingScreen from "./scenes/gameUI/LoadScreen";
import HUD from "./scenes/gameUI/HUD/Hud";
import { MissionProvider } from "./scenes/missions/MissionContext";
import MissionDebugger from "./scenes/missions/MissionDebugger";
import DialogueScene from "./scenes/gameUI/tasksUI/DialogueScene";
import FormPopup from "./scenes/gameUI/tasksUI/Form";
import DesktopSimulation from "./scenes/gameUI/tasksUI/DesktopSimulation";
import EmailClient from "./scenes/gameUI/tasksUI/EmailClient";
import PhoneMessenger from "./scenes/gameUI/tasksUI/PhoneMessenger";

// ── Task 5 new components ──
import LaptopLocked from "./scenes/gameUI/tasksUI/LaptopLocked";
import ITSupportMessenger from "./scenes/gameUI/tasksUI/ITSupportMessenger";
import MalvertisingClient from "./scenes/gameUI/tasksUI/MalvertisingClient";
import FakeModeratorClient from "./scenes/gameUI/tasksUI/FakeModerator";

// ── Cyber Shooter Minigame ──
import CyberShooterGame from "./scenes/gameUI/tasksUI/shooter/CyberShooterGame";

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [cyberShooterOpen, setCyberShooterOpen] = useState(false);
  const [cyberShooterHighScore, setCyberShooterHighScore] = useState(() =>
    parseInt(localStorage.getItem("cyberShooterHighScore") || "0"),
  );

  const handleCyberShooterScore = (score) => {
    if (score > cyberShooterHighScore) {
      setCyberShooterHighScore(score);
      localStorage.setItem("cyberShooterHighScore", score.toString());
    }
    // You can also POST score to your backend here:
    // fetch(`${API_BASE}/minigame-score`, { method: "POST", ... })
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {!loaded && <LoadingScreen onFinish={() => setLoaded(true)} />}

      <MissionProvider>
        <MissionDebugger />

        {/* 3D Canvas */}
        <Canvas shadows camera={{ fov: 50 }}>
          <Suspense fallback={null}>
            <Physics>
              {/*
                Pass onOpenCyberShooter so the trigger inside Scene
                can open the minigame overlay
              */}
              <Scene onOpenCyberShooter={() => setCyberShooterOpen(true)} />
            </Physics>
          </Suspense>
        </Canvas>

        {/* 2D UI Overlays */}
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

        {/* ── Cyber Shooter Minigame ── */}
        {cyberShooterOpen && (
          <CyberShooterGame
            onClose={() => setCyberShooterOpen(false)}
            onScoreSubmit={handleCyberShooterScore}
          />
        )}
      </MissionProvider>
    </div>
  );
}
