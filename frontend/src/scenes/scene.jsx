import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import Office from "./gameModels/office";
import CharacterController from "./gameModels/timmy";
import ThirdPersonCamera from "./utils/ThirdPersonCamera";
import GirlCharacterController from "./gameModels/girl";
import PositionalAudio from "./utils/PositionalAudio";// Import the new component
import { useEffect, useState } from "react";
import { useBrightness } from "./utils/BrightnessContext";

export default function Scene() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const { brightness } = useBrightness(); 

  const ambientIntensity = (brightness / 50) * 1.6;
  const directionalIntensity = (brightness / 50) * 1; 

  useEffect(() => {
    const character = sessionStorage.getItem("selectedCharacter");
    setSelectedCharacter(character || "timmy");
  }, []);

  return (
    <>
      <ThirdPersonCamera
        offset={{ x: 0, y: 2, z: -3 }}
        lookAtOffset={{ x: 0, y: 1, z: 0 }}
        smoothness={0.1}
      />

      {/* Positional 3D Audio */}
      <PositionalAudio
        url="/audios/office-audio.mp3"
        position={[-10.69, 2.03, 4.94]}
        refDistance={5}
        maxDistance={10}
        rolloffFactor={1}
        loop={true}
        autoplay={true}
      />

      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={directionalIntensity}
      />

      {selectedCharacter === "timmy" && (
        <CharacterController scale={1} position={[-2, 2.5, 3]} />
      )}
      {selectedCharacter === "girl" && (
        <GirlCharacterController scale={1} position={[-2, 2.5, 3]} />
      )}

      <Office scale={1.5} position={[0, 0, 0]} />
    </>
  );
}
