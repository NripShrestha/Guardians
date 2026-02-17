import { createContext, useContext, useState } from "react";

const MissionContext = createContext();

/**
 * Mission Stage Flow:
 *
 * ── TASK 1 ──────────────────────────────────────────────────────────────────
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
 *
 * ── TASK 2 ──────────────────────────────────────────────────────────────────
 * TASK2_TALK_TO_MANAGER → TASK2_TALKING_TO_MANAGER → TASK2_WAITING_FOR_MESSAGE
 *   → TASK2_PHONE_CHAT → TASK2_RETURN_TO_MANAGER → TASK2_DEBRIEFING → TASK2_COMPLETED
 *
 * ── TASK 3 ──────────────────────────────────────────────────────────────────
 * TASK3_TALK_TO_MANAGER → TASK3_TALKING_TO_MANAGER → TASK3_GO_TO_LAPTOP
 *   → TASK3_DESKTOP_SIMULATION → TASK3_RETURN_TO_MANAGER → TASK3_DEBRIEFING → TASK3_COMPLETED
 *
 * ── TASK 4 (Email Security) ──────────────────────────────────────────────────
 * TASK4_TALK_TO_MANAGER → TASK4_TALKING_TO_MANAGER → TASK4_GO_TO_LAPTOP
 *   → TASK4_DESKTOP_EMAIL → TASK4_RETURN_TO_MANAGER → TASK4_DEBRIEFING → TASK4_COMPLETED
 */
export function MissionProvider({ children }) {
  const [mission, setMission] = useState({
    id: "TASK_1_PERSONAL_DATA", //
    stage: "TALK_TO_MANAGER",
    result: null, // "PASS" | "FAIL" | "CANCELLED"
    unsafeFields: [], // fields that were filled with sensitive data (Task 1)
    selectedUrl: null, // url the user clicked (Task 3)
    emailActions: {}, // map of emailId → action taken (Task 4)
    incorrectlyHandled: [], // dangerous emails not correctly blocked/reported (Task 4)
  });

  // Phone modal state (for Task 2)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  return (
    <MissionContext.Provider
      value={{
        mission,
        setMission,
        isPhoneModalOpen,
        setIsPhoneModalOpen,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export const useMission = () => useContext(MissionContext);
