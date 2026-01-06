import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();

  axios
    .post("http://localhost:3001/login", {
      email,
      password,
    })
    .then((result) => {
      if (result.data.success) {
        localStorage.setItem("token", result.data.token);
        navigate("/home");
      } else {
        alert(result.data.message);
      }
    })
    .catch((err) => console.log(err));
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-blue-200">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-2">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Login to continue your fun journey 
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"
              name="email"
              onChange={(e) => setEmail(e.target.value)}

            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-400"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl text-lg font-bold transition"
          >
            Login
          </button>
        </form>
        <Link to="/register">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
