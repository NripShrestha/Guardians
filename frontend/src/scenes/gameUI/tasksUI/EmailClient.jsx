import { useState, useEffect } from "react";
import { useMission } from "../../missions/MissionContext";

// --- CONSTANTS & HELPERS ---
const EMAILS = [
  {
    id: "email_1",
    type: "dangerous",
    from: "security-alert@paypa1-support.com",
    fromDisplay: "PayPal Security Team",
    subject: "⚠️ URGENT: Your account has been suspended",
    time: "9:02 AM",
    preview: "Immediate action required to restore your account access...",
    body: `Dear Valued Customer,\n\nWe have detected suspicious activity on your PayPal account. Your account has been temporarily suspended to protect you.\n\nTo restore access immediately, click the link below and verify your identity:\n\n👉 http://paypa1-verify.support/restore-account\n\nYou must complete this within 24 HOURS or your account will be permanently closed.\n\nPayPal Security Department`,
  },
  {
    id: "email_2",
    type: "dangerous",
    from: "it-helpdesk@company-support-desk.net",
    fromDisplay: "IT Help Desk",
    subject: "Action Required: Reset your company password NOW",
    time: "10:15 AM",
    preview: "Your password expires in 2 hours. Click here to reset...",
    body: `Hello Employee,\n\nYour company network password expires in 2 hours. If you do not reset it immediately, you will lose access to all company systems.\n\nClick here to reset your password:\nhttp://company-support-desk.net/password-reset\n\nThis is an automated message from IT. Do not reply.`,
  },
  {
    id: "email_3",
    type: "dangerous",
    from: "hr-department@hrm4nail.org",
    fromDisplay: "HR Department",
    subject: "Your salary adjustment — Open attachment",
    time: "11:47 AM",
    preview: "Please review the attached salary revision document...",
    body: `Dear Team Member,\n\nFollowing the recent company-wide performance review, we have made adjustments to employee compensation packages.\n\nYour revised salary details are included in the attachment below.\n\n📎 salary_revision_2024.exe\n\nPlease open the file and follow the instructions to acknowledge receipt.\n\nBest regards,\nHuman Resources`,
  },
  {
    id: "email_4",
    type: "safe",
    from: "newsletter@nationalgeographic.com",
    fromDisplay: "National Geographic",
    subject: "This week: The deepest caves on Earth 🌍",
    time: "8:30 AM",
    preview: "Explore what lies beneath — our latest documentary series...",
    body: `Hi there,\n\nThis week on National Geographic, we're going underground.\n\n🕳️ Featured: The World's Deepest Caves\nOur team spent 3 months documenting explorers in the Veryovkina Cave system — the deepest known cave on Earth.\n\nWatch here: https://www.nationalgeographic.com/explore/caves`,
  },
  {
    id: "email_5",
    type: "safe",
    from: "no-reply@schoolportal.edu",
    fromDisplay: "School Portal",
    subject: "Your homework has been approved 🎉",
    time: "2:14 PM",
    preview:
      "Your math homework has been checked and approved by your teacher...",
    body: `Hi there!\n\nGood news!\n\nYour homework has been successfully checked and approved by your teacher.\n\nSubject: Mathematics\nAssignment: Chapter 5 – Word Problems\nReviewed by: Ms. Sarah\n\nGreat job and keep up the good work!\n\n– School Portal Team`,
  },
];

function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// --- SUBCOMPONENTS ---

