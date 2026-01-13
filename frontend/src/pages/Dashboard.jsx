// frontend/src/pages/Dashboard.jsx

// =========================
// DASHBOARD PAGE
// =========================

// IMPORTS
import React, { useState, useEffect } from "react";
import { Images,ImageUp,LibraryBig,GalleryVerticalEnd,} from "lucide-react";
import Header from "../components/module/Header";

export default function Dashboard() {
  // STATE (TEMP PLACEHOLDERS)
  const [imagesCount] = useState(0);
  const [librariesCount] = useState(0);

  // DARK MODE
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // RENDER
  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* HEADER */}
      <Header
        introProps={{
          user: null, // Cognito user injected later
          imagesCount,
          librariesCount,
          darkMode,
        }}
        navigationProps={{
          darkMode,
          toggleDarkMode,
          logout: null, // Cognito logout handled elsewhere
        }}
      />

      {/* MAIN ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        <a
          href="/upload"
          className={`p-6 rounded-2xl shadow transition ${
            darkMode
              ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
              : "bg-[#263248] text-white hover:bg-[#122342]"
          }`}
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ImageUp size={18} /> Upload
          </h2>
          <hr className="my-4 border-black w-full" />
          <p>Upload images to your libraries or the main gallery.</p>
        </a>

        <a
          href="/libraries"
          className={`p-6 rounded-2xl shadow transition ${
            darkMode
              ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
              : "bg-[#263248] text-white hover:bg-[#122342]"
          }`}
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <LibraryBig size={18} /> Libraries
          </h2>
          <hr className="my-4 border-black w-full" />
          <p>Create and manage image libraries.</p>
        </a>

        <a
          href="/personal"
          className={`p-6 rounded-2xl shadow transition ${
            darkMode
              ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
              : "bg-[#263248] text-white hover:bg-[#122342]"
          }`}
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Images size={18} /> Personal
          </h2>
          <hr className="my-4 border-black w-full" />
          <p>View and manage your uploaded images.</p>
        </a>
      </div>

      {/* GALLERY */}
      <div className="w-full">
        <a
          href="/gallery"
          className={`w-full flex flex-col items-center p-6 rounded-2xl shadow transition ${
            darkMode
              ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
              : "bg-[#263248] text-white hover:bg-[#122342]"
          }`}
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <GalleryVerticalEnd size={18} /> Gallery
          </h2>
          <hr className="my-4 border-black w-full" />
          <p>Browse all images across Insight.</p>
        </a>
      </div>
    </div>
  );
}
