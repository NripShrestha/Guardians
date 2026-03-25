import { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const DANGEROUS_TARGETS = [
  { label: "Phishing\nEmail", type: "danger", emoji: "🎣" },
  { label: "Fake\nWebsite", type: "danger", emoji: "🕸️" },
  { label: "Scam\nMessage", type: "danger", emoji: "💬" },
  { label: "Malware\nFile", type: "danger", emoji: "🦠" },
  { label: "Unknown\nUSB", type: "danger", emoji: "💾" },
  { label: "Fake Tech\nSupport", type: "danger", emoji: "📞" },
  { label: "Password\nRequest", type: "danger", emoji: "🔑" },
  { label: "Spam\nEmail", type: "danger", emoji: "📧" },
  { label: "Bad Link", type: "danger", emoji: "🔗" },
  { label: "Ransomware", type: "danger", emoji: "💀" },
  { label: "Fake\nGiveaway", type: "danger", emoji: "🎁" },
  { label: "Stranger\nOnline", type: "danger", emoji: "👻" },
];

// Reduced safe target weight — only 1 copy instead of 2 in spawn pool
const SAFE_TARGETS = [
  { label: "HTTPS\nSite", type: "safe", emoji: "🔒" },
  { label: "2FA\nEnabled", type: "safe", emoji: "✅" },
  { label: "Strong\nPassword", type: "safe", emoji: "💪" },
  { label: "Trusted\nSender", type: "safe", emoji: "👍" },
  { label: "Security\nUpdate", type: "safe", emoji: "🛡️" },
  { label: "Antivirus\nOn", type: "safe", emoji: "🦺" },
  { label: "Backup\nFiles", type: "safe", emoji: "💾" },
  { label: "Safe\nBrowser", type: "safe", emoji: "🌐" },
  { label: "VPN\nOn", type: "safe", emoji: "🔐" },
];

const ALL_QUIZ_QUESTIONS = [
  {
    q: "Which website is safer to visit?",
    options: ["http://bank.com", "https://bank.com"],
    correct: 1,
    fun: "HTTPS encrypts your data — always look for the padlock in the address bar!",
  },
  {
    q: "You get an email asking for your password. What do you do?",
    options: ["Send it quickly", "Never share your password"],
    correct: 1,
    fun: "Real companies never ask for your password by email!",
  },
  {
    q: "What is phishing?",
    options: [
      "A type of online fishing game",
      "A scam to trick you into giving up your info",
    ],
    correct: 1,
    fun: "Phishing tricks you into giving away passwords or personal info!",
  },
  {
    q: "Which is a stronger password?",
    options: ["password123", "Xk9mP2qR!t"],
    correct: 1,
    fun: "Mix uppercase letters, numbers and symbols for a strong password!",
  },
  {
    q: "You find a USB drive in a parking lot. What do you do?",
    options: [
      "Plug it in to see what is on it",
      "Give it to an adult or the IT team",
    ],
    correct: 1,
    fun: "Mystery USB drives can carry viruses that infect your computer!",
  },
  {
    q: "What does 2FA stand for?",
    options: ["Two-Factor Authentication", "Two Fast Applications"],
    correct: 0,
    fun: "2FA adds a second lock — even if someone steals your password, they cannot get in!",
  },
  {
    q: "A stranger online wants to meet you in person. You should:",
    options: [
      "Agree and go alone",
      "Tell a parent or trusted adult immediately",
    ],
    correct: 1,
    fun: "Never meet an online stranger without a trusted adult present!",
  },
  {
    q: "What does HTTPS mean?",
    options: [
      "HyperText Transfer Protocol Secure",
      "High Tech Page Transfer System",
    ],
    correct: 0,
    fun: "The S stands for Secure — it encrypts everything between you and the website!",
  },
  {
    q: "Someone claims to be tech support and needs remote access. You:",
    options: [
      "Let them in right away",
      "Hang up and call the company yourself",
    ],
    correct: 1,
    fun: "Fake tech support scams are very common — always verify by calling the real number!",
  },
  {
    q: "What is malware?",
    options: [
      "A helpful software update",
      "Software designed to damage or spy on your device",
    ],
    correct: 1,
    fun: "Malware means malicious software — it can steal data or destroy files!",
  },
  {
    q: "Which is the safest thing to do on public Wi-Fi?",
    options: [
      "Log into your bank account",
      "Use a VPN to protect your connection",
    ],
    correct: 1,
    fun: "Public Wi-Fi is not private — a VPN keeps your data encrypted!",
  },
  {
    q: "What is ransomware?",
    options: [
      "Software that locks your files and demands payment",
      "An antivirus tool",
    ],
    correct: 0,
    fun: "Ransomware encrypts your files and demands money — regular backups protect you!",
  },
  {
    q: "How often should you update your passwords?",
    options: [
      "Never — once set is fine",
      "Regularly, and use different ones for each account",
    ],
    correct: 1,
    fun: "Unique passwords for every account mean one breach does not expose everything!",
  },
  {
    q: "What is a firewall?",
    options: [
      "A security system that filters network traffic",
      "A type of computer virus",
    ],
    correct: 0,
    fun: "Firewalls block suspicious traffic before it can reach your device!",
  },
  {
    q: "You receive an email saying you won a prize in a contest you never entered. This is:",
    options: ["A real prize — claim it!", "A scam — ignore or report it"],
    correct: 1,
    fun: "If you did not enter, you did not win. It is a trick to steal your details!",
  },
  {
    q: "Before downloading a file from the internet, you should:",
    options: [
      "Download it immediately",
      "Make sure it comes from a trusted source",
    ],
    correct: 1,
    fun: "Downloads from unknown sources can contain hidden malware!",
  },
  {
    q: "What is social engineering?",
    options: [
      "Building apps for social media",
      "Manipulating people into revealing private information",
    ],
    correct: 1,
    fun: "Social engineers exploit trust, not technology — they target the person, not the machine!",
  },
  {
    q: "Which email address looks suspicious?",
    options: ["support@yourbank.com", "supp0rt@y0urbank-secure.net"],
    correct: 1,
    fun: "Scammers swap letters with numbers or add extra words to fake real domains!",
  },
  {
    q: "What does a VPN do?",
    options: [
      "Makes your internet faster",
      "Encrypts your connection and hides your IP address",
    ],
    correct: 1,
    fun: "VPN stands for Virtual Private Network — it keeps your browsing private!",
  },
  {
    q: "Is it safe to use the same password for every account?",
    options: [
      "Yes, it is easy to remember",
      "No — one breach exposes all your accounts at once",
    ],
    correct: 1,
    fun: "Use a password manager to create and store unique passwords safely!",
  },
  {
    q: "A pop-up says your computer has a virus and tells you to call a number. You should:",
    options: [
      "Call the number right away",
      "Close the browser tab — it is almost certainly a scam",
    ],
    correct: 1,
    fun: "Real antivirus software never asks you to call a phone number!",
  },
  {
    q: "What is an antivirus program?",
    options: [
      "Software that deletes your files",
      "Software that detects and removes malware",
    ],
    correct: 1,
    fun: "Keep your antivirus updated so it can protect you from the latest threats!",
  },
  {
    q: "What should you do before installing an app?",
    options: [
      "Install it without reading anything",
      "Review what permissions the app is requesting",
    ],
    correct: 1,
    fun: "Apps only need permissions related to what they do — be suspicious of extras!",
  },
  {
    q: "What is a data breach?",
    options: [
      "When your phone runs out of battery",
      "When private data is accessed or stolen without permission",
    ],
    correct: 1,
    fun: "Check haveibeenpwned.com to see if your email has appeared in a breach!",
  },
  {
    q: "What is the safest way to share your location?",
    options: [
      "Post it publicly on social media",
      "Share it only with people you trust in real life",
    ],
    correct: 1,
    fun: "Sharing your location publicly tells strangers exactly where you are!",
  },
  {
    q: "You receive a suspicious link in a chat message. You should:",
    options: [
      "Click it to see what it is",
      "Do not click it — report or delete the message",
    ],
    correct: 1,
    fun: "Hover over links first to preview where they really go before clicking!",
  },
  {
    q: "What is two-factor authentication?",
    options: [
      "Signing in with two passwords",
      "Using a password plus a second step like a code sent to your phone",
    ],
    correct: 1,
    fun: "The second factor proves it is really you — even if your password is stolen!",
  },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let _id = 0;
const uid = () => ++_id;

// ─── TEXTURE FACTORIES ────────────────────────────────────────────────────────

function makeTexture(label, emoji, isDanger) {
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 280;
  const ctx = cv.getContext("2d");
  const g = ctx.createRadialGradient(256, 140, 20, 256, 140, 200);
  if (isDanger) {
    g.addColorStop(0, "#FFE0E0");
    g.addColorStop(1, "#FFB3B3");
  } else {
    g.addColorStop(0, "#E0FFE8");
    g.addColorStop(1, "#B3FFD0");
  }
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 260, 40);
  ctx.fill();
  ctx.strokeStyle = isDanger ? "#FF4444" : "#22CC66";
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.fillStyle = isDanger ? "rgba(255,80,80,0.15)" : "rgba(50,200,100,0.15)";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(80 + i * 90, 40, 18, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.font = "90px serif";
  ctx.textAlign = "center";
  ctx.fillText(emoji, 100, 175);
  const lines = label.split("\n");
  ctx.fillStyle = isDanger ? "#CC0000" : "#006622";
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 4;
  if (lines.length === 1) {
    ctx.font = "bold 54px Arial Rounded MT Bold,Arial";
    ctx.fillText(label, 300, 160);
  } else {
    ctx.font = "bold 46px Arial Rounded MT Bold,Arial";
    lines.forEach((l, i) => ctx.fillText(l, 300, 115 + i * 68));
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = isDanger ? "#FF4444" : "#22CC66";
  ctx.beginPath();
  ctx.roundRect(160, 222, isDanger ? 200 : 190, 38, 20);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px Arial";
  ctx.fillText(isDanger ? "DANGER!" : "SAFE!", 256, 248);
  return new THREE.CanvasTexture(cv);
}

function makeClockTexture() {
  const cv = document.createElement("canvas");
  cv.width = 256;
  cv.height = 256;
  const ctx = cv.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  g.addColorStop(0, "#FFFDE7");
  g.addColorStop(1, "#FFD600");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(128, 128, 118, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#FF6F00";
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.strokeStyle = "#BF360C";
  ctx.lineWidth = 5;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(128 + Math.cos(a) * 92, 128 + Math.sin(a) * 92);
    ctx.lineTo(128 + Math.cos(a) * 108, 128 + Math.sin(a) * 108);
    ctx.stroke();
  }
  ctx.strokeStyle = "#212121";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(128, 128);
  ctx.lineTo(128, 60);
  ctx.stroke();
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(128, 128);
  ctx.lineTo(175, 110);
  ctx.stroke();
  ctx.fillStyle = "#FF1744";
  ctx.beginPath();
  ctx.arc(128, 128, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#BF360C";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.fillText("+10s", 128, 220);
  return new THREE.CanvasTexture(cv);
}

function makeBoosterTexture(name, emoji, color1, color2, tagColor) {
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 280;
  const ctx = cv.getContext("2d");
  const g = ctx.createRadialGradient(256, 140, 10, 256, 140, 200);
  g.addColorStop(0, color1);
  g.addColorStop(1, color2);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 260, 40);
  ctx.fill();
  ctx.strokeStyle = tagColor;
  ctx.lineWidth = 8;
  ctx.stroke();
  ctx.fillStyle = `${tagColor}44`;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(60 + i * 80, 38, 16, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.font = "88px serif";
  ctx.textAlign = "center";
  ctx.fillText(emoji, 96, 178);
  const lines = name.split("\n");
  ctx.fillStyle = tagColor;
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 4;
  ctx.font = "bold 42px Arial Rounded MT Bold,Arial";
  lines.forEach((l, i) =>
    ctx.fillText(l, 300, lines.length === 1 ? 155 : 110 + i * 62),
  );
  ctx.shadowBlur = 0;
  ctx.fillStyle = tagColor;
  ctx.beginPath();
  ctx.roundRect(130, 222, 260, 38, 20);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px Arial";
  ctx.fillText("BOOSTER!", 256, 248);
  return new THREE.CanvasTexture(cv);
}

// ─── GUN ─────────────────────────────────────────────────────────────────────

const GUN_BASE = new THREE.Vector3(0.55, -0.9, 5.8);

function CartoonGun({ firing, aimDirRef, barrelTipRef }) {
  const groupRef = useRef();
  const kickRef = useRef(0);
  const targetQuat = useRef(new THREE.Quaternion());
  const currentQuat = useRef(new THREE.Quaternion());
  const localTip = new THREE.Vector3(0, 0.15, -1.22);

  useFrame(() => {
    if (!groupRef.current) return;
    if (aimDirRef.current) {
      const dir = aimDirRef.current.clone().normalize();
      targetQuat.current.setFromUnitVectors(new THREE.Vector3(0, 0, -1), dir);
    }
    currentQuat.current.slerp(targetQuat.current, 0.2);
    groupRef.current.quaternion.copy(currentQuat.current);
    if (kickRef.current > 0)
      kickRef.current = Math.max(0, kickRef.current - 0.14);
    const kick = kickRef.current;
    groupRef.current.position.set(
      GUN_BASE.x,
      GUN_BASE.y + kick * 0.08,
      GUN_BASE.z - kick * 0.35,
    );
    if (barrelTipRef) {
      const worldTip = localTip
        .clone()
        .applyQuaternion(currentQuat.current)
        .add(groupRef.current.position);
      barrelTipRef.current.copy(worldTip);
    }
  });

  useEffect(() => {
    if (firing) kickRef.current = 1;
  }, [firing]);

  return (
    <group ref={groupRef} position={[GUN_BASE.x, GUN_BASE.y, GUN_BASE.z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.15, -0.5]}>
        <cylinderGeometry args={[0.13, 0.17, 1.2, 16]} />
        <meshStandardMaterial color="#4488DD" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.15, -1.12]}>
        <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
        <meshStandardMaterial color="#FF8800" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[0.34, 0.4, 0.65]} />
        <meshStandardMaterial color="#2266BB" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.36, 0.28]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.27, 0.52, 0.21]} />
        <meshStandardMaterial color="#994422" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.2, 0.08]}>
        <torusGeometry args={[0.11, 0.03, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#3355AA" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.17, 0.11, 0.18]}>
        <octahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial
          color="#FFCC00"
          emissive="#FFAA00"
          emissiveIntensity={2}
        />
      </mesh>
      {firing && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.15, -1.28]}>
          <cylinderGeometry args={[0.22, 0.0, 0.35, 8]} />
          <meshBasicMaterial color="#FFFF00" transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  );
}

