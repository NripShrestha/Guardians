import { useState, useEffect, useRef } from "react";
import { useMission, getAuthToken } from "../../missions/MissionContext";
import { shouldShowCredits } from "../../missions/tasks/TaskRegistry";

const API_BASE = import.meta.env.VITE_API_BASE;

const CREDITS_DATA = [
  { type: "title", text: "Guardians of the Digital Realm" },
  { type: "spacer" },
  { type: "heading", text: "Game Design & Development" },
  { type: "name", text: "Nrip Shrestha" },
  { type: "spacer" },
  { type: "heading", text: "Educational Content" },
  { type: "name", text: "Cybersecurity Awareness Program" },
  { type: "spacer" },
  { type: "heading", text: "3D Art & Animation" },
  { type: "name", text: "Nrip Shrestha" },
  { type: "spacer" },
  { type: "heading", text: "UI/UX Design" },
  { type: "name", text: "Nrip Shrestha" },
  { type: "spacer" },
  { type: "heading", text: "Sound & Music" },
  { type: "name", text: "Nrip Shrestha" },
  { type: "spacer" },
  { type: "spacer" },
  { type: "heading", text: "Special Thanks" },
  { type: "name", text: "To every player who completed the journey" },
  { type: "name", text: "and became a true Digital Defender" },
  { type: "spacer" },
  { type: "spacer" },
  { type: "heading", text: "Topics Covered" },
  { type: "name", text: "Personal Data Protection" },
  { type: "name", text: "Social Engineering Detection" },
  { type: "name", text: "URL & HTTPS Security" },
  { type: "name", text: "Phishing Email Awareness" },
  { type: "name", text: "Password Security" },
  { type: "name", text: "Malvertising" },
  { type: "name", text: "Authority Impersonation Scams" },
  { type: "name", text: "Cyberbullying Awareness" },
  { type: "name", text: "Physical Cyber Threats (BadUSB)" },
  { type: "spacer" },
  { type: "spacer" },
  { type: "title", text: "🛡️" },
  { type: "spacer" },
  { type: "heading", text: "Stay Safe Online" },
  { type: "name", text: "Think before you click." },
  { type: "name", text: "Verify before you trust." },
  { type: "name", text: "Protect your digital world." },
  { type: "spacer" },
  { type: "spacer" },
  { type: "title", text: "Thank You For Playing" },
  { type: "spacer" },
  { type: "spacer" },
  { type: "spacer" },
];

export default function CreditsRoll() {
  const { mission, setMission, setTaskResults, setQuizScore, setQuizAnswers, setQuizCompletedOnce, setQuizPerfectOnce, setShooterPlays, setShooterHighscoreCount } = useMission();
  const [scrollY, setScrollY] = useState(0);
  const [done, setDone] = useState(false);
  const animRef = useRef(null);
  const startTime = useRef(null);
  const containerRef = useRef(null);

  const isActive = shouldShowCredits(mission.id, mission.stage);
  const totalHeight = CREDITS_DATA.length * 60 + 800;

  useEffect(() => {
    if (!isActive) return;
    startTime.current = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime.current;
      const speed = 0.04; // pixels per ms
      const y = elapsed * speed;
      setScrollY(y);

      if (y < totalHeight) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setDone(true);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isActive, totalHeight]);

  if (!isActive) return null;

  const handleFinish = async () => {
    // Reset progress on backend
    const token = getAuthToken();
    if (token) {
      try {
        await fetch(`${API_BASE}/progress/reset`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Reset failed:", err);
      }
    }

    // Reset local state
    setTaskResults([]);
    setQuizScore(null);
    setQuizAnswers([]);
    setQuizCompletedOnce(false);
    setQuizPerfectOnce(false);
    setShooterPlays(0);
    setShooterHighscoreCount(0);

    // Return to start
    setMission({
      id: "TASK_1_PERSONAL_DATA",
      stage: "TALK_TO_MANAGER",
      result: null,
      unsafeFields: [],
      selectedUrl: null,
      emailActions: {},
      incorrectlyHandled: [],
    });
  };

  return (
    <div className="fixed inset-0 z-[960] bg-black flex flex-col items-center justify-center font-sans overflow-hidden">
      {/* Scrolling credits */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex flex-col items-center"
        style={{
          transform: `translateY(${window.innerHeight - scrollY}px)`,
        }}
      >
        {CREDITS_DATA.map((item, i) => {
          if (item.type === "spacer") {
            return <div key={i} className="h-16" />;
          }
          if (item.type === "title") {
            return (
              <div key={i} className="py-4">
                <h1 className="text-4xl font-black text-white text-center tracking-tight">
                  {item.text}
                </h1>
              </div>
            );
          }
          if (item.type === "heading") {
            return (
              <div key={i} className="py-2">
                <h2 className="text-lg font-black text-yellow-400 uppercase tracking-[0.2em] text-center">
                  {item.text}
                </h2>
              </div>
            );
          }
          if (item.type === "name") {
            return (
              <div key={i} className="py-1">
                <p className="text-base text-gray-300 font-bold text-center">
                  {item.text}
                </p>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Skip / Finish button */}
      <button
        onClick={handleFinish}
        className={`absolute bottom-8 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
          done
            ? "bg-yellow-400 text-indigo-900 border-4 border-indigo-900 shadow-[4px_4px_0_0_#4338ca] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            : "bg-white/10 text-white/60 border border-white/20 hover:bg-white/20"
        }`}
      >
        {done ? "Start New Journey 🚀" : "Skip Credits →"}
      </button>
    </div>
  );
}
