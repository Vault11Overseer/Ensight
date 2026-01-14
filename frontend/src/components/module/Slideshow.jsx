// frontend/src/components/module/Slideshow.jsx

// ======================================
// SLIDESHOW
// ======================================

// ======================================
// IMPORTS
// ======================================
import React from "react";

// ======================================
// SLIDESHOW FUNCTION
// ======================================
export default function Slideshow({ introProps, navigationProps }) {
  // ======================================
  // RETURN
  // ======================================
  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
      {/* LEFT COLUMN: INTRO */}
      <div className="w-full md:flex-1 md:flex md:justify-start">
        {/* <Intro {...introProps} /> */}
      </div>

      {/* RIGHT COLUMN: NAVIGATION */}
      <div className="w-full md:flex-1 md:flex md:justify-end">
        {/* <Navigation {...navigationProps} /> */}
      </div>
    </div>
  );
}
