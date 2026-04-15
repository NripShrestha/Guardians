const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const SignupModel = require("./models/Signup");
const GameProgress = require("./models/GameProgress");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/Guardians");

const JWT_SECRET = "fyp_secret_key";

// ── VALIDATION HELPERS ───────────────────────────────────────────────────────
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);
const validateUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);
const validateAge = (age) => age >= 5 && age <= 18;

// ── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
}

// ── LOGIN ────────────────────────────────────────────────────────────────────
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "All fields are required" });
  }
  if (!validateEmail(email)) {
    return res.json({ success: false, message: "Invalid email format" });
  }

  try {
    const user = await SignupModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.password !== password) {
      return res.json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      token,
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    res.json({ success: false, message: "Server error" });
  }
});

app.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await SignupModel.findById(req.user.id).select(
      "username email age gender schoolName",
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── FORGOT PASSWORD ──────────────────────────────────────────────────────────
app.post("/forgot-password", async (req, res) => {
  const { email, schoolName, newPassword } = req.body;

  if (!email || !schoolName || !newPassword) {
    return res.json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await SignupModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.schoolName.toLowerCase() !== schoolName.toLowerCase()) {
      return res.json({ success: false, message: "Incorrect school name" });
    }

    if (!validatePassword(newPassword)) {
      return res.json({ success: false, message: "Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password reset successful!" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});

// ── REGISTER ─────────────────────────────────────────────────────────────────
app.post("/register", async (req, res) => {
  const { username, email, age, gender, password, schoolName } = req.body;
  const errors = {};

  if (!username || username.trim() === "") {
    errors.username = "Username is required";
  } else if (!validateUsername(username)) {
    errors.username =
      "Username must be 3-20 characters (letters, numbers, underscores only)";
  }

  if (!email || email.trim() === "") {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (!age) {
    errors.age = "Age is required";
  } else if (!validateAge(age)) {
    errors.age = "Age must be between 5 and 18";
  }

  if (!gender) {
    errors.gender = "Gender is required";
  }

  if (!schoolName || schoolName.trim() === "") {
    errors.schoolName = "School name is required";
  } else if (schoolName.length < 2) {
    errors.schoolName = "School name must be at least 2 characters";
  }

  if (!password || password.trim() === "") {
    errors.password = "Password is required";
  } else if (!validatePassword(password)) {
    errors.password =
      "Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number";
  }

  if (Object.keys(errors).length > 0) {
    return res.json({ success: false, errors });
  }

  try {
    const existingUser = await SignupModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        errors: { email: "Email already registered" },
      });
    }

    const existingUsername = await SignupModel.findOne({ username });
    if (existingUsername) {
      return res.json({
        success: false,
        errors: { username: "Username already taken" },
      });
    }

    await SignupModel.create(req.body);
    res.json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error during registration" });
  }
});

// ── GET PROGRESS ─────────────────────────────────────────────────────────────
// Called once when the game loads — restores the player's saved stage
app.get("/progress", authenticateToken, async (req, res) => {
  try {
    const progress = await GameProgress.findOne({ userId: req.user.id });

    if (!progress) {
      // Player has never saved — return default starting point
      return res.json({
        success: true,
        progress: {
          currentMissionId: "TASK_1_PERSONAL_DATA",
          currentStage: "TALK_TO_MANAGER",
          shooterHighscore: 0,
          taskResults: [],
          hasSeenTutorial: false,
        },
      });
    }

    res.json({
      success: true,
      progress: {
        currentMissionId: progress.currentMissionId,
        currentStage: progress.currentStage,
        shooterHighscore: progress.shooterHighscore || 0,
        shooterPlays: progress.shooterPlays || 0,
        shooterHighscoreCount: progress.shooterHighscoreCount || 0,
        characterType: progress.characterType,
        playerPosition: progress.playerPosition,
        taskResults: progress.taskResults,
        quizScore: progress.quizScore ?? null,
        quizHighScore: progress.quizHighScore ?? null,
        quizAnswers: progress.quizAnswers || [],
        quizCompletedOnce: progress.quizCompletedOnce || false,
        quizPerfectOnce: progress.quizPerfectOnce || false,
        hasSeenTutorial: progress.hasSeenTutorial || false,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── SAVE PROGRESS ─────────────────────────────────────────────────────────────
// Called when player clicks the Save button in HUD
app.post("/progress", authenticateToken, async (req, res) => {
  const { currentMissionId, currentStage, taskResult, shooterHighscore, shooterPlays, shooterHighscoreCount, characterType, playerPosition, taskResults, quizScore, quizHighScore, quizAnswers, quizCompletedOnce, quizPerfectOnce, hasSeenTutorial } = req.body;

  if (!currentMissionId || !currentStage) {
    return res
      .status(400)
      .json({ success: false, message: "Missing mission or stage" });
  }

  try {
    let progressDoc = await GameProgress.findOne({ userId: req.user.id });

    if (!progressDoc) {
      // First ever save — create the document
      progressDoc = new GameProgress({
        userId: req.user.id,
        currentMissionId,
        currentStage,
        shooterHighscore: shooterHighscore || 0,
        shooterPlays: shooterPlays || 0,
        shooterHighscoreCount: shooterHighscoreCount || 0,
        characterType: characterType || null,
        playerPosition: playerPosition || { x: -2, y: 2.5, z: 3 },
        taskResults: req.body.taskResults || (taskResult ? [taskResult] : []),
        hasSeenTutorial: hasSeenTutorial || false,
      });
    } else {
      // Update the current position
      progressDoc.currentMissionId = currentMissionId;
      progressDoc.currentStage = currentStage;
      if (characterType) progressDoc.characterType = characterType;
      if (playerPosition) progressDoc.playerPosition = playerPosition;

      if (shooterHighscore !== undefined) {
        progressDoc.shooterHighscore = Math.max(progressDoc.shooterHighscore || 0, shooterHighscore);
      }
      if (shooterPlays !== undefined) {
        progressDoc.shooterPlays = shooterPlays;
      }
      if (shooterHighscoreCount !== undefined) {
        progressDoc.shooterHighscoreCount = shooterHighscoreCount;
      }

      // Overwrite the existing logic and use the new array behavior
      if (Array.isArray(req.body.taskResults)) {
        progressDoc.taskResults = req.body.taskResults;
      } else if (taskResult) {
        const existingIndex = progressDoc.taskResults.findIndex(
          (r) => r.taskId === taskResult.taskId,
        );
        if (existingIndex >= 0) {
          progressDoc.taskResults[existingIndex] = taskResult;
        } else {
          progressDoc.taskResults.push(taskResult);
        }
      }

      // ── Quiz fields ───────────────────────────────────────────────────
      if (quizScore !== undefined) progressDoc.quizScore = quizScore;
      if (quizHighScore !== undefined) {
        progressDoc.quizHighScore = Math.max(progressDoc.quizHighScore || 0, quizHighScore);
      }
      if (Array.isArray(quizAnswers)) progressDoc.quizAnswers = quizAnswers;
      if (quizCompletedOnce !== undefined) progressDoc.quizCompletedOnce = quizCompletedOnce;
      if (quizPerfectOnce !== undefined) progressDoc.quizPerfectOnce = quizPerfectOnce;
      if (hasSeenTutorial !== undefined) progressDoc.hasSeenTutorial = hasSeenTutorial;
    }

    await progressDoc.save();
    res.json({ success: true, message: "Progress saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── RESET PROGRESS (Goodbye) ────────────────────────────────────────────────
// Resets everything except shooterHighscore and quizHighScore
app.post("/progress/reset", authenticateToken, async (req, res) => {
  try {
    const progressDoc = await GameProgress.findOne({ userId: req.user.id });
    if (!progressDoc) {
      return res.json({ success: true, message: "Nothing to reset" });
    }

    // Preserve high scores & tutorial flag
    const keepShooterHighscore = progressDoc.shooterHighscore || 0;
    const keepQuizHighScore = progressDoc.quizHighScore || null;
    const keepHasSeenTutorial = progressDoc.hasSeenTutorial || false;

    // Reset everything else
    progressDoc.currentMissionId = "TASK_1_PERSONAL_DATA";
    progressDoc.currentStage = "TALK_TO_MANAGER";
    progressDoc.playerPosition = { x: -2, y: 2.5, z: 3 };
    progressDoc.shooterHighscore = keepShooterHighscore;
    progressDoc.shooterPlays = 0;
    progressDoc.shooterHighscoreCount = 0;
    progressDoc.taskResults = [];
    progressDoc.quizScore = null;
    progressDoc.quizHighScore = keepQuizHighScore;
    progressDoc.quizAnswers = [];
    progressDoc.quizCompletedOnce = false;
    progressDoc.quizPerfectOnce = false;
    progressDoc.hasSeenTutorial = keepHasSeenTutorial;

    await progressDoc.save();
    res.json({ success: true, message: "Progress reset" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
