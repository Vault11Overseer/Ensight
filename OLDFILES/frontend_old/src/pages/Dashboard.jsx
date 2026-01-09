// frontend/src/pages/Dashboard.jsx

// =========================
// DARK MODE
// =========================

// =========================
// DARK MODE
// =========================
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { Images, ImageUp, LibraryBig, GalleryVerticalEnd } from "lucide-react";

import Header from "../components/module/Header";

// =========================
// DARK MODE
// =========================
export default function Dashboard() {
  // =========================
  // DARK MODE
  // =========================
  const { token, logout, user } = useAuth();
  const [images, setImages] = useState([]);
  const [allLibraries, setAllLibraries] = useState([]);

  // Dark mode
  // =========================
  // DARK MODE
  // =========================
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      console.log("Dark mode is ON 🌙");
    } else {
      document.documentElement.classList.remove("dark");
      console.log("Dark mode is OFF ☀️");
    }

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Fetch all libraries
  useEffect(() => {
    const fetchAllLibraries = async () => {
      try {
        const res = await API.get("/libraries/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllLibraries(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    fetchAllLibraries();
  }, [token]);

  // DISPLAY
  return (
    // DARK / LIGHT THEME WRAPPER
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* HEADER SECTION */}
      <Header
        introProps={{
          user: user,
          imagesCount: images.length,
          librariesCount: allLibraries.length,
          darkMode: darkMode,
        }}
        navigationProps={{
          darkMode: darkMode,
          toggleDarkMode: toggleDarkMode,
          logout: logout,
        }}
      />

      {/* UPLOAD LINK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        <a
          href="/Upload"
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

          <p className="mt-2">
            Upload and edit photos to the library or just the main image
            gallery.
          </p>
        </a>

        {/* LIBRARY LINK */}
        <a
          href="/Libraries"
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

          <p className="mt-2">
            {" "}
            Create, edit, and delete your own libraries and browse libraries of
            images made by other users.
          </p>
        </a>

        {/* PERSONAL LINK */}
        <a
          href="/Personal"
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

          <p className="mt-2 flex items-center gap-1">
            Search... view, edit, and delete all your person uploaded images
            here.
          </p>
        </a>
      </div>

      {/* Lower Gallery Bar */}
      <div className="w-full h-auto">
        <a
          href="/Gallery"
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

          <p className="mt-2 flex items-center gap-2">
            Browse or search the main gallery, which contains all images created
            by all users.
          </p>
        </a>
      </div>
    </div>
  );
}
