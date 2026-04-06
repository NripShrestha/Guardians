import { useState } from "react";
import { X, CheckCircle, XCircle, RotateCcw } from "lucide-react";

// Must match the question array in FinalQuiz.jsx
const QUIZ_QUESTIONS = [
  { question: "Which of the following should you NEVER share online?", options: ["Your favourite colour", "Your password", "Your favourite game", "Your favourite food"], correctIndex: 1, taskRef: "Task 1 — Personal Data" },
  { question: "Why is it dangerous to share personal information on unknown forms?", options: ["It makes the form slower", "Attackers can use it to steal your identity", "It changes your browser settings", "It uses more internet data"], correctIndex: 1, taskRef: "Task 1 — Personal Data" },
  { question: "A website asks for your home address to send you a free prize. What should you do?", options: ["Enter it immediately — free stuff!", "Ask a trusted adult before sharing any personal info", "Enter a friend's address instead", "Share it but use a fake name"], correctIndex: 1, taskRef: "Task 1 — Personal Data" },
  { question: "Someone messages you asking for a verification code sent to your phone. What should you do?", options: ["Share it — they probably need it", "Never share it — verification codes are as sensitive as passwords", "Only share it if they seem nice", "Share half the code"], correctIndex: 1, taskRef: "Task 2 — Social Engineering" },
  { question: "What is social engineering?", options: ["Building social media websites", "Tricking people into giving away private information", "A type of computer virus", "A programming language"], correctIndex: 1, taskRef: "Task 2 — Social Engineering" },
  { question: "A stranger asks for your email to 'help you complete a form.' Is this safe?", options: ["Yes, emails are not important", "No — emails are keys that can be used to access accounts", "Only if they work at your school", "Yes, if they ask politely"], correctIndex: 1, taskRef: "Task 2 — Social Engineering" },
  { question: "What does the 'S' in HTTPS stand for?", options: ["Speed", "Secure", "Simple", "Server"], correctIndex: 1, taskRef: "Task 3 — URL Security" },
  { question: "Why is HTTP dangerous for entering payment details?", options: ["The page loads slower", "Data is not encrypted — anyone on the network can see it", "The website has ads", "It uses more battery"], correctIndex: 1, taskRef: "Task 3 — URL Security" },
  { question: "You see two links for the same shop. One starts with http:// and the other with https://. Which should you use?", options: ["http:// — it's shorter", "https:// — it encrypts your data", "Both are equally safe", "Neither — don't shop online"], correctIndex: 1, taskRef: "Task 3 — URL Security" },
  { question: "What is the correct action when you receive a suspicious email?", options: ["Delete it and forget about it", "Report it and block the sender", "Forward it to your friends", "Click the links to investigate"], correctIndex: 1, taskRef: "Task 4 — Email Security" },
  { question: "Phishing emails often try to create a sense of…", options: ["Calm", "Urgency or fear", "Boredom", "Happiness"], correctIndex: 1, taskRef: "Task 4 — Email Security" },
  { question: "An email says 'Your account will be deleted in 24 hours! Click here NOW!' What type of attack is this?", options: ["Malvertising", "Phishing", "BadUSB", "Cyberbullying"], correctIndex: 1, taskRef: "Task 4 — Email Security" },
  { question: "A person claiming to be from IT asks for your password over the phone. What should you do?", options: ["Tell them — IT needs passwords", "Never share your password, not even with IT", "Give them an old password", "Share it only if they know your name"], correctIndex: 1, taskRef: "Task 5 — Password Security" },
  { question: "What is the best way to create a strong password?", options: ["Use your birthday", "Use a mix of uppercase, lowercase, numbers, and symbols", "Use your pet's name", "Use 'password123'"], correctIndex: 1, taskRef: "Task 5 — Password Security" },
  { question: "Passwords are compared to what in cybersecurity?", options: ["Windows", "Keys to your house", "Bookmarks", "Search engines"], correctIndex: 1, taskRef: "Task 5 — Password Security" },
  { question: "What is malvertising?", options: ["Advertising that costs a lot of money", "Fake or malicious advertisements that can install malware", "Advertising on social media", "Email marketing"], correctIndex: 1, taskRef: "Task 6 — Malvertising" },
  { question: "An ad on a website says 'You won a free iPhone! Click here!' What should you do?", options: ["Click it — free iPhone!", "Don't click — it's likely a malicious ad", "Share it with friends first", "Click it but don't enter any info"], correctIndex: 1, taskRef: "Task 6 — Malvertising" },
  { question: "A message says your game account will be permanently banned unless you 'verify' your login. What should you do?", options: ["Click the link and verify immediately", "Ignore it — real companies don't threaten instant bans via random messages", "Share the message with friends and ask them to verify too", "Reply asking for more details"], correctIndex: 1, taskRef: "Task 7 — Fake Moderator" },
  { question: "What do scammers impersonating moderators primarily use to manipulate victims?", options: ["Kind words", "Fear and urgency", "Gift cards", "Long emails"], correctIndex: 1, taskRef: "Task 7 — Fake Moderator" },
  { question: "If you need to verify something about your account, what should you do?", options: ["Click the link in the message", "Go to the official website yourself", "Ask a friend to check for you", "Search for the link on social media"], correctIndex: 1, taskRef: "Task 7 — Fake Moderator" },
  { question: "Your friend is being cyberbullied. What is the FIRST thing you should advise them to do?", options: ["Fight back online", "Delete everything and pretend it didn't happen", "Report the bully and save evidence", "Create a fake account to scare the bully"], correctIndex: 2, taskRef: "Task 8 — Cyberbullying" },
  { question: "Why is it important to save evidence of cyberbullying?", options: ["To share it on social media", "It creates protection and accountability", "To send it back to the bully", "Evidence is not important"], correctIndex: 1, taskRef: "Task 8 — Cyberbullying" },
  { question: "Someone creates a fake account impersonating your friend. What is the best approach?", options: ["Ignore it — it will go away", "Report the fake account, tell a trusted adult, and save screenshots", "Create a fake account to fight back", "Post about it publicly to shame the person"], correctIndex: 1, taskRef: "Task 8 — Cyberbullying" },
  { question: "You find a USB drive on the ground. What should you do?", options: ["Plug it in to see what's on it", "Don't use it — report it to a responsible person", "Give it to a friend", "Take it home and use it later"], correctIndex: 1, taskRef: "Task 9 — BadUSB" },
  { question: "What is a BadUSB device?", options: ["A broken USB that doesn't work", "A USB programmed to execute malicious commands when plugged in", "A USB that only works on old computers", "A USB with too much storage"], correctIndex: 1, taskRef: "Task 9 — BadUSB" },
];

