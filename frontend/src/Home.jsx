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

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {!loaded && <LoadingScreen onFinish={() => setLoaded(true)} />}

      <MissionProvider>
        <MissionDebugger />

        {/* 3D Canvas */}
        <Canvas shadows camera={{ fov: 50 }}>
          <Suspense fallback={null}>
            <Physics>
              <Scene />
            </Physics>
          </Suspense>
        </Canvas>

        {/* 2D UI Overlays (render on top of canvas) */}
        <DialogueScene />
        <DesktopSimulation />
        <FormPopup />
        <EmailClient />
        <HUD />
      </MissionProvider>
    </div>
  );
}
