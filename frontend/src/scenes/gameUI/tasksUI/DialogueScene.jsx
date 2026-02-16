import { useState, useEffect, useRef } from "react";
import { useMission } from "../../missions/MissionContext";

// ─── TASK 1 DIALOGUE DATA ────────────────────────────────────────────────────

const TASK1_SCENE_1_OPENING = [
  {
    speaker: "Manager",
    text: "Hey there, new recruit! Before you start your adventure, you need to fill out this quick form in your workspace.",
  },
  {
    speaker: "Manager",
    text: "Everything you do here is part of your training to become a Digital Hero!",
  },
];

const TASK1_SCENE_1_OPTIONS = [
  { id: "agree", label: "Okay, I'll go fill out the form!" },
  { id: "resist", label: "Do I have to? Forms are boring." },
  { id: "inquire", label: "What's this form for?" },
];

const TASK1_SCENE_1_RESPONSES = {
  agree: null,
  resist:
    "Haha, I know! But this one is super important. It's your first test!",
  inquire:
    "It's a standard Hero Registration. Be a super thinker and decide what info is safe to share online!",
};

const TASK1_LECTURE_LINES = [
  "Always remember: Never share your Secret Code, passwords, or personal secrets with anyone online!",
  "Real heroes and trusted grown-ups will never ask for secret codes in a message or email.",
  "If this secret info gets into the wrong hands, villains could:",
  "• Access your accounts and pretend to be you.",
  "• Take your digital coins or game items.",
  "• Use your name for sneaky scams.",
  "• Trick your friends and family.",
  "Protect your digital world! Always think before you click or share.",
];

// ─── TASK 2 DIALOGUE DATA ────────────────────────────────────────────────────

const TASK2_SCENE_1_OPENING = [
  {
    speaker: "Manager",
    text: "Good. You passed the initial assessment. That tells me you can follow instructions — but now we test judgment.",
  },
  {
    speaker: "Manager",
    text: "This is an office phone. You'll be responding to people who need help completing online forms.",
  },
  {
    speaker: "Manager",
    text: "Be helpful — but stay alert. Some questions aren't as innocent as they seem.",
  },
];

const TASK2_RESULT_LINES_PASS = [
  {
    speaker: "Manager",
    text: "Good instinct.",
  },
  {
    speaker: "Manager",
    text: "Attackers often ask for help with forms because it lowers suspicion.",
  },
  {
    speaker: "Manager",
    text: '"Just an email." "Just a code." Those words have caused more breaches than malware ever has.',
  },
];

const TASK2_RESULT_LINES_FAIL = [
  {
    speaker: "Manager",
    text: "You failed the test. You are very lucky that the messenger was just an employee testing your ability to detect a dangerous message.",
  },
  {
    speaker: "Manager",
    text: "You need to be very aware.",
  },
];

const TASK2_LECTURE_LINES = [
  {
    speaker: "Manager",
    text: "Verification codes are as sensitive as passwords.",
  },
  {
    speaker: "Manager",
    text: "Emails aren't harmless identifiers — they are keys.",
  },
  {
    speaker: "Manager",
    text: "If someone needs access to your contact information to complete their task — that task is already compromised.",
  },
];

// ─── TASK 3 DIALOGUE DATA ────────────────────────────────────────────────────

const TASK3_SCENE_1_OPENING = [
  {
    speaker: "Manager",
    text: "Hey—hey, I need your help right now.",
  },
  {
    speaker: "Manager",
    text: "I completely forgot today is my son's birthday.",
  },
  {
    speaker: "Manager",
    text: "He's been asking for a blue toy car for weeks.",
  },
  {
    speaker: "Manager",
    text: "Go to your laptop, search exactly 'blue toy car', and buy it for me.",
  },
  {
    speaker: "Manager",
    text: "Here—take my card details. You'll probably need them.",
  },
  {
    speaker: "Manager",
    text: "Please hurry. There's no time.",
  },
];

const TASK3_SCENE_1_OPTIONS = [
  { id: "agree", label: "Alright, I'll take care of it." },
  { id: "resist", label: "Shouldn't you do this yourself?" },
];

const TASK3_SCENE_1_RESPONSES = {
  agree: null,
  resist: "Normally yes—but I trust you. Don't overthink it.",
};

// ─── PASS PATH DIALOGUES ─────────────────────────────────────────────────────

