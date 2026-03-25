import { useState, useEffect, useRef } from "react";
import { useMission } from "../../missions/MissionContext";

// ─── STATIC EMAIL DATA ────────────────────────────────────────────────────────

const SCAM_EMAIL_INITIAL = {
  id: "scam_1",
  from: "security@roblux-moderator-team.com",
  fromDisplay: "Roblux Official Moderator",
  subject: "⚠️ Security Alert: Suspicious Activity Detected",
  time: "Just now",
  preview:
    "This is the Roblux Security Team. We detected suspicious activity...",
  body: `Hello.\n\nThis is the Roblux Security Team.\n\nWe detected suspicious activity on your account.\n\nYour account may have been accessed from an unknown device. To protect your account and prevent a permanent ban, you must verify your identity immediately.\n\nClick the link below to begin verification:\n\n🔗 Verify Account Here\n[ http://roblux-verify-account.net/secure ]\n\n⚠️ If verification is not completed within 5 minutes, the system may automatically suspend your account.\n\nRoblux Security Department`,
};

const MODERATOR_REPLY_1 = {
  id: "mod_reply_1",
  from: "security@roblux-moderator-team.com",
  fromDisplay: "Roblux Official Moderator",
  subject: "Re: Security Alert",
  time: "Just now",
  body: `Our system detected unusual activity.\n\nThis sometimes happens if accounts are shared.\n\nTo prevent a permanent ban we need to verify your account immediately.\n\n🔗 Verify Account Here\n[ http://roblux-verify-account.net/secure ]\n\n⚠️ If verification is not completed within 5 minutes, the system may automatically suspend your account.`,
};

const MODERATOR_REPLY_2 = {
  id: "mod_reply_2",
  from: "security@roblux-moderator-team.com",
  fromDisplay: "Roblux Official Moderator",
  subject: "Re: Security Alert",
  time: "Just now",
  body: `Verification must be completed now.\n\nFailure to verify within the time limit will result in immediate account suspension.\n\nThis is your final warning.`,
};

const OTHER_EMAILS = [
  {
    id: "e_hr",
    from: "hr@guardian-corp.com",
    fromDisplay: "HR Department",
    subject: "Welcome to Guardian Corp! 🛡️",
    time: "Yesterday",
    preview: "We're glad to have you on the team...",
    body: "Welcome to the team! We're excited to have you on board.",
  },
  {
    id: "e_it",
    from: "it@guardian-corp.com",
    fromDisplay: "IT Support",
    subject: "Your workstation setup is complete",
    time: "2 days ago",
    preview: "Your training workstation is now ready...",
    body: "Your workstation has been configured and is ready for use.",
  },
];

// ─── COUNTDOWN TIMER ──────────────────────────────────────────────────────────

function CountdownTimer() {
  const [seconds, setSeconds] = useState(299);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return (
    <span
      style={{ color: "#ff4444", fontWeight: 800, fontFamily: "monospace" }}
    >
      {m}:{s.toString().padStart(2, "0")}
    </span>
  );
}

// ─── FAKE ROBLUX VERIFICATION WEBSITE ────────────────────────────────────────

