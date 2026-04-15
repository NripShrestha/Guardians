import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: "success" | "error", text: string }
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Enter your email, hero!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Check your email spelling!";
    }

    if (!schoolName.trim()) {
      newErrors.schoolName = "What is your school's name?";
    }

    if (!newPassword) {
      newErrors.newPassword = "Create a new secret code!";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Secret code needs 6+ characters!";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = "Add UPPERCASE, lowercase, and numbers!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setStatusMessage(null);
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await axios.post("http://localhost:3001/forgot-password", {
        email,
        schoolName,
        newPassword,
      });

      if (result.data.success) {
        setStatusMessage({
          type: "success",
          text: "🎉 Password reset successfully! Time to log in!",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setStatusMessage({
          type: "error",
          text:
            "⚠️ " +
            (result.data.message || "Wait! That's not right. Try again!"),
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: "🌙 The servers are sleepy. Try again later!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-500 p-4 font-sans">
      {/* Playful background shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full blur-xl opacity-50 animate-bounce"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400 rounded-full blur-xl opacity-50"></div>

      <div className="relative bg-white p-6 rounded-[1.5rem] shadow-[0_16px_0_0_rgba(0,0,0,0.1)] border-4 border-indigo-900 w-full max-w-xs">
        <h1 className="text-2xl font-black text-center text-indigo-900 mb-2 uppercase tracking-tighter">
          Forgot Password?
        </h1>
        <p className="text-center text-indigo-600 font-bold mb-6">
          Answer your security question!
        </p>

        {/* Inline status message */}
        {statusMessage && (
          <div
            className={`mb-4 px-4 py-3 rounded-2xl border-4 font-bold text-sm text-center ${
              statusMessage.type === "success"
                ? "bg-green-50 border-green-400 text-green-700"
                : "bg-red-50 border-red-400 text-red-600"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Your Email"
              className={`w-full px-4 py-3 rounded-2xl border-4 bg-indigo-50 font-bold focus:border-indigo-400 outline-none transition-all ${
                errors.email ? "border-red-400" : "border-indigo-50"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-bold mt-2 ml-2">
                ⚠️ {errors.email}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Your School Name"
              className={`w-full px-4 py-3 rounded-2xl border-4 bg-indigo-50 font-bold focus:border-indigo-400 outline-none transition-all ${
                errors.schoolName ? "border-red-400" : "border-indigo-50"
              }`}
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />
            {errors.schoolName && (
              <p className="text-red-500 text-xs font-bold mt-2 ml-2">
                ⚠️ {errors.schoolName}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="New Secret Password"
              className={`w-full px-4 py-3 rounded-2xl border-4 bg-indigo-50 font-bold focus:border-indigo-400 outline-none transition-all ${
                errors.newPassword ? "border-red-400" : "border-indigo-50"
              }`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs font-bold mt-2 ml-2">
                ⚠️ {errors.newPassword}
              </p>
            )}
            <p className="text-xs text-indigo-400 font-bold mt-1 ml-2">
              💡 6+ chars, UPPERCASE, lowercase, numbers
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-base font-black border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "THINKING..." : "RESET PASSWORD! 🔑"}
          </button>
        </form>

        <p className="text-center mt-4 font-bold text-indigo-400">
          Remembered it?{" "}
          <Link to="/login" className="text-pink-500 hover:underline">
            Log In Here 🔐
          </Link>
        </p>
      </div>
    </div>
  );
}
