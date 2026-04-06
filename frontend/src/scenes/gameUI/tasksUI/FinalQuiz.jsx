import { useState, useEffect } from "react";
import { useMission } from "../../missions/MissionContext";
import { shouldShowQuiz } from "../../missions/tasks/TaskRegistry";

// ─── 25 QUIZ QUESTIONS ────────────────────────────────────────────────────────
// Covering all 9 tasks
const QUIZ_QUESTIONS = [
  // Task 1 — Personal Data Protection
  {
    question: "Which of the following should you NEVER share online?",
    options: ["Your favourite colour", "Your password", "Your favourite game", "Your favourite food"],
    correctIndex: 1,
    taskRef: "Task 1 — Personal Data",
  },
  {
    question: "Why is it dangerous to share personal information on unknown forms?",
    options: [
      "It makes the form slower",
      "Attackers can use it to steal your identity",
      "It changes your browser settings",
      "It uses more internet data",
    ],
    correctIndex: 1,
    taskRef: "Task 1 — Personal Data",
  },
  {
    question: "A website asks for your home address to send you a free prize. What should you do?",
    options: [
      "Enter it immediately — free stuff!",
      "Ask a trusted adult before sharing any personal info",
      "Enter a friend's address instead",
      "Share it but use a fake name",
    ],
    correctIndex: 1,
    taskRef: "Task 1 — Personal Data",
  },

  // Task 2 — Phone Security / Social Engineering
  {
    question: "Someone messages you asking for a verification code sent to your phone. What should you do?",
    options: [
      "Share it — they probably need it",
      "Never share it — verification codes are as sensitive as passwords",
      "Only share it if they seem nice",
      "Share half the code",
    ],
    correctIndex: 1,
    taskRef: "Task 2 — Social Engineering",
  },
  {
    question: "What is social engineering?",
    options: [
      "Building social media websites",
      "Tricking people into giving away private information",
      "A type of computer virus",
      "A programming language",
    ],
    correctIndex: 1,
    taskRef: "Task 2 — Social Engineering",
  },
  {
    question: "A stranger asks for your email to 'help you complete a form.' Is this safe?",
    options: [
      "Yes, emails are not important",
      "No — emails are keys that can be used to access accounts",
      "Only if they work at your school",
      "Yes, if they ask politely",
    ],
    correctIndex: 1,
    taskRef: "Task 2 — Social Engineering",
  },

  // Task 3 — URL Security (HTTP vs HTTPS)
  {
    question: "What does the 'S' in HTTPS stand for?",
    options: ["Speed", "Secure", "Simple", "Server"],
    correctIndex: 1,
    taskRef: "Task 3 — URL Security",
  },
  {
    question: "Why is HTTP dangerous for entering payment details?",
    options: [
      "The page loads slower",
      "Data is not encrypted — anyone on the network can see it",
      "The website has ads",
      "It uses more battery",
    ],
    correctIndex: 1,
    taskRef: "Task 3 — URL Security",
  },
  {
    question: "You see two links for the same shop. One starts with http:// and the other with https://. Which should you use?",
    options: [
      "http:// — it's shorter",
      "https:// — it encrypts your data",
      "Both are equally safe",
      "Neither — don't shop online",
    ],
    correctIndex: 1,
    taskRef: "Task 3 — URL Security",
  },

  // Task 4 — Email Security / Phishing
  {
    question: "What is the correct action when you receive a suspicious email?",
    options: [
      "Delete it and forget about it",
      "Report it and block the sender",
      "Forward it to your friends",
      "Click the links to investigate",
    ],
    correctIndex: 1,
    taskRef: "Task 4 — Email Security",
  },
  {
    question: "Phishing emails often try to create a sense of…",
    options: ["Calm", "Urgency or fear", "Boredom", "Happiness"],
    correctIndex: 1,
    taskRef: "Task 4 — Email Security",
  },
  {
    question: "An email says 'Your account will be deleted in 24 hours! Click here NOW!' What type of attack is this?",
    options: ["Malvertising", "Phishing", "BadUSB", "Cyberbullying"],
    correctIndex: 1,
    taskRef: "Task 4 — Email Security",
  },

  // Task 5 — Password Security
  {
    question: "A person claiming to be from IT asks for your password over the phone. What should you do?",
    options: [
      "Tell them — IT needs passwords",
      "Never share your password, not even with IT",
      "Give them an old password",
      "Share it only if they know your name",
    ],
    correctIndex: 1,
    taskRef: "Task 5 — Password Security",
  },
  {
    question: "What is the best way to create a strong password?",
    options: [
      "Use your birthday",
      "Use a mix of uppercase, lowercase, numbers, and symbols",
      "Use your pet's name",
      "Use 'password123'",
    ],
    correctIndex: 1,
    taskRef: "Task 5 — Password Security",
  },
  {
    question: "Passwords are compared to what in cybersecurity?",
    options: [
      "Windows",
      "Keys to your house",
      "Bookmarks",
      "Search engines",
    ],
    correctIndex: 1,
    taskRef: "Task 5 — Password Security",
  },

  // Task 6 — Malvertising
  {
    question: "What is malvertising?",
    options: [
      "Advertising that costs a lot of money",
      "Fake or malicious advertisements that can install malware",
      "Advertising on social media",
      "Email marketing",
    ],
    correctIndex: 1,
    taskRef: "Task 6 — Malvertising",
  },
  {
    question: "An ad on a website says 'You won a free iPhone! Click here!' What should you do?",
    options: [
      "Click it — free iPhone!",
      "Don't click — it's likely a malicious ad",
      "Share it with friends first",
      "Click it but don't enter any info",
    ],
    correctIndex: 1,
    taskRef: "Task 6 — Malvertising",
  },

  // Task 7 — Fake Moderator Scam
  {
    question: "A message says your game account will be permanently banned unless you 'verify' your login. What should you do?",
    options: [
      "Click the link and verify immediately",
      "Ignore it — real companies don't threaten instant bans via random messages",
      "Share the message with friends and ask them to verify too",
      "Reply asking for more details",
    ],
    correctIndex: 1,
    taskRef: "Task 7 — Fake Moderator",
  },
  {
    question: "What do scammers impersonating moderators primarily use to manipulate victims?",
    options: [
      "Kind words",
      "Fear and urgency",
      "Gift cards",
      "Long emails",
    ],
    correctIndex: 1,
    taskRef: "Task 7 — Fake Moderator",
  },
  {
    question: "If you need to verify something about your account, what should you do?",
    options: [
      "Click the link in the message",
      "Go to the official website yourself",
      "Ask a friend to check for you",
      "Search for the link on social media",
    ],
    correctIndex: 1,
    taskRef: "Task 7 — Fake Moderator",
  },

  // Task 8 — Cyberbullying
  {
    question: "Your friend is being cyberbullied. What is the FIRST thing you should advise them to do?",
    options: [
      "Fight back online",
      "Delete everything and pretend it didn't happen",
      "Report the bully and save evidence",
      "Create a fake account to scare the bully",
    ],
    correctIndex: 2,
    taskRef: "Task 8 — Cyberbullying",
  },
  {
    question: "Why is it important to save evidence of cyberbullying?",
    options: [
      "To share it on social media",
      "It creates protection and accountability",
      "To send it back to the bully",
      "Evidence is not important",
    ],
    correctIndex: 1,
    taskRef: "Task 8 — Cyberbullying",
  },
  {
    question: "Someone creates a fake account impersonating your friend. What is the best approach?",
    options: [
      "Ignore it — it will go away",
      "Report the fake account, tell a trusted adult, and save screenshots",
      "Create a fake account to fight back",
      "Post about it publicly to shame the person",
    ],
    correctIndex: 1,
    taskRef: "Task 8 — Cyberbullying",
  },

  // Task 9 — BadUSB
  {
    question: "You find a USB drive on the ground. What should you do?",
    options: [
      "Plug it in to see what's on it",
      "Don't use it — report it to a responsible person",
      "Give it to a friend",
      "Take it home and use it later",
    ],
    correctIndex: 1,
    taskRef: "Task 9 — BadUSB",
  },
  {
    question: "What is a BadUSB device?",
    options: [
      "A broken USB that doesn't work",
      "A USB programmed to execute malicious commands when plugged in",
      "A USB that only works on old computers",
      "A USB with too much storage",
    ],
    correctIndex: 1,
    taskRef: "Task 9 — BadUSB",
  },
];

