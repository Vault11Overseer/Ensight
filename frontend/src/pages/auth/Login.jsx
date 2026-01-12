import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

// =========================
// LOGIN PAGE (COGNITO)
// =========================
export default function Login() {
  // =========================
  // DARK MODE
  // =========================
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

  // =========================
  // SLIDESHOW
  // =========================
  const slideshowImages = [
    "/images/winter-at-the-strater.jpg",
    "/images/durango_road.jpg",
    "/images/durango_train.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prev) => (prev + 1) % slideshowImages.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // =========================
  // COGNITO LOGIN
  // =========================
  const handleLogin = () => {
    window.location.href = import.meta.env.VITE_COGNITO_LOGIN_URL;
  };

  // =========================
  // RENDER
  // =========================
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
        {/* LEFT SIDE IMAGE */}
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
            Insight
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
            <p
              className={`px-3 py-1 rounded-lg font-bold text-lg ${
                darkMode ? "bg-black text-[#BDD63B]" : "bg-white text-[#1E1C29]"
              }`}
            >
              Secure internal access
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <button onClick={toggleDarkMode}>
              {darkMode ? (
                <Sun className="text-[#BDD63B]" size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
          </div>

          <p className="text-sm text-gray-400 mb-8">
            Sign in to access Insight
          </p>

          <button
            onClick={handleLogin}
            className="bg-[#BDD63B] hover:bg-[#A4C22F] text-black font-semibold p-3 rounded-lg transition-colors duration-300"
          >
            Sign in with company account
          </button>
        </div>
      </div>
    </div>
  );
}
