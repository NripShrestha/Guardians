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

const SAFE_TARGETS = [
  { label: "HTTPS\nSite", type: "safe", emoji: "🔒" },
  { label: "2FA\nEnabled", type: "safe", emoji: "✅" },
  { label: "Strong\nPassword", type: "safe", emoji: "💪" },
  { label: "Trusted\nSender", type: "safe", emoji: "👍" },
  { label: "Security\nUpdate", type: "safe", emoji: "🛡️" },
  { label: "Antivirus\nOn", type: "safe", emoji: "🦺" },
];

const QUIZ_QUESTIONS = [
  {
    q: "Which website is SAFE to visit?",
    options: ["http://bank.com 😨", "https://bank.com 🔒"],
    correct: 1,
    fun: "HTTPS keeps your info secret — like a magic shield! 🛡️",
  },
  {
    q: "You get an email asking for your password. What do you do?",
    options: ["Send it right away! 😬", "Never share passwords! 🚫"],
    correct: 1,
    fun: "Real companies NEVER ask for your password by email!",
  },
  {
    q: "What is phishing?",
    options: ["Fishing in the ocean 🎣", "Tricking you to steal info 🦹"],
    correct: 1,
    fun: "Phishing = fake messages trying to steal YOUR stuff!",
  },
  {
    q: "Which is a STRONG password?",
    options: ["password123 😅", "T!ger$un5h1n3 🔐"],
    correct: 1,
    fun: "Mix letters, numbers and symbols for super strong passwords!",
  },
  {
    q: "You find a USB on the ground. What do you do?",
    options: ["Plug it in! 🤔", "Give it to a grown-up 🧑‍🏫"],
    correct: 1,
    fun: "Mystery USBs can have sneaky viruses inside!",
  },
  {
    q: "2FA means?",
    options: ["Two-Factor Authentication 🔐", "Two Fast Apps 🏃"],
    correct: 0,
    fun: "2FA adds an extra lock to keep bad guys out!",
  },
  {
    q: "A stranger online wants to meet you. You should:",
    options: ["Meet them! 😬", "Tell a parent right away! 👨‍👩‍👧"],
    correct: 1,
    fun: "Always tell a trusted adult about strangers online!",
  },
];

let _id = 0;
const uid = () => ++_id;

// ─── TEXTURE FACTORY (Kid-friendly bright style) ──────────────────────────────

function makeTexture(label, emoji, isDanger) {
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 280;
  const ctx = cv.getContext("2d");

  // Bright bubble background
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

  // Border
  ctx.strokeStyle = isDanger ? "#FF4444" : "#22CC66";
  ctx.lineWidth = 8;
  ctx.stroke();

  // Wobbly dots decoration
  ctx.fillStyle = isDanger ? "rgba(255,80,80,0.15)" : "rgba(50,200,100,0.15)";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(80 + i * 90, 40, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  // Big emoji
  ctx.font = "90px serif";
  ctx.textAlign = "center";
  ctx.fillText(emoji, 100, 175);

  // Label text
  const lines = label.split("\n");
  ctx.fillStyle = isDanger ? "#CC0000" : "#006622";
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 4;
  if (lines.length === 1) {
    ctx.font = "bold 54px Arial Rounded MT Bold, Arial";
    ctx.fillText(label, 300, 160);
  } else {
    ctx.font = "bold 46px Arial Rounded MT Bold, Arial";
    lines.forEach((l, i) => ctx.fillText(l, 300, 115 + i * 68));
  }

  // Tag badge
  ctx.shadowBlur = 0;
  ctx.fillStyle = isDanger ? "#FF4444" : "#22CC66";
  ctx.beginPath();
  ctx.roundRect(160, 222, isDanger ? 200 : 190, 38, 20);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px Arial";
  ctx.fillText(isDanger ? "⚠️ DANGER!" : "✅ SAFE!", 256, 248);

  return new THREE.CanvasTexture(cv);
}

function makeClockTexture() {
  const cv = document.createElement("canvas");
  cv.width = 256;
  cv.height = 256;
  const ctx = cv.getContext("2d");
  // Gold circle face
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
  // Hour marks
  ctx.strokeStyle = "#BF360C";
  ctx.lineWidth = 5;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(128 + Math.cos(a) * 92, 128 + Math.sin(a) * 92);
    ctx.lineTo(128 + Math.cos(a) * 108, 128 + Math.sin(a) * 108);
    ctx.stroke();
  }
  // Clock hands
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
  // "+10s" label
  ctx.fillStyle = "#BF360C";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "center";
  ctx.fillText("+10s ⏰", 128, 220);
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
  // Sparkle dots
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
  ctx.font = "bold 42px Arial Rounded MT Bold, Arial";
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
  ctx.fillText("⚡ BOOSTER!", 256, 248);
  return new THREE.CanvasTexture(cv);
}

