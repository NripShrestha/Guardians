import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [age, setAge] = useState();
  const [gender, setGender] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/register", {
        username,
        email,
        age,
        gender,
        password,
      })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => console.log(err));

  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 to-pink-200">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-pink-500 mb-2">
          Join the Fun!
        </h1>
        <p className="text-center text-gray-500 mb-6">Create your account</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold">Username</label>
            <input
              type="text"
              placeholder="cool_kid123"
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-400 outline-none"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-400 outline-none"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Age</label>
            <input
              type="number"
              placeholder="8"
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-400 outline-none"
              name="age"
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Gender</label>
            <select
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-400 outline-none"
            >
              <option value="">Choose one</option>
              <option value="boy">Boy</option>
              <option value="girl">Girl</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-400 outline-none"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl text-lg font-bold transition"
          >
            Sign Up
          </button>
        </form>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
