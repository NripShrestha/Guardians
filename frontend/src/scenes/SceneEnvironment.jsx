import { useBrightness } from "./utils/BrightnessContext";
import PositionalAudio from "./utils/PositionalAudio";

export default function SceneEnvironment() {
  const { brightness } = useBrightness();

  const ambientIntensity = (brightness / 50) * 1.6;
  const directionalIntensity = (brightness / 50) * 1;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={directionalIntensity}
      />

      {/* Ambient Office Audio */}
      <PositionalAudio
        url="/audios/office-audio.mp3"
        position={[-10.69, 2.03, 4.94]}
        refDistance={5}
        maxDistance={10}
        rolloffFactor={1}
        loop
        autoplay
      />
    </>
  );
}
