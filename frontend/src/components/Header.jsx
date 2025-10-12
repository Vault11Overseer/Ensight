import React from "react";
import Intro from "./Intro";
import Navigation from "./Navigation";

export default function Header({ introProps, navigationProps }) {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
      {/* Left Column: Intro */}
      <div className="w-full md:flex-1 md:flex md:justify-start">
        <Intro {...introProps} />
      </div>

      {/* Right Column: Navigation */}
      <div className="w-full md:flex-1 md:flex md:justify-end">
        <Navigation {...navigationProps} />
      </div>
    </div>
  );
}
