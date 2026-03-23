import { useState } from "react";
import { useMission } from "../../missions/MissionContext";

// ─── AD DATA — all ads look visually identical / realistic ───────────────────
// Malicious ads use convincing designs; no color hints. Only the URL reveals danger.

const ADS = [
  // ── SAFE ADS ──
  {
    id: "ad_safe_1",
    type: "safe",
    style: "banner",
    brand: "Khan Academy Kids",
    logo: "🎒",
    headline: "Free Learning for Ages 6–12",
    body: "Math, reading, and more — loved by teachers and parents worldwide.",
    cta: "Start Free",
    url: "khanacademy.org/kids",
    img: "https://placehold.co/60x60/4f46e5/fff?text=KA",
    theme: {
      bg: "#ffffff",
      accent: "#4f46e5",
      cta: "#4f46e5",
      ctaText: "#fff",
    },
  },
  {
    id: "ad_safe_2",
    type: "safe",
    style: "sidebar",
    brand: "National Geographic Kids",
    logo: "🌍",
    headline: "Discover Amazing Animals!",
    body: "Explore facts, videos, and adventures from around the world.",
    cta: "Explore Now",
    url: "kids.nationalgeographic.com",
    img: "https://placehold.co/60x60/f59e0b/fff?text=NG",
    theme: {
      bg: "#fffbeb",
      accent: "#d97706",
      cta: "#d97706",
      ctaText: "#fff",
    },
  },
  {
    id: "ad_safe_3",
    type: "safe",
    style: "banner",
    brand: "Duolingo",
    logo: "🦉",
    headline: "Learn a New Language for Free",
    body: "Fun, quick lessons in Spanish, French, Japanese and more.",
    cta: "Try Duolingo",
    url: "duolingo.com",
    img: "https://placehold.co/60x60/58cc02/fff?text=DL",
    theme: {
      bg: "#f0fdf4",
      accent: "#16a34a",
      cta: "#58cc02",
      ctaText: "#fff",
    },
  },

  // ── MALICIOUS ADS — look completely real ──
  {
    id: "ad_mal_1",
    type: "malicious",
    style: "banner",
    brand: "PC SpeedBoost Pro",
    logo: "⚡",
    headline: "Your Computer Is Running Slow",
    body: "Millions of users have already boosted their PC speed by 200%. Download the free optimizer today.",
    cta: "Download Free",
    url: "pc-speedboost-pro-download.net",
    img: "https://placehold.co/60x60/2563eb/fff?text=PC",
    theme: {
      bg: "#ffffff",
      accent: "#2563eb",
      cta: "#2563eb",
      ctaText: "#fff",
    },
  },
  {
    id: "ad_mal_2",
    type: "malicious",
    style: "sidebar",
    brand: "RewardZone",
    logo: "🎁",
    headline: "You've Been Chosen!",
    body: "Complete a short survey and claim your free Amazon gift card. Limited spots available!",
    cta: "Claim Reward",
    url: "rewardzone-giftcards.click",
    img: "https://placehold.co/60x60/f97316/fff?text=RZ",
    theme: {
      bg: "#fff7ed",
      accent: "#ea580c",
      cta: "#f97316",
      ctaText: "#fff",
    },
  },
  {
    id: "ad_mal_3",
    type: "malicious",
    style: "banner",
    brand: "GameCoins Unlimited",
    logo: "🕹️",
    headline: "Get Unlimited Roblox Robux — Free!",
    body: "Verified by 5 million gamers. No survey, no download. Works on all devices!",
    cta: "Get Free Robux",
    url: "roblox-free-robux-generator.xyz",
    img: "https://placehold.co/60x60/7c3aed/fff?text=GC",
    theme: {
      bg: "#faf5ff",
      accent: "#7c3aed",
      cta: "#7c3aed",
      ctaText: "#fff",
    },
  },
  {
    id: "ad_mal_4",
    type: "malicious",
    style: "sidebar",
    brand: "VitaHealth Supplements",
    logo: "💊",
    headline: "Doctors Hate This One Trick",
    body: "Lose 10kg in 2 weeks with this viral supplement. As seen on TV. Order now while stocks last!",
    cta: "Order Now — 80% Off",
    url: "vitahealth-supplements-offer.info",
    img: "https://placehold.co/60x60/10b981/fff?text=VH",
    theme: {
      bg: "#f0fdf4",
      accent: "#059669",
      cta: "#10b981",
      ctaText: "#fff",
    },
  },
  {
    id: "ad_mal_5",
    type: "malicious",
    style: "banner",
    brand: "TechSafe Security",
    logo: "🛡️",
    headline: "⚠️ Virus Detected on This Device",
    body: "Your device has been flagged. Install TechSafe Antivirus now — it's free and takes 30 seconds.",
    cta: "Protect Now — Free",
    url: "techsafe-security-scan-now.com",
    img: "https://placehold.co/60x60/ef4444/fff?text=TS",
    theme: {
      bg: "#ffffff",
      accent: "#dc2626",
      cta: "#ef4444",
      ctaText: "#fff",
    },
  },
  {
    id: "ad_mal_6",
    type: "malicious",
    style: "sidebar",
    brand: "CryptoWallet Pro",
    logo: "₿",
    headline: "Earn $500/Day From Home",
    body: "New crypto investment platform pays out daily. Join 200,000 members already earning big.",
    cta: "Start Earning",
    url: "cryptowallet-pro-earn.cc",
    img: "https://placehold.co/60x60/f59e0b/fff?text=CW",
    theme: {
      bg: "#fffbeb",
      accent: "#b45309",
      cta: "#f59e0b",
      ctaText: "#fff",
    },
  },
];

