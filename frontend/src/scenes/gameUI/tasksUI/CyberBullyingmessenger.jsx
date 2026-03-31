import { useState, useEffect, useRef } from "react";
import { useMission } from "../../missions/MissionContext";
import { X, MessageCircle } from "lucide-react";

// ─── SCORING ────────────────────────────────────────────────────────────────
const TOTAL_DECISIONS = 4;

// ─── CHAT FLOW ───────────────────────────────────────────────────────────────
const CHAT_FLOW = [
  // ── SCENE 1: Introduction ─────────────────────────────────────────────────
  {
    id: "intro_1",
    from: "mia",
    text: "hey… are you free?",
    autoAdvance: true,
  },
  {
    id: "intro_2",
    from: "mia",
    text: "something's really wrong",
    autoAdvance: false,
    options: [
      { id: "ask_what", label: "What happened? Tell me everything." },
      { id: "blame", label: "Did you do something?" },
    ],
    responses: {
      ask_what: null,
      blame: "i didn't do anything!! just listen…",
    },
  },
  {
    id: "intro_3",
    from: "mia",
    text: "there's a fake account pretending to be me",
    autoAdvance: true,
  },
  {
    id: "intro_4",
    from: "mia",
    text: "same name… same profile picture…",
    autoAdvance: true,
  },
  {
    id: "intro_5",
    from: "mia",
    text: "they're messaging people horrible things",
    autoAdvance: true,
  },
  {
    id: "intro_6",
    from: "mia",
    text: "now everyone thinks it's me",
    autoAdvance: true,
  },
  {
    id: "intro_7",
    from: "mia",
    text: "I don't know what to do… can you help me? just tell me what I should do… I'll do it",
    autoAdvance: false,
    options: [
      {
        id: "yes_help",
        label: "Of course. Let's deal with this step by step.",
      },
    ],
    responses: { yes_help: null },
  },

  // ── DECISION 1: Fake Account ───────────────────────────────────────────────
  {
    id: "d1_setup",
    from: "mia",
    text: "I found the account… it looks exactly like mine. what should I do?",
    autoAdvance: false,
    decisionId: "fakeAccount",
    options: [
      {
        id: "report",
        label: "Report the account immediately.",
        score: "correct",
        miaReply: [
          "okay… reporting it now",
          "…done. it says they'll review it",
          "but the posts are still there… people still believe it's me",
        ],
      },
      {
        id: "block",
        label: "Block the account.",
        score: "partial",
        miaReply: [
          "I blocked it…",
          "but other people can still see it",
          "they're still messaging others…",
        ],
      },
      {
        id: "comment",
        label: "Comment on it and tell people it's fake.",
        score: "wrong",
        miaReply: [
          "I commented…",
          "now more people are replying",
          "they're tagging others… this just made it worse",
        ],
      },
      {
        id: "ignore_acc",
        label: "Ignore it for now.",
        score: "wrong",
        miaReply: [
          "I'll just ignore it…",
          "but the posts are spreading more now",
          "why isn't it stopping",
        ],
      },
    ],
  },

  // ── DECISION 2: Reputation Damage ─────────────────────────────────────────
  {
    id: "d2_setup",
    from: "mia",
    text: "people are messaging me… they think I said those things. what do I tell them?",
    autoAdvance: false,
    decisionId: "reputation",
    options: [
      {
        id: "calm_message",
        label: "Send a calm message explaining it's a fake account.",
        score: "correct",
        miaReply: [
          "okay… I sent a message",
          "…a few people replied",
          "some said they didn't know. but not everyone believes me yet",
        ],
      },
      {
        id: "aggressive",
        label: "Defend yourself aggressively.",
        score: "wrong",
        miaReply: [
          "I told them off…",
          "they're saying I'm overreacting now",
          "some think I'm guilty",
        ],
      },
      {
        id: "leave_chats",
        label: "Leave all the chats.",
        score: "wrong",
        miaReply: [
          "I left the group…",
          "now they're talking without me",
          "I can't even explain myself",
        ],
      },
      {
        id: "wait",
        label: "Wait and hope it fixes itself.",
        score: "partial",
        miaReply: [
          "I didn't say anything…",
          "more people are believing it now",
        ],
      },
    ],
  },

  // ── DECISION 3: Evidence ──────────────────────────────────────────────────
  {
    id: "d3_setup",
    from: "mia",
    text: "what if the account disappears? what should I do before that happens?",
    autoAdvance: false,
    decisionId: "evidence",
    options: [
      {
        id: "screenshot",
        label: "Take screenshots of everything.",
        score: "correct",
        miaReply: [
          "okay… I saved everything",
          "posts, messages, profile…",
          "at least now I have proof",
        ],
      },
      {
        id: "delete_comments",
        label: "Delete comments on your posts.",
        score: "wrong",
        miaReply: [
          "I deleted some comments…",
          "wait… now I don't have proof of what they said",
        ],
      },
      {
        id: "expose",
        label: "Expose them publicly.",
        score: "wrong",
        miaReply: [
          "I tried to expose them…",
          "but it just made more drama",
          "people are picking sides now",
        ],
      },
      {
        id: "report_move",
        label: "Just report and move on.",
        score: "partial",
        miaReply: [
          "I didn't save anything…",
          "what if the report doesn't work?",
        ],
      },
    ],
  },

  // ── DECISION 4: Emotional + Real Support ──────────────────────────────────
  {
    id: "d4_setup",
    from: "mia",
    text: "this is getting overwhelming… I feel like everyone hates me now. what should I do next?",
    autoAdvance: false,
    decisionId: "support",
    options: [
      {
        id: "trusted_adult",
        label: "Talk to a trusted adult — a teacher or parent.",
        score: "correct",
        miaReply: [
          "…okay",
          "I'll talk to my teacher",
          "I didn't want to… but I think I should",
        ],
      },
      {
        id: "social_break",
        label: "Take a break from social media for now.",
        score: "partial",
        miaReply: ["I logged out for now…", "but the account is still there…"],
      },
      {
        id: "ignore_feel",
        label: "Ignore it, it'll go away.",
        score: "wrong",
        miaReply: ["ignore it?", "…it doesn't feel like I can"],
      },
      {
        id: "fight_back",
        label: "Just fight back.",
        score: "wrong",
        miaReply: [
          "I tried fighting back…",
          "they just screenshotted everything",
          "now it looks even worse",
        ],
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MessageBubble({ message, isPlayer, sender }) {
  const bubbleClass = isPlayer
    ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white ml-auto"
    : "bg-white text-gray-800 border-2 border-gray-200";

  return (
    <div className={`max-w-[75%] ${isPlayer ? "ml-auto" : "mr-auto"} mb-3`}>
      {!isPlayer && (
        <p className="text-xs font-bold text-pink-500 mb-1 ml-1">
          {sender || "Mia"}
        </p>
      )}
      <div
        className={`px-4 py-3 rounded-2xl shadow-sm ${bubbleClass}`}
        style={{
          borderRadius: isPlayer ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
        }}
      >
        <p className="text-sm leading-relaxed font-medium">{message}</p>
      </div>
    </div>
  );
}

function ResponseOptions({ options, onSelect }) {
  return (
    <div className="space-y-2 mt-4">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt)}
          className="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100
                     text-indigo-900 rounded-xl border-2 border-indigo-200
                     transition-all duration-200 font-medium text-sm
                     hover:border-indigo-300 hover:shadow-md active:scale-[0.98]"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function EndChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full mt-4 px-4 py-3 bg-red-500 hover:bg-red-600
               text-white rounded-xl font-bold text-sm
               transition-all duration-200 shadow-md hover:shadow-lg
               active:scale-[0.98]"
    >
      End Chat
    </button>
  );
}

function PhoneButton({ onClick, hasNotification }) {
  return (
    <button
      onClick={onClick}
      className="pointer-events-auto relative group transition-all duration-300
                 hover:scale-105 active:scale-95"
    >
      <div
        className="w-20 h-36 bg-gray-900 border-4 border-indigo-900 rounded-[2rem]
                      shadow-[6px_6px_0_0_#4338ca] overflow-hidden flex flex-col items-center p-1"
      >
        <div className="w-8 h-1 bg-indigo-900/50 rounded-full mt-2 mb-2" />
        <div
          className="flex-1 w-full bg-gradient-to-br from-indigo-500 to-indigo-600
                        rounded-[1.2rem] flex items-center justify-center overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform relative z-10" />
          {hasNotification && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-ping" />
          )}
        </div>
        <div className="h-8 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border-2 border-indigo-900/30" />
        </div>
      </div>
      {hasNotification && (
        <div
          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 border-4 border-white
                        rounded-full flex items-center justify-center animate-bounce shadow-lg"
        >
          <span className="text-white text-[10px] font-bold">1</span>
        </div>
      )}
    </button>
  );
}

function PhoneModal({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-opacity-50">
      <div
        className="w-[420px] h-[720px] bg-gradient-to-br from-gray-900 to-gray-800
                    rounded-[3rem] shadow-2xl border-[12px] border-gray-950
                    flex flex-col overflow-hidden animate-scale-in"
      >
        {/* Notch */}
        <div className="h-8 bg-gray-950 flex items-center justify-center">
          <div className="w-32 h-6 bg-gray-900 rounded-b-3xl" />
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center text-lg">
              👧
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Mia</h3>
              <p className="text-pink-200 text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                Online
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-pink-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {children}

        {/* Home indicator */}
        <div className="h-6 bg-gray-950 flex items-center justify-center">
          <div className="w-32 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-white rounded-2xl border-2 border-gray-200 w-fit mb-3 mr-auto">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CyberbullyingMessenger() {
  const { mission, setMission, setIsPhoneModalOpen } = useMission();

  const [messages, setMessages] = useState([]);
  const [currentFlowIndex, setCurrentFlowIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Use a ref to track correct count to avoid stale closure / double-fire bug
  const correctCountRef = useRef(0);

  // Guard ref to prevent showResolution from running twice
  const resolutionStartedRef = useRef(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showOptions]);

  useEffect(() => {
    setIsPhoneModalOpen(isPhoneOpen);
  }, [isPhoneOpen, setIsPhoneModalOpen]);

  // Notification trigger after 5s
  useEffect(() => {
    if (mission.stage === "TASK8_WAITING_FOR_MESSAGE") {
      const timer = setTimeout(() => {
        setHasNotification(true);
        setMission({ ...mission, stage: "TASK8_PHONE_CHAT" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mission.stage]);

  // Start the flow when phone opens for the first time
  useEffect(() => {
    if (
      mission.stage === "TASK8_PHONE_CHAT" &&
      messages.length === 0 &&
      isPhoneOpen
    ) {
      processFlowStep(0);
    }
  }, [mission.stage, isPhoneOpen]);

  const addMessage = (text, isPlayer, sender) => {
    setMessages((prev) => [
      ...prev,
      { text, isPlayer, sender, id: Date.now() + Math.random() },
    ]);
  };

  // Show Mia typing then deliver a message
  const deliverMiaMessage = (text, callback, delay = 1200) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(text, false, "Mia");
      if (callback) setTimeout(callback, 400);
    }, delay);
  };

  // Process flow at a given index
  const processFlowStep = (index) => {
    if (index >= CHAT_FLOW.length) {
      showResolution();
      return;
    }

    const step = CHAT_FLOW[index];

    if (step.autoAdvance) {
      deliverMiaMessage(step.text, () => processFlowStep(index + 1));
    } else {
      deliverMiaMessage(step.text, () => {
        setCurrentFlowIndex(index);
        setShowOptions(true);
      });
    }
  };

  const handleOptionSelect = (option) => {
    setShowOptions(false);
    const step = CHAT_FLOW[currentFlowIndex];

    // Add player message
    addMessage(option.label, true);

    // Handle decision scoring
    if (step.decisionId) {
      if (option.score === "correct") {
        correctCountRef.current += 1;
      }

      // Deliver multi-part Mia reply
      if (option.miaReply && option.miaReply.length > 0) {
        const deliverSequence = (lines, i) => {
          if (i >= lines.length) {
            processFlowStep(currentFlowIndex + 1);
            return;
          }
          deliverMiaMessage(lines[i], () => deliverSequence(lines, i + 1));
        };
        deliverSequence(option.miaReply, 0);
        return;
      }
    }

    // Handle intro choice responses
    if (step.responses && option.id in step.responses) {
      const reply = step.responses[option.id];
      if (reply) {
        deliverMiaMessage(reply, () => processFlowStep(currentFlowIndex + 1));
      } else {
        processFlowStep(currentFlowIndex + 1);
      }
      return;
    }

    // Default: move forward
    processFlowStep(currentFlowIndex + 1);
  };

  const showResolution = () => {
    // Guard: only run once
    if (resolutionStartedRef.current) return;
    resolutionStartedRef.current = true;

    const passed = correctCountRef.current >= Math.ceil(TOTAL_DECISIONS / 2);
    const result = passed ? "PASS" : "FAIL";

    setMission((prev) => ({ ...prev, result }));

    const passLines = [
      "the account got taken down…",
      "my teacher talked to the class",
      "some people apologized",
      "not everything is back to normal… but it's better than before",
      "thank you… I didn't know what to do",
    ];

    const failLines = [
      "the account is still up…",
      "more people saw it",
      "I don't even have proof anymore",
      "this got worse…",
    ];

    const lines = passed ? passLines : failLines;

    const deliverSequence = (i) => {
      if (i >= lines.length) {
        setChatEnded(true);
        return;
      }
      deliverMiaMessage(lines[i], () => deliverSequence(i + 1), 1500);
    };
    deliverSequence(0);
  };

  const handleEndChat = () => {
    setIsPhoneOpen(false);
    setTimeout(() => {
      setMission((prev) => ({
        ...prev,
        stage: "TASK8_RETURN_TO_MANAGER",
      }));
    }, 100);
  };

  const handlePhoneButtonClick = () => {
    setIsPhoneOpen(true);
    setHasNotification(false);
  };

  if (
    !["TASK8_WAITING_FOR_MESSAGE", "TASK8_PHONE_CHAT"].includes(mission.stage)
  ) {
    return null;
  }

  const currentStep = CHAT_FLOW[currentFlowIndex];
  const currentOptions = showOptions ? currentStep?.options || [] : [];

  return (
    <>
      {/* Phone button */}
      <div className="pointer-events-none fixed bottom-8 right-8 z-[800]">
        <PhoneButton
          onClick={handlePhoneButtonClick}
          hasNotification={hasNotification}
        />
      </div>

      {/* Modal */}
      {isPhoneOpen && (
        <PhoneModal onClose={() => setIsPhoneOpen(false)}>
          {/* Messages */}
          <div className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 overflow-y-auto p-4">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg.text}
                isPlayer={msg.isPlayer}
                sender={msg.sender}
              />
            ))}

            {isTyping && <TypingIndicator />}

            {showOptions && currentOptions.length > 0 && (
              <ResponseOptions
                options={currentOptions}
                onSelect={handleOptionSelect}
              />
            )}

            {chatEnded && <EndChatButton onClick={handleEndChat} />}

            <div ref={messagesEndRef} />
          </div>
        </PhoneModal>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
