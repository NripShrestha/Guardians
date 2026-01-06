import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene from "./scenes/scene";
import { Physics } from "@react-three/rapier";


export default function Home() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        shadows
        camera={{ fov: 50 }} // Removed position - let ThirdPersonCamera handle it
        style={{ width: "100%", height: "100%" }}
      >
        <Physics>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Physics>
      </Canvas>
      
    </div>
  );
}