const TASK3_PASS_RESULT_LINES = [
  {
    speaker: "Manager",
    text: "Good.",
  },
  {
    speaker: "Manager",
    text: "I just received the payment notification.",
  },
  {
    speaker: "Manager",
    text: "You chose the secure option.",
  },
];

const TASK3_PASS_USER_OPTIONS = [
  {
    id: "knew",
    label:
      "I know, I saw the other link started with http. I know it's dangerous but I don't know why",
  },
  {
    id: "lucky",
    label: "There were options? How was I correct?",
  },
];

const TASK3_PASS_EXPLANATION = [
  {
    speaker: "Manager",
    text: "You chose the link using HTTPS.",
  },
  {
    speaker: "Manager",
    text: "Websites using HTTPS encrypt your data.",
  },
  {
    speaker: "Manager",
    text: "Even if someone intercepts the connection, the information is unreadable.",
  },
  {
    speaker: "Manager",
    text: "This is how you protect payments, logins, and private data.",
  },
  {
    speaker: "Manager",
    text: "And yes—this was a test.",
  },
];

// ─── FAIL PATH DIALOGUES ──────────────────────────────────────────────────────

const TASK3_FAIL_INITIAL = [
  {
    speaker: "Manager",
    text: "That's strange…",
  },
  {
    speaker: "Manager",
    text: "I didn't receive any bank notification.",
  },
];

const TASK3_FAIL_USER_RESPONSE = {
  speaker: "You",
  text: "I used the http://amazon.com/blue-toy-car",
};

const TASK3_FAIL_REACTION = [
  {
    speaker: "Manager",
    text: "This wasn't secure.",
  },
  {
    speaker: "Manager",
    text: "Do you realize what can happen now?",
  },
];

const TASK3_FAIL_USER_OPTIONS = [
  {
    id: "mistake",
    label: "What did I do? Did I make a mistake?",
  },
];

const TASK3_FAIL_EXPLANATION = [
  {
    speaker: "Manager",
    text: "Yes you have made a big mistake.",
  },
  {
    speaker: "Manager",
    text: "Websites without HTTPS do not encrypt data.",
  },
  {
    speaker: "Manager",
    text: "That means anyone watching the network could see the card number.",
  },
  {
    speaker: "Manager",
    text: "Attackers could steal the money…",
  },
  {
    speaker: "Manager",
    text: "Clone the card…",
  },
  {
    speaker: "Manager",
    text: "Or use it for fraud without the owner even knowing.",
  },
  {
    speaker: "Manager",
    text: "One careless click can cost someone their entire savings.",
  },
];

const TASK3_FAIL_USER_APOLOGY_OPTIONS = [
  {
    id: "sorry1",
    label: "I am so sorry sir. I had no idea that such a threat existed.",
  },
  {
    id: "sorry2",
    label:
      "I am so sorry sir. I had no knowledge about the difference in HTTPS and HTTP. Please forgive me. This won't happen again.",
  },
];

const TASK3_FAIL_REVEAL = [
  {
    speaker: "Manager",
    text: "Relax.",
  },
  {
    speaker: "Manager",
    text: "This was a test.",
  },
  {
    speaker: "Manager",
    text: "But in the real world… there would be no rewind.",
  },
];

// ─── FINAL SHARED LECTURE ────────────────────────────────────────────────────

const TASK3_FINAL_LECTURE = [
  {
    speaker: "Manager",
    text: "Attackers rely on small details you overlook.",
  },
  {
    speaker: "Manager",
    text: "A missing 'S'.",
  },
  {
    speaker: "Manager",
    text: "A fake lock icon.",
  },
  {
    speaker: "Manager",
    text: "Or your willingness to rush.",
  },
  {
    speaker: "Manager",
    text: "Always check the URL.",
  },
  {
    speaker: "Manager",
    text: "Always look for HTTPS.",
  },
  {
    speaker: "Manager",
    text: "And never assume a site is safe just because it looks familiar.",
  },
];

const TASK3_FINAL_OPTIONS = [
  {
    id: "promise",
    label: "I'll always check URLs from now on.",
  },
  {
    id: "learned",
    label: "I didn't realize one letter mattered so much.",
  },
];

