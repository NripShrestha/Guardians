import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import Scene from "./scenes/scene";
import { Physics } from "@react-three/rapier";
import LoadingScreen from "./scenes/gameUI/LoadScreen";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {!loaded && <LoadingScreen onFinish={() => setLoaded(true)} />}

      <Canvas shadows camera={{ fov: 50 }}>
        <Suspense fallback={null}>
          <Physics>
            <Scene />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}
