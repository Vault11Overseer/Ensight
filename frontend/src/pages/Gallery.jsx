// frontend/src/pages/Gallery.jsx

// =========================
// GALLERY PAGE
// =========================

// IMPORTS
import React, { useState } from "react";
import { Search, GalleryVerticalEnd } from "lucide-react";
import Header from "../components/module/Header";
import SearchBar from "../components/module/Searchbar";
import { useUserData } from "../services/UserDataContext";

export default function Gallery() {
  // =========================
  // STATE
  // =========================
  const [search, setSearch] = useState("");
  const { darkMode, setDarkMode } = useUserData();

  // =========================
  // RENDER
  // =========================
  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* HEADER */}
      <Header
        navigationProps={{
          toggleDarkMode: () => setDarkMode((prev) => !prev),
        }}
      />

      {/* PAGE TITLE */}
      <div className="flex items-center gap-2 mt-10 mb-6">
        <GalleryVerticalEnd size={22} />
        <h1 className="text-2xl font-semibold">Gallery</h1>
      </div>

  
      <SearchBar />

      {/* GALLERY GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* 
          Image cards go here.
          Do NOT remove this section — just plug your image map back in.
        */}

        {/* Example placeholder */}
        <div
          className={`aspect-square rounded-2xl flex items-center justify-center text-sm opacity-60 border ${
            darkMode
              ? "border-neutral-700 bg-neutral-900"
              : "border-neutral-300 bg-neutral-100"
          }`}
        >
          Image
        </div>
      </div>
    </div>
  );
}

// export default Gallery