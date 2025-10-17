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

// ======================================
// HEADER FUNCTION
// ======================================
export default function Header({ introProps, navigationProps }) {
  // ======================================
  // RETURN
  // ======================================
  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
      {/* LEFT COLUMN: INTRO */}
      <div className="w-full md:flex-1 md:flex md:justify-start">
        <Intro {...introProps} />
      </div>

      {/* RIGHT COLUMN: NAVIGATION */}
      <div className="w-full md:flex-1 md:flex md:justify-end">
        <Navigation {...navigationProps} />
      </div>
    </div>
  );
}