const MALICIOUS_IDS = ADS.filter((a) => a.type === "malicious").map(
  (a) => a.id,
);

// ─── ARTICLE ─────────────────────────────────────────────────────────────────

const ARTICLE = {
  category: "CYBERSECURITY",
  title: "10 Tips for Staying Safe Online",
  subtitle:
    "Experts share the most important habits every internet user should build to protect themselves in today's digital world.",
  author: "Jordan Ellis",
  date: "March 11, 2026",
  readTime: "5 min read",
  paragraphs: [
    "In an era where nearly every aspect of our lives touches the internet, staying safe online has never been more important. From shopping and banking to socialising and learning, our digital footprint grows every day.",
    "Cybersecurity experts agree that most successful attacks rely not on sophisticated hacking tools, but on human error. A single careless click can expose passwords, personal data, or even give attackers access to entire systems.",
    "The good news? A handful of simple habits can dramatically reduce your risk. Here are ten of the most important practices recommended by security professionals.",
    "First and foremost: use strong, unique passwords for every account. Password managers can help you store them securely without needing to remember each one.",
    "Second, enable two-factor authentication wherever possible. Even if your password is stolen, a second verification step can stop attackers in their tracks.",
  ],
};

// ─── EMAIL DATA ───────────────────────────────────────────────────────────────

const NPC_EMAIL = {
  from: "manager@guardian-corp.com",
  fromDisplay: "Your Manager",
  subject: "🔗 Training Link — Open This Website",
  time: "Just now",
  preview: "Click the link below to open the training website...",
  body: `Hi,\n\nAs part of your training today, I've sent you a link to a website.\n\nYour task is to open it and identify any suspicious advertisements you find on the page.\n\nHere is the link:\n\n👉 https://safenews-daily.com/top-tips-for-staying-safe-online\n\nRemember: Look carefully at ALL the advertisements. Some may look normal. Others may not be what they seem.\n\nGood luck.\n\n— Manager`,
};

const OTHER_EMAILS = [
  {
    id: "e2",
    from: "hr@guardian-corp.com",
    fromDisplay: "HR Department",
    subject: "Welcome to Guardian Corp! 🛡️",
    time: "Yesterday",
    preview: "We're glad to have you on the team...",
  },
  {
    id: "e3",
    from: "it@guardian-corp.com",
    fromDisplay: "IT Support",
    subject: "Your workstation setup is complete",
    time: "2 days ago",
    preview: "Your training workstation is now ready...",
  },
];

