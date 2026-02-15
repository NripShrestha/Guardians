import { PerspectiveCamera } from "@react-three/drei";

export default function LaptopCamera({ active, position, lookAt }) {
  if (!active) return null;

  return (
    <PerspectiveCamera
      makeDefault
      position={position}
      onUpdate={(cam) => {
        if (lookAt) cam.lookAt(lookAt[0], lookAt[1], lookAt[2]);
      }}
      fov={50}
    />
  );
}