// ─── BULLET ──────────────────────────────────────────────────────────────────

function Bullet({ startPos, direction, onHit, registry }) {
  const ref = useRef();
  const pos = useRef(new THREE.Vector3(...startPos));
  const dir = useRef(new THREE.Vector3(...direction).normalize());
  const done = useRef(false);
  const speed = 20;

  useFrame((_, dt) => {
    if (!ref.current || done.current) return;
    pos.current.addScaledVector(dir.current, speed * dt);
    ref.current.position.copy(pos.current);
    const meshes = [];
    registry.current.forEach((mesh) => {
      if (mesh?.parent) meshes.push(mesh);
    });
    for (const mesh of meshes) {
      if (pos.current.distanceTo(mesh.position) < 1.5) {
        done.current = true;
        ref.current.visible = false;
        onHit(mesh, pos.current.toArray());
        return;
      }
    }
    if (
      pos.current.z < -16 ||
      Math.abs(pos.current.x) > 16 ||
      Math.abs(pos.current.y) > 12
    ) {
      done.current = true;
      ref.current.visible = false;
      onHit(null, null);
    }
  });

  return (
    <mesh ref={ref} position={[...startPos]}>
      <sphereGeometry args={[0.09, 8, 8]} />
      <meshStandardMaterial
        color="#FFDD00"
        emissive="#FFAA00"
        emissiveIntensity={3}
        metalness={0.8}
      />
    </mesh>
  );
}

// ─── STAR BURST ───────────────────────────────────────────────────────────────

