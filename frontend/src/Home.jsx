import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import Scene from "./scenes/scene";
import { Physics } from "@react-three/rapier";
import LoadingScreen from "./scenes/gameUI/LoadScreen";
import CharacterSelection from "./scenes/gameUI/CharacterSelect";
import HUD from "./scenes/gameUI/HUD/Hud";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {!loaded && <LoadingScreen onFinish={() => setLoaded(true)} />}
      {/* <CharacterSelection /> */}
      <Canvas shadows camera={{ fov: 50 }}>
        <Suspense fallback={null}>
          <Physics>
            <Scene />
          </Physics>
        </Suspense>
      </Canvas>
      <HUD />
    </div>
  );
}
