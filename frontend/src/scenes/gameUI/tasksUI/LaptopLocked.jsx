import { useState, useEffect } from "react";
import { useMission } from "../../missions/MissionContext";

/**
 * LaptopLocked.jsx
 * Inside screen strictly follows Windows 11 Login UI.
 */

export default function LaptopLocked() {
  const { mission, setMission } = useMission();

  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const isVisible =
    mission.id === "TASK_5_PASSWORD_SECURITY" &&
    mission.stage === "TASK5_LAPTOP_LOCKED";

  if (!isVisible) return null;

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (pinInput.length === 0) return;

    setShake(true);
    setTimeout(() => {
      setShake(false);
      setError(true);
      setPinInput("");
    }, 400);
  };

  const handleContactAdmin = () => {
    setMission({ ...mission, stage: "TASK5_ASK_NPC_FOR_IT" });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 font-['Segoe_UI',_sans-serif] bg-black/40">
      {/* Monitor Frame — Your original frame preserved */}
      <div className="relative w-[70%] h-[90vh] bg-[#1a1a1a] rounded-2xl p-4 shadow-2xl border-b-[16px] border-x-[12px] border-t-[12px] border-[#2a2a2a] flex flex-col">
        {/* Screen: Windows OS Style */}
        <div className="relative w-full h-full overflow-hidden flex flex-col rounded-sm bg-[#004275] shadow-inner">
          {/* Windows Bloom Wallpaper Effect */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2000')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          </div>

          {/* Login Interface */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-white">
            <div
              className={`flex flex-col items-center transition-transform duration-300 ${shake ? "animate-shake" : ""}`}
            >
              {/* Profile Picture */}
              <div className="w-32 h-32 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 overflow-hidden shadow-2xl">
                <svg viewBox="0 0 24 24" className="w-20 h-20 fill-white/90">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>

              {/* Account Name */}
              <h2 className="text-3xl font-semibold mb-8 drop-shadow-md">
                Admin_Workstation
              </h2>

              {!error ? (
                /* PIN Entry State */
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col items-center w-64"
                >
                  <div className="relative w-full group">
                    <input
                      autoFocus
                      type="password"
                      placeholder="PIN"
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      className="w-full bg-black/30 border-b-2 border-white/60 px-4 py-2 text-center text-xl tracking-[0.4em] 
                               focus:outline-none focus:border-[#60cdff] focus:bg-black/50 transition-all
                               placeholder:tracking-normal placeholder:text-sm placeholder:text-white/50"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-xl"
                    >
                      
                    </button>
                  </div>
                  <button
                    type="button"
                    className="mt-4 text-xs text-white/70 hover:text-white transition-colors"
                  >
                    Sign-in options
                  </button>
                </form>
              ) : (
                /* Access Denied / Lockout State */
                <div className="flex flex-col items-center text-center max-w-sm animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-[#ff9999] font-medium mb-3 text-sm">
                    The PIN is incorrect. Try again.
                  </p>
                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-4 rounded-md shadow-lg mb-6">
                    <p className="text-xs leading-relaxed text-white/90">
                      This device has been locked by security policy. <br />
                      Reference Error:{" "}
                      <span className="font-mono text-[10px] opacity-70">
                        0x80070005
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={handleContactAdmin}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 px-10 py-2 rounded text-sm font-medium transition-all"
                  >
                    Contact Administrator
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Windows Taskbar Style Bottom Row */}
          <div className="relative z-10 h-12 flex items-center px-6 justify-end gap-5">
            <span className="text-xs font-semibold tracking-tighter">ENG</span>
            <div className="flex gap-4 opacity-90 scale-90">
              {/* Internet Icon */}
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              {/* Power Icon */}
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}