function StarBurst({ pos, color, onDone }) {
  const particles = useRef(
    Array.from({ length: 10 }, () => ({
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
      ),
    })),
  );
  const refs = useRef([]);
  const life = useRef(1);
  const dead = useRef(false);

  useFrame((_, dt) => {
    if (dead.current) return;
    life.current -= dt * 2.5;
    if (life.current <= 0) {
      dead.current = true;
      onDone();
      return;
    }
    particles.current.forEach((p, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      mesh.position.addScaledVector(p.vel, dt);
      p.vel.y -= dt * 12;
      mesh.material.opacity = life.current;
      const s = life.current * 0.8;
      mesh.scale.set(s, s, s);
    });
  });

  return (
    <>
      {particles.current.map((_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} position={[...pos]}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </>
  );
}

// ─── TARGET ──────────────────────────────────────────────────────────────────

function Target({
  id,
  label,
  emoji,
  type,
  initPos,
  speed,
  difficulty,
  speedMult = 1,
  registry,
  onDead,
}) {
  const meshRef = useRef();
  const [tex] = useState(() => makeTexture(label, emoji, type === "danger"));
  const dying = useRef(false);
  const opacity = useRef(1);
  const pos = useRef(new THREE.Vector3(...initPos));
  const wobbleT = useRef(Math.random() * Math.PI * 2);
  const bounceDir = useRef({
    x: (Math.random() > 0.5 ? 1 : -1) * (0.4 + Math.random() * 0.5),
    y: (Math.random() - 0.5) * 0.4,
  });

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    registry.current.set(id, mesh);
    mesh.userData.kill = () => {
      dying.current = true;
    };
    mesh.userData.targetType = type;
    mesh.userData.targetId = id;
    return () => registry.current.delete(id);
  });

  useFrame((state, dt) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (dying.current) {
      opacity.current = Math.max(0, opacity.current - dt * 4);
      mesh.material.opacity = opacity.current;
      const s = 1 + (1 - opacity.current) * 0.5;
      mesh.scale.set(s, s, s);
      if (opacity.current === 0) {
        registry.current.delete(id);
        onDead(id);
      }
      return;
    }
    const spd = speed * (1 + difficulty * 0.08) * speedMult;
    wobbleT.current += dt * 1.2;
    pos.current.x += bounceDir.current.x * spd * dt;
    pos.current.y +=
      bounceDir.current.y * spd * dt + Math.sin(wobbleT.current) * 0.006;
    if (Math.abs(pos.current.x) > 7) bounceDir.current.x *= -1;
    if (pos.current.y > 3.5 || pos.current.y < -2.5) bounceDir.current.y *= -1;
    mesh.position.copy(pos.current);
    mesh.rotation.z = Math.sin(wobbleT.current * 0.7) * 0.06;
    mesh.lookAt(state.camera.position);
    mesh.rotation.z = Math.sin(wobbleT.current * 0.7) * 0.06;
  });

  return (
    <mesh ref={meshRef} position={initPos}>
      <planeGeometry args={[2.8, 1.5]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── FLOATING CLOUDS ─────────────────────────────────────────────────────────

function FloatingCloud({ position, scale, speed }) {
  const ref = useRef();
  const t = useRef(Math.random() * Math.PI * 2);
  useFrame((_, dt) => {
    if (!ref.current) return;
    t.current += dt * speed;
    ref.current.position.x = position[0] + Math.sin(t.current) * 0.5;
    ref.current.position.y = position[1] + Math.cos(t.current * 0.7) * 0.3;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      {[
        [0, 0, 0, 0.7],
        [0.6, 0.2, 0, 0.5],
        [-0.6, 0.15, 0, 0.55],
        [1.1, -0.1, 0, 0.4],
        [-1.1, -0.05, 0, 0.45],
        [0.3, 0.4, 0, 0.35],
        [-0.3, 0.38, 0, 0.3],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 10, 10]} />
          <meshStandardMaterial color="#FFFFFF" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

// ─── CLOCK TARGET — 4s lifetime ───────────────────────────────────────────────

function ClockTarget({ id, initPos, speedMult, registry, onDead }) {
  const meshRef = useRef();
  const [tex] = useState(() => makeClockTexture());
  const dying = useRef(false);
  const opacity = useRef(1);
  const pos = useRef(new THREE.Vector3(...initPos));
  const wobbleT = useRef(Math.random() * Math.PI * 2);
  const dir = useRef(
    new THREE.Vector3(
      (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random()),
      (Math.random() - 0.5) * 1.2,
      0,
    ),
  );
  const changeT = useRef(0);
  const lifeT = useRef(0);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    registry.current.set(id, mesh);
    mesh.userData.kill = () => {
      dying.current = true;
    };
    mesh.userData.targetType = "clock";
    mesh.userData.targetId = id;
    return () => registry.current.delete(id);
  });

  useFrame((state, dt) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (dying.current) {
      opacity.current = Math.max(0, opacity.current - dt * 5);
      mesh.material.opacity = opacity.current;
      const s = 1 + (1 - opacity.current) * 0.6;
      mesh.scale.set(s, s, s);
      if (opacity.current === 0) {
        registry.current.delete(id);
        onDead(id);
      }
      return;
    }
    lifeT.current += dt;
    if (lifeT.current > 3) {
      mesh.material.opacity = 0.4 + Math.sin(lifeT.current * 14) * 0.4;
    }
    if (lifeT.current >= 4) {
      dying.current = true;
      return;
    }

    const spd = 3.5 * speedMult;
    wobbleT.current += dt * 2.5;
    changeT.current += dt;
    if (changeT.current > 1.2) {
      changeT.current = 0;
      dir.current
        .set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2, 0)
        .normalize()
        .multiplyScalar(1);
    }
    pos.current.x += dir.current.x * spd * dt;
    pos.current.y +=
      dir.current.y * spd * dt + Math.sin(wobbleT.current) * 0.01;
    if (Math.abs(pos.current.x) > 6.5) dir.current.x *= -1;
    if (pos.current.y > 3.5 || pos.current.y < -2.5) dir.current.y *= -1;
    mesh.position.copy(pos.current);
    mesh.rotation.z += dt * 1.8;
    mesh.lookAt(state.camera.position);
    mesh.rotation.z += dt * 1.8;
  });

  return (
    <mesh ref={meshRef} position={initPos}>
      <circleGeometry args={[0.75, 32]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── BOOSTER TARGET — 4s lifetime ────────────────────────────────────────────

function BoosterTarget({ id, boosterType, initPos, registry, onDead }) {
  const meshRef = useRef();
  const [tex] = useState(() => {
    if (boosterType === "freeze")
      return makeBoosterTexture(
        "FIREWALL\nFREEZE",
        "🧊",
        "#E3F2FD",
        "#B3E5FC",
        "#0277BD",
      );
    return makeBoosterTexture(
      "PAYLOAD\nDROP",
      "💣",
      "#F3E5F5",
      "#E1BEE7",
      "#7B1FA2",
    );
  });
  const dying = useRef(false);
  const opacity = useRef(1);
  const pos = useRef(new THREE.Vector3(...initPos));
  const wobbleT = useRef(Math.random() * Math.PI * 2);
  const dir = useRef(
    new THREE.Vector3(
      (Math.random() > 0.5 ? 1 : -1) * 0.5,
      (Math.random() - 0.5) * 0.3,
      0,
    ),
  );
  const lifeT = useRef(0);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    registry.current.set(id, mesh);
    mesh.userData.kill = () => {
      dying.current = true;
    };
    mesh.userData.targetType =
      boosterType === "freeze" ? "booster_freeze" : "booster_payload";
    mesh.userData.targetId = id;
    return () => registry.current.delete(id);
  });

  useFrame((state, dt) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (dying.current) {
      opacity.current = Math.max(0, opacity.current - dt * 4);
      mesh.material.opacity = opacity.current;
      if (opacity.current === 0) {
        registry.current.delete(id);
        onDead(id);
      }
      return;
    }
    lifeT.current += dt;
    if (lifeT.current > 3) {
      opacity.current = 0.4 + Math.sin(lifeT.current * 14) * 0.4;
      mesh.material.opacity = opacity.current;
    }
    if (lifeT.current >= 4) {
      dying.current = true;
      return;
    }

    wobbleT.current += dt;
    pos.current.x += dir.current.x * dt;
    pos.current.y += dir.current.y * dt + Math.sin(wobbleT.current) * 0.008;
    if (Math.abs(pos.current.x) > 6.5) dir.current.x *= -1;
    if (pos.current.y > 3.5 || pos.current.y < -2.5) dir.current.y *= -1;
    mesh.position.copy(pos.current);
    mesh.rotation.z = Math.sin(wobbleT.current * 0.5) * 0.12;
    mesh.lookAt(state.camera.position);
    mesh.rotation.z = Math.sin(wobbleT.current * 0.5) * 0.12;
  });

  return (
    <mesh ref={meshRef} position={initPos}>
      <planeGeometry args={[2.8, 1.5]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── GAME SCENE ───────────────────────────────────────────────────────────────

function GameScene({
  paused,
  difficulty,
  shootEvent,
  mousePosRef,
  speedMult,
  onScoreUpdate,
  onSpecialHit,
}) {
  const { camera, size } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const registry = useRef(new Map());
  const [targets, setTargets] = useState([]);
  const [clocks, setClocks] = useState([]);
  const [boosters, setBoosters] = useState([]);
  const [bursts, setBursts] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [firing, setFiring] = useState(false);
  const spawnT = useRef(0);
  const clockT = useRef(0);
  const freezeT = useRef(10);
  const payloadT = useRef(16);
  const aimDirRef = useRef(new THREE.Vector3(0, 0, -1));
  const barrelTipRef = useRef(
    new THREE.Vector3(GUN_BASE.x, GUN_BASE.y, GUN_BASE.z - 1.22),
  );
  const lastShootId = useRef(null);

  const spawnInterval = Math.max(0.5, 2.2 - difficulty * 0.1);

  useFrame((_, dt) => {
    if (mousePosRef?.current) {
      const ndcX = (mousePosRef.current.x / size.width) * 2 - 1;
      const ndcY = -(mousePosRef.current.y / size.height) * 2 + 1;
      raycaster.current.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      aimDirRef.current.copy(raycaster.current.ray.direction);
    }
    if (paused) return;

    // Safe appears ~30% (1 copy vs 2 danger-heavy pool)
    spawnT.current += dt;
    if (spawnT.current >= spawnInterval) {
      spawnT.current = 0;
      // 2 danger copies : 1 safe copy → ~33% safe rate (down from ~50%)
      const pool = [
        ...DANGEROUS_TARGETS,
        ...DANGEROUS_TARGETS,
        ...SAFE_TARGETS,
      ];
      const tmpl = pool[Math.floor(Math.random() * pool.length)];
      const x = (Math.random() - 0.5) * 12;
      const y = (Math.random() - 0.5) * 4;
      const z = -3 - Math.random() * 4;
      const spd = 0.8 + Math.random() * 0.8 + difficulty * 0.1;
      setTargets((prev) => [
        ...prev.slice(-28),
        { id: uid(), ...tmpl, initPos: [x, y, z], speed: spd },
      ]);
    }

    clockT.current += dt;
    if (clockT.current >= 14) {
      clockT.current = 0;
      setClocks((prev) => [
        ...prev.slice(-2),
        {
          id: uid(),
          initPos: [
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 3.5,
            -3.5,
          ],
        },
      ]);
    }

    freezeT.current += dt;
    if (freezeT.current >= 18) {
      freezeT.current = 0;
      setBoosters((prev) => [
        ...prev.slice(-4),
        {
          id: uid(),
          boosterType: "freeze",
          initPos: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 3, -3],
        },
      ]);
    }

    payloadT.current += dt;
    if (payloadT.current >= 22) {
      payloadT.current = 0;
      setBoosters((prev) => [
        ...prev.slice(-4),
        {
          id: uid(),
          boosterType: "payload",
          initPos: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 3, -3],
        },
      ]);
    }
  });

  useEffect(() => {
    if (!shootEvent || paused) return;
    if (shootEvent.id === lastShootId.current) return;
    lastShootId.current = shootEvent.id;
    const bulletStart = barrelTipRef.current.toArray();
    const dir = aimDirRef.current.clone().normalize().toArray();
    setBullets((b) => [
      ...b.slice(-14),
      { id: uid(), startPos: bulletStart, direction: dir },
    ]);
    setFiring(true);
    setTimeout(() => setFiring(false), 110);
  }, [shootEvent, paused]);

  const handleBulletHit = useCallback(
    (mesh, hitPos) => {
      if (!mesh || !mesh.userData.kill || !hitPos) return;
      const ttype = mesh.userData.targetType;
      mesh.userData.kill();
      if (ttype === "clock") {
        setBursts((b) => [
          ...b.slice(-20),
          { id: uid(), pos: hitPos, color: "#FFD600" },
        ]);
        onSpecialHit("clock");
        return;
      }
      if (ttype === "booster_freeze" || ttype === "booster_payload") {
        setBursts((b) => [
          ...b.slice(-20),
          {
            id: uid(),
            pos: hitPos,
            color: ttype === "booster_freeze" ? "#40C4FF" : "#CE93D8",
          },
        ]);
        onSpecialHit(ttype === "booster_freeze" ? "freeze" : "payload");
        return;
      }
      const color = ttype === "danger" ? "#FF5555" : "#44FF88";
      setBursts((b) => [...b.slice(-20), { id: uid(), pos: hitPos, color }]);
      onScoreUpdate(
        ttype === "danger" ? 10 : -10,
        ttype === "safe" ? -10 : 0,
        ttype === "danger",
      );
    },
    [onScoreUpdate, onSpecialHit],
  );

  const rmTarget = useCallback(
    (id) => setTargets((p) => p.filter((t) => t.id !== id)),
    [],
  );
  const rmClock = useCallback(
    (id) => setClocks((p) => p.filter((t) => t.id !== id)),
    [],
  );
  const rmBooster = useCallback(
    (id) => setBoosters((p) => p.filter((t) => t.id !== id)),
    [],
  );
  const rmBurst = useCallback(
    (id) => setBursts((p) => p.filter((t) => t.id !== id)),
    [],
  );
  const rmBullet = useCallback(
    (id) => setBullets((p) => p.filter((t) => t.id !== id)),
    [],
  );

  const payloadDrop = useCallback(() => {
    const newTargets = Array.from({ length: 8 }, () => {
      const tmpl =
        DANGEROUS_TARGETS[Math.floor(Math.random() * DANGEROUS_TARGETS.length)];
      return {
        id: uid(),
        ...tmpl,
        initPos: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 4,
          -2 - Math.random() * 4,
        ],
        speed: 0.9 + Math.random() * 0.7,
      };
    });
    setTargets((prev) => [...prev.slice(-20), ...newTargets]);
  }, []);

  useEffect(() => {
    if (onSpecialHit._payloadRef)
      onSpecialHit._payloadRef.current = payloadDrop;
  }, [payloadDrop, onSpecialHit]);

  // Extended cloud layout — more clouds across the sky
  const clouds = [
    [[-5, 3, -10], [1.2, 0.7, 1], 0.3],
    [[4, 3.5, -11], [0.9, 0.6, 1], 0.25],
    [[-8, 2.5, -9], [1.0, 0.7, 1], 0.35],
    [[7, 2, -10], [1.3, 0.7, 1], 0.28],
    [[0, 4, -11], [1.1, 0.65, 1], 0.22],
    [[-3, 3.8, -12], [0.75, 0.5, 1], 0.18],
    [[6, 4, -12], [0.8, 0.55, 1], 0.2],
    [[-10, 3.2, -11], [0.85, 0.6, 1], 0.32],
    [[10, 3, -10], [1.0, 0.6, 1], 0.27],
    [[2, 4.5, -13], [1.4, 0.75, 1], 0.15],
    [[-6, 4.2, -13], [0.65, 0.5, 1], 0.24],
    [[8, 3.5, -13], [0.9, 0.6, 1], 0.19],
  ];

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        color="#FFF5E0"
        castShadow
      />
      <pointLight position={[-5, 5, 3]} intensity={0.8} color="#AADDFF" />
      <mesh position={[0, 0, -12]}>
        <planeGeometry args={[80, 50]} />
        <meshBasicMaterial color="#87CEEB" />
      </mesh>
      <mesh position={[0, -5, -8]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[80, 20]} />
        <meshStandardMaterial color="#5DC76E" roughness={1} />
      </mesh>
      {clouds.map(([pos, scale, speed], i) => (
        <FloatingCloud key={i} position={pos} scale={scale} speed={speed} />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={`s${i}`}
          position={[Math.sin(i * 1.7) * 9, Math.cos(i * 2.3) * 2 + 2.5, -11.5]}
        >
          <octahedronGeometry args={[0.06, 0]} />
          <meshBasicMaterial color="#FFDD44" />
        </mesh>
      ))}
      <CartoonGun
        firing={firing}
        aimDirRef={aimDirRef}
        barrelTipRef={barrelTipRef}
      />
      {targets.map((t) => (
        <Target
          key={t.id}
          {...t}
          difficulty={difficulty}
          speedMult={speedMult}
          registry={registry}
          onDead={rmTarget}
        />
      ))}
      {clocks.map((c) => (
        <ClockTarget
          key={c.id}
          {...c}
          speedMult={speedMult}
          registry={registry}
          onDead={rmClock}
        />
      ))}
      {boosters.map((b) => (
        <BoosterTarget
          key={b.id}
          {...b}
          registry={registry}
          onDead={rmBooster}
        />
      ))}
      {bullets.map((b) => (
        <Bullet
          key={b.id}
          startPos={b.startPos}
          direction={b.direction}
          registry={registry}
          onHit={(mesh, pos) => {
            handleBulletHit(mesh, pos);
            rmBullet(b.id);
          }}
        />
      ))}
      {bursts.map((b) => (
        <StarBurst
          key={b.id}
          pos={b.pos}
          color={b.color}
          onDone={() => rmBurst(b.id)}
        />
      ))}
    </>
  );
}

