import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { Images } from "lucide-react";

import Header from "../components/Header";

export default function Dashboard() {
  const { token, logout, user } = useAuth();
  const [images, setImages] = useState([]);
  const [allLibraries, setAllLibraries] = useState([]);

  // Dark mode
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

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
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

      {/* Portal Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        <a
          href="/Upload"
          className={`p-6 rounded-2xl shadow transition ${
            darkMode
              ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
              : "bg-[#263248] text-white hover:bg-[#122342]"
          }`}
        >
          <h2 className="text-xl font-semibold">⬆️ Upload</h2>
          <p className="mt-2">Upload your images</p>
        </a>

        <a
          href="/Libraries"
          className={`p-6 rounded-2xl shadow transition ${
            darkMode
              ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
              : "bg-[#263248] text-white hover:bg-[#122342]"
          }`}
        >
          <h2 className="text-xl font-semibold">📚 Libraries</h2>
          <p className="mt-2">Browse Collections of Images</p>
        </a>

        <a
          href="/personal"
          className={`p-6 rounded-2xl shadow transition ${
            darkMode
              ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
              : "bg-[#263248] text-white hover:bg-[#122342]"
          }`}
        >
          <h2 className="text-xl font-semibold">📷 Personal</h2>
          <p className="mt-2 flex items-center gap-1">
            Manage your uploads <Images size={18} />
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
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span>📷 Gallery</span>
          </h2>
          <p className="mt-2 flex items-center gap-2">
            Browse the main gallery
          </p>
        </a>
      </div>
    </div>
  );
}
