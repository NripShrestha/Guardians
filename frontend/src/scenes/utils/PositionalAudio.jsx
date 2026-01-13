import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useVolume } from "./VolumeContext"; // Add this import

export default function PositionalAudio({
  url = "/audios/office-audio.mp3",
  position = [-10.69, 2.03, 4.94],
  refDistance = 5,
  maxDistance = 30,
  rolloffFactor = 1,
  loop = true,
  autoplay = true,
}) {
  const { camera, scene } = useThree();
  const { volume } = useVolume(); // Add this hook
  const audioRef = useRef(null);
  const listenerRef = useRef(null);
  const soundRef = useRef(null);
  const audioContextRef = useRef(null);
  const hasStarted = useRef(false);

  // Update volume when slider changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setVolume(volume / 100); // Convert 0-100 to 0-1
    }
  }, [volume]);

  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);
    listenerRef.current = listener;
    audioContextRef.current = listener.context;

    const sound = new THREE.PositionalAudio(listener);
    soundRef.current = sound;

    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.add(sound);
    scene.add(mesh);
    audioRef.current = mesh;

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
      url,
      (buffer) => {
        sound.setBuffer(buffer);
        sound.setRefDistance(refDistance);
        sound.setMaxDistance(maxDistance);
        sound.setRolloffFactor(rolloffFactor);
        sound.setVolume(volume / 100); // Use context volume
        sound.setLoop(loop);
        console.log("✓ Audio loaded successfully");
      },
      (progress) => {
        console.log(
          `Loading audio: ${((progress.loaded / progress.total) * 100).toFixed(
            0
          )}%`
        );
      },
      (error) => {
        console.error("Error loading audio:", error);
      }
    );

    const startAudio = async () => {
      if (!soundRef.current || !audioContextRef.current || hasStarted.current)
        return;

      try {
        if (audioContextRef.current.state === "suspended") {
          await audioContextRef.current.resume();
        }

        if (soundRef.current.buffer && !soundRef.current.isPlaying) {
          soundRef.current.play();
          hasStarted.current = true;
        }
      } catch (error) {
        console.error("Error starting audio:", error);
      }
    };

    const handleInteraction = () => {
      if (autoplay) {
        startAudio();
      }
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("keydown", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);

      if (sound.isPlaying) {
        sound.stop();
      }
      if (sound.buffer) {
        sound.disconnect();
      }
      if (mesh) {
        scene.remove(mesh);
      }
      if (listener && camera.children.includes(listener)) {
        camera.remove(listener);
      }
      geometry.dispose();
      material.dispose();
    };
  }, [
    url,
    camera,
    scene,
    position,
    refDistance,
    maxDistance,
    rolloffFactor,
    loop,
    autoplay,
  ]);

  return null;
}