function FakeRobluxSite({ onSubmit }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    securityAnswer: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = true;
    if (!formData.password.trim()) newErrors.password = true;
    if (!formData.email.trim()) newErrors.email = true;
    if (!formData.securityAnswer.trim()) newErrors.securityAnswer = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setTimeout(() => onSubmit(), 1200);
  };

  const inputStyle = (field) => ({
    width: "100%",
    background: "#1a1a24",
    border: `1px solid ${
      errors[field] ? "#ff4444" : focusedField === field ? "#00b2ff" : "#393b4f"
    }`,
    borderRadius: "4px",
    padding: "10px 14px",
    color: "#ffffff",
    fontSize: "13px",
    fontFamily: "'Nunito', 'Arial', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  });

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 700,
    color: "#9b9bae",
    marginBottom: "6px",
    fontFamily: "'Nunito', 'Arial', sans-serif",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  const errorStyle = {
    color: "#ff4444",
    fontSize: "10px",
    marginTop: "4px",
    fontFamily: "'Nunito', 'Arial', sans-serif",
  };

  return (
    <div
      style={{
        flex: 1,
        margin: "8px",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #444",
        zIndex: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      {/* ── Fake browser chrome ── */}
      <div
        style={{
          background: "#2b2b3b",
          borderBottom: "1px solid #3a3a4a",
          flexShrink: 0,
        }}
      >
        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            padding: "6px 8px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#1e1e2e",
              border: "1px solid #3a3a4a",
              borderBottom: "1px solid #1e1e2e",
              borderRadius: "6px 6px 0 0",
              padding: "6px 14px",
              fontSize: 11,
              color: "#ccc",
              maxWidth: 280,
            }}
          >
            <span style={{ color: "#888", fontSize: 10 }}>🌐</span>
            <span
              style={{
                color: "#ff4444",
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              roblux-verify-account.net
            </span>
            <span style={{ color: "#666", marginLeft: 4, cursor: "pointer" }}>
              ✕
            </span>
          </div>
        </div>
        {/* Address bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px 8px",
          }}
        >
          {["←", "→", "↻"].map((btn) => (
            <button
              key={btn}
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "none",
                background: "transparent",
                color: "#888",
                cursor: "pointer",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {btn}
            </button>
          ))}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#1a1a26",
              border: "1.5px solid #ff4444",
              borderRadius: 20,
              padding: "5px 14px",
              fontSize: 12,
            }}
          >
            <span style={{ color: "#ff4444", fontWeight: 700, fontSize: 11 }}>
              ⚠ Not secure
            </span>
            <span style={{ color: "#777", marginLeft: 4 }}>
              roblux-verify-account.net/secure
            </span>
          </div>
        </div>
      </div>

      {/* ── Page content ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#1a1a24",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Roblox-style top nav */}
        <div
          style={{
            background: "#1a1a24",
            borderBottom: "1px solid #2a2a3a",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            height: 52,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              marginRight: 24,
            }}
          >
            <div
              style={{
                fontFamily: "'Arial Black', 'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: 22,
                color: "#ffffff",
                letterSpacing: "-1px",
                transform: "skewX(-8deg)",
                display: "inline-block",
              }}
            >
              ROBLUX
            </div>
          </div>

          {["Games", "Avatar", "Social", "Shop", "Robux"].map((item) => (
            <span
              key={item}
              style={{
                color: "#9b9bae",
                fontSize: 13,
                marginRight: 20,
                cursor: "pointer",
                fontFamily: "'Nunito', 'Arial', sans-serif",
                fontWeight: 600,
              }}
            >
              {item}
            </span>
          ))}

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "#262636",
                border: "1px solid #393b4f",
                borderRadius: 20,
                padding: "5px 14px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: "#9b9bae",
                cursor: "pointer",
              }}
            >
              <span style={{ color: "#ffcc00", fontSize: 13 }}>R$</span>
              <span>0</span>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#00b2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              JD
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 16px",
            background: "linear-gradient(160deg, #1a1a24 0%, #0d0d18 100%)",
          }}
        >
          <div style={{ width: "100%", maxWidth: 420 }}>
            <div
              style={{
                background: "#262636",
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 4px 40px rgba(0,0,0,0.5)",
                border: "1px solid #393b4f",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  background: "#444",
                  padding: "20px 24px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 6 }}>🔐</div>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 17,
                    fontFamily: "'Nunito', 'Arial Black', sans-serif",
                    letterSpacing: "-0.2px",
                  }}
                >
                  Account Verification Required
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 12,
                    marginTop: 4,
                    fontFamily: "'Nunito', 'Arial', sans-serif",
                  }}
                >
                  Your account has been flagged for suspicious activity
                </div>
              </div>

              {/* Countdown banner */}
              <div
                style={{
                  background: "#1e0a0a",
                  borderBottom: "1px solid #3a1a1a",
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                }}
              >
                <span style={{ color: "#ff4444", fontWeight: 700 }}>
                  ⚠ WARNING:
                </span>
                <span style={{ color: "#9b9bae" }}>Account suspension in</span>
                <CountdownTimer />
              </div>

              {/* Form body */}
              <div style={{ padding: "24px 24px 20px" }}>
                {/* Global error message */}
                {Object.keys(errors).length > 0 && (
                  <div
                    style={{
                      background: "#2a0a0a",
                      border: "1px solid #ff4444",
                      borderRadius: 4,
                      padding: "10px 14px",
                      marginBottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span style={{ color: "#ff4444", fontSize: 14 }}>⚠</span>
                    <span
                      style={{
                        color: "#ff6666",
                        fontSize: 12,
                        fontFamily: "'Nunito', 'Arial', sans-serif",
                      }}
                    >
                      Please fill in all required fields to verify your account.
                    </span>
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>
                    Username <span style={{ color: "#ff4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({ ...formData, username: e.target.value });
                      if (errors.username)
                        setErrors({ ...errors, username: false });
                    }}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your Roblux username"
                    style={inputStyle("username")}
                  />
                  {errors.username && (
                    <p style={errorStyle}>Username is required.</p>
                  )}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>
                    Password <span style={{ color: "#ff4444" }}>*</span>
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password)
                        setErrors({ ...errors, password: false });
                    }}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    style={inputStyle("password")}
                  />
                  {errors.password && (
                    <p style={errorStyle}>Password is required.</p>
                  )}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>
                    Email Address <span style={{ color: "#ff4444" }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: false });
                    }}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your email"
                    style={inputStyle("email")}
                  />
                  {errors.email && (
                    <p style={errorStyle}>Email address is required.</p>
                  )}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>
                    Security Question: What was your first pet's name?{" "}
                    <span style={{ color: "#ff4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.securityAnswer}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        securityAnswer: e.target.value,
                      });
                      if (errors.securityAnswer)
                        setErrors({ ...errors, securityAnswer: false });
                    }}
                    onFocus={() => setFocusedField("security")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Your answer"
                    style={inputStyle("securityAnswer")}
                  />
                  {errors.securityAnswer && (
                    <p style={errorStyle}>Security answer is required.</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 4,
                    border: "none",
                    background: submitting ? "#444" : "#00b2ff",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "'Nunito', 'Arial Black', sans-serif",
                    letterSpacing: "0.03em",
                    transition: "background 0.15s",
                    textTransform: "uppercase",
                  }}
                >
                  {submitting ? "Verifying..." : "Verify Account"}
                </button>

                <p
                  style={{
                    textAlign: "center",
                    color: "#525268",
                    fontSize: 10,
                    marginTop: 14,
                    fontFamily: "'Nunito', 'Arial', sans-serif",
                    lineHeight: 1.5,
                  }}
                >
                  🔒 Secured by Roblux Security Systems
                  <br />
                  By verifying, you agree to our{" "}
                  <span style={{ color: "#00b2ff", cursor: "pointer" }}>
                    Terms of Use
                  </span>{" "}
                  and{" "}
                  <span style={{ color: "#00b2ff", cursor: "pointer" }}>
                    Privacy Policy
                  </span>
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                marginTop: 16,
                fontSize: 12,
                color: "#525268",
                fontFamily: "'Nunito', 'Arial', sans-serif",
              }}
            >
              <span style={{ cursor: "pointer", color: "#00b2ff" }}>About</span>
              <span style={{ cursor: "pointer", color: "#00b2ff" }}>Blog</span>
              <span style={{ cursor: "pointer", color: "#00b2ff" }}>
                Support
              </span>
              <span style={{ cursor: "pointer", color: "#00b2ff" }}>
                Careers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BLACK SCREEN SHUTDOWN ────────────────────────────────────────────────────

