import { createContext, useContext, useState } from "react";

const MissionContext = createContext();

/**
 * Mission Stage Flow:
 *
 * TALK_TO_MANAGER         — player walks up to NPC
 *   ↓ (trigger)
 * TALKING_TO_MANAGER      — Scene 1 dialogue open (NPC convo + choice)
 *   ↓ (dialogue ends)
 * GO_TO_WORKSPACE         — mission marker visible, player goes to desk
 *   ↓ (workspace trigger)
 * FILL_FORM               — laptop camera + form popup active
 *   ↓ (form submit/cancel)
 * RETURN_TO_MANAGER       — player walks back to NPC
 *   ↓ (trigger)
 * DEBRIEFING              — Scene 2 dialogue (pass/fail + lecture)
 *   ↓ (dialogue ends)
 * COMPLETED               — task done
 */
export function MissionProvider({ children }) {
  const [mission, setMission] = useState({
    id: "TASK_1_PERSONAL_DATA",
    stage: "TALK_TO_MANAGER",
    result: null, // "PASS" | "FAIL" | "CANCELLED"
    unsafeFields: [], // fields that were filled with sensitive data
  });

  return (
    <MissionContext.Provider value={{ mission, setMission }}>
      {children}
    </MissionContext.Provider>
  );
}

export const useMission = () => useContext(MissionContext);