// ─── AD CARD ─────────────────────────────────────────────────────────────────
// Looks like a real ad — no color hints, no badges. Only URL tooltip on hover.

function AdCard({ ad, found, onFind, size = "banner" }) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (ad.type === "malicious" && !found) {
      onFind(ad.id);
    }
  };

  const isBanner = size === "banner" || ad.style === "banner";

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ad unit — identical look for safe and malicious */}
      <div
        onClick={handleClick}
        className={`rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-all duration-150 hover:shadow-md select-none
          ${found ? "ring-2 ring-green-500" : ""}
          ${isBanner ? "flex flex-row items-center gap-3 p-3" : "flex flex-col p-3 gap-2"}
        `}
        style={{ backgroundColor: ad.theme.bg, minWidth: isBanner ? 260 : 160 }}
      >
        {/* Logo / Image */}
        <div
          className={`rounded-lg flex items-center justify-center text-xl font-bold flex-shrink-0 ${isBanner ? "w-12 h-12" : "w-10 h-10"}`}
          style={{
            backgroundColor: ad.theme.accent + "22",
            color: ad.theme.accent,
          }}
        >
          {ad.logo}
        </div>

        {/* Text */}
        <div className={`flex-1 min-w-0 ${isBanner ? "" : ""}`}>
          {/* Brand */}
          <div className="text-[9px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
            {ad.brand} · Ad
          </div>
          {/* Headline */}
          <div
            className={`font-bold text-gray-900 leading-tight ${isBanner ? "text-[12px]" : "text-[11px]"} mb-0.5`}
          >
            {ad.headline}
          </div>
          {/* Body — only show in banner mode */}
          {isBanner && (
            <div className="text-[10px] text-gray-500 leading-snug line-clamp-2 mb-2">
              {ad.body}
            </div>
          )}
          {/* CTA Button */}
          <div
            className="inline-block text-[10px] font-bold px-3 py-1 rounded-full mt-1"
            style={{ backgroundColor: ad.theme.cta, color: ad.theme.ctaText }}
          >
            {ad.cta}
          </div>
        </div>

        {/* Found checkmark */}
        {found && (
          <div className="absolute top-1 right-1 bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
            ✓ Found
          </div>
        )}
      </div>

      {/* URL Tooltip — the ONLY hint */}
      {hovered && (
        <div
          className="absolute bottom-full left-0 mb-1.5 z-50 px-3 py-1.5 rounded-md text-[10px] font-mono shadow-xl border pointer-events-none whitespace-nowrap"
          style={{
            backgroundColor: "#1e1e1e",
            color: "#d4d4d4",
            borderColor: "#333",
          }}
        >
          🔗 {ad.url}
        </div>
      )}
    </div>
  );
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

