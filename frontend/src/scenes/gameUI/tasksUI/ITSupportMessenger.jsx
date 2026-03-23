import { useState, useEffect, useRef } from "react";
import { useMission } from "../../missions/MissionContext";
import { X, MessageCircle, Search } from "lucide-react";

// ─── CHAT FLOW DATA ───────────────────────────────────────────────────────────

const IT_CHAT_FLOW = {
  // User opens chat, sends first message automatically after a delay
  it_intro: {
    from: "it",
    text: "Hello.",
    delay: 800,
  },
  it_ask: {
    from: "it",
    text: "What seems to be the problem?",
    delay: 1200,
  },
  user_explain_options: [
    { id: "explain", label: "My laptop won't unlock. It says access denied." },
  ],
  it_response_1: {
    from: "it",
    text: "Don't worry.",
    delay: 1000,
  },
  it_response_2: {
    from: "it",
    text: "I can fix it remotely.",
    delay: 1200,
  },
  it_response_3: {
    from: "it",
    text: "It will be faster if you give me your email password.",
    delay: 1400,
  },
  // Player choice — this is the key decision point
  password_choice: [
    {
      id: "give_password",
      label: "Okay, my password is Guardian@2024",
      result: "FAIL",
    },
    {
      id: "refuse_password",
      label: "I can't share my password with anyone.",
      result: "PASS",
    },
  ],

  // ── FAIL PATH ───────────────────────────────────────────────────────────────
  fail_stop: {
    from: "it",
    text: "Stop right there.",
    delay: 600,
  },
  fail_reveal: {
    from: "it",
    text: "That was a test. You should never share your password with anyone.",
    delay: 1200,
  },
  fail_user_options: [
    { id: "confused", label: "Wait… this was a test?" },
    { id: "wrong", label: "What did I do wrong?" },
  ],
  fail_lecture: [
    {
      from: "it",
      text: "Asking for your password is a common trick used by attackers.",
      delay: 800,
    },
    {
      from: "it",
      text: "Real IT staff will never ask for your password.",
      delay: 1200,
    },
    {
      from: "it",
      text: "If someone gets your password they can read your emails, send messages pretending to be you, and access company systems.",
      delay: 1400,
    },
    {
      from: "it",
      text: "That can lead to stolen data… or even attacks on the whole organization.",
      delay: 1600,
    },
    {
      from: "it",
      text: "Always remember — your password is private. Never share it with anyone. Even if they say they are IT.",
      delay: 1400,
    },
    {
      from: "it",
      text: "I'll tell the manager that you completed the task. But remember this lesson.",
      delay: 1400,
    },
  ],

  // ── PASS PATH ───────────────────────────────────────────────────────────────
  pass_good: {
    from: "it",
    text: "Good decision.",
    delay: 800,
  },
  pass_reveal: {
    from: "it",
    text: "That was a test.",
    delay: 1000,
  },
  pass_user_options: [
    { id: "real", label: "So this wasn't the real IT team?" },
    { id: "suspicious", label: "That was a little suspicious." },
  ],
  pass_lecture: [
    {
      from: "it",
      text: "Exactly. Attackers often pretend to be someone helpful.",
      delay: 800,
    },
    {
      from: "it",
      text: "They may say they are IT support. They may say your computer has a problem.",
      delay: 1400,
    },
    {
      from: "it",
      text: "But their real goal is to get your password.",
      delay: 1200,
    },
    {
      from: "it",
      text: "You did the correct thing. You refused to share private information.",
      delay: 1200,
    },
    {
      from: "it",
      text: "That's how you stay safe online.",
      delay: 1000,
    },
    {
      from: "it",
      text: "I'll inform your manager that you passed the test.",
      delay: 1200,
    },
  ],
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function MessageBubble({ message, isUser }) {
  return (
    <div className={`max-w-[78%] ${isUser ? "ml-auto" : "mr-auto"} mb-3`}>
      {!isUser && (
        <div className="flex items-center gap-2 mb-1">
          {/* No profile picture — blank avatar with question mark */}
          <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-dashed border-gray-400 flex items-center justify-center">
            <span className="text-gray-400 text-xs font-bold">?</span>
          </div>
          <span className="text-gray-400 text-[10px] font-semibold tracking-wide">
            IT Support
          </span>
        </div>
      )}
      <div
        className={`px-4 py-3 shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white"
            : "bg-white text-gray-800 border-2 border-gray-200"
        }`}
        style={{
          borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
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
          className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium text-sm
                     hover:shadow-md active:scale-[0.98]
                     ${
                       opt.result === "FAIL"
                         ? "bg-red-50 hover:bg-red-100 text-red-900 border-red-200 hover:border-red-300"
                         : opt.result === "PASS"
                           ? "bg-green-50 hover:bg-green-100 text-green-900 border-green-200 hover:border-green-300"
                           : "bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200 hover:border-indigo-300"
                     }`}
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

// ─── CONTACTS SEARCH SCREEN ───────────────────────────────────────────────────

function ContactsSearch({ onSelectContact }) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) setSearched(true);
    else setSearched(false);
  };

  const showITResult = searched && "it support".includes(query.toLowerCase());

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      {/* Search Bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            autoFocus
            value={query}
            onChange={handleSearch}
            placeholder="Search contacts..."
            className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {!searched && (
          <div className="p-6 text-center text-gray-400 text-sm font-medium">
            Type to search contacts
          </div>
        )}
        {searched && !showITResult && (
          <div className="p-6 text-center text-gray-400 text-sm font-medium">
            No contacts found
          </div>
        )}
        {showITResult && (
          <button
            onClick={onSelectContact}
            className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-100 transition-colors border-b border-gray-100"
          >
            {/* No profile picture */}
            <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center flex-shrink-0">
              <span className="text-gray-400 text-lg font-bold">?</span>
            </div>
            <div className="text-left">
              <p className="text-gray-900 font-semibold text-sm">IT Support</p>
              <p className="text-gray-400 text-xs">No info available</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── PHONE MODAL SHELL (same design as PhoneMessenger) ────────────────────────

function PhoneModal({
  onClose,
  children,
  showBackButton,
  onBack,
  title,
  subtitle,
}) {
  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-opacity-50">
      <div
        className="w-[420px] h-[720px] bg-gradient-to-br from-gray-900 to-gray-800 
                    rounded-[3rem] shadow-2xl border-[12px] border-gray-950
                    flex flex-col overflow-hidden"
        style={{ animation: "scaleIn 0.3s ease-out" }}
      >
        {/* Notch */}
        <div className="h-8 bg-gray-950 flex items-center justify-center relative">
          <div className="w-32 h-6 bg-gray-900 rounded-b-3xl" />
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={onBack}
                className="p-1 hover:bg-indigo-800 rounded-full transition-colors mr-1"
              >
                <span className="text-white text-sm">←</span>
              </button>
            )}
            <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center">
              <span className="text-gray-500 font-bold">?</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-base">
                {title || "Messages"}
              </h3>
              <p className="text-indigo-200 text-xs">{subtitle || ""}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-indigo-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        {children}

        {/* Home indicator */}
        <div className="h-6 bg-gray-950 flex items-center justify-center">
          <div className="w-32 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── PHONE BUTTON (identical design to PhoneMessenger) ────────────────────────

function PhoneButton({ onClick, hasNotification }) {
  return (
    <button
      onClick={onClick}
      className="pointer-events-auto relative group transition-all duration-300 hover:scale-105 active:scale-95"
    >
      <div className="w-20 h-36 bg-gray-900 border-4 border-indigo-900 rounded-[2rem] shadow-[6px_6px_0_0_#4338ca] overflow-hidden flex flex-col items-center p-1">
        <div className="w-8 h-1 bg-indigo-900/50 rounded-full mt-2 mb-2" />
        <div className="flex-1 w-full bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[1.2rem] flex items-center justify-center overflow-hidden relative">
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
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 border-4 border-white rounded-full flex items-center justify-center animate-bounce shadow-lg">
          <span className="text-white text-[10px] font-bold">1</span>
        </div>
      )}
    </button>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function ITSupportMessenger() {
  const { mission, setMission, setIsPhoneModalOpen } = useMission();

  const [screen, setScreen] = useState("search"); // "search" | "chat"
  const [messages, setMessages] = useState([]);
  const [chatPhase, setChatPhase] = useState("user_open"); // tracks conversation phase
  const [showOptions, setShowOptions] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [chatEnded, setChatEnded] = useState(false);
  const [result, setResult] = useState(null);
  // Use a ref so handleEndChat always reads the latest result
  // even though it's called long after the closure was created
  const resultRef = useRef(null);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [lectureIndex, setLectureIndex] = useState(0);

  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Sync modal open state with global context
  useEffect(() => {
    setIsPhoneModalOpen(isPhoneOpen);
  }, [isPhoneOpen, setIsPhoneModalOpen]);

  // Give notification after 3s when stage is PHONE_CHAT
  useEffect(() => {
    if (mission.stage === "TASK5_PHONE_CHAT" && !hasNotification) {
      const t = setTimeout(() => setHasNotification(true), 3000);
      return () => clearTimeout(t);
    }
  }, [mission.stage]);

  const addMsg = (text, isPlayer) =>
    setMessages((prev) => [
      ...prev,
      { text, isPlayer, id: Date.now() + Math.random() },
    ]);

  const delayedIT = (text, delay, cb) =>
    setTimeout(() => {
      addMsg(text, false);
      if (cb) setTimeout(cb, 400);
    }, delay);

  // ── Start chat once user selects IT Support ──
  const handleSelectContact = () => {
    setScreen("chat");
    // User sends first message automatically
    setTimeout(() => {
      addMsg(
        "Hello, my laptop is locked and asks me to contact the administrator.",
        true,
      );
      // IT replies
      delayedIT(IT_CHAT_FLOW.it_intro.text, IT_CHAT_FLOW.it_intro.delay, () => {
        delayedIT(IT_CHAT_FLOW.it_ask.text, IT_CHAT_FLOW.it_ask.delay, () => {
          setCurrentOptions(IT_CHAT_FLOW.user_explain_options);
          setShowOptions(true);
          setChatPhase("user_explain");
        });
      });
    }, 500);
  };

  const handleOptionSelect = (opt) => {
    addMsg(opt.label, true);
    setShowOptions(false);
    setCurrentOptions([]);

    if (chatPhase === "user_explain") {
      // IT asks for password
      delayedIT(
        IT_CHAT_FLOW.it_response_1.text,
        IT_CHAT_FLOW.it_response_1.delay,
        () => {
          delayedIT(
            IT_CHAT_FLOW.it_response_2.text,
            IT_CHAT_FLOW.it_response_2.delay,
            () => {
              delayedIT(
                IT_CHAT_FLOW.it_response_3.text,
                IT_CHAT_FLOW.it_response_3.delay,
                () => {
                  setCurrentOptions(IT_CHAT_FLOW.password_choice);
                  setShowOptions(true);
                  setChatPhase("password_choice");
                },
              );
            },
          );
        },
      );
      return;
    }

    if (chatPhase === "password_choice") {
      const chosenResult = opt.result;
      setResult(chosenResult);
      resultRef.current = chosenResult; // store in ref so handleEndChat can read it
      setMission({ ...mission, result: chosenResult });

      if (chosenResult === "FAIL") {
        delayedIT(
          IT_CHAT_FLOW.fail_stop.text,
          IT_CHAT_FLOW.fail_stop.delay,
          () => {
            delayedIT(
              IT_CHAT_FLOW.fail_reveal.text,
              IT_CHAT_FLOW.fail_reveal.delay,
              () => {
                setCurrentOptions(IT_CHAT_FLOW.fail_user_options);
                setShowOptions(true);
                setChatPhase("fail_user_response");
              },
            );
          },
        );
      } else {
        delayedIT(
          IT_CHAT_FLOW.pass_good.text,
          IT_CHAT_FLOW.pass_good.delay,
          () => {
            delayedIT(
              IT_CHAT_FLOW.pass_reveal.text,
              IT_CHAT_FLOW.pass_reveal.delay,
              () => {
                setCurrentOptions(IT_CHAT_FLOW.pass_user_options);
                setShowOptions(true);
                setChatPhase("pass_user_response");
              },
            );
          },
        );
      }
      return;
    }

    if (chatPhase === "fail_user_response") {
      setChatPhase("fail_lecture");
      playLecture(IT_CHAT_FLOW.fail_lecture, 0, () => setChatEnded(true));
      return;
    }

    if (chatPhase === "pass_user_response") {
      setChatPhase("pass_lecture");
      playLecture(IT_CHAT_FLOW.pass_lecture, 0, () => setChatEnded(true));
      return;
    }
  };

  const playLecture = (lines, index, onDone) => {
    if (index >= lines.length) {
      if (onDone) onDone();
      return;
    }
    const line = lines[index];
    setTimeout(
      () => {
        addMsg(line.text, false);
        playLecture(lines, index + 1, onDone);
      },
      line.delay + index * 600,
    );
  };

  const handleEndChat = () => {
    setIsPhoneOpen(false);
    setTimeout(() => {
      // Use resultRef.current — spreading { ...mission } here would carry
      // a stale result: null because mission was captured at render time.
      setMission((prev) => ({
        ...prev,
        result: resultRef.current ?? prev.result,
        stage: "TASK5_RETURN_TO_MANAGER",
      }));
    }, 100);
  };

  const handlePhoneOpen = () => {
    setIsPhoneOpen(true);
    setHasNotification(false);
  };

  if (mission.stage !== "TASK5_PHONE_CHAT") return null;

  return (
    <>
      {/* Phone button */}
      <div className="pointer-events-none fixed bottom-8 right-8 z-[800]">
        <PhoneButton
          onClick={handlePhoneOpen}
          hasNotification={hasNotification}
        />
      </div>

      {/* Phone modal */}
      {isPhoneOpen && (
        <PhoneModal
          onClose={() => setIsPhoneOpen(false)}
          showBackButton={screen === "chat"}
          onBack={() => {
            setScreen("search");
            setMessages([]);
            setChatPhase("user_open");
            setShowOptions(false);
            setChatEnded(false);
          }}
          title={screen === "chat" ? "IT Support" : "Messages"}
          subtitle={screen === "chat" ? "No info available" : ""}
        >
          {screen === "search" ? (
            <ContactsSearch onSelectContact={handleSelectContact} />
          ) : (
            <div className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 overflow-y-auto p-4">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.text}
                  isUser={msg.isPlayer}
                />
              ))}

              {showOptions && currentOptions.length > 0 && (
                <ResponseOptions
                  options={currentOptions}
                  onSelect={handleOptionSelect}
                />
              )}

              {chatEnded && <EndChatButton onClick={handleEndChat} />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </PhoneModal>
      )}
    </>
  );
}
