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

// ── REGISTER ─────────────────────────────────────────────────────────────────
app.post("/register", async (req, res) => {
  const { username, email, age, gender, password } = req.body;
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
        },
      });
    }

    res.json({
      success: true,
      progress: {
        currentMissionId: progress.currentMissionId,
        currentStage: progress.currentStage,
        shooterHighscore: progress.shooterHighscore || 0,
        taskResults: progress.taskResults,
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
  const { currentMissionId, currentStage, taskResult, shooterHighscore } = req.body;

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
        taskResults: taskResult ? [taskResult] : [],
      });
    } else {
      // Update the current position
      progressDoc.currentMissionId = currentMissionId;
      progressDoc.currentStage = currentStage;

      if (shooterHighscore !== undefined) {
        progressDoc.shooterHighscore = Math.max(progressDoc.shooterHighscore || 0, shooterHighscore);
      }

      // If this save includes a task result, upsert it
      if (taskResult) {
        const existingIndex = progressDoc.taskResults.findIndex(
          (r) => r.taskId === taskResult.taskId,
        );
        if (existingIndex >= 0) {
          // Replace the old result for this task
          progressDoc.taskResults[existingIndex] = taskResult;
        } else {
          // New task result
          progressDoc.taskResults.push(taskResult);
        }
      }
    }

    await progressDoc.save();
    res.json({ success: true, message: "Progress saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
