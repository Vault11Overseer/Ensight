import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";

export default function Register() {
  // ============================
  // STATE
  // ============================
  const [showPassword, setShowPassword] = useState(false); // TOGGLE PASSWORD VISIBILITY
  const [firstName, setFirstName] = useState(""); // FIRST NAME INPUT
  const [lastName, setLastName] = useState(""); // LAST NAME INPUT
  const [email, setEmail] = useState(""); // EMAIL INPUT
  const [password, setPassword] = useState(""); // PASSWORD INPUT
  const navigate = useNavigate(); // ENABLE PAGE NAVIGATION

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
  // IMAGE SLIDESHOW
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
  // FORM SUBMISSION HANDLER
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    }
  };

  // ============================
  // COMPONENT RENDER
  // ============================
  return (
    // MAIN PAGE WRAPPER WITH THEME BACKGROUND
    <div
      className={`min-h-screen flex w-full items-center justify-center transition-colors duration-500 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* MAIN FORM CONTAINER */}
      <div
        className={`flex w-[900px] max-w-full rounded-2xl shadow-2xl overflow-hidden transition-colors duration-500 ${
          darkMode ? "bg-[#1E1C29]" : "bg-gray-100"
        }`}
        style={{ height: "70vh" }} // FIXED TO HALF VIEWPORT HEIGHT
      >
        {/* LEFT SIDE IMAGE SLIDESHOW */}
        <div className="w-1/2 relative hidden md:block">
          <img
            src={slideshowImages[currentImageIndex]}
            alt="register slideshow"
            className="h-full w-full object-cover transition-opacity duration-1000"
          />

          {/* APP NAME LOGO */}
          <div
            className={`absolute top-5 left-5 px-3 py-1 rounded-lg font-bold text-lg ${
              darkMode ? "bg-black text-[#BDD63B]" : "bg-white text-[#1E1C29]"
            }`}
          >
            Ensight
          </div>

          {/* TAGLINE */}
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

          {/* SLIDE INDICATORS */}
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

        {/* RIGHT SIDE FORM SECTION */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative">
          {/* HEADER WITH THEME TOGGLE */}
          <div className="flex justify-between items-center mb-2">
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Create an account
            </h2>

            {/* DARK/LIGHT TOGGLE BUTTON */}
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

          {/* LOGIN LINK BELOW TITLE */}
          <p
            className={`text-sm mb-6 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Already have an account?{" "}
            <a
              href="/login"
              className={`font-medium hover:underline ${
                darkMode ? "text-[#BDD63B]" : "text-[#1E1C29]"
              }`}
            >
              Log in
            </a>
          </p>

          {/* REGISTRATION FORM */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* NAME INPUTS */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-1/2 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] transition-colors duration-300 ${
                  darkMode
                    ? "bg-[#2D2B3A] text-white placeholder-gray-400"
                    : "bg-gray-200 text-black placeholder-gray-600"
                }`}
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-1/2 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] transition-colors duration-300 ${
                  darkMode
                    ? "bg-[#2D2B3A] text-white placeholder-gray-400"
                    : "bg-gray-200 text-black placeholder-gray-600"
                }`}
              />
            </div>

            {/* EMAIL INPUT */}
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
            />

            {/* PASSWORD INPUT WITH TOGGLE ICON */}
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* TERMS AGREEMENT */}
            <label
              className={`flex items-center text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <input
                type="checkbox"
                className="mr-2 accent-[#BDD63B] cursor-pointer"
              />
              I agree to the{" "}
              <a
                href="#"
                className={`ml-1 hover:underline ${
                  darkMode ? "text-[#BDD63B]" : "text-[#1E1C29]"
                }`}
              >
                Terms & Conditions
              </a>
            </label>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="bg-[#BDD63B] hover:bg-[#A4C22F] text-black font-semibold p-3 rounded-lg transition-colors duration-300"
            >
              Create account
            </button>

            {/* DIVIDER FOR SOCIAL LOGIN */}
            <div className="flex items-center gap-2 my-4">
              <hr
                className={`flex-1 ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                }`}
              />
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Or register with
              </span>
              <hr
                className={`flex-1 ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                }`}
              />
            </div>

            {/* SOCIAL LOGIN BUTTONS */}
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg p-3 font-medium transition ${
                  darkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }`}
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
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg p-3 font-medium transition ${
                  darkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-white text-gray-800 hover:bg-gray-100"
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
          </form>
        </div>
      </div>
    </div>
  );
}
