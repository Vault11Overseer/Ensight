// /src/components/Navigation.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Settings, Sun, Moon, ArrowLeft } from "lucide-react";

export default function Navigation({ darkMode, toggleDarkMode, logout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const green = "#BDD63B";
  const darkBlue = "#212B3E";

  // Check if user is on Dashboard
  const isDashboard = location.pathname === "/" || location.pathname === "/";

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8 justify-end">
      {/* User Settings / Back Button */}
      <button
        onClick={() => (isDashboard ? navigate("/settings") : navigate("/"))}
        className={`group flex flex-row-reverse items-center rounded-full transition-all duration-300 overflow-hidden `}
        style={{
          backgroundColor: green,
          color: "black",
          minWidth: "48px",
          // padding: "6px 10px",
          padding: "6px 20px 6px 10px",
        }}
      >
        {/* Icon changes based on page */}
        {isDashboard ? <Settings size={28} /> : <ArrowLeft size={28} />}

        {/* Text fills in from left on hover */}
        <span className="font-semibold whitespace-nowrap max-w-0 overflow-hidden transition-all duration-300 group-hover:max-w-[180px] mr-2 text-left">
          {isDashboard ? "User Settings" : "Back To Dashboard"}
        </span>
      </button>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="px-4 py-2 rounded-lg bg-red-500 text-white transition-colors duration-300 hover:bg-red-700"
      >
        Logout
      </button>

      {/* Dark/Light Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-lg transition"
        style={{
          backgroundColor: darkMode ? "white" : darkBlue,
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
