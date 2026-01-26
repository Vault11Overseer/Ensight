// =========================
// REGISTER PAGE
// =========================

// IMPORTS
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Slideshow from "../../components/module/Slideshow";
import {Link} from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ firstName, lastName, email, password });
    alert("Registration submitted! (Cognito signup pending)");
    navigate("/login");
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
      darkMode ? "bg-black text-white" : "bg-white text-black"
    }`}>
      <div
        className={`flex w-[900px] max-w-full rounded-2xl shadow-2xl overflow-hidden transition-colors duration-500 ${
          darkMode ? "bg-[#1E1C29]" : "bg-gray-100"
        }`}
        style={{ maxHeight: "90vh" }}
      >
        {/* LEFT SLIDESHOW */}
        <div className="w-1/2 hidden md:block">
  <Slideshow
    slides={[
      { image: "/images/winter-at-the-strater.jpg", title: "Capturing Moments", subtitle: "Creating Memories" },
      { image: "/images/durango_road.jpg", title: "Adventure Awaits", subtitle: "Hit the Road" },
      { image: "/images/durango_train.jpg", title: "Historic Journeys", subtitle: "Ride the Rails" }
    ]}
    darkMode={darkMode}
    containerHeight="80vh" // lock height
  />
</div>


        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
              Create an account
            </h2>
            <button onClick={toggleDarkMode} className="p-2 rounded-full transition-colors duration-300">
              {darkMode ? <Sun className="text-[#BDD63B]" size={20} /> : <Moon className="text-[#1E1C29]" size={20} />}
            </button>
          </div>

          <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Already have an account?{" "}
            <Link to="/login" className={`font-medium hover:underline ${darkMode ? "text-[#BDD63B]" : "text-[#1E1C29]"}`}>
              Log in
            </Link>
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
              <Link to="#" className={`ml-1 hover:underline ${darkMode ? "text-[#BDD63B]" : "text-[#1E1C29]"}`}>
                Terms & Conditions
              </Link>
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