const TASK3_FINAL_RESPONSES = {
  promise: "Good. That habit will save you one day.",
  learned: "In cybersecurity, details are everything.",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useTypewriter(text, speed = 30, active = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!active || !text) {
      if (text === "") setDone(true);
      return;
    }
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    ref.current = timer;
    return () => clearInterval(ref.current);
  }, [text, active, speed]);

  const skip = () => {
    clearInterval(ref.current);
    setDisplayed(text);
    setDone(true);
  };

  return { displayed, done, skip };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ label, pass }) {
  const borderColor =
    pass === true ? "#22c55e" : pass === false ? "#ef4444" : "#4338ca";

  return (
    <div
      className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0_0_#4338ca] border-4"
      style={{
        backgroundColor: "#fef3c7",
        borderColor: borderColor,
      }}
    >
      {label}
    </div>
  );
}

function DialogueBubble({ line, onAdvance }) {
  const { displayed, done, skip } = useTypewriter(line.text);

  return (
    <div
      onClick={done ? onAdvance : skip}
      className="cursor-pointer select-none bg-white p-4 rounded-2xl border-4 border-indigo-900"
    >
      <p className="text-sm font-black text-pink-500 mb-1 tracking-wider uppercase">
        {line.speaker}
      </p>
      <p
        className="text-lg font-bold leading-snug text-indigo-900"
        style={{ minHeight: "3.5rem" }}
      >
        {displayed}
        {!done && (
          <span className="inline-block w-1 h-5 ml-1 align-middle bg-pink-500 animate-pulse" />
        )}
      </p>
      {done && (
        <p className="text-right text-xs font-bold mt-2 text-gray-400">
          Click to continue...
        </p>
      )}
    </div>
  );
}

