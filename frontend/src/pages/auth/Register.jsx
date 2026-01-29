// frontend/src/pages/auth/Register.jsx
// REGISTER

// IMPORTS
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Slideshow, { introSlides } from "../../components/module/Slideshow";
import { useUserData } from "../../services/UserDataContext";

export default function Register() {
  // CONTEXT
  const { darkMode, setDarkMode } = useUserData();
  const navigate = useNavigate();

  // LOCAL FORM STATE
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // DARK MODE 
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Placeholder until real auth is wired
    console.log({ firstName, lastName, email, password });

    alert("Registration submitted! (Cognito signup pending)");
    navigate("/login");
  };

  // RENDER
  return (
    // REGISTER CONTAINER
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
      darkMode ? "bg-black text-white" : "bg-white text-black"
    }`}>
      <div
        className={`flex w-[900px] max-w-full rounded-2xl shadow-2xl overflow-hidden transition-colors duration-500 ${
    darkMode ? "bg-[linear-gradient(to_right,#262627,#4f4e4f,#262526)]" : "bg-[linear-gradient(to_right,#d1d5db,#e4e4e7,#e4e4e7)]"
  }`}
  style={{ maxHeight: "90vh" }}>
        {/* LEFT SLIDESHOW */}
        <div className="w-1/2 hidden md:block">
          <Slideshow slides={introSlides} darkMode={darkMode} containerHeight="80vh" />
        </div>


        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
              Create an account
            </h2>
            <button onClick={toggleDarkMode} className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 transition-colors duration-300">
                          {darkMode ? <Sun className="text-black" size={30} /> : <Moon className="text-black" size={30} />}
                        </button>
          </div>

          <p className={`text-lg mb-6 ${darkMode ? "text-white" : "text-black"}`}>
            Already have an account?{" "}
            <Link to="/login" className={`font-medium hover:underline ${darkMode ? "text-[#BDD63B]" : "text-[#1E1C29]"}`}>
              Log in
            </Link>
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`inputs-set ${ darkMode ? "inputs-set-dark" : "inputs-set-light" }`}

              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`inputs-set ${ darkMode ? "inputs-set-dark" : "inputs-set-light" }`}

              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`inputs-set ${ darkMode ? "inputs-set-dark" : "inputs-set-light" }`}

            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`inputs-set ${ darkMode ? "inputs-set-dark" : "inputs-set-light" }`}

              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <label className={`flex items-center text-lg ${darkMode ? "text-white" : "text-black"}`}>
              <input type="checkbox" className="mr-2 accent-[#BDD63B] " />
              I agree to the{" "}
              <Link to="#" className={`ml-1 hover:underline ${darkMode ? "text-[#BDD63B]" : "text-[#1E1C29]"}`}>
                Terms & Conditions
              </Link>
            </label>

            <button type="submit" className={`button-set ${ darkMode ? "button-set-dark" : "button-set-light" }`}
>
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
