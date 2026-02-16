import { useState, useEffect, useRef } from "react";
import { useMission } from "../../missions/MissionContext";
import { X, MessageCircle } from "lucide-react";

/**
 * Phone Messenger Chat Data
 */

const CHAT_FLOW = {
  message1: {
    from: "user",
    text: "Hi, sorry to bother you. I'm filling out the online form but I'm confused 😓",
    delay: 0,
    options: [
      { id: "help1", label: "No problem, what part are you stuck on?" },
      { id: "help2", label: "I can help. What does the form say?" },
    ],
  },
  message2: {
    from: "user",
    text: "It's asking for date of birth. What should I do?",
    delay: 1500,
    options: [
      { id: "dob", label: "Type the Date of birth based on required format" },
    ],
  },
  message3: {
    from: "user",
    text: "Thanks. Now it's asking for address history. Do I need to include my old address too?",
    delay: 1500,
    options: [
      { id: "address", label: "You can type just your current Address." },
    ],
  },
  message4: {
    from: "user",
    text: "Hmm… now it's asking for guardian details. I don't really have one. I live alone. It says a guardian email is required to continue. It says this email is needed to receive a verification code, that's all. Could I use your email just for this step? You won't be sharing a password or anything. It's just a code.",
    delay: 2000,
    options: [
      {
        id: "give_email",
        label: "Sure, here's my email intern1@guardians.com",
        result: "FAIL",
      },
      {
        id: "refuse_email",
        label:
          "I can't share personal or work emails. You'll need to contact official support. This doesn't seem safe",
        result: "PASS",
      },
    ],
  },
  // FAIL PATH
  message5_fail: {
    from: "user",
    text: "Great! I am so thankful to you. Did you receive the verification code?",
    delay: 1500,
    options: [
      {
        id: "give_code",
        label: "You're welcome. Yes I received the verification code: XYD23.",
      },
    ],
  },
  message6_fail: {
    from: "user",
    text: "Looks like the form is completed. Thank you so much for your help.",
    delay: 1500,
    final: true,
  },
};

/**
 * Message Bubble Component
 */
function MessageBubble({ message, isUser }) {
  const bubbleClass = isUser
    ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white ml-auto"
    : "bg-white text-gray-800 border-2 border-gray-200";

  return (
    <div className={`max-w-[75%] ${isUser ? "ml-auto" : "mr-auto"} mb-3`}>
      <div
        className={`px-4 py-3 rounded-2xl shadow-sm ${bubbleClass}`}
        style={{
          borderRadius: isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
        }}
      >
        <p className="text-sm leading-relaxed font-medium">{message}</p>
      </div>
    </div>
  );
}

/**
 * Response Options Component
 */
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

/**
 * End Chat Button Component
 */
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

/**
 * Phone Button (bottom-right corner)
 */
/**
 * Phone Button (re-styled as a mini-phone)
 */