export default function MalvertisingClient() {
  const { mission, setMission } = useMission();

  const [screen, setScreen] = useState("gmail_inbox");
  const [foundAds, setFoundAds] = useState(new Set());
  const [blockedApp, setBlockedApp] = useState(null);
  const [showComplete, setShowComplete] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(NPC_EMAIL);

  const isVisible =
    mission.id === "TASK_6_MALVERTISING" &&
    mission.stage === "TASK6_DESKTOP_BROWSER";

  if (!isVisible) return null;

  const handleFindAd = (id) => {
    const next = new Set(foundAds);
    next.add(id);
    setFoundAds(next);
    if (MALICIOUS_IDS.every((mid) => next.has(mid))) {
      setTimeout(() => setShowComplete(true), 800);
    }
  };

  const handleFinishTask = () => {
    setMission({
      ...mission,
      stage: "TASK6_RETURN_TO_MANAGER",
      result: "PASS",
    });
  };

  // Ad placements — looked up by id to avoid index bugs
  const byId = (id) => ADS.find((a) => a.id === id);

  const topBannerAds = [byId("ad_mal_1"), byId("ad_safe_1")]; // PC SpeedBoost, Khan Academy
  const inArticleAd = byId("ad_mal_2"); // RewardZone
  const inArticleAd2 = byId("ad_mal_5"); // TechSafe virus
  const sidebarAds = [
    byId("ad_safe_2"),
    byId("ad_mal_3"),
    byId("ad_mal_4"),
    byId("ad_safe_3"),
  ]; // NatGeo, GameCoins, VitaHealth, Duolingo
  const bottomBannerAd = byId("ad_mal_6"); // CryptoWallet

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 font-sans bg-black/20">
      {/* Monitor Frame */}
      <div className="relative w-[70%] h-[90vh] bg-[#1a1a1a] rounded-2xl p-4 shadow-2xl border-b-[16px] border-x-[12px] border-t-[12px] border-[#2a2a2a] flex flex-col">
        <div className="relative w-full h-full bg-[#0078D7] overflow-hidden flex flex-col rounded-sm">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent pointer-events-none" />

          <div className="flex-1 flex overflow-hidden">
            {/* Desktop Icons */}
            <div className="w-20 p-4 flex flex-col gap-6 z-10">
              <DesktopIcon
                icon="📧"
                label="Gmail"
                onClick={() => setScreen("gmail_inbox")}
              />
              <DesktopIcon
                icon="🌐"
                label="Browser"
                disabled={screen !== "browser"}
                onClick={() => {}}
              />
              <DesktopIcon
                icon="📂"
                label="Files"
                disabled
                onClick={() => setBlockedApp("File Explorer")}
              />
            </div>

            {/* ── GMAIL ── */}
            {screen === "gmail_inbox" ? (
              <div className="flex-1 m-2 bg-[#f6f8fc] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-300 z-20">
                {/* Gmail Top Bar */}
                <div className="h-16 flex items-center px-4 gap-4 bg-[#f6f8fc] border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center gap-1 min-w-[200px]">
                    {["G", "m", "a", "i", "l"].map((l, i) => (
                      <span
                        key={i}
                        className="font-bold text-2xl leading-none"
                        style={{
                          color: [
                            "#EA4335",
                            "#4285F4",
                            "#34A853",
                            "#FBBC05",
                            "#EA4335",
                          ][i],
                        }}
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
                  {/* Sidebar */}
                  <div className="w-56 flex-shrink-0 pt-2 flex flex-col bg-[#f6f8fc]">
                    <div className="mx-3 mb-3">
                      <button className="flex items-center gap-3 bg-[#c2e7ff] px-4 py-3 rounded-2xl text-sm font-medium text-[#001d35] w-full">
                        ✉️ Compose
                      </button>
                    </div>
                    {[
                      { icon: "📥", label: "Inbox", count: 3, active: true },
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
                        {item.count && (
                          <span className="text-xs font-bold">
                            {item.count}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Email list + detail */}
                  <div className="flex flex-1 overflow-hidden bg-white rounded-tl-3xl">
                    {/* List */}
                    <div className="w-80 flex-shrink-0 border-r border-gray-200 overflow-y-auto">
                      <div className="h-12 flex items-center px-3 gap-2 border-b border-gray-100">
                        <span className="ml-auto text-xs text-gray-400">
                          1–3 of 3
                        </span>
                      </div>
                      {[NPC_EMAIL, ...OTHER_EMAILS].map((e, idx) => (
                        <div
                          key={e.id || "npc"}
                          onClick={() => setSelectedEmail(e)}
                          className={`flex items-center px-3 py-3 cursor-pointer border-b border-gray-50 group ${selectedEmail === e ? "bg-[#e8f0fe]" : "hover:bg-gray-50"}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center mr-3 flex-shrink-0 ${idx === 0 ? "bg-[#1a73e8]" : "bg-gray-300 text-gray-700"}`}
                          >
                            {e.fromDisplay
                              .split(" ")
                              .map((w) => w[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-0.5">
                              <span
                                className={`text-xs truncate ${idx === 0 ? "font-black text-gray-900" : "text-gray-600"}`}
                              >
                                {e.fromDisplay}
                              </span>
                              <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">
                                {e.time}
                              </span>
                            </div>
                            <div
                              className={`text-xs truncate ${idx === 0 ? "font-bold text-gray-800" : "text-gray-500"}`}
                            >
                              {e.subject}
                            </div>
                            <div className="text-[11px] text-gray-400 truncate">
                              {e.preview}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Detail */}
                    <div className="flex-1 overflow-y-auto">
                      {selectedEmail && (
                        <div className="p-6">
                          <h2 className="text-xl font-normal text-gray-800 mb-4">
                            {selectedEmail.subject}
                          </h2>
                          <div className="flex items-start gap-3 mb-5 pb-4 border-b border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-[#1a73e8] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                              {selectedEmail.fromDisplay
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
                          {selectedEmail.body ? (
                            <pre className="text-sm font-sans whitespace-pre-wrap text-gray-800 leading-relaxed">
                              {selectedEmail.body}
                            </pre>
                          ) : (
                            <p className="text-sm text-gray-500 italic">
                              No body content.
                            </p>
                          )}
                          {selectedEmail === NPC_EMAIL && (
                            <button
                              onClick={() => setScreen("browser")}
                              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1558b0] text-white text-sm font-medium rounded-full shadow transition-all"
                            >
                              🌐 Open Training Link
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // ── BROWSER ──
              <div className="flex-1 m-2 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-300 z-20">
                {/* Browser chrome */}
                <div className="bg-[#f1f3f4] border-b border-gray-300 flex-shrink-0">
                  <div className="flex items-end pt-2 px-2">
                    <div className="flex items-center gap-2 bg-white border border-gray-300 border-b-white rounded-t-lg px-4 py-2 text-xs text-gray-700 max-w-[260px]">
                      <span className="text-gray-400">🌐</span>
                      <span className="truncate font-medium">
                        10 Tips for Staying Safe Online
                      </span>
                      <button className="ml-auto text-gray-400">×</button>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center text-gray-400 cursor-pointer mb-1">
                      +
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 pb-2">
                    <button
                      onClick={() => setScreen("gmail_inbox")}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500"
                    >
                      ←
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400">
                      →
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500">
                      ↻
                    </button>
                    <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-full px-4 py-1.5 text-xs text-gray-600">
                      <span className="text-green-600">🔒</span>
                      <span className="font-medium">
                        https://safenews-daily.com/top-tips-for-staying-safe-online
                      </span>
                    </div>
                  </div>
                </div>

                {/* Page */}
                <div className="flex-1 overflow-y-auto bg-gray-50">
                  {/* Site nav */}
                  <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center gap-6">
                    <div className="font-black text-lg text-gray-900 tracking-tight">
                      SafeNews<span className="text-blue-600">Daily</span>
                    </div>
                    <div className="flex gap-5 text-xs text-gray-500 ml-4">
                      {[
                        "Home",
                        "Technology",
                        "Security",
                        "Science",
                        "World",
                      ].map((n) => (
                        <span
                          key={n}
                          className="hover:text-blue-600 cursor-pointer"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                    <div className="ml-auto bg-gray-100 rounded-full px-4 py-1 text-xs text-gray-400">
                      🔍 Search
                    </div>
                  </div>

                  {/* Top banner ads */}
                  <div className="bg-white border-b border-gray-100 px-8 py-3">
                    <div className="text-[8px] text-gray-300 uppercase tracking-widest mb-2">
                      Advertisements
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {topBannerAds.map((ad) => (
                        <AdCard
                          key={ad.id}
                          ad={ad}
                          found={foundAds.has(ad.id)}
                          onFind={handleFindAd}
                          size="banner"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Main layout */}
                  <div className="flex gap-6 px-8 py-6">
                    {/* Article */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded tracking-widest uppercase">
                          {ARTICLE.category}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {ARTICLE.date}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-400 text-xs">
                          {ARTICLE.readTime}
                        </span>
                      </div>
                      <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">
                        {ARTICLE.title}
                      </h1>
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                        {ARTICLE.subtitle}
                      </p>
                      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-200">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          {ARTICLE.author[0]}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">
                          By {ARTICLE.author}
                        </span>
                      </div>

                      {ARTICLE.paragraphs.map((p, i) => (
                        <div key={i}>
                          <p className="text-sm text-gray-700 leading-relaxed mb-4">
                            {p}
                          </p>
                          {i === 1 && (
                            <div className="my-4 py-3 border-t border-b border-gray-100">
                              <div className="text-[8px] text-gray-300 uppercase tracking-widest mb-1.5">
                                Sponsored
                              </div>
                              <AdCard
                                ad={inArticleAd}
                                found={foundAds.has(inArticleAd.id)}
                                onFind={handleFindAd}
                                size="banner"
                              />
                            </div>
                          )}
                          {i === 3 && (
                            <div className="my-4 py-3 border-t border-b border-gray-100">
                              <div className="text-[8px] text-gray-300 uppercase tracking-widest mb-1.5">
                                Sponsored
                              </div>
                              <AdCard
                                ad={inArticleAd2}
                                found={foundAds.has(inArticleAd2.id)}
                                onFind={handleFindAd}
                                size="banner"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Sidebar */}
                    <div className="w-52 flex-shrink-0 space-y-3">
                      <div className="text-[8px] text-gray-300 uppercase tracking-widest font-bold border-b border-gray-100 pb-1">
                        Sponsored
                      </div>
                      {sidebarAds.map((ad) => (
                        <AdCard
                          key={ad.id}
                          ad={ad}
                          found={foundAds.has(ad.id)}
                          onFind={handleFindAd}
                          size="sidebar"
                        />
                      ))}

                      {/* Score counter */}
                      <div className="bg-white rounded-xl p-3 text-center border border-gray-200 mt-4">
                        <div className="text-2xl font-black text-gray-800">
                          {foundAds.size}
                          <span className="text-gray-300 text-base font-normal">
                            {" "}
                            / {MALICIOUS_IDS.length}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          Suspicious ads found
                        </div>
                        {MALICIOUS_IDS.every((id) => foundAds.has(id)) ? (
                          <div className="mt-1 text-[10px] text-green-600 font-bold">
                            ✅ All found!
                          </div>
                        ) : (
                          <div className="mt-1 text-[10px] text-gray-300">
                            Keep looking…
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom banner — CryptoWallet */}
                  <div className="bg-white border-t border-gray-100 px-8 py-4">
                    <div className="text-[8px] text-gray-300 uppercase tracking-widest mb-2">
                      Sponsored
                    </div>
                    <AdCard
                      ad={bottomBannerAd}
                      found={foundAds.has(bottomBannerAd.id)}
                      onFind={handleFindAd}
                      size="banner"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Taskbar */}
          <div className="h-12 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center px-2 gap-1 z-[100] flex-shrink-0">
            <div className="w-10 h-10 flex items-center justify-center text-blue-400 text-2xl hover:bg-white/10 rounded cursor-pointer">
              ⊞
            </div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded cursor-pointer ${screen === "gmail_inbox" ? "bg-white/10 border-b-2 border-blue-500" : "hover:bg-white/10"}`}
              onClick={() => setScreen("gmail_inbox")}
            >
              <span
                className="text-sm font-bold"
                style={{ color: screen === "gmail_inbox" ? "#EA4335" : "#aaa" }}
              >
                M
              </span>
            </div>
            {screen === "browser" && (
              <div className="w-10 h-10 flex items-center justify-center bg-white/10 border-b-2 border-blue-500 rounded cursor-pointer">
                <span className="text-sm">🌐</span>
              </div>
            )}
            <div className="ml-auto flex items-center px-4 text-white/90 text-[11px] text-right leading-tight">
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

          {/* Completion banner */}
          {showComplete && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-[110]">
              <div className="bg-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 border border-gray-200">
                <span className="text-sm font-black text-green-700">
                  ✅ All suspicious advertisements spotted!
                </span>
                <button
                  onClick={handleFinishTask}
                  className="px-8 py-2 rounded-full text-xs font-black text-white bg-green-600 hover:bg-green-700 shadow-lg transition-all"
                >
                  RETURN TO MANAGER
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blocked app modal */}
      {blockedApp && (
        <div className="absolute inset-0 z-[200] bg-black/60 flex items-center justify-center">
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
