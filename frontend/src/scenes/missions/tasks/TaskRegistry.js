/**
 * Task Registry with Stage Instructions
 *
 * Enhanced version that includes user-friendly instructions for each stage
 */

export const TASK_REGISTRY = {
  TASK_1_PERSONAL_DATA: {
    id: "TASK_1_PERSONAL_DATA",
    name: "Personal Data Protection",

    stages: [
      "TALK_TO_MANAGER",
      "TALKING_TO_MANAGER",
      "GO_TO_WORKSPACE",
      "FILL_FORM",
      "RETURN_TO_MANAGER",
      "DEBRIEFING",
      "COMPLETED",
    ],

    lockedStages: ["TALKING_TO_MANAGER", "FILL_FORM", "DEBRIEFING"],

    // 🆕 User-friendly instructions for each stage
    stageInstructions: {
      TALK_TO_MANAGER: "Go talk to your manager to receive your task briefing",
      TALKING_TO_MANAGER: "Listen carefully to your manager's briefing",
      GO_TO_WORKSPACE:
        "Go to your workspace and complete the form (follow the yellow marker)",
      FILL_FORM:
        "Fill out the form carefully - avoid sharing sensitive information",
      RETURN_TO_MANAGER: "Return to your manager to report your findings",
      DEBRIEFING: "Receiving feedback on your performance",
      COMPLETED: "Well done! Ready for the next challenge?",
    },

    triggers: [
      {
        type: "npc",
        position: [-7.18, 0.03, 9.17],
        size: [1, 2, 2.3],
        stages: {
          TALK_TO_MANAGER: "TALKING_TO_MANAGER",
          RETURN_TO_MANAGER: "DEBRIEFING",
        },
      },
      {
        type: "workspace",
        position: [-5.35, 0.03, 1.99],
        size: [2, 2, 2],
        stages: {
          GO_TO_WORKSPACE: "FILL_FORM",
        },
      },
    ],

    markers: [
      {
        type: "objective",
        position: [-5.35, 0.03, 1.99],
        visibleInStages: ["GO_TO_WORKSPACE"],
        color: "yellow",
      },
    ],

    cameras: {
      FILL_FORM: {
        position: [-5.35, 1.44, 1.45],
        lookAt: [-18, 1.2, 7.4],
      },
      TALKING_TO_MANAGER: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
      DEBRIEFING: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
    },
  },

  TASK_2_EMAIL_SECURITY: {
    id: "TASK_2_EMAIL_SECURITY",
    name: "Email Security Training",

    stages: [
      "TALK_TO_MANAGER",
      "TALKING_TO_MANAGER",
      "GO_TO_EMAIL_STATION",
      "CHECK_EMAILS",
      "RETURN_TO_MANAGER",
      "DEBRIEFING",
      "COMPLETED",
    ],

    lockedStages: ["TALKING_TO_MANAGER", "CHECK_EMAILS", "DEBRIEFING"],

    stageInstructions: {
      TALK_TO_MANAGER: "Go talk to your manager to receive your task briefing",
      TALKING_TO_MANAGER: "Listen carefully to your manager's briefing",
      GO_TO_EMAIL_STATION:
        "Go to the email station and review suspicious emails (follow the cyan marker)",
      CHECK_EMAILS:
        "Review the emails and identify which ones are phishing attempts",
      RETURN_TO_MANAGER: "Return to your manager to report your findings",
      DEBRIEFING: "Receiving feedback on your performance",
      COMPLETED: "Well done! Ready for the next challenge?",
    },

    triggers: [
      {
        type: "npc",
        position: [-7.18, 0.03, 9.17],
        size: [1, 2, 2.3],
        stages: {
          TALK_TO_MANAGER: "TALKING_TO_MANAGER",
          RETURN_TO_MANAGER: "DEBRIEFING",
        },
      },
      {
        type: "email_station",
        position: [-8, 0.03, 2],
        size: [2, 2, 2],
        stages: {
          GO_TO_EMAIL_STATION: "CHECK_EMAILS",
        },
      },
    ],

    markers: [
      {
        type: "objective",
        position: [-8, 0.03, 2],
        visibleInStages: ["GO_TO_EMAIL_STATION"],
        color: "cyan",
      },
    ],

    cameras: {
      CHECK_EMAILS: {
        position: [-8, 1.5, 2],
        lookAt: [-20, 1.2, 5],
      },
      TALKING_TO_MANAGER: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
      DEBRIEFING: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
    },
  },
};

// Helper to get current task config
export function getCurrentTaskConfig(missionId) {
  return TASK_REGISTRY[missionId];
}

// Helper to check if stage locks player
export function isPlayerLocked(missionId, stage) {
  const config = TASK_REGISTRY[missionId];
  return config?.lockedStages.includes(stage) ?? false;
}

// Helper to get camera config for current stage
export function getCameraConfig(missionId, stage) {
  const config = TASK_REGISTRY[missionId];
  return config?.cameras[stage];
}

// 🆕 Helper to get instruction for current stage
export function getStageInstruction(missionId, stage) {
  const config = TASK_REGISTRY[missionId];
  return config?.stageInstructions[stage] || "Complete your current objective";
}
