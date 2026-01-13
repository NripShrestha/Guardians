import { createContext, useContext, useState } from "react";

const BrightnessContext = createContext();

export function BrightnessProvider({ children }) {
  const [brightness, setBrightness] = useState(50); // 50% default

  return (
    <BrightnessContext.Provider value={{ brightness, setBrightness }}>
      {children}
    </BrightnessContext.Provider>
  );
}

export function useBrightness() {
  const context = useContext(BrightnessContext);
  if (!context) {
    throw new Error("useBrightness must be used within BrightnessProvider");
  }
  return context;
}
