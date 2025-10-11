import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { Settings, Images, Sun, Moon } from "lucide-react"; // gear & theme icons
import Search from "../components/Search";

export default function Dashboard() {
  const { token, logout, user } = useAuth(); 
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [topLibraries, setTopLibraries] = useState([]);
  const [allLibraries, setAllLibraries] = useState([]);

  // 1. Initialize darkMode from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true; // default
  });

  // 2. Sync <html> class whenever darkMode changes
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // 3. Toggle dark/light theme
  const toggleDarkMode = () => setDarkMode((prev) => !prev);


// Fetch all libraries for top 5
useEffect(() => {
  const fetchAllLibraries = async () => {
    try {
      const res = await API.get("/libraries/mine", {
  headers: { Authorization: `Bearer ${token}` },
});
setAllLibraries(res.data);


      // Sort by image_count descending and slice top 5
      const top = [...res.data]
        .sort((a, b) => (b.image_count || 0) - (a.image_count || 0))
        .slice(0, 5);
      setTopLibraries(top);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };
  fetchAllLibraries();
}, []);

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user?.first_name || user?.username || "User"}!
          </h1>
          <p className={`mt-1 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
            You have uploaded {images.length} images
          </p>

          <p className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            You’ve created{" "}
            <span className="text-indigo-400">{allLibraries.length}</span> libraries
          </p>

        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* <button
            className={`group flex items-center space-x-2 p-2 rounded-lg transition ${
              darkMode ? "hover:text-indigo-400" : "hover:text-indigo-600"
            }`}
            title="Settings"
          >
            <Settings size={28} />
            <span className="hidden md:inline">User Settings</span>
          </button> */}
          

<button
  onClick={() => (window.location.href = "/")}
  className="group flex items-center space-x-2 p-2 rounded-full border-2 border-green-500 hover:bg-green-500/20 transition"
>
  <Settings size={28} />
  <span className="hidden group-hover:inline">User Settings</span>
</button>









          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition text-white"
          >
            Logout
          </button>

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition ${
              darkMode
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>

      {/* SEARCH FEATURE */}
      <Search />

      {/* PORTAL LINKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        <a
          href="/Upload"
          className={`p-6 rounded-2xl shadow transition ${
            darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold">⬆️ Upload</h2>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-500"} mt-2`}>
            Upload your images
          </p>
        </a>

        <a
          href="/Libraries"
          className={`p-6 rounded-2xl shadow transition ${
            darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold">📚 Libraries</h2>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-500"} mt-2`}>
            Browse Collections of Images
          </p>
        </a>

        <a
          href="/personal"
          className={`p-6 rounded-2xl shadow transition ${
            darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold">📷 Personal</h2>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-500"} mt-2 flex items-center gap-1`}>
            Manage your uploads <Images size={18} />
          </p>
        </a>
      </div>

      {/* LOWER GALLERY BAR */}
      <div className="w-full h-auto">
        <a
          href="/gallery"
          className={`w-full flex flex-col items-center p-6 rounded-2xl shadow transition ${
            darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span>📷 Gallery</span>
          </h2>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-500"} mt-2 flex items-center gap-2`}>
            <span>Browse the main gallery</span>
            <Images size={18} />
          </p>
        </a>
      </div>

      {/* IMAGE PREVIEWS */}
      {images.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="uploaded"
                className={`rounded-lg shadow transition ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* TOP 5 LIBRARIES */}
      {topLibraries.length > 0 && (
  <div className="mt-16">
    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
      Top 5 Libraries
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {topLibraries.map((lib) => (
        <div
          key={lib.id}
          className={`p-4 rounded-lg shadow transition ${
            darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-200"
          }`}
        >
          <div className="w-full h-24 overflow-hidden rounded mb-2">
            <img
              src={lib.image_url || "http://localhost:8000/static/default_library.png"}
              alt={lib.title}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-bold text-gray-100 dark:text-gray-100">{lib.title}</h3>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-500"} text-sm mb-1`}>
            {lib.description}
          </p>
         
        </div>
      ))}
    </div>
  </div>
)}


    </div>
  );
}