const GUN_BASE = new THREE.Vector3(0.55, -0.9, 5.8);

function CartoonGun({ firing, aimDirRef, barrelTipRef }) {
  const groupRef = useRef();
  const kickRef = useRef(0);
  const targetQuat = useRef(new THREE.Quaternion());
  const currentQuat = useRef(new THREE.Quaternion());
  // Local-space barrel tip offset (tip of the barrel cylinder)
  const localTip = new THREE.Vector3(0, 0.15, -1.22);

  useFrame(() => {
    if (!groupRef.current) return;

    // Build aim quaternion: rotate local -Z to match the ray direction
    if (aimDirRef.current) {
      const dir = aimDirRef.current.clone().normalize();
      targetQuat.current.setFromUnitVectors(new THREE.Vector3(0, 0, -1), dir);
    }

    // Smooth slerp
    currentQuat.current.slerp(targetQuat.current, 0.2);
    groupRef.current.quaternion.copy(currentQuat.current);

    // Recoil
    if (kickRef.current > 0)
      kickRef.current = Math.max(0, kickRef.current - 0.14);
    const kick = kickRef.current;
    groupRef.current.position.set(
      GUN_BASE.x,
      GUN_BASE.y + kick * 0.08,
      GUN_BASE.z - kick * 0.35,
    );

    // Compute world-space barrel tip so bullet spawns exactly there
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
      {/* Main barrel — cylinder oriented along local -Z (barrel points forward) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.15, -0.5]}>
        <cylinderGeometry args={[0.13, 0.17, 1.2, 16]} />
        <meshStandardMaterial color="#4488DD" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Barrel tip ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.15, -1.12]}>
        <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
        <meshStandardMaterial color="#FF8800" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Body block */}
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[0.34, 0.4, 0.65]} />
        <meshStandardMaterial color="#2266BB" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Grip */}
      <mesh position={[0, -0.36, 0.28]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.27, 0.52, 0.21]} />
        <meshStandardMaterial color="#994422" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Trigger guard */}
      <mesh position={[0, -0.2, 0.08]}>
        <torusGeometry args={[0.11, 0.03, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#3355AA" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Star decoration */}
      <mesh position={[0.17, 0.11, 0.18]}>
        <octahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial
          color="#FFCC00"
          emissive="#FFAA00"
          emissiveIntensity={2}
        />
      </mesh>
      {/* Muzzle flash */}
      {firing && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.15, -1.28]}>
          <cylinderGeometry args={[0.22, 0.0, 0.35, 8]} />
          <meshBasicMaterial color="#FFFF00" transparent opacity={0.85} />
        </mesh>
      )}
    </group>
  );
}

// ─── BULLET ───────────────────────────────────────────────────────────────────

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

