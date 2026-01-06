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

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await SignupModel.findOne({ email });

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  if (user.password !== password) {
    return res.json({ success: false, message: "Wrong password" });
  }

  //Generate token
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    success: true,
    token,
  });
});

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const user = await SignupModel.create(req.body);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
