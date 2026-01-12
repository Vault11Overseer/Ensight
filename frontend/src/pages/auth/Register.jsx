// frontend/src/pages/auth/Register.jsx
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  // ============================
  // STATE
  // ============================
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ============================
  // DARK MODE
  // ============================
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

  // ============================
  // SLIDESHOW
  // ============================
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

  // ============================
  // FORM SUBMISSION
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Wire this to AWS Cognito signup
    console.log({ firstName, lastName, email, password });
    alert("Registration submitted! (Cognito signup pending)");
    navigate("/login");
  };

  // ============================
  // RENDER
  // ============================
  return (
    <div
      className={`min-h-screen flex w-full items-center justify-center transition-colors duration-500 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`flex w-[900px] max-w-full rounded-2xl shadow-2xl overflow-hidden transition-colors duration-500 ${
          darkMode ? "bg-[#1E1C29]" : "bg-gray-100"
        }`}
        style={{ height: "70vh" }}
      >
        {/* LEFT IMAGE SLIDESHOW */}
        <div className="w-1/2 relative hidden md:block">
          <img
            src={slideshowImages[currentImageIndex]}
            alt="register slideshow"
            className="h-full w-full object-cover transition-opacity duration-1000"
          />
          <div
            className={`absolute top-5 left-5 px-3 py-1 rounded-lg font-bold text-lg ${
              darkMode ? "bg-black text-[#BDD63B]" : "bg-white text-[#1E1C29]"
            }`}
          >
            Insight
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
            <p
              className={`px-3 py-1 rounded-lg font-bold text-lg ${
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

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative">
          <div className="flex justify-between items-center mb-2">
            <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
              Create an account
            </h2>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full transition-colors duration-300"
            >
              {darkMode ? <Sun className="text-[#BDD63B]" size={20} /> : <Moon className="text-[#1E1C29]" size={20} />}
            </button>
          </div>

          <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Already have an account?{" "}
            <a href="/login" className={`font-medium hover:underline ${darkMode ? "text-[#BDD63B]" : "text-[#1E1C29]"}`}>
              Log in
            </a>
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-1/2 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] transition-colors duration-300 ${
                  darkMode ? "bg-[#2D2B3A] text-white placeholder-gray-400" : "bg-gray-200 text-black placeholder-gray-600"
                }`}
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-1/2 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] transition-colors duration-300 ${
                  darkMode ? "bg-[#2D2B3A] text-white placeholder-gray-400" : "bg-gray-200 text-black placeholder-gray-600"
                }`}
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] transition-colors duration-300 ${
                darkMode ? "bg-[#2D2B3A] text-white placeholder-gray-400" : "bg-gray-200 text-black placeholder-gray-600"
              }`}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] transition-colors duration-300 ${
                  darkMode ? "bg-[#2D2B3A] text-white placeholder-gray-400" : "bg-gray-200 text-black placeholder-gray-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <label className={`flex items-center text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <input type="checkbox" className="mr-2 accent-[#BDD63B] cursor-pointer" />
              I agree to the{" "}
              <a href="#" className={`ml-1 hover:underline ${darkMode ? "text-[#BDD63B]" : "text-[#1E1C29]"}`}>
                Terms & Conditions
              </a>
            </label>

            <button type="submit" className="bg-[#BDD63B] hover:bg-[#A4C22F] text-black font-semibold p-3 rounded-lg transition-colors duration-300">
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
