import { createContext, useContext, useState } from "react";

const VolumeContext = createContext();

export function VolumeProvider({ children }) {
  const [volume, setVolume] = useState(50); // Default volume 50%
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(50);

  const toggleMute = () => {
    if (isMuted || volume === 0) {
      setIsMuted(false);
      setVolume(prevVolume > 0 ? prevVolume : 50);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  };

  const handleSetVolume = (val) => {
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
    if (val === 0 && !isMuted) {
      setIsMuted(true);
    }
    setVolume(val);
  };

  return (
    <VolumeContext.Provider value={{ volume, setVolume: handleSetVolume, isMuted, toggleMute }}>
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