// ─── CROSSHAIR ────────────────────────────────────────────────────────────────

function Crosshair({ mousePos, firing }) {
  const color = firing ? "#FF4444" : "#FF8800";
  return (
    <div
      style={{
        position: "absolute",
        left: mousePos.x - 28,
        top: mousePos.y - 28,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle
          cx="28"
          cy="28"
          r={firing ? 6 : 10}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          opacity="0.9"
        />
        <circle cx="28" cy="28" r={firing ? 4 : 2.5} fill={color} />
        {[
          [28, 4, 28, 16],
          [28, 40, 28, 52],
          [4, 28, 16, 28],
          [40, 28, 52, 28],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}
        {firing && (
          <circle
            cx="28"
            cy="28"
            r="18"
            fill="none"
            stroke="#FF440066"
            strokeWidth="3"
          />
        )}
      </svg>
    </div>
  );
}

// ─── SCORE POP ────────────────────────────────────────────────────────────────

function ScorePop({ msg, color }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        bottom: "22%",
        left: "50%",
        transform: "translateX(-50%)",
        color,
        fontSize: 22,
        fontWeight: 900,
        fontFamily: "'Fredoka One','Comic Sans MS',cursive",
        textShadow: "0 0 12px rgba(0,0,0,0.5), 2px 2px 0 rgba(0,0,0,0.4)",
        animation: "floatUp 1.2s ease forwards",
        pointerEvents: "none",
        zIndex: 25,
        whiteSpace: "nowrap",
        letterSpacing: 1,
      }}
    >
      {msg}
    </div>
  );
}

