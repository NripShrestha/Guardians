const mongoose = require("mongoose");

const TaskResultSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true }, // e.g. "TASK_1_PERSONAL_DATA"
    result: { type: String, enum: ["PASS", "FAIL", "CANCELLED"] },
    unsafeFields: [String], // Task 1: fields user filled in
    selectedUrl: String, // Task 3: URL the user clicked
    emailActions: { type: Map, of: String }, // Task 4: emailId → action
    incorrectlyHandled: [String], // Task 4: dangerous emails missed
    completedAt: { type: Date, default: Date.now },
  },
  { _id: false }, // no separate _id per result, taskId is the key
);

const GameProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "register",
      required: true,
      unique: true, // one progress document per user
    },
    currentMissionId: {
      type: String,
      default: "TASK_1_PERSONAL_DATA",
    },
    currentStage: {
      type: String,
      default: "TALK_TO_MANAGER",
    },
    // ── character selection + last known position ──────────────────────────
    characterType: {
      type: String,
      enum: ["timmy", "girl"],
      default: null, // null = player has never chosen a character
    },
    playerPosition: {
      x: { type: Number, default: -2 },
      y: { type: Number, default: 2.5 },
      z: { type: Number, default: 3 },
    },
    shooterHighscore: { type: Number, default: 0 },
    shooterPlays: { type: Number, default: 0 },
    shooterHighscoreCount: { type: Number, default: 0 },
    taskResults: [TaskResultSchema],
    // ── Quiz fields ───────────────────────────────────────────────────────
    quizScore: { type: Number, default: null },       // last quiz score
    quizHighScore: { type: Number, default: null },   // best ever (preserved on reset)
    quizAnswers: [
      {
        questionIndex: Number,
        selectedAnswer: Number,
        correct: Boolean,
      },
    ],
    quizCompletedOnce: { type: Boolean, default: false }, // first-attempt XP flag
    quizPerfectOnce: { type: Boolean, default: false },   // first-perfect XP flag
  },
  { timestamps: true },
);

const GameProgress = mongoose.model("GameProgress", GameProgressSchema);
module.exports = GameProgress;
