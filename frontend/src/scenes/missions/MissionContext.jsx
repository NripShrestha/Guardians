import { createContext, useContext, useState } from "react";

const MissionContext = createContext();

export function MissionProvider({ children }) {
  const [mission, setMission] = useState({
    id: "TASK_1_PERSONAL_DATA",
    stage: "TALK_TO_MANAGER",
    result: null, // "PASS" | "FAIL"
  });

  return (
    <MissionContext.Provider value={{ mission, setMission }}>
      {children}
    </MissionContext.Provider>
  );
}

export const useMission = () => useContext(MissionContext);