function PhoneButton({ onClick, hasNotification }) {
  return (
    <button
      onClick={onClick}
      className="pointer-events-auto relative group transition-all duration-300 
                 hover:scale-105 active:scale-95"
    >
      {/* Phone Body */}
      <div className="w-20 h-36 bg-gray-900 border-4 border-indigo-900 rounded-[2rem] 
                      shadow-[6px_6px_0_0_#4338ca] overflow-hidden flex flex-col items-center p-1">
        
        {/* Speaker/Notch */}
        <div className="w-8 h-1 bg-indigo-900/50 rounded-full mt-2 mb-2" />

        {/* Inner Screen Area */}
        <div className="flex-1 w-full bg-gradient-to-br from-indigo-500 to-indigo-600 
                        rounded-[1.2rem] flex items-center justify-center overflow-hidden relative">
          
          {/* Subtle Glow Effect on Hover */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform relative z-10" />
          
          {/* Floating Notification inside the screen */}
          {hasNotification && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-ping" />
          )}
        </div>

        {/* Home Button Circle */}
        <div className="h-8 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border-2 border-indigo-900/30" />
        </div>
      </div>

      {/* Main Notification Badge (Outer) */}
      {hasNotification && (
        <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 border-4 border-white 
                        rounded-full flex items-center justify-center animate-bounce shadow-lg">
           <span className="text-white text-[10px] font-bold">1</span>
        </div>
      )}
    </button>
  );
}

/**
 * Phone Modal (center of screen)
 */
function PhoneModal({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4  bg-opacity-50">
      <div
        className="w-[420px] h-[720px] bg-gradient-to-br from-gray-900 to-gray-800 
                    rounded-[3rem] shadow-2xl border-[12px] border-gray-950
                    flex flex-col overflow-hidden animate-scale-in"
      >
        {/* Phone Notch */}
        <div className="h-8 bg-gray-950 flex items-center justify-center relative">
          <div className="w-32 h-6 bg-gray-900 rounded-b-3xl" />
        </div>

        {/* App Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-300 rounded-full flex items-center justify-center text-lg">
              👤
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Form Helper</h3>
              <p className="text-indigo-200 text-xs">Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-indigo-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages Area */}
        {children}

        {/* Phone Home Indicator */}
        <div className="h-6 bg-gray-950 flex items-center justify-center">
          <div className="w-32 h-1 bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Main Phone Messenger Component
 */
export default function PhoneMessenger() {
  const { mission, setMission, setIsPhoneModalOpen } = useMission();
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState("message1");
  const [showOptions, setShowOptions] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [result, setResult] = useState(null);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update global modal state when local state changes
  useEffect(() => {
    setIsPhoneModalOpen(isPhoneOpen);
  }, [isPhoneOpen, setIsPhoneModalOpen]);

  // Handle message notification after 5 seconds
  useEffect(() => {
    if (mission.stage === "TASK2_WAITING_FOR_MESSAGE") {
      const timer = setTimeout(() => {
        setHasNotification(true);
        setMission({ ...mission, stage: "TASK2_PHONE_CHAT" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mission.stage]);

  // Initialize first message when chat starts and phone is opened
  useEffect(() => {
    if (
      mission.stage === "TASK2_PHONE_CHAT" &&
      messages.length === 0 &&
      isPhoneOpen
    ) {
      setTimeout(() => {
        addMessage(CHAT_FLOW.message1.text, false);
        setTimeout(() => setShowOptions(true), 500);
      }, 500);
    }
  }, [mission.stage, isPhoneOpen]);

  const addMessage = (text, isPlayer) => {
    setMessages((prev) => [...prev, { text, isPlayer, id: Date.now() }]);
  };

  const handleOptionSelect = (option) => {
    // Add player's response
    addMessage(option.label, true);
    setShowOptions(false);

    // Check if this option leads to pass/fail
    if (option.result) {
      setResult(option.result);
      setMission({
        ...mission,
        result: option.result,
      });

      if (option.result === "FAIL") {
        // Continue to fail path
        setTimeout(() => {
          addMessage(CHAT_FLOW.message5_fail.text, false);
          setTimeout(() => setShowOptions(true), 500);
          setCurrentStep("message5_fail");
        }, CHAT_FLOW.message5_fail.delay);
      } else {
        // PASS - show end chat button
        setTimeout(() => {
          setChatEnded(true);
        }, 1000);
      }
      return;
    }

    // Handle fail path continuation
    if (currentStep === "message5_fail") {
      setTimeout(() => {
        addMessage(CHAT_FLOW.message6_fail.text, false);
        setTimeout(() => {
          setChatEnded(true);
        }, 1000);
      }, CHAT_FLOW.message6_fail.delay);
      return;
    }

    // Progress to next message
    const nextSteps = {
      message1: "message2",
      message2: "message3",
      message3: "message4",
    };

    const nextStep = nextSteps[currentStep];
    if (nextStep) {
      const nextMessage = CHAT_FLOW[nextStep];
      setTimeout(() => {
        addMessage(nextMessage.text, false);
        setCurrentStep(nextStep);
        setTimeout(() => setShowOptions(true), 500);
      }, nextMessage.delay);
    }
  };

  const handleEndChat = () => {
    // Close modal first
    setIsPhoneOpen(false);
    // Then update stage after a small delay to ensure unlock happens
    setTimeout(() => {
      setMission({ ...mission, stage: "TASK2_RETURN_TO_MANAGER" });
    }, 100);
  };

  const handlePhoneButtonClick = () => {
    setIsPhoneOpen(true);
    setHasNotification(false); // Clear notification when opened
  };

  const handleClosePhone = () => {
    setIsPhoneOpen(false);
  };

  const currentOptions = CHAT_FLOW[currentStep]?.options || [];

  // Don't render if not in phone stages
  if (
    !["TASK2_WAITING_FOR_MESSAGE", "TASK2_PHONE_CHAT"].includes(mission.stage)
  ) {
    return null;
  }

  return (
    <>
      {/* Phone Button (always visible in bottom-right) */}
      <div className="pointer-events-none fixed bottom-8 right-8 z-[800]">
        <PhoneButton
          onClick={handlePhoneButtonClick}
          hasNotification={hasNotification}
        />
      </div>

      {/* Phone Modal (center of screen when opened) */}
      {isPhoneOpen && (
        <PhoneModal onClose={handleClosePhone}>
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
        </PhoneModal>
      )}

      {/* Add animation styles */}
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
