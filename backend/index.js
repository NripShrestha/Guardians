const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const SignupModel = require("./models/Signup");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/Guardians");

const JWT_SECRET = "fyp_secret_key";

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};

const validateUsername = (username) => {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

const validateAge = (age) => {
  return age >= 5 && age <= 18;
};

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validation
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

    // Generate token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.json({ success: false, message: "Server error" });
  }
});

// REGISTER
app.post("/register", async (req, res) => {
  const { username, email, age, gender, password } = req.body;

  // Validation
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
    // Check if email already exists
    const existingUser = await SignupModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        errors: { email: "Email already registered" },
      });
    }

    // Check if username already exists
    const existingUsername = await SignupModel.findOne({ username });
    if (existingUsername) {
      return res.json({
        success: false,
        errors: { username: "Username already taken" },
      });
    }

    const user = await SignupModel.create(req.body);
    res.json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error during registration" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
