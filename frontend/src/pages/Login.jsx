import React, { useState } from "react";
import API, { setAuthToken } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      setAuthToken(res.data.access_token);
      login(res.data.access_token);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <h1 className="text-4xl bg-red-50">Login</h1>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
    <div className="bg-red-500 text-white text-4xl p-10">
      Tailwind Test
    </div>
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <p className="text-4xl font-bold text-blue-900">Tailwind is Working!</p>
    </div>
    </div>
  );
}
