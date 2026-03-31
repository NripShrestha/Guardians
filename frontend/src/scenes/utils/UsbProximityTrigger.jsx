import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useMission } from "../missions/MissionContext";

/**
 * USBProximityTrigger
 *
 * Invisible trigger zone placed at the USB position.
 * When the player character walks within TRIGGER_RADIUS units,
 * it fires the stage transition to TASK9_USB_FOUND and shows
 * the choice popup overlay.
 *
 * The choice popup itself is rendered as a React DOM overlay
 * (not in the 3D scene) to match the style of the rest of the UI.
 */

const USB_POSITION = [-6.5, 0.0, 3.99]; // must match Scene.jsx
const TRIGGER_RADIUS = 1.5;

export default function USBProximityTrigger() {
  const { mission, setMission } = useMission();
  const { scene } = useThree();
  const triggered = useRef(false);

  // Only active during TASK9 and before a choice is made
  const isActive =
    mission.id === "TASK_9_USB_BADUSB" &&
    mission.stage === "TASK9_FIND_USB" &&
    !triggered.current;

  useFrame(() => {
    if (!isActive) return;

    // Find the player character mesh by name convention
    const player =
      scene.getObjectByName("PlayerCharacter") ||
      scene.getObjectByName("CharacterController") ||
      scene.getObjectByName("timmy") ||
      scene.getObjectByName("girl");

    if (!player) return;

    const px = player.position.x - USB_POSITION[0];
    const pz = player.position.z - USB_POSITION[2];
    const dist = Math.sqrt(px * px + pz * pz);

    if (dist < TRIGGER_RADIUS) {
      triggered.current = true;
      // Transition to the locked choice stage — DialogueScene handles the popup
      setMission((prev) => ({ ...prev, stage: "TASK9_USB_FOUND" }));
    }
  });

  return null; // purely logical — no 3D geometry needed
}
