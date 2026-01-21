// frontend/src/pages/Gallery.jsx

// =========================
// GALLERY PAGE
// =========================

// IMPORTS
import React, { useEffect, useState } from "react";
import { Search, GalleryVerticalEnd } from "lucide-react";
import Header from "../components/module/Header";
import Searchbar from "../components/module/submodule/SearchBar"

export default function Gallery() {
  // =========================
  // STATE
  // =========================
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");

  // DARK MODE
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

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
        introProps={{
          user,
          darkMode,
          albumsCount: 0,
          imagesCount: 0,
        }}
        navigationProps={{
          darkMode,
          toggleDarkMode,
        }}
      />

      {/* PAGE TITLE */}
      <div className="flex items-center gap-2 mt-10 mb-6">
        <GalleryVerticalEnd size={22} />
        <h1 className="text-2xl font-semibold">Gallery</h1>
      </div>

      {/* SEARCH BAR */}
      {/* <div className="w-full max-w-2xl mb-10">
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition ${
            darkMode
              ? "bg-neutral-900 border-neutral-700 focus-within:border-[#BDD63B]"
              : "bg-neutral-100 border-neutral-300 focus-within:border-[#263248]"
          }`}
        >
          <Search size={18} className="opacity-70" />
          <input
            type="text"
            placeholder="Search images, albums, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-transparent outline-none text-sm ${
              darkMode ? "placeholder-neutral-400" : "placeholder-neutral-500"
            }`}
          />
        </div>
      </div> */}

      <Search size={18} className="opacity-70" />
      <Searchbar />

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