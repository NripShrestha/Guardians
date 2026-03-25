import { useState, useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * CyberShooterTrigger
 *
 * Places a glowing mission marker in the 3D world at position
 * x: -14.123, y: 0.028, z: 6.871
 *
 * When the player enters the proximity sensor, onTrigger() fires.
 * The game can be re-triggered ANY TIME — no stage gating.
 */

const TRIGGER_POSITION = [-14.123, 0.028, 6.871];
const MARKER_POSITION = [-14.123, 0.5, 6.871];
const TRIGGER_SIZE = [2.5, 3, 2.5];

function PulsingMarker({ active }) {
  const cylinderRef = useRef();
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    if (cylinderRef.current) {
      // Spinning marker
      cylinderRef.current.rotation.y += delta * 2;
      // Slight vertical bobbing
      cylinderRef.current.position.y = Math.sin(t.current * 3) * 0.1;
    }
  });

  // GTA V style bright yellow mission marker
  const color = active ? "#FFFFFF" : "#FFD700";
  const emissive = active ? "#FFFFFF" : "#FFB300";

  return (
    <group position={MARKER_POSITION}>
      {/* Spinning open cylinder (The core GTA marker shape) */}
      <mesh ref={cylinderRef}>
        <cylinderGeometry args={[0.6, 0.6, 1.2, 32, 1, true]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={2}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner subtle glow cylinder for that hazy neon look */}
      {/* <mesh position={[0, 0, 0]} scale={0.95}>
        <cylinderGeometry args={[0.6, 0.6, 0.6, 32, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh> */}

     
    </group>
  );
}

export default function CyberShooterTrigger({ onTrigger }) {
  const [justTriggered, setJustTriggered] = useState(false);
  const cooldownRef = useRef(false);

  const handleIntersection = () => {
    if (cooldownRef.current) return;
    cooldownRef.current = true;
    setJustTriggered(true);

    onTrigger();

    setTimeout(() => {
      cooldownRef.current = false;
      setJustTriggered(false);
    }, 3000);
  };

  return (
    <>
      <PulsingMarker active={justTriggered} />

      <RigidBody
        type="fixed"
        sensor
        position={TRIGGER_POSITION}
        onIntersectionEnter={handleIntersection}
      >
        <mesh>
          <boxGeometry args={TRIGGER_SIZE} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </RigidBody>
    </>
  );
}
