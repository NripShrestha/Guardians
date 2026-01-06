const mongoose = require('mongoose');

const SignupSchema = new mongoose.Schema({
username: { type: String, required: true },
email: { type: String, required: true, unique: true },
age: { type: Number, required: true },
gender: { type: String, required: true },
password: { type: String, required: true }
})

const Signup = mongoose.model('register', SignupSchema);
module.exports = Signup;

