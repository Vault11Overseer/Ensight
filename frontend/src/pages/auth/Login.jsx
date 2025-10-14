// Login.jsx

// IMPORTS
import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sun, Moon, X } from "lucide-react";

export default function Login() {
  // STATE MANAGEMENT
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // DARK MODE - STATE MANAGEMENT
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const slideshowImages = [
    "/images/winter-at-the-strater.jpg",
    "/images/durango_road.jpg",
    "/images/durango_train.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % slideshowImages.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.access_token);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  // =============================
  // Forgot Password Modal Logic
  // =============================
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/forgot-password", { email: forgotEmail });
      alert("Password reset link sent to your email.");
      setShowForgot(false);
    } catch (err) {
      console.error(err);
      alert("Failed to send reset link.");
    }
  };

  return (
    <div
      className={`min-h-screen flex w-full items-center justify-center transition-colors duration-500 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`flex w-[900px] max-w-full rounded-2xl shadow-2xl overflow-hidden h-[70vh] transition-colors duration-500 ${
          darkMode ? "bg-[#1E1C29]" : "bg-gray-100"
        }`}
      >
        {/* LEFT SIDE IMAGE SLIDESHOW */}
        <div className="w-1/2 relative hidden md:block">
          <img
            src={slideshowImages[currentImageIndex]}
            alt="login slideshow"
            className="h-full w-full object-cover transition-opacity duration-1000"
          />
          <div
            className={`absolute top-5 left-5 px-3 py-1 rounded-lg font-bold text-lg ${
              darkMode ? "bg-black text-[#BDD63B]" : "bg-white text-[#1E1C29]"
            }`}
          >
            Ensight
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
            <p
              className={` px-3 py-1 rounded-lg font-bold text-lg ${
                darkMode ? "bg-black text-[#BDD63B]" : "bg-white text-[#1E1C29]"
              }`}
            >
              Capturing Moments,
              <br />
              Creating Memories
            </p>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slideshowImages.map((_, idx) => (
              <span
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentImageIndex
                    ? darkMode
                      ? "bg-[#BDD63B]"
                      : "bg-[#1E1C29]"
                    : "bg-white/40"
                }`}
              ></span>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative">
          <div className="flex justify-between items-center mb-2">
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Welcome back
            </h2>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full transition-colors duration-300"
            >
              {darkMode ? (
                <Sun className="text-[#BDD63B]" size={20} />
              ) : (
                <Moon className="text-[#1E1C29]" size={20} />
              )}
            </button>
          </div>

          <p
            className={`text-sm mb-6 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Don’t have an account?{" "}
            <a
              href="/register"
              className={`font-medium hover:underline ${
                darkMode ? "text-[#BDD63B]" : "text-[#1E1C29]"
              }`}
            >
              Register
            </a>
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] transition-colors duration-300 ${
                darkMode
                  ? "bg-[#2D2B3A] text-white placeholder-gray-400"
                  : "bg-gray-200 text-black placeholder-gray-600"
              }`}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] transition-colors duration-300 ${
                  darkMode
                    ? "bg-[#2D2B3A] text-white placeholder-gray-400"
                    : "bg-gray-200 text-black placeholder-gray-600"
                }`}
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

            <div
              className={`flex justify-between items-center text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="accent-[#BDD63B] cursor-pointer"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className={`font-medium hover:underline ${
                  darkMode ? "text-[#BDD63B]" : "text-[#1E1C29]"
                }`}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="bg-[#BDD63B] hover:bg-[#A4C22F] text-black font-semibold p-3 rounded-lg transition-colors duration-300"
            >
              Log in
            </button>
          </form>

          {/* SOCIAL LOGIN OPTIONS */}
          <div className="flex items-center gap-2 my-4">
            <hr
              className={`flex-1 ${
                darkMode ? "border-gray-600" : "border-gray-300"
              }`}
            />
            <span
              className={`${
                darkMode ? "text-gray-400" : "text-gray-600"
              } text-sm`}
            >
              Or log in with
            </span>
            <hr
              className={`flex-1 ${
                darkMode ? "border-gray-600" : "border-gray-300"
              }`}
            />
          </div>

          <div className="flex gap-4">
            {/* GOOGLE LOGIN BUTTON */}
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg p-3 transition-colors duration-300 ${
                darkMode
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Google
            </button>

            {/* APPLE LOGIN BUTTON */}
            <button
              type="button"
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg p-3 transition-colors duration-300 ${
                darkMode
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              <img
                src="https://www.svgrepo.com/show/69341/apple-logo.svg"
                alt="Apple"
                className="w-5 h-5"
              />
              Apple
            </button>
          </div>
        </div>
      </div>

      {/* ==================== FORGOT PASSWORD MODAL ==================== */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-xl w-[90%] max-w-md relative ${
              darkMode ? "bg-[#1E1C29] text-white" : "bg-white text-black"
            }`}
          >
            <button
              onClick={() => setShowForgot(false)}
              className="absolute top-3 right-3"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-center">
              Reset your password
            </h3>
            <p
              className={`text-sm mb-4 text-center ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Enter your email address and we’ll send you a link to reset your
              password.
            </p>
            <form
              onSubmit={handleForgotPassword}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Email"
                required
                className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] transition-colors duration-300 ${
                  darkMode
                    ? "bg-[#2D2B3A] text-white placeholder-gray-400"
                    : "bg-gray-200 text-black placeholder-gray-600"
                }`}
              />
              <button
                type="submit"
                className="bg-[#BDD63B] hover:bg-[#A4C22F] text-black font-semibold p-3 rounded-lg transition-colors duration-300"
              >
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
