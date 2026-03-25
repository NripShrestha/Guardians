import { useEffect, useState } from "react";
import { Award } from "lucide-react";

// Sparkle particle component
function Sparkle({ style }) {
  return (
    <div
      style={style}
      className="absolute w-3 h-3 rounded-full pointer-events-none badge-sparkle"
    />
  );
}

const BADGE_STYLES = {
  Bronze:   { text: "text-amber-700",  border: "border-amber-700",  bg: "bg-amber-50",   glow: "#b45309", particle: "#fbbf24" },
  Silver:   { text: "text-gray-400",   border: "border-gray-400",   bg: "bg-gray-50",    glow: "#9ca3af", particle: "#e5e7eb" },
  Gold:     { text: "text-yellow-500", border: "border-yellow-500", bg: "bg-yellow-50",  glow: "#eab308", particle: "#fde68a" },
  Platinum: { text: "text-slate-400",  border: "border-slate-400",  bg: "bg-slate-50",   glow: "#94a3b8", particle: "#cbd5e1" },
  Diamond:  { text: "text-cyan-400",   border: "border-cyan-400",   bg: "bg-cyan-50",    glow: "#22d3ee", particle: "#a5f3fc" },
};

const SPARKLE_COUNT = 16;

function generateSparkles(color) {
  return Array.from({ length: SPARKLE_COUNT }, (_, i) => {
    const angle = (360 / SPARKLE_COUNT) * i;
    const distance = 110 + Math.random() * 50;
    const size = 6 + Math.random() * 8;
    const delay = Math.random() * 0.3;
    return {
      key: i,
      style: {
        backgroundColor: color,
        width: `${size}px`,
        height: `${size}px`,
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%)`,
        "--angle": `${angle}deg`,
        "--distance": `${distance}px`,
        animationDelay: `${delay}s`,
      },
    };
  });
}

export default function BadgeUpgradeAnimation({ badgeName, onDone }) {
  const styles = BADGE_STYLES[badgeName] || BADGE_STYLES.Bronze;
  const sparkles = generateSparkles(styles.particle);
  const [phase, setPhase] = useState("enter"); // "enter" | "exit"

  useEffect(() => {
    // After 2.2s start exit animation, then call onDone
    const exitTimer = setTimeout(() => setPhase("exit"), 2200);
    const doneTimer = setTimeout(() => onDone(), 2900);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <>
      <style>{`
        @keyframes badge-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes badge-overlay-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes badge-card-in {
          0%   { opacity: 0; transform: scale(0.2) rotate(-15deg); }
          60%  { opacity: 1; transform: scale(1.12) rotate(4deg); }
          80%  {             transform: scale(0.96) rotate(-2deg); }
          100% { opacity: 1; transform: scale(1)    rotate(0deg); }
        }
        @keyframes badge-card-out {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.4); }
        }
        @keyframes badge-rank-up {
          0%   { transform: translateY(24px); opacity: 0; }
          50%  { transform: translateY(-6px); opacity: 1; }
          100% { transform: translateY(0);   opacity: 1; }
        }
        @keyframes badge-icon-spin {
          0%   { transform: rotate(-30deg) scale(0.5); opacity: 0; }
          60%  { transform: rotate(10deg)  scale(1.1); opacity: 1; }
          100% { transform: rotate(0deg)   scale(1);   opacity: 1; }
        }
        @keyframes badge-sparkle {
          0%   { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0)                   scale(1);   opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--distance))     scale(0);   opacity: 0; }
        }
        @keyframes badge-glow-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%       { opacity: 0.85; transform: scale(1.08); }
        }

        .badge-sparkle {
          animation: badge-sparkle 0.9s ease-out forwards;
        }
      `}</style>

      {/* Overlay — fixed so it always covers the full viewport */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          backgroundColor: "rgba(0,0,0,0.6)",
          pointerEvents: "auto",
          animation: phase === "exit"
            ? "badge-overlay-out 0.7s ease forwards"
            : "badge-overlay-in 0.35s ease forwards",
        }}
      />

      {/* Outer: fixed centering — never animated so translate is never overridden */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 201,
          pointerEvents: "none",
        }}
      >
        {/* Inner: scale/rotate/opacity animation only — no translate here */}
        <div
          style={{
            animation: phase === "exit"
              ? "badge-card-out 0.7s ease forwards"
              : "badge-card-in 0.65s cubic-bezier(0.22,1,0.36,1) forwards",
            transformOrigin: "center",
          }}
        >
        {/* Glow halo */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${styles.glow}88 0%, transparent 70%)`,
            animation: "badge-glow-pulse 1.4s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Sparkles */}
        <div style={{ position: "absolute", top: "50%", left: "50%", pointerEvents: "none" }}>
          {sparkles.map((s) => (
            <Sparkle key={s.key} style={s.style} />
          ))}
        </div>

        {/* Card itself */}
        <div
          className={`relative flex flex-col items-center gap-4 px-12 py-10 rounded-3xl border-4 ${styles.border} bg-white shadow-2xl`}
          style={{ minWidth: 280 }}
        >
          {/* RANK UP label */}
          <span
            className="text-indigo-900 font-black text-sm tracking-[0.3em] uppercase"
            style={{
              animation: "badge-rank-up 0.5s ease 0.3s both",
            }}
          >
            🎉 Rank Up!
          </span>

          {/* Badge circle */}
          <div
            className={`w-28 h-28 flex items-center justify-center rounded-full border-4 ${styles.border} ${styles.bg}`}
            style={{ animation: "badge-icon-spin 0.6s ease 0.2s both" }}
          >
            <Award className={`w-16 h-16 ${styles.text}`} />
          </div>

          {/* Badge name */}
          <div className="flex flex-col items-center gap-1">
            <span
              className={`font-black text-3xl uppercase ${styles.text}`}
              style={{ animation: "badge-rank-up 0.5s ease 0.45s both" }}
            >
              {badgeName}
            </span>
            <span
              className="text-indigo-700 font-bold text-base"
              style={{ animation: "badge-rank-up 0.5s ease 0.55s both" }}
            >
              Defender
            </span>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
