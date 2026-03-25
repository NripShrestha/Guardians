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

  TASK_2_PHONE_SECURITY: {
    id: "TASK_2_PHONE_SECURITY",
    name: "Phone Security - Social Engineering Detection",

    stages: [
      "TASK2_TALK_TO_MANAGER",
      "TASK2_TALKING_TO_MANAGER",
      "TASK2_WAITING_FOR_MESSAGE",
      "TASK2_PHONE_CHAT",
      "TASK2_RETURN_TO_MANAGER",
      "TASK2_DEBRIEFING",
      "TASK2_COMPLETED",
    ],

    // Note: TASK2_PHONE_CHAT is NOT locked by default
    // The PhoneMessenger component handles locking when modal is open
    lockedStages: ["TASK2_TALKING_TO_MANAGER", "TASK2_DEBRIEFING"],

    stageInstructions: {
      TASK2_TALK_TO_MANAGER: "Go talk to your manager for your next assignment",
      TASK2_TALKING_TO_MANAGER: "Listen carefully to your manager's briefing",
      TASK2_WAITING_FOR_MESSAGE:
        "Wait for a message on your office phone (check bottom-right)",
      TASK2_PHONE_CHAT: "Check your phone and respond to messages carefully",
      TASK2_RETURN_TO_MANAGER: "Return to your manager to report what happened",
      TASK2_DEBRIEFING: "Receiving feedback on your performance",
      TASK2_COMPLETED: "Excellent work! You're becoming a security expert!",
    },

    triggers: [
      {
        type: "npc",
        position: [-7.18, 0.03, 9.17],
        size: [1, 2, 2.3],
        stages: {
          TASK2_TALK_TO_MANAGER: "TASK2_TALKING_TO_MANAGER",
          TASK2_RETURN_TO_MANAGER: "TASK2_DEBRIEFING",
        },
      },
    ],

    markers: [],

    cameras: {
      TASK2_TALKING_TO_MANAGER: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
      TASK2_DEBRIEFING: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
    },

    // New config for phone UI visibility
    showPhoneInStages: ["TASK2_WAITING_FOR_MESSAGE", "TASK2_PHONE_CHAT"],
  },

  TASK_3_URL_SECURITY: {
    id: "TASK_3_URL_SECURITY",
    name: "URL Security - HTTP vs HTTPS",

    stages: [
      "TASK3_TALK_TO_MANAGER",
      "TASK3_TALKING_TO_MANAGER",
      "TASK3_GO_TO_LAPTOP",
      "TASK3_DESKTOP_SIMULATION",
      "TASK3_RETURN_TO_MANAGER",
      "TASK3_DEBRIEFING",
      "TASK3_COMPLETED",
    ],

    lockedStages: [
      "TASK3_TALKING_TO_MANAGER",
      "TASK3_DESKTOP_SIMULATION",
      "TASK3_DEBRIEFING",
    ],

    stageInstructions: {
      TASK3_TALK_TO_MANAGER: "Go talk to your manager - they seem urgent",
      TASK3_TALKING_TO_MANAGER: "Listen carefully to your manager's request",
      TASK3_GO_TO_LAPTOP:
        "Go to your laptop and make the purchase (follow the green marker)",
      TASK3_DESKTOP_SIMULATION:
        "Search for 'blue toy car' and make the purchase carefully",
      TASK3_RETURN_TO_MANAGER: "Return to your manager to report completion",
      TASK3_DEBRIEFING: "Receiving feedback on your decision",
      TASK3_COMPLETED: "Outstanding! You're mastering cybersecurity!",
    },

    triggers: [
      {
        type: "npc",
        position: [-7.18, 0.03, 9.17],
        size: [1, 2, 2.3],
        stages: {
          TASK3_TALK_TO_MANAGER: "TASK3_TALKING_TO_MANAGER",
          TASK3_RETURN_TO_MANAGER: "TASK3_DEBRIEFING",
        },
      },
      {
        type: "workspace",
        position: [-5.35, 0.03, 1.99],
        size: [2, 2, 2],
        stages: {
          TASK3_GO_TO_LAPTOP: "TASK3_DESKTOP_SIMULATION",
        },
      },
    ],

    markers: [
      {
        type: "objective",
        position: [-5.35, 0.03, 1.99],
        visibleInStages: ["TASK3_GO_TO_LAPTOP"],
        color: "green",
      },
    ],

    cameras: {
      TASK3_DESKTOP_SIMULATION: {
        position: [-5.35, 1.44, 1.45],
        lookAt: [-18, 1.2, 7.4],
      },
      TASK3_TALKING_TO_MANAGER: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
      TASK3_DEBRIEFING: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
    },
  },

  // ─── TASK 4: EMAIL SECURITY ────────────────────────────────────────────────
  TASK_4_EMAIL_SECURITY: {
    id: "TASK_4_EMAIL_SECURITY",
    name: "Email Security - Phishing Detection",

    stages: [
      "TASK4_TALK_TO_MANAGER",
      "TASK4_TALKING_TO_MANAGER",
      "TASK4_GO_TO_LAPTOP",
      "TASK4_DESKTOP_EMAIL",
      "TASK4_RETURN_TO_MANAGER",
      "TASK4_DEBRIEFING",
      "TASK4_COMPLETED",
    ],

    lockedStages: [
      "TASK4_TALKING_TO_MANAGER",
      "TASK4_DESKTOP_EMAIL",
      "TASK4_DEBRIEFING",
    ],

    stageInstructions: {
      TASK4_TALK_TO_MANAGER: "Go talk to your manager for your next assignment",
      TASK4_TALKING_TO_MANAGER: "Listen carefully to your manager's briefing",
      TASK4_GO_TO_LAPTOP:
        "Go to your laptop and check the emails (follow the blue marker)",
      TASK4_DESKTOP_EMAIL:
        "Review each email carefully — report, block, delete, or approve",
      TASK4_RETURN_TO_MANAGER: "Return to your manager to report your findings",
      TASK4_DEBRIEFING: "Receiving feedback on your email handling",
      TASK4_COMPLETED: "Outstanding! You're a certified Digital Defender!",
    },

    triggers: [
      {
        type: "npc",
        position: [-7.18, 0.03, 9.17],
        size: [1, 2, 2.3],
        stages: {
          TASK4_TALK_TO_MANAGER: "TASK4_TALKING_TO_MANAGER",
          TASK4_RETURN_TO_MANAGER: "TASK4_DEBRIEFING",
        },
      },
      {
        type: "workspace",
        position: [-5.35, 0.03, 1.99],
        size: [2, 2, 2],
        stages: {
          TASK4_GO_TO_LAPTOP: "TASK4_DESKTOP_EMAIL",
        },
      },
    ],

    markers: [
      {
        type: "objective",
        position: [-5.35, 0.03, 1.99],
        visibleInStages: ["TASK4_GO_TO_LAPTOP"],
        color: "blue",
      },
    ],

    cameras: {
      TASK4_DESKTOP_EMAIL: {
        position: [-5.35, 1.44, 1.45],
        lookAt: [-18, 1.2, 7.4],
      },
      TASK4_TALKING_TO_MANAGER: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
      TASK4_DEBRIEFING: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
    },
  },
  TASK_5_PASSWORD_SECURITY: {
    id: "TASK_5_PASSWORD_SECURITY",
    name: "Password Security - Social Engineering via IT Support",

    stages: [
      "TASK5_TALK_TO_MANAGER",
      "TASK5_TALKING_TO_MANAGER",
      "TASK5_GO_TO_LAPTOP",
      "TASK5_LAPTOP_LOCKED",
      "TASK5_ASK_NPC_FOR_IT",
      "TASK5_ASKING_NPC_FOR_IT",
      "TASK5_PHONE_CHAT",
      "TASK5_RETURN_TO_MANAGER",
      "TASK5_DEBRIEFING",
      "TASK5_COMPLETED",
    ],

    lockedStages: [
      "TASK5_TALKING_TO_MANAGER",
      "TASK5_LAPTOP_LOCKED",
      "TASK5_ASKING_NPC_FOR_IT",
      "TASK5_DEBRIEFING",
    ],

    stageInstructions: {
      TASK5_TALK_TO_MANAGER: "Go talk to your manager for your next assignment",
      TASK5_TALKING_TO_MANAGER: "Listen carefully to your manager's briefing",
      TASK5_GO_TO_LAPTOP: "Go to your laptop (follow the purple marker)",
      TASK5_LAPTOP_LOCKED: "Your laptop is locked — read the screen carefully",
      TASK5_ASK_NPC_FOR_IT: "Return to your manager and ask for the IT contact",
      TASK5_ASKING_NPC_FOR_IT: "Listen to your manager's instructions",
      TASK5_PHONE_CHAT: "Open your phone and message IT Support",
      TASK5_RETURN_TO_MANAGER: "Return to your manager to report what happened",
      TASK5_DEBRIEFING: "Receiving feedback on your performance",
      TASK5_COMPLETED: "Outstanding! You're a true Digital Defender!",
    },

    triggers: [
      {
        type: "npc",
        position: [-7.18, 0.03, 9.17],
        size: [1, 2, 2.3],
        stages: {
          TASK5_TALK_TO_MANAGER: "TASK5_TALKING_TO_MANAGER",
          TASK5_ASK_NPC_FOR_IT: "TASK5_ASKING_NPC_FOR_IT",
          TASK5_RETURN_TO_MANAGER: "TASK5_DEBRIEFING",
        },
      },
      {
        type: "workspace",
        position: [-5.35, 0.03, 1.99],
        size: [2, 2, 2],
        stages: {
          TASK5_GO_TO_LAPTOP: "TASK5_LAPTOP_LOCKED",
        },
      },
    ],

    markers: [
      {
        type: "objective",
        position: [-5.35, 0.03, 1.99],
        visibleInStages: ["TASK5_GO_TO_LAPTOP"],
        color: "purple",
      },
    ],

    cameras: {
      TASK5_LAPTOP_LOCKED: {
        position: [-5.35, 1.44, 1.45],
        lookAt: [-18, 1.2, 7.4],
      },
      TASK5_TALKING_TO_MANAGER: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
      TASK5_ASKING_NPC_FOR_IT: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
      TASK5_DEBRIEFING: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
    },

    showPhoneInStages: ["TASK5_PHONE_CHAT"],
  },
  TASK_6_MALVERTISING: {
    id: "TASK_6_MALVERTISING",
    name: "Malvertising Awareness - Spot the Malicious Ads",

    stages: [
      "TASK6_TALK_TO_MANAGER",
      "TASK6_TALKING_TO_MANAGER",
      "TASK6_GO_TO_LAPTOP",
      "TASK6_DESKTOP_BROWSER",
      "TASK6_RETURN_TO_MANAGER",
      "TASK6_DEBRIEFING",
      "TASK6_COMPLETED",
    ],

    lockedStages: [
      "TASK6_TALKING_TO_MANAGER",
      "TASK6_DESKTOP_BROWSER",
      "TASK6_DEBRIEFING",
    ],

    stageInstructions: {
      TASK6_TALK_TO_MANAGER: "Go talk to your manager for your next assignment",
      TASK6_TALKING_TO_MANAGER: "Listen carefully to your manager's briefing",
      TASK6_GO_TO_LAPTOP:
        "Go to your laptop and open the link (follow the orange marker)",
      TASK6_DESKTOP_BROWSER:
        "Open the link in your email and spot all the malicious advertisements",
      TASK6_RETURN_TO_MANAGER: "Return to your manager to report your findings",
      TASK6_DEBRIEFING: "Receiving feedback on your performance",
      TASK6_COMPLETED: "Outstanding! You're a true Digital Defender!",
    },

    triggers: [
      {
        type: "npc",
        position: [-7.18, 0.03, 9.17],
        size: [1, 2, 2.3],
        stages: {
          TASK6_TALK_TO_MANAGER: "TASK6_TALKING_TO_MANAGER",
          TASK6_RETURN_TO_MANAGER: "TASK6_DEBRIEFING",
        },
      },
      {
        type: "workspace",
        position: [-5.35, 0.03, 1.99],
        size: [2, 2, 2],
        stages: {
          TASK6_GO_TO_LAPTOP: "TASK6_DESKTOP_BROWSER",
        },
      },
    ],

    markers: [
      {
        type: "objective",
        position: [-5.35, 0.03, 1.99],
        visibleInStages: ["TASK6_GO_TO_LAPTOP"],
        color: "orange",
      },
    ],

    cameras: {
      TASK6_DESKTOP_BROWSER: {
        position: [-5.35, 1.44, 1.45],
        lookAt: [-18, 1.2, 7.4],
      },
      TASK6_TALKING_TO_MANAGER: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
      TASK6_DEBRIEFING: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
    },
  },
  TASK_7_FAKE_MODERATOR: {
    id: "TASK_7_FAKE_MODERATOR",
    name: "Fake Game Moderator Scam - Authority Impersonation",

    stages: [
      "TASK7_TALK_TO_MANAGER",
      "TASK7_TALKING_TO_MANAGER",
      "TASK7_GO_TO_DESK",
      "TASK7_DESKTOP_EMAIL",
      "TASK7_RETURN_TO_MANAGER",
      "TASK7_DEBRIEFING",
      "TASK7_COMPLETED",
    ],

    lockedStages: [
      "TASK7_TALKING_TO_MANAGER",
      "TASK7_DESKTOP_EMAIL",
      "TASK7_DEBRIEFING",
    ],

    stageInstructions: {
      TASK7_TALK_TO_MANAGER: "Go talk to your manager for your next assignment",
      TASK7_TALKING_TO_MANAGER: "Listen carefully to your manager's briefing",
      TASK7_GO_TO_DESK:
        "Go to your desk and continue your work (follow the red marker)",
      TASK7_DESKTOP_EMAIL: "Check your inbox — handle any messages carefully",
      TASK7_RETURN_TO_MANAGER: "Return to your manager to report what happened",
      TASK7_DEBRIEFING: "Receiving feedback on your performance",
      TASK7_COMPLETED: "Outstanding! You're a true Digital Defender!",
    },

    triggers: [
      {
        type: "npc",
        position: [-7.18, 0.03, 9.17],
        size: [1, 2, 2.3],
        stages: {
          TASK7_TALK_TO_MANAGER: "TASK7_TALKING_TO_MANAGER",
          TASK7_RETURN_TO_MANAGER: "TASK7_DEBRIEFING",
        },
      },
      {
        type: "workspace",
        position: [-5.35, 0.03, 1.99],
        size: [2, 2, 2],
        stages: {
          TASK7_GO_TO_DESK: "TASK7_DESKTOP_EMAIL",
        },
      },
    ],

    markers: [
      {
        type: "objective",
        position: [-5.35, 0.03, 1.99],
        visibleInStages: ["TASK7_GO_TO_DESK"],
        color: "red",
      },
    ],

    cameras: {
      TASK7_DESKTOP_EMAIL: {
        position: [-5.35, 1.44, 1.45],
        lookAt: [-18, 1.2, 7.4],
      },
      TASK7_TALKING_TO_MANAGER: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
      TASK7_DEBRIEFING: {
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

// Helper to get instruction for current stage
export function getStageInstruction(missionId, stage) {
  const config = TASK_REGISTRY[missionId];
  return config?.stageInstructions[stage] || "Complete your current objective";
}

// Helper to check if phone should be visible
export function shouldShowPhone(missionId, stage) {
  const config = TASK_REGISTRY[missionId];
  return config?.showPhoneInStages?.includes(stage) ?? false;
}

// Helper to check if email client should be visible
export function shouldShowEmailClient(missionId, stage) {
  return (
    missionId === "TASK_4_EMAIL_SECURITY" && stage === "TASK4_DESKTOP_EMAIL"
  );
}
export function shouldShowMalvertisingClient(missionId, stage) {
  return (
    missionId === "TASK_6_MALVERTISING" && stage === "TASK6_DESKTOP_BROWSER"
  );
}
export function shouldShowFakeModeratorClient(missionId, stage) {
  return (
    missionId === "TASK_7_FAKE_MODERATOR" && stage === "TASK7_DESKTOP_EMAIL"
  );
}