function ShutdownScreen({ onComplete }) {
  const [phase, setPhase] = useState("data");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("bsod"), 2000);
    const t2 = setTimeout(() => setPhase("black"), 5000);
    const t3 = setTimeout(() => onComplete(), 7000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "data") {
    return (
      <div className="absolute inset-0 bg-black z-[500] flex items-center justify-center">
        <div className="text-green-400 font-mono text-xs space-y-1 text-left w-96">
          <p className="text-green-300 animate-pulse">
            ⚠ WARNING: Unauthorized access detected
          </p>
          <p>Collecting credentials... ████████████ 100%</p>
          <p>Uploading to remote server...</p>
          <p className="text-red-400">ERROR: System compromised</p>
          <p>Initiating shutdown sequence...</p>
        </div>
      </div>
    );
  }

  if (phase === "bsod") {
    return (
      <div className="absolute inset-0 bg-[#0078D7] z-[500] flex items-center justify-center">
        <div className="text-white text-center max-w-lg">
          <div className="text-6xl mb-6">:(</div>
          <p className="text-2xl font-bold mb-4">Your PC ran into a problem</p>
          <p className="text-sm opacity-80 mb-6">
            A critical error has been detected and your session has been
            terminated to prevent further damage.
          </p>
          <p className="text-xs font-mono opacity-60">
            CRITICAL_SECURITY_BREACH (0x0000009F)
          </p>
          <div className="mt-8 text-sm opacity-70">Shutting down... 0%</div>
        </div>
      </div>
    );
  }

  return <div className="absolute inset-0 bg-black z-[500]" />;
}

