// frontend/src/pages/auth/Login.jsx

// LOGIN
// IMPORT
import React, { useState } from "react";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Slideshow, { introSlides } from "../../components/module/Slideshow";
import { API_BASE_URL } from "../../services/api";
import { useUserData } from "../../services/UserDataContext";

// EXPORT
export default function Login() {
  
  // CONTEXT 
  const { darkMode, setDarkMode } = useUserData();
  const navigate = useNavigate();
  // LOCAL UI STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // REMEMBER ME
  const [rememberMe, setRememberMe] = useState(() => {
    return JSON.parse(localStorage.getItem("rememberMe")) ?? false;
  });
  // DARK MODE (delegated to context)
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  // SHARED LOGIN STORAGE HANDLER
  const persistLogin = (user) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("user", JSON.stringify(user));
    localStorage.setItem("rememberMe", JSON.stringify(rememberMe));

    navigate("/dashboard");
  };

  // =========================
  // DEV LOGIN
  // =========================
  const handleDevLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`);
      const data = await res.json();

      if (res.ok && data.user) {
        persistLogin(data.user);
      } else {
        alert("Dev user missing. Run init_db.py first.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend.");
    }
  };

  // =========================
  // TEMP LOGIN (until real auth)
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    // Placeholder user until backend auth is wired
    const fakeUser = { email };
    persistLogin(fakeUser);
  };


  // RENDER
  return (
    // LOGIN CONTAINER
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        darkMode ? "bg-black text-white" : "bg-slate-100 text-black"
      }`}
    >

      
      <div
        className={`flex w-[900px] max-w-full rounded-2xl shadow-2xl overflow-hidden transition-colors duration-500 ${
    darkMode ? "bg-[linear-gradient(to_right,#262627,#4f4e4f,#262526)]" : "bg-[linear-gradient(to_right,#d1d5db,#e4e4e7,#e4e4e7)]"
  }`}
  style={{ maxHeight: "90vh" }}>
        {/* LEFT SLIDESHOW */}
        <div className="w-1/2 hidden md:block">
          <Slideshow slides={introSlides} darkMode={darkMode} containerHeight="80vh" />
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center overflow-y-auto">
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>Welcome!</h2>
            <button onClick={toggleDarkMode} className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 transition-colors duration-300">
              {darkMode ? <Sun className="text-black" size={30} /> : <Moon className="text-black" size={30} />}
            </button>
          </div>

          <p className={`text-lg mb-1  ${darkMode ? "text-white" : "text-black"}`}>
            Sign in to access Insight.
          </p>
          <p className={`text-lg mb-6 ${darkMode ? "text-white" : "text-black"}`}>
            Don't have an account?{" "}
            <Link to="/register" className={`font-medium hover:underline ${darkMode ? "text-[#BDD63B]" : "text-[#1E1C29]"}`}>
              Register
            </Link>
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`inputs-set ${ darkMode ? "inputs-set-dark" : "inputs-set-light" }`}
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`inputs-set ${ darkMode ? "inputs-set-dark" : "inputs-set-light" }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* REMEMBER ME */}
            <div className="flex items-center justify-between text-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#BDD63B] h-[10%]"
                />
                <span className={darkMode ? "text-white" : "text-black"}>
                  Remember Me
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className={`button-set ${ darkMode ? "button-set-dark" : "button-set-light" }`}
            >
              Sign In
            </button>
          </form>

          <button
            onClick={handleDevLogin}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg transition-colors duration-300"
          >
            Dev Login
          </button>

          
        </div>
      </div>
    </div>
  );
}
