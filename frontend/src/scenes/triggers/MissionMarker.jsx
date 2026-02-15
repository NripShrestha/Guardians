export default function MissionMarker({ position, visible }) {
  if (!visible) return null;

  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.2, 0.2, 1]} />
      <meshStandardMaterial color="yellow" emissive="yellow" />
    </mesh>
  );
}