const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;

export default function FinalQuiz() {
  const {
    mission,
    setMission,
    quizScore,
    setQuizScore,
    quizHighScore,
    setQuizHighScore,
    setQuizAnswers,
    quizCompletedOnce,
    setQuizCompletedOnce,
    quizPerfectOnce,
    setQuizPerfectOnce,
  } = useMission();

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]); // { questionIndex, selectedAnswer, correct }
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [xpAwarded, setXpAwarded] = useState(0);

  if (!shouldShowQuiz(mission.id, mission.stage)) return null;

  const q = QUIZ_QUESTIONS[currentQ];

  const handleSelect = (index) => {
    if (confirmed) return;
    setSelectedAnswer(index);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === q.correctIndex;
    const newAnswers = [
      ...answers,
      { questionIndex: currentQ, selectedAnswer, correct: isCorrect },
    ];
    setAnswers(newAnswers);
    setConfirmed(true);

    if (isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < TOTAL_QUESTIONS - 1) {
      setCurrentQ((c) => c + 1);
      setSelectedAnswer(null);
      setConfirmed(false);
    } else {
      // Quiz finished
      const finalScore = answers.filter((a) => a.correct).length + (selectedAnswer === q.correctIndex ? 0 : 0);
      // score state already updated via handleConfirm
      handleFinish(answers);
    }
  };

  const handleFinish = (finalAnswers) => {
    const finalScore = finalAnswers.filter((a) => a.correct).length;

    // Calculate XP
    let xp = 0;
    if (!quizCompletedOnce) {
      xp += 50; // first attempt
      setQuizCompletedOnce(true);
    }
    if (finalScore === TOTAL_QUESTIONS && !quizPerfectOnce) {
      xp += 50; // first perfect
      setQuizPerfectOnce(true);
    }
    setXpAwarded(xp);

    // Save quiz results
    setQuizScore(finalScore);
    const newHigh = Math.max(quizHighScore || 0, finalScore);
    setQuizHighScore(newHigh);
    setQuizAnswers(finalAnswers);

    setFinished(true);
  };

  const handleDone = () => {
    // Move to TASK10_COMPLETED → which transitions to TASK_11_OUTRO
    setMission({
      id: "TASK_11_OUTRO",
      stage: "TASK11_GO_TO_MANAGER",
      result: null,
      unsafeFields: [],
      selectedUrl: null,
      emailActions: {},
      incorrectlyHandled: [],
    });
  };

  // ── RESULTS SCREEN ──
  if (finished) {
    const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
    const isPerfect = score === TOTAL_QUESTIONS;
    return (
      <div className="fixed inset-0 z-[950] flex items-center justify-center bg-black/80 backdrop-blur-sm font-sans">
        <div className="bg-white rounded-3xl border-4 border-indigo-900 shadow-[8px_8px_0_0_#4338ca] w-[520px] overflow-hidden">
          {/* Header */}
          <div
            className={`p-8 text-center ${isPerfect ? "bg-gradient-to-br from-yellow-400 to-amber-500" : percentage >= 60 ? "bg-gradient-to-br from-green-400 to-emerald-500" : "bg-gradient-to-br from-red-400 to-rose-500"}`}
          >
            <div className="text-6xl mb-3">
              {isPerfect ? "🏆" : percentage >= 60 ? "🎉" : "📚"}
            </div>
            <h2 className="text-3xl font-black text-white drop-shadow-md">
              {isPerfect
                ? "PERFECT SCORE!"
                : percentage >= 60
                  ? "Well Done!"
                  : "Keep Learning!"}
            </h2>
            <p className="text-white/90 font-bold text-lg mt-1">
              Final Assessment Complete
            </p>
          </div>

          {/* Score */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-black text-indigo-900">
                  {score}/{TOTAL_QUESTIONS}
                </div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Score
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center">
                <div className="text-4xl font-black text-indigo-900">
                  {percentage}%
                </div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Accuracy
                </div>
              </div>
            </div>

            {xpAwarded > 0 && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3 text-center">
                <span className="text-yellow-600 font-black text-lg">
                  +{xpAwarded} XP Earned! ⭐
                </span>
              </div>
            )}

            {/* Progress bar */}
            <div className="w-full h-4 bg-gray-200 rounded-full border-2 border-indigo-900 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ease-out ${isPerfect ? "bg-yellow-400" : percentage >= 60 ? "bg-green-400" : "bg-red-400"}`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <button
              onClick={handleDone}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl text-lg font-black border-b-8 border-indigo-800 active:border-b-0 active:translate-y-2 transition-all uppercase tracking-wide"
            >
              Continue 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ QUESTION SCREEN ──
  const progress = ((currentQ + 1) / TOTAL_QUESTIONS) * 100;

  return (
    <div className="fixed inset-0 z-[950] flex items-center justify-center bg-black/80 backdrop-blur-sm font-sans">
      <div className="bg-white rounded-3xl border-4 border-indigo-900 shadow-[8px_8px_0_0_#4338ca] w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-white uppercase tracking-wide">
              📝 Final Assessment
            </h2>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-black text-white">
              {currentQ + 1} / {TOTAL_QUESTIONS}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-indigo-200 font-bold mt-1.5">
            {q.taskRef}
          </div>
        </div>

        {/* Question */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <h3 className="text-xl font-black text-indigo-900 leading-snug">
            {q.question}
          </h3>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let btnClass =
                "w-full text-left px-5 py-4 rounded-2xl text-base font-bold border-3 transition-all ";

              if (confirmed) {
                if (i === q.correctIndex) {
                  btnClass +=
                    "bg-green-100 border-green-500 text-green-800 border-b-4";
                } else if (i === selectedAnswer && i !== q.correctIndex) {
                  btnClass +=
                    "bg-red-100 border-red-500 text-red-800 border-b-4";
                } else {
                  btnClass +=
                    "bg-gray-50 border-gray-200 text-gray-400 border-b-4";
                }
              } else if (i === selectedAnswer) {
                btnClass +=
                  "bg-indigo-100 border-indigo-500 text-indigo-900 border-b-4 shadow-md scale-[1.01]";
              } else {
                btnClass +=
                  "bg-white border-gray-200 text-indigo-900 border-b-4 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={confirmed}
                  className={btnClass}
                >
                  <span className="mr-3 opacity-60 font-black">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                  {confirmed && i === q.correctIndex && (
                    <span className="float-right">✅</span>
                  )}
                  {confirmed &&
                    i === selectedAnswer &&
                    i !== q.correctIndex && (
                      <span className="float-right">❌</span>
                    )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t-4 border-indigo-100 bg-gray-50">
          {!confirmed ? (
            <button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className={`w-full py-4 rounded-2xl text-lg font-black border-b-8 transition-all uppercase tracking-wide ${
                selectedAnswer !== null
                  ? "bg-pink-500 hover:bg-pink-600 text-white border-pink-800 active:border-b-0 active:translate-y-2"
                  : "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
              }`}
            >
              Confirm Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-4 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all uppercase tracking-wide"
            >
              {currentQ < TOTAL_QUESTIONS - 1
                ? "Next Question →"
                : "See Results 🏁"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
