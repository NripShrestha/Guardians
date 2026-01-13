import { createContext, useContext, useState } from "react";

const VolumeContext = createContext();

export function VolumeProvider({ children }) {
  const [volume, setVolume] = useState(50); // Default volume 50%

  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
      {children}
    </VolumeContext.Provider>
  );
}

export function useVolume() {
  const context = useContext(VolumeContext);
  if (!context) {
    throw new Error("useVolume must be used within VolumeProvider");
  }
  return context;
}
