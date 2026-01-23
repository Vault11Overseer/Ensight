// /src/components/Navigation.jsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Settings, Sun, Moon, ArrowLeft } from "lucide-react";
import { useUserData } from "../../../services/UserDataContext";

// ======================================
// NAVIGATION FUNCTION
// ======================================
export default function Navigation({ toggleDarkMode }) {
  const { darkMode } = useUserData();
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";

  // ======================================
  // LOGOUT (DEV NOW, COGNITO LATER)
  // ======================================
  const handleLogout = async () => {
    try {
      // ----------------------------------
      // FUTURE: Cognito logout goes here
      // ----------------------------------
      // Example (later):
      // await Auth.signOut({ global: true });

      // DEV AUTH CLEANUP
      localStorage.removeItem("user");
      localStorage.removeItem("darkMode");

      // REDIRECT TO LOGIN
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to log out");
    }
  };

  // ======================================
  // RETURN
  // ======================================
  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 justify-end">
      {/* USER SETTINGS / BACK BUTTON */}
      <button
        onClick={() =>
          isDashboard ? navigate("/settings") : navigate("/dashboard")
        }
        className="group flex flex-row-reverse items-center rounded-full transition-all duration-300 overflow-hidden"
        style={{
          backgroundColor: "#BDD63B",
          color: "black",
          minWidth: "48px",
          padding: "6px 10px",
        }}
      >
        {isDashboard ? <Settings size={28} /> : <ArrowLeft size={28} />}

        <span className="font-semibold whitespace-nowrap max-w-0 overflow-hidden transition-all duration-300 group-hover:max-w-[180px] mr-2 text-left">
          {isDashboard ? "User Settings" : "Back To Dashboard"}
        </span>
      </button>

      {/* LOGOUT BUTTON */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg bg-red-500 text-white transition-colors duration-300 hover:bg-red-700"
      >
        Logout
      </button>

      {/* DARK / LIGHT MODE TOGGLE */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg transition"
        style={{
          backgroundColor: darkMode ? "white" : "#263248",
        }}
      >
        {darkMode ? (
          <Sun size={20} color="black" />
        ) : (
          <Moon size={20} color="white" />
        )}
      </button>
    </div>
  );
}
