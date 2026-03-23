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
  const ringRef = useRef();
  const pillarRef = useRef();
  const glowRef = useRef();
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;

    if (ringRef.current) {
      const s = 1 + Math.sin(t.current * 2) * 0.12;
      ringRef.current.scale.set(s, 1, s);
    }

    if (pillarRef.current) {
      pillarRef.current.material.opacity = 0.4 + Math.sin(t.current * 3) * 0.25;
    }

    if (glowRef.current) {
      glowRef.current.rotation.y += delta * 1.5;
    }
  });

  // Kid-friendly bright orange/yellow instead of old dark red
  const color = active ? "#FFD700" : "#FF8C00";
  const emissive = active ? "#FFAA00" : "#FF6600";

  return (
    <group position={MARKER_POSITION}>
      {/* Vertical light beam */}
      <mesh ref={pillarRef} position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 5, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </mesh>

      {/* Main cylinder marker */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 1.2, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={2}
        />
      </mesh>

      {/* Pulsing ring on ground */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      >
        <ringGeometry args={[0.6, 0.85, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Rotating diamond icon */}
      <mesh ref={glowRef} position={[0, 1.4, 0]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={3}
        />
      </mesh>

      {/* Point light for glow effect */}
      <pointLight
        position={[0, 1, 0]}
        color={color}
        intensity={active ? 4 : 1.5}
        distance={5}
      />
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
