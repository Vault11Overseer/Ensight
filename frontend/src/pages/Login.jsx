import React, { useState } from "react";
import API, { setAuthToken } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      // Save token for axios headers & context
      setAuthToken(res.data.access_token);
      login(res.data.access_token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };
  
  
  return (
    <div className="min-h-screen flex w-full items-center justify-center bg-[#2D2B3A]">
      <div className="flex w-[900px] max-w-full bg-[#1E1C29] rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side */}
        <div className="w-1/2 relative hidden md:block">
          <img
            src = "/winter-at-the-strater.jpg"
            alt="cover"
            className="h-full w-full object-cover"
          />
          <div className="p-4 absolute top-5 left-5 text-white font-bold text-lg bg-[#2D2B3A]">
            Ensight
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-lg">
            Capturing Moments, <br /> Creating Memories
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <span className="w-2 h-2 rounded-full bg-white/40"></span>
            <span className="w-2 h-2 rounded-full bg-white/40"></span>
            <span className="w-2 h-2 rounded-full bg-white"></span>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-6">
            Don’t have an account?{" "}
            <a href="/register" className="text-indigo-400 hover:underline">
              Register
            </a>
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email input */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded-lg bg-[#2D2B3A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            {/* Password input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#2D2B3A] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Remember/Forgot */}
            <div className="flex justify-between items-center text-sm text-gray-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-indigo-500" />
                Remember me
              </label>
              <a href="#" className="text-indigo-400 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 transition text-white font-medium p-3 rounded-lg"
            >
              Log in
            </button>

            {/* OR login */}
            <div className="flex items-center gap-2 my-4">
              <hr className="flex-1 border-gray-600" />
              <span className="text-gray-400 text-sm">Or log in with</span>
              <hr className="flex-1 border-gray-600" />
            </div>

            {/* Social login */}
            <div className="flex gap-4">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 rounded-lg p-3 hover:bg-gray-100"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Google
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-800 rounded-lg p-3 hover:bg-gray-100"
              >
                <img
                  src="https://www.svgrepo.com/show/69341/apple-logo.svg"
                  alt="Apple"
                  className="w-5 h-5"
                />
                Apple
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
