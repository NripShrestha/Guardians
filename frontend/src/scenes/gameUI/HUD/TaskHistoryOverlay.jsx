import React, { useEffect, useState } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  School,
  Calendar,
  FileText,
  Target,
} from "lucide-react";
import { TASK_REGISTRY } from "../../missions/tasks/TaskRegistry";
import QuizReviewOverlay from "./QuizReviewOverlay";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;

export default function TaskHistoryOverlay({ onClose, taskResults, quizScore, quizHighScore, quizAnswers, onRetakeQuiz, shooterHighScore }) {
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "history"
  const [showQuizReview, setShowQuizReview] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("guardians_token");
    if (!token) return;

    axios
      .get(`${API_BASE}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) setUserData(res.data.user);
      })
      .catch(console.error);
  }, []);

  const allTasks = Object.values(TASK_REGISTRY);
  // Only show the 9 educational tasks + quiz row
  const educationalTasks = allTasks.filter(
    (t) => t.id !== "TASK_10_FINAL_QUIZ" && t.id !== "TASK_11_OUTRO"
  );

  const passCount = taskResults.filter((r) => r.result === "PASS").length;
  const failCount = taskResults.filter((r) => r.result === "FAIL").length;
  const totalReal = educationalTasks.length;

  if (showQuizReview) {
    return (
      <QuizReviewOverlay
        onClose={() => setShowQuizReview(false)}
        quizAnswers={quizAnswers}
        quizScore={quizScore}
        onRetake={() => {
          setShowQuizReview(false);
          onClose();
          if (onRetakeQuiz) onRetakeQuiz();
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-auto backdrop-blur-[2px]">
      <div className="bg-white rounded-3xl border-4 border-indigo-900 shadow-[6px_6px_0_0_#4338ca] w-[480px] max-h-[85vh] flex flex-col translate-y-[-20px] overflow-hidden">
        {/* ── PROFILE HEADER ── */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-yellow-400 border-4 border-white shadow-lg flex items-center justify-center shrink-0">
              <span className="text-3xl">
                {userData?.gender === "girl" ? "👧" : "🧒"}
              </span>
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-black text-white truncate">
                {userData?.username ?? "Hero"}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                <p className="text-indigo-200 text-sm font-bold truncate">
                  {userData?.email ?? "—"}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-indigo-200 text-xs font-bold">
                  <Calendar className="w-3 h-3" />
                  Age {userData?.age ?? "—"}
                </span>
                <span className="flex items-center gap-1 text-indigo-200 text-xs font-bold">
                  <School className="w-3 h-3" />
                  {userData?.schoolName ?? "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: "Completed", value: passCount, color: "bg-green-400" },
              { label: "Failed", value: failCount, color: "bg-red-400" },
              {
                label: "Remaining",
                value: Math.max(0, totalReal - passCount - failCount),
                color: "bg-yellow-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/10 rounded-xl p-2.5 text-center border border-white/20"
              >
                <div className={`text-xl font-black text-white`}>{s.value}</div>
                <div className="text-indigo-200 text-xs font-bold uppercase tracking-wider mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex border-b-4 border-indigo-100 bg-white">
          {[
            { id: "profile", label: "📋 Profile" },
            { id: "history", label: "📊 Missions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-black uppercase tracking-wider transition-colors ${
                activeTab === tab.id
                  ? "text-indigo-700 border-b-4 border-indigo-600 -mb-1 bg-indigo-50"
                  : "text-gray-400 hover:text-indigo-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="p-5 space-y-3">
              {[
                {
                  icon: <User className="w-4 h-4" />,
                  label: "Hero Name",
                  value: userData?.username,
                },
                {
                  icon: <Mail className="w-4 h-4" />,
                  label: "Email",
                  value: userData?.email,
                },
                {
                  icon: <Calendar className="w-4 h-4" />,
                  label: "Age",
                  value: userData?.age
                    ? `${userData.age} years old`
                    : undefined,
                },
                {
                  icon: <span className="text-sm">⚧</span>,
                  label: "Gender",
                  value: userData?.gender
                    ? userData.gender.charAt(0).toUpperCase() +
                      userData.gender.slice(1)
                    : undefined,
                },
                {
                  icon: <School className="w-4 h-4" />,
                  label: "School",
                  value: userData?.schoolName,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl border-2 border-indigo-100"
                >
                  <div className="w-8 h-8 bg-indigo-200 rounded-lg flex items-center justify-center text-indigo-700 shrink-0">
                    {row.icon}
                  </div>
                  <div>
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">
                      {row.label}
                    </p>
                    <p className="font-bold text-indigo-900">
                      {row.value ?? <span className="text-gray-300">—</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mission History Tab */}
          {activeTab === "history" && (
            <div className="p-5 space-y-3">
              {educationalTasks.map((task, idx) => {
                const resultObj = taskResults.find((r) => r.taskId === task.id);
                const status = resultObj?.result || "PENDING";

                let StatusIcon = Clock;
                let statusColor = "text-gray-400";
                let bgColor = "bg-gray-50 border-gray-200";

                if (status === "PASS") {
                  StatusIcon = CheckCircle;
                  statusColor = "text-green-500";
                  bgColor =
                    "bg-green-50 border-green-200 shadow-[2px_2px_0_0_#bbf7d0]";
                } else if (status === "FAIL") {
                  StatusIcon = XCircle;
                  statusColor = "text-red-500";
                  bgColor =
                    "bg-red-50 border-red-200 shadow-[2px_2px_0_0_#fecaca]";
                }

                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${bgColor}`}
                  >
                    <div className="text-sm font-black text-indigo-900 w-8 h-8 flex items-center justify-center bg-white rounded-xl border-2 border-indigo-100 shadow-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-indigo-900 truncate">
                        {task.name}
                      </h3>
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                        {status}
                      </p>
                    </div>
                    <StatusIcon className={`w-6 h-6 shrink-0 ${statusColor}`} />
                  </div>
                );
              })}

              {/* ── QUIZ SCORE ROW ── */}
              <div className="mt-2 pt-2 border-t-2 border-indigo-100">
                <div
                  onClick={() => {
                    if (quizScore !== null) setShowQuizReview(true);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    quizScore !== null
                      ? quizScore === 25
                        ? "bg-yellow-50 border-yellow-300 shadow-[2px_2px_0_0_#fde68a] cursor-pointer hover:bg-yellow-100"
                        : "bg-indigo-50 border-indigo-200 shadow-[2px_2px_0_0_#c7d2fe] cursor-pointer hover:bg-indigo-100"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="text-sm font-black text-indigo-900 w-8 h-8 flex items-center justify-center bg-white rounded-xl border-2 border-indigo-100 shadow-sm shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-indigo-900">
                      Final Quiz
                    </h3>
                    {quizScore !== null ? (
                      <p className="text-sm font-bold text-gray-500 mt-0.5">
                        Score: <span className={quizScore === 25 ? "text-yellow-600" : quizScore >= 15 ? "text-green-600" : "text-red-600"}>{quizScore}/25</span>
                        {quizHighScore !== null && quizHighScore > quizScore && (
                          <span className="text-xs text-gray-400 ml-2">(Best: {quizHighScore}/25)</span>
                        )}
                        <span className="text-xs text-indigo-400 ml-2">Click to review</span>
                      </p>
                    ) : (
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                        NOT TAKEN
                      </p>
                    )}
                  </div>
                  {quizScore !== null ? (
                    quizScore === 25 ? (
                      <span className="text-2xl">🏆</span>
                    ) : (
                      <CheckCircle className="w-6 h-6 text-indigo-500 shrink-0" />
                    )
                  ) : (
                    <Clock className="w-6 h-6 text-gray-400 shrink-0" />
                  )}
                </div>
              </div>

              {/* ── CYBER SHOOTER ROW ── */}
              <div className="mt-2 pt-2 border-t-2 border-indigo-100">
                <div className="flex items-center gap-3 p-3 rounded-xl border-2 bg-indigo-50 border-indigo-200">
                  <div className="text-sm font-black text-indigo-900 w-8 h-8 flex items-center justify-center bg-white rounded-xl border-2 border-indigo-100 shadow-sm shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-indigo-900">
                      Cyber Shooter
                    </h3>
                    <p className="text-sm font-bold text-gray-500 mt-0.5">
                      High Score: <span className="text-indigo-600">{shooterHighScore || 0}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
