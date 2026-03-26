import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Enter your email, hero!";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Check your email spelling!";
    }

    if (!password) {
      newErrors.password = "Enter your password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      if (result.data.success) {
        // ✅ FIXED: was "token", must match what MissionContext & HUD read
        localStorage.setItem("guardians_token", result.data.token);

        try {
          const progressRes = await axios.get(
            "http://localhost:3001/progress",
            {
              headers: { Authorization: `Bearer ${result.data.token}` },
            },
          );
          if (
            progressRes.data.success &&
            progressRes.data.progress.characterType
          ) {
            navigate("/home");
          } else {
            navigate("/choose-character");
          }
        } catch (err) {
          navigate("/choose-character");
        }
      } else {
        alert(
          "⚠️ " + (result.data.message || "Wait! That's not right. Try again!"),
        );
      }
    } catch (err) {
      console.error(err);
      alert("🌙 The servers are sleepy. Try again later!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-400 p-4 font-sans">
      <div className="bg-white p-7 rounded-[2rem] shadow-[8px_8px_0_0_#4338ca] border-4 border-indigo-900 w-full max-w-xs">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-indigo-100 rounded-full mb-2">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-2xl font-black text-indigo-900 uppercase tracking-tighter">
            Welcome Back!
          </h1>
        </div>

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
              type="password"
              placeholder="Secret Password"
              className={`w-full px-4 py-3 rounded-2xl border-4 bg-indigo-50 font-bold focus:border-indigo-400 outline-none transition-all ${
                errors.password ? "border-red-400" : "border-indigo-50"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-xs font-bold mt-2 ml-2">
                ⚠️ {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-2xl text-base font-black border-b-4 border-pink-800 active:border-b-0 active:translate-y-1 transition-all ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "KNOCK KNOCK... 🚪" : "GO TO GAME! 🎮"}
          </button>
        </form>

        <p className="text-center mt-5 font-bold text-gray-400 uppercase text-xs tracking-widest">
          New Explorer?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-800"
          >
            Create Hero 🚀
          </Link>
          <br />
          <Link
            to="/forgot-password"
            className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
          >
            Forgot Password? 🤔
          </Link>
        </p>
      </div>
    </div>
  );
}