// ─── STAR BURST PARTICLES ─────────────────────────────────────────────────────

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
      {particles.current.map((p, i) => (
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

// ─── TARGET ───────────────────────────────────────────────────────────────────

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
    // Gentle bob rotation
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

// ─── FLOATING CLOUDS (background deco) ────────────────────────────────────────

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
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 10, 10]} />
          <meshStandardMaterial color="#FFFFFF" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

// ─── CLOCK TARGET (fast, +10 seconds) ────────────────────────────────────────

function ClockTarget({ id, initPos, speedMult, registry, onDead, onHit }) {
  const meshRef = useRef();
  const [tex] = useState(() => makeClockTexture());
  const dying = useRef(false);
  const opacity = useRef(1);
  const pos = useRef(new THREE.Vector3(...initPos));
  const wobbleT = useRef(Math.random() * Math.PI * 2);
  // Fast erratic movement
  const dir = useRef(
    new THREE.Vector3(
      (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random()),
      (Math.random() - 0.5) * 1.2,
      0,
    ),
  );
  const changeT = useRef(0);

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
    const spd = 3.5 * speedMult;
    wobbleT.current += dt * 2.5;
    // Randomly change direction every ~1.2s for erratic feel
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
    mesh.rotation.z += dt * 1.8; // spinning clock face
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

// ─── BOOSTER TARGET ───────────────────────────────────────────────────────────

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
  // Boosters vanish after 8 seconds if not shot
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
    // Pulse opacity to signal it's expiring
    if (lifeT.current > 6) {
      opacity.current = 0.4 + Math.sin(lifeT.current * 12) * 0.4;
      mesh.material.opacity = opacity.current;
    }
    if (lifeT.current > 8) {
      dying.current = true;
      return;
    }

    wobbleT.current += dt * 1.0;
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
  const boosterT = useRef(8); // first booster after 8s
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

    // Normal targets
    spawnT.current += dt;
    if (spawnT.current >= spawnInterval) {
      spawnT.current = 0;
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

    // Clock — spawns every ~14s, one at a time
    clockT.current += dt;
    if (clockT.current >= 14) {
      clockT.current = 0;
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 3.5;
      setClocks((prev) => [
        ...prev.slice(-2),
        { id: uid(), initPos: [x, y, -3.5] },
      ]);
    }

    // Boosters — alternate freeze / payload every ~18s
    boosterT.current += dt;
    if (boosterT.current >= 18) {
      boosterT.current = 0;
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 3;
      const type = Math.random() < 0.5 ? "freeze" : "payload";
      setBoosters((prev) => [
        ...prev.slice(-2),
        { id: uid(), boosterType: type, initPos: [x, y, -3] },
      ]);
    }
  });

  // Fire exactly ONE bullet per unique shootEvent
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
        ttype === "safe" ? -3 : 0,
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

  // Payload drop: spawn 8 danger targets at once
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

  // Expose payloadDrop via ref so root can call it
  useEffect(() => {
    if (onSpecialHit._payloadRef)
      onSpecialHit._payloadRef.current = payloadDrop;
  }, [payloadDrop, onSpecialHit]);

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

      {/* Sky */}
      <mesh position={[0, 0, -12]}>
        <planeGeometry args={[80, 50]} />
        <meshBasicMaterial color="#87CEEB" />
      </mesh>
      {/* Ground */}
      <mesh position={[0, -5, -8]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[80, 20]} />
        <meshStandardMaterial color="#5DC76E" roughness={1} />
      </mesh>
      {[
        [[-5, 3, -10], [1.2, 0.7, 1], 0.3],
        [[4, 3.5, -11], [0.9, 0.6, 1], 0.25],
        [[-8, 2.5, -9], [1.0, 0.7, 1], 0.35],
        [[7, 2, -10], [1.3, 0.7, 1], 0.28],
      ].map(([pos, scale, speed], i) => (
        <FloatingCloud key={i} position={pos} scale={scale} speed={speed} />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={`star${i}`}
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

// ─── SCORE POP (floating +/- text) ────────────────────────────────────────────

function ScorePop({ msg, color, id }) {
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
        bottom: "25%",
        left: "50%",
        transform: "translateX(-50%)",
        color,
        fontSize: 26,
        fontWeight: 900,
        fontFamily: "'Fredoka One', 'Comic Sans MS', cursive",
        textShadow: "2px 2px 0 rgba(0,0,0,0.3)",
        animation: "floatUp 1.2s ease forwards",
        pointerEvents: "none",
        zIndex: 25,
        whiteSpace: "nowrap",
      }}
    >
      {msg}
    </div>
  );
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────

export default function CyberShooterGame({ onClose, onScoreSubmit }) {
  const [gameState, setGameState] = useState("intro");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [firing, setFiring] = useState(false);
  const [pops, setPops] = useState([]);
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
  // Booster state
  const [speedMult, setSpeedMult] = useState(1);
  const [freezeActive, setFreezeActive] = useState(false);
  const [freezeTimeLeft, setFreezeTimeLeft] = useState(0);
  const payloadRef = useRef(null); // set by GameScene, called on payload hit

  const addPop = useCallback((msg, color) => {
    setPops((p) => [...p.slice(-4), { id: uid(), msg, color }]);
  }, []);

  const handleSpecialHit = useCallback(
    (type) => {
      if (type === "clock") {
        setTimeLeft((t) => t + 10);
        addPop("⏰ +10 seconds!", "#FFD600");
      } else if (type === "freeze") {
        setSpeedMult(0.22);
        setFreezeActive(true);
        setFreezeTimeLeft(6);
        addPop("🧊 FIREWALL FREEZE! Slowed!", "#40C4FF");
        // Tick down freeze timer
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
        addPop("💣 PAYLOAD DROP! Threats incoming!", "#CE93D8");
        if (payloadRef.current) payloadRef.current();
      }
    },
    [addPop],
  );

  // Attach payloadRef bridge to handleSpecialHit so GameScene can set it
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
      setQuiz(QUIZ_QUESTIONS[quizIdx % QUIZ_QUESTIONS.length]);
      setQuizFb(null);
      setGameState("quiz");
    }, 22000);
    return () => clearInterval(t);
  }, [gameState, quizIdx]);

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
    };
    window.addEventListener("mousedown", fn);
    return () => window.removeEventListener("mousedown", fn);
  }, [gameState]);

  const handleScoreUpdate = useCallback(
    (pts, timeDelta, isGood) => {
      setScore((s) => Math.max(0, s + pts));
      if (timeDelta < 0) {
        setTimeLeft((t) => Math.max(0, t + timeDelta));
        addPop("Oops! Safe target 😬 -10pts", "#FF6600");
      } else if (isGood) {
        setCombo((c) => {
          const next = c + 1;
          if (next >= 3 && next % 3 === 0) {
            setScore((s) => s + 20);
            addPop(`🔥 Combo x${next}! +20 pts`, "#FF8800");
          } else {
            addPop(`💥 Threat stopped! +10`, "#22CC66");
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
      addPop("+10 seconds! ⏰", "#22AAFF");
    } else addPop("Wrong answer! Try again 🙈", "#FF4444");
    setTimeout(() => {
      setQuizIdx((qi) => qi + 1);
      setQuiz(null);
      setQuizFb(null);
      setGameState("playing");
    }, 2000);
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
    setGameState("playing");
  };

  const timerPct = (timeLeft / 60) * 100;
  const timerColor =
    timeLeft > 30 ? "#22CC66" : timeLeft > 10 ? "#FFAA00" : "#FF3333";
  const playing = gameState === "playing" || gameState === "quiz";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#87CEEB",
        fontFamily: "'Fredoka One', 'Comic Sans MS', 'Segoe UI', cursive",
        cursor: gameState === "playing" ? "none" : "default",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');
        @keyframes floatUp {
          0% { opacity:1; transform:translateX(-50%) translateY(0); }
          100% { opacity:0; transform:translateX(-50%) translateY(-80px); }
        }
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(40px); }
        }
        @keyframes starSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes pop {
          0% { transform: scale(0.5); opacity:0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity:1; }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes freezePulse {
          0% { background: rgba(100,210,255,0.15); }
          100% { background: rgba(100,210,255,0.30); }
        }
        @keyframes boosterSlide {
          0% { transform: translateX(120%); opacity:0; }
          100% { transform: translateX(0); opacity:1; }
        }
        .btn-fun {
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-family: inherit;
          font-weight: 900;
          letter-spacing: 1px;
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .btn-fun:hover { transform: translateY(-3px); }
        .btn-fun:active { transform: translateY(1px); }
      `}</style>

      {/* 3D Canvas */}
      {playing && (
        <Canvas
          style={{ position: "absolute", inset: 0 }}
          camera={{ position: [0, 0, 7], fov: 65 }}
          gl={{ antialias: true }}
        >
          <GameScene
            paused={gameState === "quiz"}
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
              "linear-gradient(180deg, #87CEEB 0%, #B0E8FF 40%, #90EE90 70%, #5DC76E 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {/* Decorative clouds */}
          {[
            [-35, -18],
            [30, -16],
            [55, -10],
            [-55, -8],
          ].map(([x, y], i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${28 + i * 8}%`,
                left: `${50 + x}%`,
                width: 120,
                height: 60,
                borderRadius: 50,
                background: "rgba(255,255,255,0.85)",
                animation: `cloudDrift ${4 + i}s ease-in-out infinite alternate`,
              }}
            />
          ))}

          {/* Title card */}
          <div
            style={{
              background: "white",
              borderRadius: 32,
              padding: "30px 48px",
              textAlign: "center",
              boxShadow: "0 8px 0 #CCC, 0 12px 30px rgba(0,0,0,0.15)",
              animation: "pop 0.5s ease",
              maxWidth: 520,
              zIndex: 2,
            }}
          >
            <div style={{ fontSize: 72, animation: "bounce 1.5s infinite" }}>
              🛡️
            </div>
            <h1
              style={{
                fontSize: 42,
                margin: "8px 0 4px",
                background:
                  "linear-gradient(135deg, #FF6B6B, #FF8E53, #FFD93D, #6BCB77)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "none",
                letterSpacing: 2,
              }}
            >
              Cyber Guardian
            </h1>
            <div
              style={{
                fontSize: 16,
                color: "#666",
                marginBottom: 20,
                letterSpacing: 1,
              }}
            >
              Learn to spot internet dangers! 🌐
            </div>

            {/* Rules */}
            <div
              style={{
                background: "#FFF9E6",
                borderRadius: 16,
                padding: "16px 22px",
                textAlign: "left",
                border: "3px dashed #FFD700",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  fontSize: 16,
                  color: "#FF6B00",
                  marginBottom: 10,
                }}
              >
                🎮 HOW TO PLAY
              </div>
              {[
                ["🔴 Shoot RED targets!", "They're internet dangers (+10 pts)"],
                ["🟢 Don't shoot GREEN!", "Those are safe things (-10 pts)"],
                ["⏰ Shoot the CLOCK!", "Hard to hit but gives +10 seconds!"],
                ["🧊 FIREWALL FREEZE", "Shoot it to slow all targets for 6s!"],
                ["💣 PAYLOAD DROP", "Shoot it to spawn 8 bonus targets!"],
                ["🔥 Hit 3 in a row!", "Get a combo bonus +20 pts"],
                ["❓ Answer quiz questions!", "Get +10 bonus seconds"],
              ].map(([t, d], i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    marginBottom: 7,
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 14, fontWeight: 900, color: "#333" }}
                  >
                    {t}
                  </span>
                  <span style={{ fontSize: 12, color: "#888" }}>{d}</span>
                </div>
              ))}
            </div>

            <button
              data-ui
              className="btn-fun"
              onClick={startGame}
              style={{
                background: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
                color: "#fff",
                fontSize: 24,
                padding: "16px 50px",
                boxShadow: "0 6px 0 #CC4400, 0 8px 20px rgba(255,100,0,0.4)",
                display: "block",
                width: "100%",
                marginBottom: 12,
              }}
            >
              🚀 START MISSION!
            </button>
            {onClose && (
              <button
                data-ui
                className="btn-fun"
                onClick={onClose}
                style={{
                  background: "#EEE",
                  color: "#888",
                  fontSize: 15,
                  padding: "10px 30px",
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

          {/* FIREWALL FREEZE full-screen tint */}
          {freezeActive && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 5,
                background: "rgba(100,210,255,0.22)",
                backdropFilter: "blur(1px)",
                animation: "freezePulse 0.8s ease-in-out infinite alternate",
              }}
            />
          )}

          {/* Top HUD bar */}
          <div
            data-ui
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 20px",
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(8px)",
              borderBottom: "4px solid #FFD700",
              pointerEvents: "none",
            }}
          >
            {/* Score */}
            <div
              style={{
                background: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
                borderRadius: 16,
                padding: "8px 22px",
                boxShadow: "0 4px 0 #CC4400",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.8)",
                  letterSpacing: 2,
                }}
              >
                SCORE
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#FFF",
                  lineHeight: 1,
                }}
              >
                {score.toString().padStart(5, "0")}
              </div>
            </div>

            {/* Timer */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 54,
                  fontWeight: 900,
                  color: timerColor,
                  textShadow: `0 3px 0 rgba(0,0,0,0.2)`,
                  lineHeight: 1,
                  animation: timeLeft <= 10 ? "pulse 0.5s infinite" : "none",
                }}
              >
                {timeLeft}
              </div>
              <div
                style={{
                  width: 140,
                  height: 12,
                  background: "#E0E0E0",
                  borderRadius: 6,
                  marginTop: 4,
                  overflow: "hidden",
                  border: "2px solid #CCC",
                }}
              >
                <div
                  style={{
                    width: `${timerPct}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${timerColor}, ${timerColor}AA)`,
                    borderRadius: 4,
                    transition: "width 1s linear, background 0.5s",
                  }}
                />
              </div>
            </div>

            {/* Combo + Level */}
            <div
              style={{
                background:
                  combo >= 3
                    ? "linear-gradient(135deg,#FF8C00,#FFD700)"
                    : "linear-gradient(135deg,#6BCB77,#4D9E52)",
                borderRadius: 16,
                padding: "8px 18px",
                textAlign: "right",
                boxShadow: `0 4px 0 ${combo >= 3 ? "#CC6600" : "#2D7A38"}`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.8)",
                  letterSpacing: 2,
                }}
              >
                COMBO
              </div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#FFF",
                  lineHeight: 1,
                }}
              >
                x{combo}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                LVL {difficulty + 1}
              </div>
            </div>
          </div>

          {/* Active booster badges — slide in from right */}
          {freezeActive && (
            <div
              style={{
                position: "absolute",
                top: 90,
                right: 20,
                background: "linear-gradient(135deg,#0288D1,#40C4FF)",
                borderRadius: 16,
                padding: "10px 20px",
                boxShadow: "0 4px 0 #01579B, 0 6px 20px rgba(0,150,255,0.4)",
                color: "#fff",
                fontWeight: 900,
                fontSize: 16,
                border: "3px solid #B3E5FC",
                animation: "boosterSlide 0.3s ease",
                pointerEvents: "none",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 28 }}>🧊</div>
              <div>FIREWALL FREEZE</div>
              <div style={{ fontSize: 22, marginTop: 2 }}>
                {freezeTimeLeft}s
              </div>
            </div>
          )}

          {/* Bottom legend */}
          <div
            data-ui
            style={{
              position: "absolute",
              bottom: 16,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 10,
              pointerEvents: "none",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {[
              ["🔴 RED = SHOOT!", "#FF4444"],
              ["🟢 GREEN = SAFE!", "#22CC66"],
              ["⏰ CLOCK = +10s!", "#FFD600"],
              ["🧊 FIREWALL FREEZE", "#0288D1"],
              ["💣 PAYLOAD DROP", "#7B1FA2"],
            ].map(([t, c]) => (
              <div
                key={t}
                style={{
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: 16,
                  padding: "6px 14px",
                  border: `2px solid ${c}`,
                  color: c,
                  fontSize: 12,
                  fontWeight: 900,
                  boxShadow: "0 3px 0 rgba(0,0,0,0.1)",
                }}
              >
                {t}
              </div>
            ))}
          </div>

          {/* Score pops */}
          {pops.map((p) => (
            <ScorePop key={p.id} {...p} />
          ))}
        </>
      )}

      {/* ── QUIZ OVERLAY ── */}
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
            background: "rgba(135,206,235,0.7)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              background: "#FFF",
              borderRadius: 32,
              padding: "36px 44px",
              maxWidth: 520,
              width: "90%",
              boxShadow: "0 8px 0 #FFD700, 0 12px 40px rgba(0,0,0,0.2)",
              border: "4px solid #FFD700",
              animation: "pop 0.3s ease",
            }}
          >
            <div style={{ textAlign: "center", fontSize: 44, marginBottom: 8 }}>
              ❓
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#888",
                letterSpacing: 3,
                textAlign: "center",
                marginBottom: 12,
                textTransform: "uppercase",
              }}
            >
              Quiz Time! Correct = +10 seconds ⏰
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#333",
                marginBottom: 24,
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              {quiz.q}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {quiz.options.map((opt, i) => {
                let bg = "#F5F5F5",
                  border = "3px solid #DDD",
                  color = "#444";
                if (quizFb) {
                  if (i === quiz.correct) {
                    bg = "#E8FFE8";
                    border = "3px solid #22CC66";
                    color = "#006622";
                  } else {
                    bg = "#FFE8E8";
                    border = "3px solid #FF4444";
                    color = "#880000";
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
                      padding: "14px 20px",
                      fontSize: 17,
                      textAlign: "left",
                      cursor: quizFb ? "default" : "pointer",
                      boxShadow: quizFb ? "none" : "0 4px 0 rgba(0,0,0,0.1)",
                    }}
                  >
                    <span style={{ fontWeight: 900 }}>{["🅰️", "🅱️"][i]} </span>{" "}
                    {opt}
                  </button>
                );
              })}
            </div>
            {quizFb && (
              <div
                style={{
                  marginTop: 20,
                  padding: "14px 20px",
                  background: quizFb.correct ? "#E8FFE8" : "#FFF0E0",
                  borderRadius: 16,
                  fontSize: 15,
                  color: "#444",
                  border: `3px solid ${quizFb.correct ? "#22CC66" : "#FFAA00"}`,
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                {quizFb.correct ? "🎉 " : "💡 "}
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
              "linear-gradient(180deg, #87CEEB 0%, #B0E8FF 40%, #90EE90 70%, #5DC76E 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              background: "#FFF",
              borderRadius: 32,
              padding: "36px 52px",
              textAlign: "center",
              boxShadow: "0 8px 0 #FFD700, 0 12px 40px rgba(0,0,0,0.15)",
              border: "4px solid #FFD700",
              animation: "pop 0.4s ease",
              maxWidth: 440,
            }}
          >
            <div style={{ fontSize: 80, animation: "bounce 1s infinite" }}>
              {score >= 200 ? "🏆" : score >= 100 ? "🎖️" : "🌟"}
            </div>
            <h2
              style={{
                fontSize: 32,
                margin: "10px 0 6px",
                background:
                  score >= 100
                    ? "linear-gradient(135deg,#22CC66,#00AA44)"
                    : "linear-gradient(135deg,#FF6B6B,#FF8E53)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {score >= 200
                ? "CYBER HERO! 🦸"
                : score >= 100
                  ? "GREAT JOB! 🎉"
                  : "KEEP TRYING! 💪"}
            </h2>
            <div
              style={{
                background: "#FFF9E6",
                borderRadius: 20,
                padding: "20px 30px",
                margin: "16px 0",
                border: "3px dashed #FFD700",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#AAA",
                  letterSpacing: 2,
                  marginBottom: 4,
                }}
              >
                YOUR SCORE
              </div>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: "#333",
                  lineHeight: 1,
                }}
              >
                {score}
              </div>
              <div style={{ fontSize: 14, color: "#888", marginTop: 8 }}>
                {score >= 200
                  ? "Amazing! You're a real cyber guardian! 🛡️"
                  : score >= 100
                    ? "You stopped lots of cyber threats! Keep it up!"
                    : "Practice makes perfect! You'll get better! 🌱"}
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
                  fontSize: 20,
                  padding: "14px 32px",
                  boxShadow: "0 5px 0 #2D7A38",
                }}
              >
                🔄 Play Again!
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
                  fontSize: 20,
                  padding: "14px 32px",
                  boxShadow: "0 5px 0 #CC4400",
                }}
              >
                ✅ Save & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
