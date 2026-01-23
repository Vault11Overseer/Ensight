// frontend/src/components/module/Header.jsx

// ======================================
// HEADER
// ======================================

// ======================================
// IMPORTS
// ======================================
import React from "react";
import Intro from "./submodule/Intro";
import Navigation from "./submodule/Navigation";
import { useUserData } from "../../services/UserDataContext";

// ======================================
// HEADER FUNCTION
// ======================================
export default function Header({ navigationProps }) {
  // ======================================
  // RETURN
  // ======================================
  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
      {/* LEFT COLUMN: INTRO */}
      <div className="w-full md:flex-1 md:flex md:justify-start">
        <Intro />
      </div>

      {/* RIGHT COLUMN: NAVIGATION */}
      <div className="w-full md:flex-1 md:flex md:justify-end">
        <Navigation toggleDarkMode={navigationProps?.toggleDarkMode} />
      </div>
    </div>
  );
}