export default function QuizReviewOverlay({ onClose, quizAnswers, quizScore, onRetake }) {
  const [expandedQ, setExpandedQ] = useState(null);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const percentage = quizScore !== null ? Math.round((quizScore / totalQuestions) * 100) : 0;
  const isPerfect = quizScore === totalQuestions;

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 pointer-events-auto backdrop-blur-[2px]">
      <div className="bg-white rounded-3xl border-4 border-indigo-900 shadow-[6px_6px_0_0_#4338ca] w-[560px] max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`p-5 relative ${isPerfect ? "bg-gradient-to-br from-yellow-400 to-amber-500" : "bg-gradient-to-br from-indigo-600 to-purple-600"}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-black text-white uppercase tracking-wide">
            📝 Quiz Review
          </h2>
          <div className="flex items-center gap-4 mt-3">
            <div className="bg-white/20 rounded-xl px-4 py-2">
              <span className="text-2xl font-black text-white">{quizScore}/{totalQuestions}</span>
            </div>
            <div className="flex-1">
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isPerfect ? "bg-white" : percentage >= 60 ? "bg-green-400" : "bg-red-400"}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-white/80 text-xs font-bold mt-1">{percentage}% Accuracy</p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ scrollbarWidth: "thin" }}>
          {QUIZ_QUESTIONS.map((q, i) => {
            const answer = quizAnswers?.[i];
            const isCorrect = answer?.correct;
            const isExpanded = expandedQ === i;

            return (
              <div
                key={i}
                onClick={() => setExpandedQ(isExpanded ? null : i)}
                className={`rounded-xl border-2 transition-all cursor-pointer ${
                  isCorrect
                    ? "border-green-200 bg-green-50 hover:bg-green-100"
                    : "border-red-200 bg-red-50 hover:bg-red-100"
                }`}
              >
                {/* Summary row */}
                <div className="flex items-center gap-3 p-3">
                  <div className="w-7 h-7 rounded-lg bg-white border-2 border-indigo-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-indigo-900">{i + 1}</span>
                  </div>
                  <p className="flex-1 text-sm font-bold text-indigo-900 truncate">
                    {q.question}
                  </p>
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-2 border-t border-gray-200 pt-2">
                    <p className="text-xs font-bold text-gray-500 uppercase">{q.taskRef}</p>
                    {q.options.map((opt, oi) => {
                      let cls = "text-sm px-3 py-2 rounded-lg font-bold ";
                      if (oi === q.correctIndex) {
                        cls += "bg-green-200 text-green-900 border border-green-400";
                      } else if (oi === answer?.selectedAnswer && !answer?.correct) {
                        cls += "bg-red-200 text-red-900 border border-red-400 line-through";
                      } else {
                        cls += "bg-gray-100 text-gray-500";
                      }
                      return (
                        <div key={oi} className={cls}>
                          {String.fromCharCode(65 + oi)}. {opt}
                          {oi === q.correctIndex && " ✅"}
                          {oi === answer?.selectedAnswer && oi !== q.correctIndex && " ❌"}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-4 border-indigo-100 bg-gray-50">
          <button
            onClick={onRetake}
            className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-2xl text-base font-black border-b-6 border-pink-800 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-wide"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