function DesktopIcon({ icon, label, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 group w-16 select-none ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
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

export default function EmailClient() {
  const { mission, setMission } = useMission();
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailActions, setEmailActions] = useState({});
  const [blockedApp, setBlockedApp] = useState(null);

  const isVisible =
    mission.id === "TASK_4_EMAIL_SECURITY" &&
    mission.stage === "TASK4_DESKTOP_EMAIL";
  if (!isVisible) return null;

  const handleAction = (id, action) => {
    setEmailActions((prev) => ({ ...prev, [id]: action }));
    if (selectedEmail?.id === id) setSelectedEmail(null);
  };

  const allHandled = EMAILS.every((e) => emailActions[e.id]);

  const handleSubmit = () => {
    if (!allHandled) return;
    const dangerousEmails = EMAILS.filter((e) => e.type === "dangerous");
    const passed = dangerousEmails.every(
      (e) => emailActions[e.id] === "spam" || emailActions[e.id] === "trash",
    );

    setMission({
      ...mission,
      stage: "TASK4_RETURN_TO_MANAGER",
      result: passed ? "PASS" : "FAIL",
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 font-sans bg-black/20">
      {/* Hardware Monitor Frame */}
      <div className="relative w-[70%] h-[90vh] bg-[#1a1a1a] rounded-2xl p-4 shadow-2xl border-b-[16px] border-x-[12px] border-t-[12px] border-[#2a2a2a] flex flex-col">
        {/* Screen Area (Desktop) */}
        <div className="relative w-full h-full bg-[#0078D7] overflow-hidden flex flex-col rounded-sm">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent pointer-events-none" />

          {/* Desktop App Layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Desktop Icons Sidebar */}
            <div className="w-20 p-4 flex flex-col gap-6 z-10">
              <DesktopIcon icon="📧" label="Gmail" onClick={() => {}} />
              <DesktopIcon
                icon="📂"
                label="Files"
                disabled
                onClick={() => setBlockedApp("File Explorer")}
              />
              <DesktopIcon
                icon="🌐"
                label="Edge"
                disabled
                onClick={() => setBlockedApp("Browser")}
              />
            </div>

            {/* Gmail Application Window */}
            <div className="flex-1 m-2 bg-[#f6f8fc] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-300 z-20">
              {/* Gmail Top Bar */}
              <div className="h-16 flex items-center px-4 gap-4 bg-[#f6f8fc]">
                <div className="flex items-center gap-2 min-w-[150px]">
                  <span className="text-red-500 text-2xl font-bold">M</span>
                  <span className="text-gray-600 text-lg font-medium">
                    Gmail
                  </span>
                </div>
                <div className="flex-1 max-w-2xl">
                  <div className="bg-[#eaf1fb] h-12 rounded-full flex items-center px-6 text-sm text-gray-600 focus-within:bg-white focus-within:shadow-md transition-all">
                    🔍 Search mail
                  </div>
                </div>
                <div className="w-8 h-8 bg-blue-700 rounded-full text-xs text-white flex items-center justify-center font-bold">
                  JD
                </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Gmail Sidebar */}
                <div className="w-64 pt-2 flex flex-col">
                  <div className="mx-2 mb-4 bg-[#c2e7ff] hover:shadow-lg transition-all py-4 px-6 rounded-2xl w-max text-sm font-medium flex items-center gap-3 cursor-pointer text-[#001d35]">
                    ✏️ Compose
                  </div>
                  <div className="bg-[#d3e3fd] text-[#001d35] font-bold px-6 py-2 rounded-r-full text-sm flex items-center gap-4">
                    📥 Inbox{" "}
                    <span className="ml-auto text-xs">{EMAILS.length}</span>
                  </div>
                  {["Starred", "Snoozed", "Sent", "Drafts"].map((item) => (
                    <div
                      key={item}
                      className="px-6 py-2 text-gray-600 text-sm flex items-center gap-4 hover:bg-gray-200 rounded-r-full cursor-not-allowed"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Email List / Detail View */}
                <div className="flex-1 flex flex-col bg-white rounded-tl-3xl shadow-inner overflow-hidden">
                  {selectedEmail ? (
                    <div className="flex flex-col h-full">
                      {/* Detail Toolbar */}
                      <div className="h-12 border-b flex items-center px-4 gap-2">
                        <button
                          onClick={() => setSelectedEmail(null)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                        >
                          ⬅
                        </button>
                        <div className="flex gap-1 ml-4">
                          {[
                            { icon: "🗑️", label: "trash" },
                            { icon: "🚫", label: "spam" },
                            { icon: "📥", label: "archive" },
                          ].map((btn) => (
                            <button
                              key={btn.label}
                              onClick={() =>
                                handleAction(selectedEmail.id, btn.label)
                              }
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors text-lg"
                              title={btn.label}
                            >
                              {btn.icon}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="p-8 overflow-y-auto">
                        <h2 className="text-2xl text-gray-800 mb-6 font-normal">
                          {selectedEmail.subject}
                        </h2>
                        <div className="flex gap-4 mb-8">
                          <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold">
                            {getInitials(selectedEmail.fromDisplay)}
                          </div>
                          <div>
                            <div className="text-sm">
                              <span className="font-bold">
                                {selectedEmail.fromDisplay}
                              </span>
                              <span className="text-gray-500 ml-2">
                                &lt;{selectedEmail.from}&gt;
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">to me</div>
                          </div>
                        </div>
                        <pre className="text-sm font-sans whitespace-pre-wrap text-gray-800 leading-relaxed max-w-3xl">
                          {selectedEmail.body}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto">
                      {EMAILS.map((email) => (
                        <div
                          key={email.id}
                          onClick={() => setSelectedEmail(email)}
                          className={`flex items-center px-4 py-2 border-b border-gray-100 cursor-pointer hover:shadow-md hover:z-10 transition-all group ${emailActions[email.id] ? "bg-gray-100 opacity-60" : "bg-white"}`}
                        >
                          <div className="w-6 text-gray-300 group-hover:text-gray-400">
                            ⋮⋮
                          </div>
                          <div
                            className={`w-48 text-sm truncate mr-4 ${!emailActions[email.id] ? "font-bold text-gray-900" : "text-gray-500"}`}
                          >
                            {email.fromDisplay}
                          </div>
                          <div className="flex-1 text-sm truncate pr-10">
                            <span
                              className={
                                !emailActions[email.id] ? "font-bold" : ""
                              }
                            >
                              {email.subject}
                            </span>
                            <span className="text-gray-500 font-normal">
                              {" "}
                              - {email.preview}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 font-medium ml-auto">
                            {email.time}
                          </div>
                          {emailActions[email.id] && (
                            <div className="ml-4 text-[10px] bg-gray-200 px-2 py-0.5 rounded text-gray-600 font-bold uppercase">
                              {emailActions[email.id]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Windows Taskbar */}
          <div className="h-12 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center px-2 gap-1 z-[100]">
            <div className="w-10 h-10 flex items-center justify-center text-blue-400 text-2xl hover:bg-white/10 rounded transition-colors cursor-pointer">
              ⊞
            </div>
            <div className="w-10 h-10 flex items-center justify-center bg-white/10 border-b-2 border-blue-500">
              <span className="text-red-400 text-sm font-bold">M</span>
            </div>
            <div className="ml-auto flex items-center px-4 gap-4 text-white/90 text-[11px] text-right">
              <div className="leading-tight">
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

          {/* Submission Overlay */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-8 border border-gray-200 z-[110] animate-bounce-subtle">
            <div className="text-xs font-bold text-gray-700">
              {allHandled
                ? "✅ All emails sorted"
                : `📧 ${EMAILS.length - Object.keys(emailActions).length} emails to process`}
            </div>
            <button
              disabled={!allHandled}
              onClick={handleSubmit}
              className={`px-8 py-2 rounded-full text-xs font-black text-white transition-all ${allHandled ? "bg-blue-600 hover:bg-blue-700 shadow-lg scale-105" : "bg-gray-300 cursor-not-allowed"}`}
            >
              FINISH TASK
            </button>
          </div>
        </div>
      </div>

      {/* App Blocked Alert */}
      {blockedApp && (
        <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 max-w-sm text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">
              Restricted Access
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              The {blockedApp} is currently locked by the administrator to help
              you stay focused on your cybersecurity training.
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