// ─── DESKTOP ICON ─────────────────────────────────────────────────────────────

function DesktopIcon({ icon, label, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 group w-16 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div
        className={`text-2xl w-10 h-10 flex items-center justify-center rounded-lg transition-all ${!disabled && "group-hover:bg-white/20"}`}
      >
        {icon}
      </div>
      <span className="text-[9px] text-white text-center font-medium drop-shadow-sm">
        {label}
      </span>
    </button>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function FakeModeratorClient() {
  const { mission, setMission } = useMission();

  const [emailArrived, setEmailArrived] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emails, setEmails] = useState([...OTHER_EMAILS]);
  const [screen, setScreen] = useState("gmail");
  const [chatPhase, setChatPhase] = useState("initial");
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showQuestionOptions, setShowQuestionOptions] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const [blockedApp, setBlockedApp] = useState(null);

  const isVisible =
    mission.id === "TASK_7_FAKE_MODERATOR" &&
    mission.stage === "TASK7_DESKTOP_EMAIL";

  useEffect(() => {
    if (!isVisible || emailArrived) return;
    const t = setTimeout(() => {
      setEmails([SCAM_EMAIL_INITIAL, ...OTHER_EMAILS]);
      setEmailArrived(true);
    }, 2000);
    return () => clearTimeout(t);
  }, [isVisible, emailArrived]);

  if (!isVisible) return null;

  const isScamEmail = (e) =>
    e?.id === "scam_1" || e?.id === "mod_reply_1" || e?.id === "mod_reply_2";

  const handleEmailAction = (action) => {
    setShowActionMenu(false);
    if (action === "report" || action === "delete") {
      setChatPhase("reported");
      setSelectedEmail(null);
      setEmails((prev) => prev.filter((e) => e.id !== "scam_1"));
      setTimeout(() => {
        setMission({
          ...mission,
          stage: "TASK7_RETURN_TO_MANAGER",
          result: "PASS",
        });
      }, 1500);
    }
  };

  const handleReply = () => {
    setShowReplyBox(false);
    setReplyText("");
    const updated = emails.map((e) =>
      e.id === "scam_1" ? { ...MODERATOR_REPLY_1, id: "scam_1" } : e,
    );
    setEmails(updated);
    setSelectedEmail({ ...MODERATOR_REPLY_1, id: "scam_1" });
    setChatPhase("replied");
    setShowActionMenu(true);
  };

  const handleClickLink = () => {
    setScreen("fakesite");
    setChatPhase("clickedlink");
    setShowActionMenu(false);
  };

  const handleFormSubmit = () => {
    setScreen("gmail");
    setShowShutdown(true);
  };

  const handleShutdownComplete = () => {
    setMission({
      ...mission,
      stage: "TASK7_RETURN_TO_MANAGER",
      result: "FAIL",
    });
  };

  const handleQuestion = () => {
    setShowActionMenu(false);
    setShowQuestionOptions(true);
  };

  const handleQuestionChoice = () => {
    setShowQuestionOptions(false);
    setEmails((prev) => {
      const withoutScam = prev.filter((e) => e.id !== "scam_1");
      return [MODERATOR_REPLY_2, ...withoutScam];
    });
    setSelectedEmail(MODERATOR_REPLY_2);
    setChatPhase("questioned");
    setTimeout(() => setChatPhase("showRefuse"), 500);
  };

  const handleRefuse = () => {
    setChatPhase("refused");
    setTimeout(() => {
      setMission({
        ...mission,
        stage: "TASK7_RETURN_TO_MANAGER",
        result: "PASS",
      });
    }, 1500);
  };

  const renderEmailActions = () => {
    if (!selectedEmail || !isScamEmail(selectedEmail)) return null;

    if (chatPhase === "initial") {
      return (
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setShowReplyBox(true)}
            className="px-4 py-2 bg-[#1a73e8] text-white text-xs font-bold rounded-full hover:bg-[#1558b0] transition-colors"
          >
            ↩ Reply
          </button>
          <button
            onClick={handleQuestion}
            className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-full hover:bg-orange-600 transition-colors"
          >
            ❓ This Seems Suspicious
          </button>
          <button
            onClick={() => handleEmailAction("report")}
            className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-full hover:bg-red-600 transition-colors"
          >
            🚫 Report
          </button>
          <button
            onClick={() => handleEmailAction("delete")}
            className="px-4 py-2 bg-gray-500 text-white text-xs font-bold rounded-full hover:bg-gray-600 transition-colors"
          >
            🗑️ Delete
          </button>
        </div>
      );
    }

    if (chatPhase === "replied") {
      return (
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={handleClickLink}
            className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-full hover:bg-red-700 transition-colors"
          >
            🔗 Verify Account Here
          </button>
          <button
            onClick={handleQuestion}
            className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-full hover:bg-orange-600 transition-colors"
          >
            ❓ I Don't Trust This Link
          </button>
          <button
            onClick={() => handleEmailAction("report")}
            className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-full hover:bg-red-600 transition-colors"
          >
            🚫 Report
          </button>
        </div>
      );
    }

    if (chatPhase === "showRefuse") {
      return (
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={handleRefuse}
            className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-full hover:bg-green-700 transition-colors"
          >
            ✋ I Refuse — This Is Suspicious
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 font-sans bg-black/20">
      <div className="relative w-[70%] h-[90vh] bg-[#1a1a1a] rounded-2xl p-4 shadow-2xl border-b-[16px] border-x-[12px] border-t-[12px] border-[#2a2a2a] flex flex-col">
        <div className="relative w-full h-full bg-[#0078D7] overflow-hidden flex flex-col rounded-sm">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent pointer-events-none" />

          <div className="flex-1 flex overflow-hidden">
            {/* Desktop Icons */}
            <div className="w-20 p-4 flex flex-col gap-6 z-10">
              <DesktopIcon
                icon="📧"
                label="Gmail"
                onClick={() => setScreen("gmail")}
              />
              <DesktopIcon
                icon="📂"
                label="Files"
                disabled
                onClick={() => setBlockedApp("File Explorer")}
              />
              <DesktopIcon
                icon="🌐"
                label="Browser"
                disabled
                onClick={() => setBlockedApp("Browser")}
              />
            </div>

            {/* ── GMAIL ── */}
            {screen === "gmail" && (
              <div className="flex-1 m-2 bg-[#f6f8fc] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-300 z-20">
                <div className="h-16 flex items-center px-4 gap-4 bg-[#f6f8fc] border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center gap-1 min-w-[200px]">
                    {[
                      ["G", "#EA4335"],
                      ["m", "#4285F4"],
                      ["a", "#34A853"],
                      ["i", "#FBBC05"],
                      ["l", "#EA4335"],
                    ].map(([l, c], i) => (
                      <span
                        key={i}
                        className="font-bold text-2xl leading-none"
                        style={{ color: c }}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                  <div className="flex-1 max-w-2xl">
                    <div className="bg-[#eaf1fb] h-11 rounded-full flex items-center px-5 gap-3 text-sm text-gray-500">
                      <span>🔍</span>
                      <span>Search mail</span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#1a73e8] text-white text-sm font-bold flex items-center justify-center ml-auto">
                    JD
                  </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                  <div className="w-56 flex-shrink-0 pt-2 flex flex-col bg-[#f6f8fc]">
                    <div className="mx-3 mb-3">
                      <button className="flex items-center gap-3 bg-[#c2e7ff] px-4 py-3 rounded-2xl text-sm font-medium text-[#001d35] w-full">
                        ✉️ Compose
                      </button>
                    </div>
                    {[
                      {
                        icon: "📥",
                        label: "Inbox",
                        count: emails.length,
                        active: true,
                      },
                      { icon: "⭐", label: "Starred" },
                      { icon: "📤", label: "Sent" },
                      { icon: "📝", label: "Drafts" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`flex items-center gap-4 px-4 py-2 rounded-r-full text-sm cursor-pointer ${item.active ? "bg-[#d3e3fd] font-bold text-[#001d35]" : "text-gray-600 hover:bg-gray-200"}`}
                      >
                        <span>{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                        {item.count > 0 && (
                          <span className="text-xs font-bold">
                            {item.count}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-1 overflow-hidden bg-white rounded-tl-3xl">
                    <div className="w-80 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
                      <div className="h-12 flex items-center px-3 border-b border-gray-100">
                        <span className="ml-auto text-xs text-gray-400">
                          {emails.length} messages
                        </span>
                      </div>
                      {!emailArrived && (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                          <div className="text-3xl mb-2">📭</div>
                          <p className="text-xs">Waiting for mail...</p>
                        </div>
                      )}
                      {emails.map((e, idx) => {
                        const isScam =
                          e.id === "scam_1" ||
                          e.id === "mod_reply_1" ||
                          e.id === "mod_reply_2";
                        return (
                          <div
                            key={e.id}
                            onClick={() => setSelectedEmail(e)}
                            className={`flex items-center px-3 py-3 cursor-pointer border-b border-gray-50 group ${selectedEmail?.id === e.id ? "bg-[#e8f0fe]" : "hover:bg-gray-50"}`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0 ${isScam ? "bg-red-500" : "bg-gray-300 text-gray-700"}`}
                            >
                              {isScam
                                ? "🎮"
                                : e.fromDisplay
                                    .split(" ")
                                    .map((w) => w[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center mb-0.5">
                                <span
                                  className={`text-xs truncate ${isScam && idx === 0 ? "font-black text-red-900" : "text-gray-600"}`}
                                >
                                  {e.fromDisplay}
                                </span>
                                <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">
                                  {e.time}
                                </span>
                              </div>
                              <div
                                className={`text-xs truncate ${isScam ? "font-bold text-gray-800" : "text-gray-500"}`}
                              >
                                {e.subject}
                              </div>
                              <div className="text-[11px] text-gray-400 truncate">
                                {e.preview || e.body?.slice(0, 60) + "..."}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      {selectedEmail ? (
                        <div className="p-6">
                          <h2 className="text-xl font-normal text-gray-800 mb-4">
                            {selectedEmail.subject}
                          </h2>
                          <div className="flex items-start gap-3 mb-5 pb-4 border-b border-gray-100">
                            <div
                              className={`w-10 h-10 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0 ${isScamEmail(selectedEmail) ? "bg-red-500" : "bg-[#1a73e8]"}`}
                            >
                              {isScamEmail(selectedEmail)
                                ? "🎮"
                                : selectedEmail.fromDisplay
                                    ?.split(" ")
                                    .map((w) => w[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">
                                {selectedEmail.fromDisplay}
                              </div>
                              <div className="text-xs text-gray-400">
                                &lt;{selectedEmail.from}&gt;
                              </div>
                              <div className="text-xs text-gray-400">to me</div>
                            </div>
                            <div className="ml-auto text-xs text-gray-400">
                              {selectedEmail.time}
                            </div>
                          </div>
                          <pre className="text-sm font-sans whitespace-pre-wrap text-gray-800 leading-relaxed">
                            {selectedEmail.body}
                          </pre>
                          {renderEmailActions()}
                          {showQuestionOptions && (
                            <div className="mt-4 space-y-2">
                              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                Choose your response:
                              </p>
                              {[
                                "I will contact official support instead.",
                                "I don't trust this link.",
                                "This message seems suspicious.",
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  onClick={handleQuestionChoice}
                                  className="w-full text-left px-4 py-2.5 bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold rounded-xl hover:bg-orange-100 transition-colors"
                                >
                                  → {opt}
                                </button>
                              ))}
                            </div>
                          )}
                          {showReplyBox && (
                            <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
                              <div className="bg-gray-50 px-4 py-2 text-xs text-gray-500 border-b border-gray-200">
                                Reply to: {selectedEmail.from}
                              </div>
                              <div className="p-3">
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder='Type "What happened?" and press Send'
                                  className="w-full text-sm border-none outline-none resize-none min-h-[60px] text-gray-700"
                                />
                              </div>
                              <div className="bg-gray-50 px-4 py-2 flex gap-2">
                                <button
                                  onClick={handleReply}
                                  className="px-5 py-1.5 bg-[#1a73e8] text-white text-xs font-bold rounded-full hover:bg-[#1558b0]"
                                >
                                  Send
                                </button>
                                <button
                                  onClick={() => setShowReplyBox(false)}
                                  className="px-4 py-1.5 text-gray-500 text-xs hover:bg-gray-200 rounded-full"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          {chatPhase === "reported" ? (
                            <div className="text-center">
                              <div className="text-4xl mb-3">✅</div>
                              <p className="text-sm font-bold text-green-600">
                                Email reported successfully
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Returning to office...
                              </p>
                            </div>
                          ) : chatPhase === "refused" ? (
                            <div className="text-center">
                              <div className="text-4xl mb-3">✅</div>
                              <p className="text-sm font-bold text-green-600">
                                You refused the suspicious request
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Returning to office...
                              </p>
                            </div>
                          ) : (
                            <>
                              <div className="text-3xl mb-2">📬</div>
                              <p className="text-xs">Select an email to read</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── FAKE ROBLUX SITE ── */}
            {screen === "fakesite" && (
              <FakeRobluxSite onSubmit={handleFormSubmit} />
            )}
          </div>

          {/* Taskbar */}
          <div className="h-12 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center px-2 gap-1 z-[100] flex-shrink-0">
            <div className="w-10 h-10 flex items-center justify-center text-blue-400 text-2xl hover:bg-white/10 rounded cursor-pointer">
              ⊞
            </div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded cursor-pointer ${screen === "gmail" ? "bg-white/10 border-b-2 border-blue-500" : "hover:bg-white/10"}`}
              onClick={() => setScreen("gmail")}
            >
              <span
                className="text-sm font-bold"
                style={{ color: screen === "gmail" ? "#EA4335" : "#aaa" }}
              >
                M
              </span>
            </div>
            {screen === "fakesite" && (
              <div className="w-10 h-10 flex items-center justify-center bg-white/10 border-b-2 border-blue-500 rounded">
                <span className="text-sm">🌐</span>
              </div>
            )}
            <div className="ml-auto flex items-center px-4 text-white/90 text-[11px] leading-tight text-right">
              <div>
                <div>
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div>{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {showShutdown && (
            <ShutdownScreen onComplete={handleShutdownComplete} />
          )}
        </div>
        {/* Monitor Neck (No Stand) */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-32 md:w-48 h-[50vh] bg-gradient-to-b from-[#111] to-[#050505] border-x-[12px] border-[#222] -z-10 shadow-[inset_0_30px_30px_rgba(0,0,0,0.8)]">
          <div className="w-full h-full flex justify-center">
            <div className="w-12 border-x border-[#1a1a1a] h-full"></div>
          </div>
        </div>
      </div>

      {blockedApp && (
        <div className="absolute inset-0 z-[200] bg-black/60 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 max-w-sm text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">
              Restricted Access
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              The {blockedApp} is currently locked by the administrator.
            </p>
            <button
              onClick={() => setBlockedApp(null)}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors"
            >
              Back to Training
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