// ─── FREEZE OVERLAY — icy visual with no blur ─────────────────────────────────

function FreezeOverlay({ freezeTimeLeft }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 6,
        overflow: "hidden",
      }}
    >
      {/* Tinted border vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 80px 30px rgba(80,210,255,0.45)",
          animation: "icePulse 1s ease-in-out infinite alternate",
        }}
      />

      {/* Scanline frost stripes */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(120,230,255,0.06) 6px, rgba(120,230,255,0.06) 7px)",
        }}
      />

      {/* Corner ice crystal — top left */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 220,
          height: 220,
          opacity: 0.7,
        }}
        viewBox="0 0 220 220"
      >
        <g stroke="#A8EEFF" strokeWidth="1.5" fill="none" opacity="0.9">
          {[0, 30, 60, 90, 120, 150].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1="0"
                y1="0"
                x2={Math.cos(r) * 160}
                y2={Math.sin(r) * 160}
                strokeWidth="1"
                opacity="0.6"
              />
            );
          })}
          {[40, 70, 100, 130].map((r, i) => (
            <circle
              key={i}
              cx="0"
              cy="0"
              r={r}
              strokeWidth="0.8"
              opacity="0.4"
            />
          ))}
          {[0, 30, 60, 90, 120, 150].map((a) => {
            const r = (a * Math.PI) / 180;
            const mx = Math.cos(r) * 90,
              my = Math.sin(r) * 90;
            const px = Math.cos(r + 0.5) * 20,
              py = Math.sin(r + 0.5) * 20;
            const qx = Math.cos(r - 0.5) * 20,
              qy = Math.sin(r - 0.5) * 20;
            return (
              <g key={a}>
                <line
                  x1={mx}
                  y1={my}
                  x2={mx + px}
                  y2={my + py}
                  strokeWidth="1.2"
                />
                <line
                  x1={mx}
                  y1={my}
                  x2={mx + qx}
                  y2={my + qy}
                  strokeWidth="1.2"
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Corner ice crystal — bottom right */}
      <svg
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 220,
          height: 220,
          opacity: 0.7,
          transform: "rotate(180deg)",
        }}
        viewBox="0 0 220 220"
      >
        <g stroke="#A8EEFF" strokeWidth="1.5" fill="none" opacity="0.9">
          {[0, 30, 60, 90, 120, 150].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1="0"
                y1="0"
                x2={Math.cos(r) * 160}
                y2={Math.sin(r) * 160}
                strokeWidth="1"
                opacity="0.6"
              />
            );
          })}
          {[40, 70, 100, 130].map((r, i) => (
            <circle
              key={i}
              cx="0"
              cy="0"
              r={r}
              strokeWidth="0.8"
              opacity="0.4"
            />
          ))}
        </g>
      </svg>

      {/* Top-right crystal */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 160,
          height: 160,
          opacity: 0.55,
          transform: "rotate(90deg)",
        }}
        viewBox="0 0 220 220"
      >
        <g stroke="#C8F4FF" strokeWidth="1.2" fill="none">
          {[0, 45, 90, 135].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1="0"
                y1="0"
                x2={Math.cos(r) * 130}
                y2={Math.sin(r) * 130}
                opacity="0.5"
              />
            );
          })}
          {[35, 65, 95].map((r, i) => (
            <circle
              key={i}
              cx="0"
              cy="0"
              r={r}
              strokeWidth="0.7"
              opacity="0.35"
            />
          ))}
        </g>
      </svg>

      {/* Bottom-left crystal */}
      <svg
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 160,
          height: 160,
          opacity: 0.55,
          transform: "rotate(270deg)",
        }}
        viewBox="0 0 220 220"
      >
        <g stroke="#C8F4FF" strokeWidth="1.2" fill="none">
          {[0, 45, 90, 135].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1="0"
                y1="0"
                x2={Math.cos(r) * 130}
                y2={Math.sin(r) * 130}
                opacity="0.5"
              />
            );
          })}
          {[35, 65, 95].map((r, i) => (
            <circle
              key={i}
              cx="0"
              cy="0"
              r={r}
              strokeWidth="0.7"
              opacity="0.35"
            />
          ))}
        </g>
      </svg>

      {/* Floating ice particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${8 + ((i * 7.8) % 85)}%`,
            top: `${5 + ((i * 13) % 90)}%`,
            width: 6 + (i % 4) * 3,
            height: 6 + (i % 4) * 3,
            background: "rgba(160,230,255,0.5)",
            borderRadius: "50% 20% 50% 20%",
            transform: `rotate(${i * 30}deg)`,
            animation: `iceDrift ${2 + (i % 3)}s ease-in-out ${i * 0.3}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────

export default function CyberShooterGame({
  onClose,
  onScoreSubmit,
  initialHighScore = 0,
}) {
  const [gameState, setGameState] = useState("intro");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [highScore, setHighScore] = useState(initialHighScore);
  const [difficulty, setDifficulty] = useState(0);
  const [firing, setFiring] = useState(false);
  const [pops, setPops] = useState([]);
  const [quizQueue, setQuizQueue] = useState(() =>
    shuffleArray(ALL_QUIZ_QUESTIONS),
  );
  const [quizIdx, setQuizIdx] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [quizFb, setQuizFb] = useState(null);
  const [mousePos, setMousePos] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const mousePosRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const [shootEvent, setShootEvent] = useState(null);
  const [speedMult, setSpeedMult] = useState(1);
  const [freezeActive, setFreezeActive] = useState(false);
  const [freezeTimeLeft, setFreezeTimeLeft] = useState(0);
  const payloadRef = useRef(null);

  const bgMusicRef = useRef(null);
  const gunSoundRef = useRef(null);

  useEffect(() => {
    const bg = new Audio("./audios/TriggerBackground.mp3");
    bg.loop = true;
    bg.volume = 0.45;
    bgMusicRef.current = bg;
    const gun = new Audio("./audios/TriggerGun.wav");
    gun.volume = 0.7;
    gunSoundRef.current = gun;
    return () => {
      bg.pause();
      bg.src = "";
      gun.src = "";
    };
  }, []);

  useEffect(() => {
    const bg = bgMusicRef.current;
    if (!bg) return;
    if (gameState === "playing" || gameState === "quiz") {
      bg.play().catch(() => {});
    } else if (gameState === "paused") {
      bg.pause();
    } else {
      bg.pause();
      bg.currentTime = 0;
    }
  }, [gameState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setGameState((prev) => {
          if (prev === "playing") return "paused";
          if (prev === "paused") return "playing";
          return prev;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addPop = useCallback((msg, color) => {
    setPops((p) => [...p.slice(-4), { id: uid(), msg, color }]);
  }, []);

  const handleSpecialHit = useCallback(
    (type) => {
      if (type === "clock") {
        setTimeLeft((t) => t + 10);
        addPop("+10 seconds! ⏰", "#FFD600");
      } else if (type === "freeze") {
        setSpeedMult(0.22);
        setFreezeActive(true);
        setFreezeTimeLeft(6);
        addPop("🧊 FIREWALL FREEZE!", "#40C4FF");
        let remaining = 6;
        const tick = setInterval(() => {
          remaining -= 1;
          setFreezeTimeLeft(remaining);
          if (remaining <= 0) {
            clearInterval(tick);
            setSpeedMult(1);
            setFreezeActive(false);
          }
        }, 1000);
      } else if (type === "payload") {
        addPop("💣 PAYLOAD DROP — threats incoming!", "#CE93D8");
        if (payloadRef.current) payloadRef.current();
      }
    },
    [addPop],
  );

  handleSpecialHit._payloadRef = payloadRef;

  useEffect(() => {
    if (gameState !== "playing") return;
    const fn = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const t = setInterval(
      () => setDifficulty((d) => Math.min(d + 1, 10)),
      10000,
    );
    return () => clearInterval(t);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("gameover");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const t = setInterval(() => {
      setQuiz(quizQueue[quizIdx % quizQueue.length]);
      setQuizFb(null);
      setGameState("quiz");
    }, 22000);
    return () => clearInterval(t);
  }, [gameState, quizIdx, quizQueue]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const fn = (e) => {
      let el = e.target;
      while (el) {
        if (el.dataset?.ui !== undefined) return;
        el = el.parentElement;
      }
      setShootEvent({
        x: mousePosRef.current.x,
        y: mousePosRef.current.y,
        id: uid(),
      });
      setFiring(true);
      setTimeout(() => setFiring(false), 100);
      if (gunSoundRef.current) {
        const shot = gunSoundRef.current.cloneNode();
        shot.volume = 0.7;
        shot.play().catch(() => {});
      }
    };
    window.addEventListener("mousedown", fn);
    return () => window.removeEventListener("mousedown", fn);
  }, [gameState]);

  useEffect(() => {
    if (gameState === "gameover") {
      setHighScore((h) => Math.max(h, score));
      if (onScoreSubmit) onScoreSubmit(score);
    }
  }, [gameState, score, onScoreSubmit]);

  const handleScoreUpdate = useCallback(
    (pts, timeDelta, isGood) => {
      setScore((s) => Math.max(0, s + pts));
      if (timeDelta < 0) {
        setTimeLeft((t) => Math.max(0, t + timeDelta));
        addPop("⚠️ Wrong target! -10 pts, -10 sec", "#FF3333");
      } else if (isGood) {
        setCombo((c) => {
          const next = c + 1;
          if (next >= 3 && next % 3 === 0) {
            setScore((s) => s + 20);
            addPop(`🔥 Combo x${next}! +20 pts`, "#FF8800");
          } else {
            addPop("✅ Threat stopped! +10 pts", "#22CC66");
          }
          return next;
        });
      } else {
        setCombo(0);
      }
    },
    [addPop],
  );

  const answerQuiz = (idx) => {
    const q = quiz;
    const correct = idx === q.correct;
    setQuizFb({ correct, fun: q.fun });
    if (correct) {
      setTimeLeft((t) => t + 10);
      addPop("+10 seconds! 🎉", "#22AAFF");
    } else addPop("Wrong answer! Try again", "#FF4444");
    setTimeout(() => {
      setQuizIdx((qi) => qi + 1);
      setQuiz(null);
      setQuizFb(null);
      setGameState("playing");
    }, 2200);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setCombo(0);
    setDifficulty(0);
    setShootEvent(null);
    setPops([]);
    setSpeedMult(1);
    setFreezeActive(false);
    setFreezeTimeLeft(0);
    setQuizQueue(shuffleArray(ALL_QUIZ_QUESTIONS));
    setQuizIdx(0);
    setGameState("playing");
  };

  const timerPct = (timeLeft / 60) * 100;
  const timerColor =
    timeLeft > 30 ? "#22CC66" : timeLeft > 10 ? "#FFAA00" : "#FF3333";
  const playing =
    gameState === "playing" || gameState === "quiz" || gameState === "paused";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#87CEEB",
        fontFamily: "'Fredoka One','Comic Sans MS','Segoe UI',cursive",
        cursor: gameState === "playing" ? "none" : "default",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');

        @keyframes floatUp {
          0%  { opacity:1; transform:translateX(-50%) translateY(0) scale(1.1) }
          100%{ opacity:0; transform:translateX(-50%) translateY(-90px) scale(0.9) }
        }
        @keyframes bounce {
          0%,100%{ transform:translateY(0) }
          50%    { transform:translateY(-14px) }
        }
        @keyframes cloudDrift {
          0%  { transform:translateX(0) }
          100%{ transform:translateX(40px) }
        }
        @keyframes pop {
          0%  { transform:scale(0.5); opacity:0 }
          70% { transform:scale(1.08) }
          100%{ transform:scale(1); opacity:1 }
        }
        @keyframes pulse {
          0%,100%{ transform:scale(1) }
          50%    { transform:scale(1.06) }
        }
        @keyframes icePulse {
          0%  { box-shadow: inset 0 0 80px 30px rgba(80,210,255,0.35) }
          100%{ box-shadow: inset 0 0 100px 50px rgba(80,210,255,0.6) }
        }
        @keyframes iceDrift {
          0%  { transform:translateY(0) rotate(0deg); opacity:0.4 }
          100%{ transform:translateY(-12px) rotate(20deg); opacity:0.8 }
        }
        @keyframes hudSlideDown {
          0%  { transform:translateY(-30px); opacity:0 }
          100%{ transform:translateY(0); opacity:1 }
        }
        @keyframes hudSlideRight {
          0%  { transform:translateX(30px); opacity:0 }
          100%{ transform:translateX(0); opacity:1 }
        }
        @keyframes comboFlash {
          0%,100%{ box-shadow: 0 4px 20px rgba(255,140,0,0.5) }
          50%    { box-shadow: 0 4px 30px rgba(255,220,0,0.9) }
        }
        @keyframes timerWarn {
          0%,100%{ text-shadow: 0 0 10px rgba(255,50,50,0.5) }
          50%    { text-shadow: 0 0 25px rgba(255,50,50,1) }
        }
        @keyframes badgeIn {
          0%  { transform:scale(0.4) rotate(-10deg); opacity:0 }
          80% { transform:scale(1.1) rotate(2deg) }
          100%{ transform:scale(1) rotate(0deg); opacity:1 }
        }
        @keyframes legendFloat {
          0%,100%{ transform:translateX(-50%) translateY(0) }
          50%    { transform:translateX(-50%) translateY(-4px) }
        }

        .btn-fun {
          border:none; border-radius:20px; cursor:pointer;
          font-family:inherit; font-weight:900; letter-spacing:1px;
          transition:transform 0.12s, box-shadow 0.12s;
        }
        .btn-fun:hover  { transform:translateY(-4px) scale(1.03) }
        .btn-fun:active { transform:translateY(2px) scale(0.97) }

        .hud-glass {
          background: rgba(10, 20, 40, 0.62);
          border: 1.5px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
      `}</style>

      {/* ── 3D CANVAS ── */}
      {playing && (
        <Canvas
          style={{ position: "absolute", inset: 0 }}
          camera={{ position: [0, 0, 7], fov: 65 }}
          gl={{ antialias: true }}
        >
          <GameScene
            paused={gameState === "quiz" || gameState === "paused"}
            difficulty={difficulty}
            shootEvent={shootEvent}
            mousePosRef={mousePosRef}
            speedMult={speedMult}
            onScoreUpdate={handleScoreUpdate}
            onSpecialHit={handleSpecialHit}
          />
        </Canvas>
      )}

      {/* ── INTRO ── */}
      {gameState === "intro" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg,#87CEEB 0%,#B0E8FF 40%,#90EE90 70%,#5DC76E 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
          }}
        >
          {[
            [-35, -18],
            [30, -16],
            [55, -10],
            [-55, -8],
            [-15, -22],
            [10, -20],
            [42, -14],
          ].map(([x, y], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${28 + i * 5}%`,
                left: `${50 + x}%`,
                width: 80 + (i % 3) * 40,
                height: 40 + (i % 2) * 20,
                borderRadius: 50,
                background: "rgba(255,255,255,0.82)",
                animation: `cloudDrift ${4 + i}s ease-in-out infinite alternate`,
              }}
            />
          ))}

          <div
            style={{
              background: "rgba(255,255,255,0.96)",
              borderRadius: 32,
              padding: "26px 40px",
              textAlign: "center",
              boxShadow: "0 10px 0 #CCC, 0 16px 40px rgba(0,0,0,0.18)",
              animation: "pop 0.5s ease",
              maxWidth: 540,
              zIndex: 2,
              maxHeight: "90vh",
              overflowY: "auto",
              border: "3px solid rgba(255,215,0,0.4)",
            }}
          >
            <div style={{ fontSize: 64, animation: "bounce 1.5s infinite" }}>
              🛡️
            </div>
            <h1
              style={{
                fontSize: 36,
                margin: "6px 0 4px",
                background:
                  "linear-gradient(135deg,#FF6B6B,#FF8E53,#FFD93D,#6BCB77)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 2,
              }}
            >
              Cyber Guardian
            </h1>
            <div
              style={{
                fontSize: 14,
                color: "#888",
                marginBottom: 16,
                letterSpacing: 1,
              }}
            >
              Learn to spot internet dangers!
            </div>

            <div
              style={{
                background: "#FFF9E6",
                borderRadius: 16,
                padding: "13px 18px",
                textAlign: "left",
                border: "3px dashed #FFD700",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 13,
                  color: "#FF6B00",
                  marginBottom: 8,
                }}
              >
                HOW TO PLAY
              </div>
              {[
                ["🔴 Shoot RED targets", "Cyber threats — +10 pts"],
                ["🟢 Do NOT shoot GREEN", "Safe things — -10 pts and -10 sec!"],
                ["⏰ Shoot the CLOCK", "Gives +10 seconds (only lasts 4s)"],
                [
                  "🧊 FIREWALL FREEZE",
                  "Shoot to slow targets for 6s (lasts 4s)",
                ],
                [
                  "💣 PAYLOAD DROP",
                  "Shoot to spawn 8 bonus threats (lasts 4s)",
                ],
                ["🔥 Hit 3 in a row", "Combo bonus +20 pts"],
                ["❓ Answer quiz questions", "Correct = +10 bonus seconds"],
              ].map(([t, d], i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 5,
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 900,
                      color: "#333",
                      minWidth: 165,
                    }}
                  >
                    {t}
                  </span>
                  <span style={{ fontSize: 11, color: "#888" }}>{d}</span>
                </div>
              ))}
            </div>

            {highScore > 0 && (
              <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
                Best score:{" "}
                <span style={{ color: "#FF6B00", fontWeight: 900 }}>
                  {highScore}
                </span>
              </div>
            )}

            <button
              data-ui
              className="btn-fun"
              onClick={startGame}
              style={{
                background: "linear-gradient(135deg,#FF6B6B,#FF8E53)",
                color: "#fff",
                fontSize: 22,
                padding: "13px 50px",
                boxShadow: "0 6px 0 #CC4400",
                display: "block",
                width: "100%",
                marginBottom: 10,
              }}
            >
              START MISSION! 🚀
            </button>
            {onClose && (
              <button
                data-ui
                className="btn-fun"
                onClick={onClose}
                style={{
                  background: "#EEE",
                  color: "#888",
                  fontSize: 13,
                  padding: "8px 26px",
                  paddingTop: 8,
                  paddingBottom: 8,
                  boxShadow: "0 4px 0 #CCC",
                }}
              >
                Maybe Later
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── HUD ── */}
      {playing && (
        <>
          <Crosshair mousePos={mousePos} firing={firing} />

          {/* Freeze overlay — no blur, icy crystal effect */}
          {freezeActive && <FreezeOverlay freezeTimeLeft={freezeTimeLeft} />}

          {/* ── TOP-RIGHT: SCORE ── */}
          <div
            data-ui
            className="hud-glass"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              textAlign: "right",
              borderRadius: 20,
              padding: "10px 16px 10px 20px",
              pointerEvents: "none",
              animation: "hudSlideRight 0.4s ease",
              minWidth: 130,
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,220,100,0.8)",
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              ⚡ Score
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 900,
                color: "#FFE566",
                lineHeight: 1,
                textShadow: "0 0 16px rgba(255,220,50,0.6)",
                letterSpacing: 1,
              }}
            >
              {score.toString().padStart(5, "0")}
            </div>
            {highScore > 0 && (
              <div
                style={{
                  fontSize: 9,
                  color: "rgba(200,180,255,0.7)",
                  marginTop: 3,
                  letterSpacing: 1,
                }}
              >
                BEST&nbsp;
                <span style={{ color: "#C893FF", fontWeight: 900 }}>
                  {highScore}
                </span>
              </div>
            )}
          </div>

          {/* ── PAUSE BUTTON ── */}
          {gameState === "playing" && (
            <button
              data-ui
              className="btn-fun hud-glass"
              onClick={() => setGameState("paused")}
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                width: 50,
                height: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                color: "#FFF",
                pointerEvents: "auto",
                animation: "hudSlideDown 0.4s ease",
                padding: 0,
              }}
              title="Pause Game (Esc)"
            >
              ⏸️
            </button>
          )}

          {/* ── TOP-CENTER: TIMER ── */}
          <div
            data-ui
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              pointerEvents: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              animation: "hudSlideDown 0.4s ease",
            }}
          >
            {/* Timer arc ring */}
            <div style={{ position: "relative", width: 88, height: 88 }}>
              <svg
                width="88"
                height="88"
                viewBox="0 0 88 88"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: "rotate(-90deg)",
                }}
              >
                {/* Track */}
                <circle
                  cx="44"
                  cy="44"
                  r="36"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="6"
                />
                {/* Progress */}
                <circle
                  cx="44"
                  cy="44"
                  r="36"
                  fill="none"
                  stroke={timerColor}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 36}`}
                  strokeDashoffset={`${2 * Math.PI * 36 * (1 - timerPct / 100)}`}
                  style={{
                    transition: "stroke-dashoffset 1s linear, stroke 0.5s",
                    filter: `drop-shadow(0 0 6px ${timerColor})`,
                  }}
                />
              </svg>
              {/* Center number */}
              <div
                className="hud-glass"
                style={{
                  position: "absolute",
                  inset: 8,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: timerColor,
                    lineHeight: 1,
                    textShadow: `0 0 12px ${timerColor}88`,
                    animation:
                      timeLeft <= 10 ? "timerWarn 0.5s infinite" : "none",
                  }}
                >
                  {timeLeft}
                </div>
                <div
                  style={{
                    fontSize: 7,
                    color: "rgba(255,255,255,0.45)",
                    letterSpacing: 1,
                  }}
                >
                  SEC
                </div>
              </div>
            </div>
          </div>

          {/* ── TOP-RIGHT: COMBO + LEVEL ── */}
          <div
            data-ui
            className="hud-glass"
            style={{
              position: "absolute",
              top: 110,
              right: 16,
              borderRadius: 20,
              padding: "10px 18px",
              pointerEvents: "none",
              animation: "hudSlideRight 0.4s ease",
              textAlign: "right",
              minWidth: 110,
              ...(combo >= 3 ? { animation: "comboFlash 0.8s infinite" } : {}),
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,200,80,0.75)",
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              🔥 Combo
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: combo >= 3 ? "#FFD700" : "#FFFFFF",
                lineHeight: 1,
                textShadow:
                  combo >= 3 ? "0 0 20px rgba(255,200,0,0.8)" : "none",
              }}
            >
              ×{combo}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "rgba(160,220,255,0.7)",
                letterSpacing: 2,
                marginTop: 3,
                borderTop: "1px solid rgba(255,255,255,0.1)",
                paddingTop: 4,
              }}
            >
              LVL{" "}
              <span style={{ color: "#80CCFF", fontWeight: 900 }}>
                {difficulty + 1}
              </span>
            </div>
          </div>

          {/* ── FREEZE ACTIVE BADGE — bottom-right, never overlaps top HUD ── */}
          {freezeActive && (
            <div
              data-ui
              style={{
                position: "absolute",
                bottom: 80,
                right: 16,
                pointerEvents: "none",
                animation: "badgeIn 0.4s ease",
                zIndex: 15,
              }}
            >
              <div
                className="hud-glass"
                style={{
                  borderRadius: 18,
                  padding: "10px 16px",
                  border: "2px solid rgba(100,220,255,0.5)",
                  textAlign: "center",
                  background: "rgba(0,60,100,0.75)",
                }}
              >
                <div style={{ fontSize: 28 }}>🧊</div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#80E8FF",
                    fontWeight: 900,
                    letterSpacing: 1,
                  }}
                >
                  FREEZE
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: "#40C4FF",
                    textShadow: "0 0 14px #40C4FF",
                    lineHeight: 1.1,
                  }}
                >
                  {freezeTimeLeft}s
                </div>
              </div>
            </div>
          )}

          {/* ── BOTTOM LEGEND — compact floating pills ── */}
          <div
            data-ui
            style={{
              position: "absolute",
              bottom: 14,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 6,
              pointerEvents: "none",
              flexWrap: "nowrap",
              justifyContent: "center",
              animation: "legendFloat 3s ease-in-out infinite",
              zIndex: 10,
            }}
          >
            {[
              ["🔴 SHOOT", "#FF4444", "rgba(255,68,68,0.15)"],
              ["🟢 AVOID", "#22CC66", "rgba(34,204,102,0.15)"],
              ["⏰ +10s", "#FFD600", "rgba(255,214,0,0.15)"],
              ["🧊 FREEZE", "#29B6F6", "rgba(41,182,246,0.15)"],
              ["💣 DROP", "#AB47BC", "rgba(171,71,188,0.15)"],
            ].map(([t, c, bg]) => (
              <div
                key={t}
                style={{
                  background: bg,
                  borderRadius: 30,
                  padding: "5px 12px",
                  border: `1.5px solid ${c}`,
                  color: c,
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                  textShadow: `0 0 8px ${c}66`,
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </div>
            ))}
          </div>

          {pops.map((p) => (
            <ScorePop key={p.id} msg={p.msg} color={p.color} />
          ))}
        </>
      )}

      {/* ── PAUSE OVERLAY ── */}
      {gameState === "paused" && (
        <div
          data-ui
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1001,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            animation: "pop 0.3s ease",
          }}
        >
          <div style={{ fontSize: 80, marginBottom: 15 }}>⏸️</div>
          <h2
            style={{
              fontSize: 50,
              margin: 0,
              letterSpacing: 4,
              fontWeight: 900,
            }}
          >
            PAUSED
          </h2>
          <p
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.7)",
              marginTop: 10,
            }}
          >
            Press ESC or click to resume
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 15,
              marginTop: 40,
            }}
          >
            <div style={{ display: "flex", gap: 20 }}>
              <button
                className="btn-fun"
                onClick={() => setGameState("playing")}
                style={{
                  padding: "15px 50px",
                  fontSize: 26,
                  background: "linear-gradient(135deg,#6BCB77,#4CAF50)",
                  color: "white",
                  boxShadow: "0 8px 0 #2E7D32",
                  textTransform: "uppercase",
                }}
              >
                RESUME
              </button>
              {onClose && (
                <button
                  className="btn-fun"
                  onClick={onClose}
                  style={{
                    padding: "15px 50px",
                    fontSize: 26,
                    background: "linear-gradient(135deg,#FF6B6B,#FF4444)",
                    color: "white",
                    boxShadow: "0 8px 0 #CC0000",
                    textTransform: "uppercase",
                  }}
                >
                  EXIT GAME
                </button>
              )}
            </div>
            {onClose && (
              <div
                style={{
                  color: "#FF8888",
                  fontSize: 14,
                  fontWeight: 900,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  padding: "8px 16px",
                  borderRadius: 8,
                  marginTop: 10,
                  border: "1px solid rgba(255,68,68,0.5)",
                  letterSpacing: 1,
                }}
              >
                ⚠️ WARNING: Exiting will clear your current game progress!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── QUIZ ── */}
      {gameState === "quiz" && quiz && (
        <div
          data-ui
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(5,20,50,0.6)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              background: "rgba(10,25,60,0.96)",
              borderRadius: 32,
              padding: "30px 40px",
              maxWidth: 520,
              width: "90%",
              boxShadow:
                "0 0 0 2px rgba(255,215,0,0.4), 0 20px 60px rgba(0,0,0,0.5)",
              border: "2px solid rgba(255,215,0,0.3)",
              animation: "pop 0.3s ease",
            }}
          >
            <div style={{ textAlign: "center", fontSize: 40, marginBottom: 4 }}>
              🧠
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(180,200,255,0.7)",
                letterSpacing: 3,
                textAlign: "center",
                marginBottom: 12,
                textTransform: "uppercase",
              }}
            >
              Quiz Time — Correct = +10 seconds
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: "#F0F4FF",
                marginBottom: 20,
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              {quiz.q}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {quiz.options.map((opt, i) => {
                let bg = "rgba(255,255,255,0.06)",
                  border = "2px solid rgba(255,255,255,0.12)",
                  color = "#C8D8FF";
                if (quizFb) {
                  if (i === quiz.correct) {
                    bg = "rgba(50,200,100,0.2)";
                    border = "2px solid #22CC66";
                    color = "#88FFB8";
                  } else {
                    bg = "rgba(255,80,80,0.15)";
                    border = "2px solid #FF4444";
                    color = "#FF9999";
                  }
                }
                return (
                  <button
                    key={i}
                    data-ui
                    className="btn-fun"
                    onClick={() => !quizFb && answerQuiz(i)}
                    style={{
                      background: bg,
                      border,
                      color,
                      borderRadius: 14,
                      padding: "13px 18px",
                      fontSize: 15,
                      textAlign: "left",
                      cursor: quizFb ? "default" : "pointer",
                      boxShadow: quizFb ? "none" : "0 4px 0 rgba(0,0,0,0.2)",
                    }}
                  >
                    <span style={{ fontWeight: 900, marginRight: 8 }}>
                      {["A", "B"][i]}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {quizFb && (
              <div
                style={{
                  marginTop: 16,
                  padding: "12px 18px",
                  background: quizFb.correct
                    ? "rgba(50,200,100,0.15)"
                    : "rgba(255,160,50,0.15)",
                  borderRadius: 14,
                  fontSize: 13,
                  color: quizFb.correct ? "#88FFB8" : "#FFD080",
                  border: `2px solid ${quizFb.correct ? "#22CC66" : "#FFAA00"}`,
                  textAlign: "center",
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                {quizFb.correct ? "✅ Correct! " : "💡 Tip: "}
                {quizFb.fun}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── GAME OVER ── */}
      {gameState === "gameover" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg,#87CEEB 0%,#B0E8FF 40%,#90EE90 70%,#5DC76E 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {[
            [-35, -18],
            [30, -16],
            [55, -10],
            [-55, -8],
            [10, -22],
            [-10, -20],
            [42, -14],
          ].map(([x, y], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${28 + i * 5}%`,
                left: `${50 + x}%`,
                width: 80 + (i % 3) * 40,
                height: 40 + (i % 2) * 20,
                borderRadius: 50,
                background: "rgba(255,255,255,0.82)",
                animation: `cloudDrift ${4 + i}s ease-in-out infinite alternate`,
              }}
            />
          ))}

          <div
            style={{
              background: "rgba(255,255,255,0.97)",
              borderRadius: 32,
              padding: "32px 48px",
              textAlign: "center",
              boxShadow: "0 10px 0 #FFD700, 0 16px 50px rgba(0,0,0,0.18)",
              border: "3px solid rgba(255,215,0,0.5)",
              animation: "pop 0.4s ease",
              maxWidth: 440,
              zIndex: 2,
            }}
          >
            <div style={{ fontSize: 72, animation: "bounce 1s infinite" }}>
              {score >= 200 ? "🏆" : score >= 100 ? "🎖️" : "🌟"}
            </div>
            <h2
              style={{
                fontSize: 28,
                margin: "8px 0 4px",
                background:
                  score >= 100
                    ? "linear-gradient(135deg,#22CC66,#00AA44)"
                    : "linear-gradient(135deg,#FF6B6B,#FF8E53)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {score >= 200
                ? "CYBER HERO!"
                : score >= 100
                  ? "GREAT JOB!"
                  : "KEEP TRYING!"}
            </h2>
            <div
              style={{
                background: "#FFF9E6",
                borderRadius: 20,
                padding: "16px 26px",
                margin: "12px 0",
                border: "3px dashed #FFD700",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#AAA",
                  letterSpacing: 2,
                  marginBottom: 4,
                }}
              >
                YOUR SCORE
              </div>
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  color: "#333",
                  lineHeight: 1,
                }}
              >
                {score}
              </div>
              {highScore > 0 && score >= highScore && score > 0 && (
                <div
                  style={{
                    fontSize: 13,
                    color: "#FF8800",
                    fontWeight: 900,
                    marginTop: 4,
                  }}
                >
                  🎉 New Best Score!
                </div>
              )}
              {highScore > 0 && score < highScore && (
                <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                  Best: {highScore}
                </div>
              )}
              <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
                {score >= 200
                  ? "Amazing! You are a real cyber guardian!"
                  : score >= 100
                    ? "You stopped lots of cyber threats! Keep it up!"
                    : "Practice makes perfect! You will get better!"}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                data-ui
                className="btn-fun"
                onClick={startGame}
                style={{
                  background: "linear-gradient(135deg,#6BCB77,#4D9E52)",
                  color: "#fff",
                  fontSize: 18,
                  padding: "12px 28px",
                  boxShadow: "0 5px 0 #2D7A38",
                }}
              >
                Play Again! 🎮
              </button>
              <button
                data-ui
                className="btn-fun"
                onClick={() => {
                  onScoreSubmit?.(score);
                  onClose?.();
                }}
                style={{
                  background: "linear-gradient(135deg,#FF6B6B,#FF8E53)",
                  color: "#fff",
                  fontSize: 18,
                  padding: "12px 28px",
                  boxShadow: "0 5px 0 #CC4400",
                }}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
