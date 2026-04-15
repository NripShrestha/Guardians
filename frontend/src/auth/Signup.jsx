import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Pick a cool hero name!";
    } else if (username.length < 3 || username.length > 20) {
      newErrors.username = "Hero name must be 3-20 characters!";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Only letters, numbers, and _ allowed!";
    }

    if (!email.trim()) {
      newErrors.email = "We need your email address!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Check your email spelling!";
    }

    if (!age) {
      newErrors.age = "How old are you, hero?";
    } else if (age < 5 || age > 18) {
      newErrors.age = "Age must be between 5 and 18!";
    }

    if (!gender) {
      newErrors.gender = "Pick your gender";
    }

    if (!schoolName.trim()) {
      newErrors.schoolName = "What is your school's name?";
    } else if (schoolName.length < 2) {
      newErrors.schoolName = "School name needs to be at least 2 characters!";
    }

    if (!password) {
      newErrors.password = "Create a secret code!";
    } else if (password.length < 6) {
      newErrors.password = "Secret code needs 6+ characters!";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Add UPPERCASE, lowercase, and numbers!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    setServerSuccess("");

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await axios.post("http://localhost:3001/register", {
        username,
        email,
        age: Number(age),
        gender,
        schoolName,
        password,
      });

      if (result.data.success) {
        setServerSuccess("Hero created! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else if (result.data.errors) {
        setErrors(result.data.errors);
      } else {
        setServerError(result.data.message || "Oops! Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      setServerError("Oops! Something went wrong. Try again!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-500 p-4 font-sans">
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full blur-xl opacity-50 animate-bounce"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400 rounded-full blur-xl opacity-50"></div>

      <div className="relative bg-white p-6 rounded-[1.5rem] shadow-[0_16px_0_0_rgba(0,0,0,0.1)] border-4 border-indigo-900 w-full max-w-sm transform transition-all hover:scale-[1.01]">
        <h1 className="text-3xl font-black text-center text-indigo-900 mb-2 tracking-tight">
          HERO SIGNUP
        </h1>
        <p className="text-center text-indigo-600 font-bold mb-6">
          Start your digital safety quest!
        </p>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="relative">
            <label className="text-sm font-black text-indigo-900 ml-2 uppercase">
              Hero Name
            </label>
            <input
              type="text"
              placeholder="Hero123"
              className={`w-full mt-1 px-3 py-2 rounded-2xl border-4 bg-indigo-50 font-bold transition-all focus:ring-4 focus:ring-yellow-300 outline-none ${
                errors.username ? "border-red-400" : "border-indigo-100"
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && (
              <p className="text-red-500 text-xs font-bold mt-1 ml-2">
                ⚠️ {errors.username}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-black text-indigo-900 ml-2 uppercase">
              Email
            </label>
            <input
              type="email"
              placeholder="hero@gmail.com"
              className={`w-full mt-1 px-3 py-2 rounded-2xl border-4 bg-indigo-50 font-bold transition-all focus:ring-4 focus:ring-yellow-300 outline-none ${
                errors.email ? "border-red-400" : "border-indigo-100"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-bold mt-1 ml-2">
                ⚠️ {errors.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-black text-indigo-900 ml-2 uppercase">
                Age
              </label>
              <input
                type="number"
                placeholder="10"
                className={`w-full mt-1 px-3 py-2 rounded-2xl border-4 bg-indigo-50 font-bold focus:ring-4 focus:ring-yellow-300 outline-none ${
                  errors.age ? "border-red-400" : "border-indigo-100"
                }`}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              {errors.age && (
                <p className="text-red-500 text-xs font-bold mt-1">
                  ⚠️ {errors.age}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-black text-indigo-900 ml-2 uppercase">
                Gender
              </label>
              <select
                className={`w-full mt-1 px-3 py-2 rounded-2xl border-4 bg-indigo-50 font-bold outline-none ${
                  errors.gender ? "border-red-400" : "border-indigo-100"
                }`}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="boy">Boy</option>
                <option value="girl">Girl</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs font-bold mt-1">
                  ⚠️ {errors.gender}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-black text-indigo-900 ml-2 uppercase">
              School Name (Security Question)
            </label>
            <input
              type="text"
              placeholder="School Name"
              className={`w-full mt-1 px-3 py-2 rounded-2xl border-4 bg-indigo-50 font-bold transition-all focus:ring-4 focus:ring-yellow-300 outline-none ${
                errors.schoolName ? "border-red-400" : "border-indigo-100"
              }`}
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
            {errors.schoolName && (
              <p className="text-red-500 text-xs font-bold mt-1 ml-2">
                ⚠️ {errors.schoolName}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-black text-indigo-900 ml-2 uppercase">
              Secret Code
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`w-full mt-1 px-3 py-2 rounded-2xl border-4 bg-indigo-50 font-bold focus:ring-4 focus:ring-yellow-300 outline-none ${
                errors.password ? "border-red-400" : "border-indigo-100"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-xs font-bold mt-1 ml-2">
                ⚠️ {errors.password}
              </p>
            )}
            <p className="text-xs text-indigo-400 font-bold mt-1 ml-2">
              💡 6+ chars, UPPERCASE, lowercase, numbers
            </p>
          </div>

          {serverError && (
            <div className="flex items-center gap-2 bg-red-50 border-2 border-red-300 rounded-2xl px-4 py-3">
              <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                !
              </span>
              <p className="text-red-700 text-xs font-bold">{serverError}</p>
            </div>
          )}

          {serverSuccess && (
            <div className="flex items-center gap-2 bg-green-50 border-2 border-green-300 rounded-2xl px-4 py-3">
              <span className="flex-shrink-0 w-5 h-5 bg-green-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                ✓
              </span>
              <p className="text-green-700 text-xs font-bold">
                {serverSuccess}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-base font-black border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "LOADING..." : "READY TO PLAY! 🎮"}
          </button>
        </form>

        <p className="text-center mt-4 font-bold text-indigo-400">
          Already a Hero?{" "}
          <Link to="/login" className="text-pink-500 hover:underline">
            Log In Here 🔐
          </Link>
        </p>
      </div>
    </div>
  );
}
