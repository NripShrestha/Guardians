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

  // ─── TASK 8: CYBERBULLYING ─────────────────────────────────────────────────
  TASK_8_CYBERBULLYING: {
    id: "TASK_8_CYBERBULLYING",
    name: "Cyberbullying Awareness - Help a Friend",

    stages: [
      "TASK8_TALK_TO_MANAGER",
      "TASK8_TALKING_TO_MANAGER",
      "TASK8_WAITING_FOR_MESSAGE",
      "TASK8_PHONE_CHAT",
      "TASK8_RETURN_TO_MANAGER",
      "TASK8_DEBRIEFING",
      "TASK8_COMPLETED",
    ],

    lockedStages: ["TASK8_TALKING_TO_MANAGER", "TASK8_DEBRIEFING"],

    stageInstructions: {
      TASK8_TALK_TO_MANAGER: "Go talk to your manager for your next assignment",
      TASK8_TALKING_TO_MANAGER: "Listen carefully to your manager's briefing",
      TASK8_WAITING_FOR_MESSAGE:
        "Wait — your friend Mia is about to message you (check bottom-right)",
      TASK8_PHONE_CHAT:
        "Check your phone and help Mia handle the cyberbullying step by step",
      TASK8_RETURN_TO_MANAGER: "Return to your manager to report what happened",
      TASK8_DEBRIEFING: "Receiving feedback on how you helped your friend",
      TASK8_COMPLETED:
        "Outstanding! You know how to support someone being cyberbullied!",
    },

    triggers: [
      {
        type: "npc",
        position: [-7.18, 0.03, 9.17],
        size: [1, 2, 2.3],
        stages: {
          TASK8_TALK_TO_MANAGER: "TASK8_TALKING_TO_MANAGER",
          TASK8_RETURN_TO_MANAGER: "TASK8_DEBRIEFING",
        },
      },
    ],

    markers: [],

    cameras: {
      TASK8_TALKING_TO_MANAGER: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
      TASK8_DEBRIEFING: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
    },

    showPhoneInStages: ["TASK8_WAITING_FOR_MESSAGE", "TASK8_PHONE_CHAT"],
  },

  // ─── TASK 9: USB / BADUSB ATTACK ──────────────────────────────────────────
  TASK_9_USB_BADUSB: {
    id: "TASK_9_USB_BADUSB",
    name: "Physical Cyber Threats - The Unknown USB (BadUSB Attack)",

    stages: [
      // USB is found on the ground — proximity triggers the choice
      "TASK9_FIND_USB", // walking around looking for it
      "TASK9_USB_FOUND", // player walks near USB → prompt appears
      "TASK9_CHOICE_MADE", // player chose plug-in or report
      // PATH A — PLUG IN (FAIL)
      "TASK9_GO_TO_PC_FAIL", // walk to desk to plug in
      "TASK9_BADUSB_SIMULATION", // BadUSB Windows desktop simulation
      "TASK9_REPORT_INCIDENT", // walk back to NPC to report
      "TASK9_DEBRIEFING_FAIL", // NPC debrief — fail path
      // PATH B — REPORT (PASS)
      "TASK9_REPORT_TO_NPC", // walk to NPC immediately
      "TASK9_DEBRIEFING_PASS", // NPC debrief — pass path
      // Shared closing
      "TASK9_COMPLETED",
    ],

    // Lock player during dialogue and simulation screens
    lockedStages: [
      "TASK9_USB_FOUND",
      "TASK9_BADUSB_SIMULATION",
      "TASK9_DEBRIEFING_FAIL",
      "TASK9_DEBRIEFING_PASS",
    ],

    stageInstructions: {
      TASK9_FIND_USB: "Explore the office. Did someone drop a USB drive?",
      TASK9_USB_FOUND:
        "You found a USB drive on the ground — what will you do?",
      TASK9_CHOICE_MADE: "Acting on your decision...",
      TASK9_GO_TO_PC_FAIL:
        "Go to your workstation and plug in the USB (follow the white marker)",
      TASK9_BADUSB_SIMULATION:
        "Watching what happens after plugging in the USB...",
      TASK9_REPORT_INCIDENT:
        "Something went wrong! Go report to your manager immediately",
      TASK9_DEBRIEFING_FAIL: "Receiving feedback on your mistake",
      TASK9_REPORT_TO_NPC:
        "Good instinct! Go report the suspicious USB to your manager",
      TASK9_DEBRIEFING_PASS: "Receiving feedback on your great decision",
      TASK9_COMPLETED:
        "Well done! You understand the dangers of unknown physical devices!",
    },

    triggers: [
      // USB found trigger — physics-based to detect when player walks over the USB
      {
        type: "usb",
        position: [-6.5, 0.0, 3.99],
        size: [3, 3, 3],
        stages: {
          TASK9_FIND_USB: "TASK9_USB_FOUND",
        },
      },
      // NPC trigger — used for both report paths and incident reporting
      {
        type: "npc",
        position: [-7.18, 0.03, 9.17],
        size: [1, 2, 2.3],
        stages: {
          TASK9_REPORT_INCIDENT: "TASK9_DEBRIEFING_FAIL",
          TASK9_REPORT_TO_NPC: "TASK9_DEBRIEFING_PASS",
        },
      },
      // Workspace trigger — only for the FAIL path (go plug in USB)
      {
        type: "workspace",
        position: [-5.35, 0.03, 1.99],
        size: [2, 2, 2],
        stages: {
          TASK9_GO_TO_PC_FAIL: "TASK9_BADUSB_SIMULATION",
        },
      },
    ],

    markers: [
      // White marker pointing to workstation (fail path only)
      {
        type: "objective",
        position: [-5.35, 0.03, 1.99],
        visibleInStages: ["TASK9_GO_TO_PC_FAIL"],
        color: "white",
      },
    ],

    cameras: {
      TASK9_BADUSB_SIMULATION: {
        position: [-5.35, 1.44, 1.45],
        lookAt: [-18, 1.2, 7.4],
      },
      TASK9_DEBRIEFING_FAIL: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
      TASK9_DEBRIEFING_PASS: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
    },
  },

  // ─── TASK 10: FINAL QUIZ ─────────────────────────────────────────────────
  TASK_10_FINAL_QUIZ: {
    id: "TASK_10_FINAL_QUIZ",
    name: "Final Assessment — Cybersecurity Quiz",

    stages: [
      "TASK10_TALK_TO_MANAGER",
      "TASK10_TALKING_TO_MANAGER",
      "TASK10_QUIZ",
      "TASK10_COMPLETED",
    ],

    lockedStages: ["TASK10_TALKING_TO_MANAGER", "TASK10_QUIZ"],

    stageInstructions: {
      TASK10_TALK_TO_MANAGER:
        "All tasks complete! Go to your manager for your final assessment",
      TASK10_TALKING_TO_MANAGER: "Listen to your manager",
      TASK10_QUIZ: "Complete the cybersecurity quiz",
      TASK10_COMPLETED:
        "Quiz complete! When you're ready to go home, visit your manager to say goodbye.",
    },

    triggers: [
      {
        type: "npc",
        position: [-7.18, 0.03, 9.17],
        size: [1, 2, 2.3],
        stages: {
          TASK10_TALK_TO_MANAGER: "TASK10_TALKING_TO_MANAGER",
        },
      },
    ],

    markers: [],

    cameras: {
      TASK10_TALKING_TO_MANAGER: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
    },
  },

  // ─── TASK 11: OUTRO / GOODBYE ──────────────────────────────────────────────
  TASK_11_OUTRO: {
    id: "TASK_11_OUTRO",
    name: "Farewell — Say Your Goodbyes",

    stages: [
      "TASK11_GO_TO_MANAGER",
      "TASK11_GOODBYE_PROMPT",
      "TASK11_GOODBYE_DIALOGUE",
      "TASK11_CREDITS",
    ],

    lockedStages: [
      "TASK11_GOODBYE_PROMPT",
      "TASK11_GOODBYE_DIALOGUE",
      "TASK11_CREDITS",
    ],

    stageInstructions: {
      TASK11_GO_TO_MANAGER:
        "Ready to go home? Go to your manager and say your goodbyes.",
      TASK11_GOODBYE_PROMPT: "Make your decision…",
      TASK11_GOODBYE_DIALOGUE: "Saying your goodbyes…",
      TASK11_CREDITS: "Thank you for playing!",
    },

    triggers: [
      {
        type: "npc",
        position: [-7.18, 0.03, 9.17],
        size: [1, 2, 2.3],
        stages: {
          TASK11_GO_TO_MANAGER: "TASK11_GOODBYE_PROMPT",
        },
      },
    ],

    markers: [],

    cameras: {
      TASK11_GOODBYE_DIALOGUE: {
        position: [-7.25, 1.73, 7.7],
        lookAt: [-7, 1, 16],
      },
    },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCurrentTaskConfig(missionId) {
  return TASK_REGISTRY[missionId];
}

export function isPlayerLocked(missionId, stage) {
  const config = TASK_REGISTRY[missionId];
  return config?.lockedStages.includes(stage) ?? false;
}

export function getCameraConfig(missionId, stage) {
  const config = TASK_REGISTRY[missionId];
  return config?.cameras[stage];
}

export function getStageInstruction(missionId, stage) {
  const config = TASK_REGISTRY[missionId];
  return config?.stageInstructions[stage] || "Complete your current objective";
}

export function shouldShowPhone(missionId, stage) {
  const config = TASK_REGISTRY[missionId];
  return config?.showPhoneInStages?.includes(stage) ?? false;
}

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

export function shouldShowCyberbullyingMessenger(missionId, stage) {
  return (
    missionId === "TASK_8_CYBERBULLYING" &&
    ["TASK8_WAITING_FOR_MESSAGE", "TASK8_PHONE_CHAT"].includes(stage)
  );
}

export function shouldShowBadUSBSimulation(missionId, stage) {
  return (
    missionId === "TASK_9_USB_BADUSB" && stage === "TASK9_BADUSB_SIMULATION"
  );
}

// Returns true when the USB model should be visible on the floor
export function shouldShowUSBModel(missionId, stage) {
  if (missionId === "TASK_8_CYBERBULLYING" && stage === "TASK8_COMPLETED")
    return true;
  if (missionId === "TASK_9_USB_BADUSB") {
    // Keep it on the floor for the duration of the task, remove when completed
    return stage !== "TASK9_COMPLETED";
  }
  return false;
}

export function shouldShowQuiz(missionId, stage) {
  return missionId === "TASK_10_FINAL_QUIZ" && stage === "TASK10_QUIZ";
}

export function shouldShowGoodbyePrompt(missionId, stage) {
  return missionId === "TASK_11_OUTRO" && stage === "TASK11_GOODBYE_PROMPT";
}

export function shouldShowCredits(missionId, stage) {
  return missionId === "TASK_11_OUTRO" && stage === "TASK11_CREDITS";
}