function ChoiceMenu({ options, onSelect }) {
  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-black text-indigo-900 mb-2 uppercase tracking-wide">
        Your Turn!
      </p>
      {options.map((opt, i) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className="w-full text-left px-5 py-3 rounded-2xl text-base font-bold text-white border-b-8 transition-all transform active:translate-y-1 active:border-b-4 bg-pink-500 border-pink-800 hover:bg-pink-600"
        >
          <span className="mr-2 opacity-80">{i + 1}.</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── TASK 1 SCENES ────────────────────────────────────────────────────────────

function Task1Scene1({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState("opening");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOpeningAdvance = () => {
    if (lineIndex < TASK1_SCENE_1_OPENING.length - 1) {
      setLineIndex((i) => i + 1);
    } else {
      setPhase("choice");
    }
  };

  const handleChoice = (id) => {
    setSelectedOption(id);
    if (TASK1_SCENE_1_RESPONSES[id]) {
      setPhase("response");
    } else {
      onComplete();
    }
  };

  const handleResponseAdvance = () => {
    onComplete();
  };

  const currentLine =
    phase === "opening"
      ? TASK1_SCENE_1_OPENING[lineIndex]
      : phase === "response"
        ? {
            speaker: "Manager",
            text: TASK1_SCENE_1_RESPONSES[selectedOption],
          }
        : null;

  return (
    <div className="flex gap-4 items-start">
      <Avatar label="🧑🏻‍💼" />
      <div className="flex-1">
        {phase !== "choice" && currentLine ? (
          <DialogueBubble
            key={`${phase}-${lineIndex}`}
            line={currentLine}
            onAdvance={
              phase === "opening" ? handleOpeningAdvance : handleResponseAdvance
            }
          />
        ) : (
          <ChoiceMenu options={TASK1_SCENE_1_OPTIONS} onSelect={handleChoice} />
        )}
      </div>
    </div>
  );
}

function Task1Scene2({ result, unsafeFields, onComplete }) {
  const RESULT_LINES_PASS = [
    {
      speaker: "Manager",
      text: "Awesome! You completed the form and kept your important info super safe. Great job!",
    },
    {
      speaker: "Manager",
      text: "You passed the first test! You're on your way to being a Digital Hero!",
    },
  ];

  const RESULT_LINES_FAIL = [
    {
      speaker: "Manager",
      text: "Uh oh... It looks like you shared some secret information on the form.",
    },
    {
      speaker: "Manager",
      text: "Don't worry! This was just a test. Let's learn why it's important to be careful.",
    },
  ];

  const resultLines = result === "PASS" ? RESULT_LINES_PASS : RESULT_LINES_FAIL;
  const allLines = [
    ...resultLines,
    ...TASK1_LECTURE_LINES.map((text) => ({
      speaker: "Manager",
      text,
    })),
  ];
  const [lineIndex, setLineIndex] = useState(0);

  const handleAdvance = () => {
    if (lineIndex < allLines.length - 1) {
      setLineIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  const isLectureSection = lineIndex >= resultLines.length;
  const isLast = lineIndex === allLines.length - 1;

  return (
    <div className="space-y-4">
      {result === "FAIL" && !isLectureSection && unsafeFields?.length > 0 && (
        <div className="text-sm p-3 rounded-lg font-bold bg-red-100 border-2 border-red-300 text-red-700">
          <span className="font-black">Flagged Fields: </span>
          {unsafeFields.join(", ")}
        </div>
      )}

      <div className="flex gap-4 items-start">
        <Avatar
          label="🧑🏻‍💼"
          pass={!isLectureSection ? result === "PASS" : undefined}
        />
        <div className="flex-1">
          <DialogueBubble
            key={lineIndex}
            line={allLines[lineIndex]}
            onAdvance={handleAdvance}
          />
          {isLast && (
            <button
              onClick={handleAdvance}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              Finish Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TASK 2 SCENES ────────────────────────────────────────────────────────────

function Task2Scene1({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);

  const handleAdvance = () => {
    if (lineIndex < TASK2_SCENE_1_OPENING.length - 1) {
      setLineIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex gap-4 items-start">
      <Avatar label="🧑🏻‍💼" />
      <div className="flex-1">
        <DialogueBubble
          key={lineIndex}
          line={TASK2_SCENE_1_OPENING[lineIndex]}
          onAdvance={handleAdvance}
        />
      </div>
    </div>
  );
}

function Task2Scene2({ result, onComplete }) {
  const resultLines =
    result === "PASS" ? TASK2_RESULT_LINES_PASS : TASK2_RESULT_LINES_FAIL;
  const allLines = [...resultLines, ...TASK2_LECTURE_LINES];
  const [lineIndex, setLineIndex] = useState(0);

  const handleAdvance = () => {
    if (lineIndex < allLines.length - 1) {
      setLineIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  const isLectureSection = lineIndex >= resultLines.length;
  const isLast = lineIndex === allLines.length - 1;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <Avatar
          label="🧑🏻‍💼"
          pass={!isLectureSection ? result === "PASS" : undefined}
        />
        <div className="flex-1">
          <DialogueBubble
            key={lineIndex}
            line={allLines[lineIndex]}
            onAdvance={handleAdvance}
          />
          {isLast && (
            <button
              onClick={handleAdvance}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              Finish Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TASK 3 SCENES ────────────────────────────────────────────────────────────

function Task3Scene1({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState("opening");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOpeningAdvance = () => {
    if (lineIndex < TASK3_SCENE_1_OPENING.length - 1) {
      setLineIndex((i) => i + 1);
    } else {
      setPhase("choice");
    }
  };

  const handleChoice = (id) => {
    setSelectedOption(id);
    if (TASK3_SCENE_1_RESPONSES[id]) {
      setPhase("response");
    } else {
      onComplete();
    }
  };

  const handleResponseAdvance = () => {
    onComplete();
  };

  const currentLine =
    phase === "opening"
      ? TASK3_SCENE_1_OPENING[lineIndex]
      : phase === "response"
        ? {
            speaker: "Manager",
            text: TASK3_SCENE_1_RESPONSES[selectedOption],
          }
        : null;

  return (
    <div className="flex gap-4 items-start">
      <Avatar label="🧑🏻‍💼" />
      <div className="flex-1">
        {phase !== "choice" && currentLine ? (
          <DialogueBubble
            key={`${phase}-${lineIndex}`}
            line={currentLine}
            onAdvance={
              phase === "opening" ? handleOpeningAdvance : handleResponseAdvance
            }
          />
        ) : (
          <ChoiceMenu options={TASK3_SCENE_1_OPTIONS} onSelect={handleChoice} />
        )}
      </div>
    </div>
  );
}

function Task3Scene2({ result, selectedUrl, onComplete }) {
  const [phase, setPhase] = useState("initial");
  const [lineIndex, setLineIndex] = useState(0);

  // Build dialogue flow based on PASS or FAIL
  const getDialogueFlow = () => {
    if (result === "PASS") {
      return {
        initial: TASK3_PASS_RESULT_LINES,
        userChoice: TASK3_PASS_USER_OPTIONS,
        explanation: TASK3_PASS_EXPLANATION,
        finalLecture: TASK3_FINAL_LECTURE,
        finalChoice: TASK3_FINAL_OPTIONS,
      };
    } else {
      return {
        initial: TASK3_FAIL_INITIAL,
        userResponse: TASK3_FAIL_USER_RESPONSE,
        reaction: TASK3_FAIL_REACTION,
        userChoice1: TASK3_FAIL_USER_OPTIONS,
        explanation: TASK3_FAIL_EXPLANATION,
        userChoice2: TASK3_FAIL_USER_APOLOGY_OPTIONS,
        reveal: TASK3_FAIL_REVEAL,
        finalLecture: TASK3_FINAL_LECTURE,
        finalChoice: TASK3_FINAL_OPTIONS,
      };
    }
  };

  const flow = getDialogueFlow();

  const handleAdvance = () => {
    if (result === "PASS") {
      // PASS flow: initial → userChoice → explanation → finalLecture → finalChoice
      if (phase === "initial") {
        if (lineIndex < flow.initial.length - 1) {
          setLineIndex((i) => i + 1);
        } else {
          setPhase("userChoice");
          setLineIndex(0);
        }
      } else if (phase === "explanation") {
        if (lineIndex < flow.explanation.length - 1) {
          setLineIndex((i) => i + 1);
        } else {
          setPhase("finalLecture");
          setLineIndex(0);
        }
      } else if (phase === "finalLecture") {
        if (lineIndex < flow.finalLecture.length - 1) {
          setLineIndex((i) => i + 1);
        } else {
          setPhase("finalChoice");
          setLineIndex(0);
        }
      }
    } else {
      // FAIL flow: initial → userResponse → reaction → userChoice1 → explanation → userChoice2 → reveal → finalLecture → finalChoice
      if (phase === "initial") {
        if (lineIndex < flow.initial.length - 1) {
          setLineIndex((i) => i + 1);
        } else {
          setPhase("userResponse");
          setLineIndex(0);
        }
      } else if (phase === "userResponse") {
        setPhase("reaction");
        setLineIndex(0);
      } else if (phase === "reaction") {
        if (lineIndex < flow.reaction.length - 1) {
          setLineIndex((i) => i + 1);
        } else {
          setPhase("userChoice1");
          setLineIndex(0);
        }
      } else if (phase === "explanation") {
        if (lineIndex < flow.explanation.length - 1) {
          setLineIndex((i) => i + 1);
        } else {
          setPhase("userChoice2");
          setLineIndex(0);
        }
      } else if (phase === "reveal") {
        if (lineIndex < flow.reveal.length - 1) {
          setLineIndex((i) => i + 1);
        } else {
          setPhase("finalLecture");
          setLineIndex(0);
        }
      } else if (phase === "finalLecture") {
        if (lineIndex < flow.finalLecture.length - 1) {
          setLineIndex((i) => i + 1);
        } else {
          setPhase("finalChoice");
          setLineIndex(0);
        }
      }
    }
  };

  const handleUserChoice = (id) => {
    if (result === "PASS") {
      setPhase("explanation");
      setLineIndex(0);
    } else {
      if (phase === "userChoice1") {
        setPhase("explanation");
        setLineIndex(0);
      } else if (phase === "userChoice2") {
        setPhase("reveal");
        setLineIndex(0);
      }
    }
  };

  const handleFinalChoice = (id) => {
    // Complete the task immediately after final choice
    onComplete();
  };

  // Render current content
  const renderContent = () => {
    if (phase === "userChoice" && result === "PASS") {
      return (
        <ChoiceMenu options={flow.userChoice} onSelect={handleUserChoice} />
      );
    }
    if (phase === "userChoice1" && result === "FAIL") {
      return (
        <ChoiceMenu options={flow.userChoice1} onSelect={handleUserChoice} />
      );
    }
    if (phase === "userChoice2" && result === "FAIL") {
      return (
        <ChoiceMenu options={flow.userChoice2} onSelect={handleUserChoice} />
      );
    }
    if (phase === "finalChoice") {
      return (
        <ChoiceMenu options={flow.finalChoice} onSelect={handleFinalChoice} />
      );
    }
    if (phase === "userResponse" && result === "FAIL") {
      return (
        <DialogueBubble
          key="user-response"
          line={flow.userResponse}
          onAdvance={handleAdvance}
        />
      );
    }

    // Regular dialogue lines
    const currentLines = flow[phase];
    if (!currentLines || !currentLines[lineIndex]) return null;

    return (
      <DialogueBubble
        key={`${phase}-${lineIndex}`}
        line={currentLines[lineIndex]}
        onAdvance={handleAdvance}
      />
    );
  };

  const isLast = phase === "finalChoice";

  return (
    <div className="space-y-4">
      {result === "FAIL" && phase === "initial" && (
        <div className="text-sm p-3 rounded-lg font-bold bg-red-100 border-2 border-red-300 text-red-700">
          <span className="font-black">URL Used: </span>
          {selectedUrl}
        </div>
      )}

      <div className="flex gap-4 items-start">
        <Avatar
          label="🧑🏻‍💼"
          pass={phase === "initial" ? result === "PASS" : undefined}
        />
        <div className="flex-1">
          {renderContent()}
          {isLast && (
            <p className="text-center text-sm font-bold mt-4 text-indigo-900 uppercase tracking-wide">
              Choose your response above
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main DialogueScene ───────────────────────────────────────────────────

export default function DialogueScene() {
  const { mission, setMission } = useMission();

  // Task 1 handlers
  const isTask1Scene1 = mission.stage === "TALKING_TO_MANAGER";
  const isTask1Scene2 = mission.stage === "DEBRIEFING";

  // Task 2 handlers
  const isTask2Scene1 = mission.stage === "TASK2_TALKING_TO_MANAGER";
  const isTask2Scene2 = mission.stage === "TASK2_DEBRIEFING";

  // Task 3 handlers
  const isTask3Scene1 = mission.stage === "TASK3_TALKING_TO_MANAGER";
  const isTask3Scene2 = mission.stage === "TASK3_DEBRIEFING";

  if (
    !isTask1Scene1 &&
    !isTask1Scene2 &&
    !isTask2Scene1 &&
    !isTask2Scene2 &&
    !isTask3Scene1 &&
    !isTask3Scene2
  ) {
    return null;
  }

  const handleTask1Scene1Complete = () => {
    setMission({ ...mission, stage: "GO_TO_WORKSPACE" });
  };

  const handleTask1Scene2Complete = () => {
    // After Task 1 completes, start Task 2
    setMission({
      id: "TASK_2_PHONE_SECURITY",
      stage: "TASK2_TALK_TO_MANAGER",
      result: null,
      unsafeFields: [],
      selectedUrl: null,
    });
  };

  const handleTask2Scene1Complete = () => {
    setMission({ ...mission, stage: "TASK2_WAITING_FOR_MESSAGE" });
  };

  const handleTask2Scene2Complete = () => {
    // After Task 2 completes, start Task 3
    setMission({
      id: "TASK_3_URL_SECURITY",
      stage: "TASK3_TALK_TO_MANAGER",
      result: null,
      unsafeFields: [],
      selectedUrl: null,
    });
  };

  const handleTask3Scene1Complete = () => {
    setMission({ ...mission, stage: "TASK3_GO_TO_LAPTOP" });
  };

  const handleTask3Scene2Complete = () => {
    setMission({ ...mission, stage: "TASK3_COMPLETED" });
  };

  return (
    <div className="fixed inset-0 bg-opacity-0 z-[900] flex items-end justify-center p-4 font-sans">
      <div className="w-full max-w-3xl bg-yellow-400 p-6 rounded-[2rem] border-4 border-indigo-900 shadow-[10px_10px_0_0_#4338ca] mb-4">
        {/* Task 1 Scenes */}
        {isTask1Scene1 && (
          <Task1Scene1 onComplete={handleTask1Scene1Complete} />
        )}
        {isTask1Scene2 && (
          <Task1Scene2
            result={mission.result}
            unsafeFields={mission.unsafeFields}
            onComplete={handleTask1Scene2Complete}
          />
        )}

        {/* Task 2 Scenes */}
        {isTask2Scene1 && (
          <Task2Scene1 onComplete={handleTask2Scene1Complete} />
        )}
        {isTask2Scene2 && (
          <Task2Scene2
            result={mission.result}
            onComplete={handleTask2Scene2Complete}
          />
        )}

        {/* Task 3 Scenes */}
        {isTask3Scene1 && (
          <Task3Scene1 onComplete={handleTask3Scene1Complete} />
        )}
        {isTask3Scene2 && (
          <Task3Scene2
            result={mission.result}
            selectedUrl={mission.selectedUrl}
            onComplete={handleTask3Scene2Complete}
          />
        )}
      </div>
    </div>
  );
}
