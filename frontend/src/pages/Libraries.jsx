import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

export default function Libraries() {
  // ==============================
  // AUTH CONTEXT & STATE VARIABLES
  // ==============================
  const { user, logout } = useAuth();

  const [libraries, setLibraries] = useState([]); // USER'S LIBRARIES
  const [allLibraries, setAllLibraries] = useState([]); // ALL LIBRARIES
  const [title, setTitle] = useState(""); // NEW LIBRARY TITLE
  const [description, setDescription] = useState(""); // NEW LIBRARY DESCRIPTION
  const [imageFile, setImageFile] = useState(null); // FILE UPLOAD
  const [imageBase64, setImageBase64] = useState(""); // IMAGE AS BASE64 FOR INLINE EDIT
  const [error, setError] = useState(""); // ERROR MESSAGES
  const [inlineEdits, setInlineEdits] = useState({}); // INLINE EDITING STATE
  const [images, setImages] = useState([]); // COUNT OF IMAGES

  // ==============================
  // DARK MODE STATE INITIALIZATION
  // ==============================
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true; // DEFAULT DARK MODE
  });

  // ==============================
  // SYNC DARK MODE TO <HTML> CLASS
  // ==============================
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // ==============================
  // TOGGLE DARK MODE FUNCTION
  // ==============================
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // ==============================
  // FETCH USER'S LIBRARIES
  // ==============================
  const fetchMyLibraries = async () => {
    try {
      const res = await API.get("/libraries/mine");
      setLibraries(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  // ==============================
  // FETCH ALL LIBRARIES
  // ==============================
  const fetchAllLibraries = async () => {
    try {
      const res = await API.get("/libraries/");
      setAllLibraries(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  // ==============================
  // INITIAL DATA FETCH
  // ==============================
  useEffect(() => {
    fetchMyLibraries();
    fetchAllLibraries();
  }, []);

  // ==============================
  // HANDLE NEW LIBRARY CREATION
  // ==============================
  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await API.post("/libraries/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLibraries([...libraries, res.data]);
      setAllLibraries([...allLibraries, res.data]);
      setTitle("");
      setDescription("");
      setImageFile(null);
      setError("");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.detail || "Failed to create library");
    }
  };

  // ==============================
  // HANDLE LIBRARY DELETION
  // ==============================
  const handleDelete = async (libId) => {
    try {
      await API.delete(`/libraries/${libId}`);
      setLibraries(libraries.filter((lib) => lib.id !== libId));
      setAllLibraries(allLibraries.filter((lib) => lib.id !== libId));
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.detail || "Failed to delete library");
    }
  };

  // ==============================
  // START INLINE EDIT
  // ==============================
  const startEditingInline = (lib) => {
    setInlineEdits({
      id: lib.id,
      title: lib.title,
      description: lib.description,
    });
  };

  // ==============================
  // HANDLE INLINE INPUT CHANGES
  // ==============================
  const handleInlineChange = (e) => {
    setInlineEdits({ ...inlineEdits, [e.target.name]: e.target.value });
  };

  // ==============================
  // SAVE INLINE EDITS
  // ==============================
  const saveInlineEdits = async (libId) => {
    try {
      const payload = {
        title: inlineEdits.title,
        description: inlineEdits.description,
        image_base64: imageBase64 || null,
      };
      const res = await API.put(`/libraries/${libId}`, payload);
      setLibraries(libraries.map((lib) => (lib.id === libId ? res.data : lib)));
      setAllLibraries(
        allLibraries.map((lib) => (lib.id === libId ? res.data : lib))
      );
      setInlineEdits({});
      setImageFile(null);
      setImageBase64("");
      setError("");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.detail || "Failed to update library");
    }
  };

  // ==============================
  // HANDLE IMAGE FILE CHANGE
  // ==============================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      const base64String = result.split(",")[1];
      setImageBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  // ==============================
  // MAIN RENDER
  // ==============================
return (
  <div
    className={`min-h-screen p-8 transition-colors duration-300 ${
      darkMode ? "bg-[#0B0E1D] text-white" : "bg-[#EAF1FF] text-black"
    }`}
  >
    {/* HEADER COMPONENT */}
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

    {/* CREATE LIBRARY FORM */}
    <div className="flex flex-col md:flex-row gap-10 mt-6">
      <div
        className={`w-full p-6 rounded-2xl shadow transition-colors duration-300 ${
          darkMode ? "bg-[#1A1F3D]" : "bg-white"
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-4 ${
            darkMode ? "text-[#BDD63B]" : "text-[#0B0E1D]"
          }`}
        >
          CREATE A NEW LIBRARY
        </h2>

        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <input
            className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
              darkMode
                ? "bg-[#0B0E1D] text-white placeholder-gray-400"
                : "bg-[#DDE7FF] text-[#0B0E1D] placeholder-gray-500"
            }`}
            placeholder="Library Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
              darkMode
                ? "bg-[#0B0E1D] text-white placeholder-gray-400"
                : "bg-[#DDE7FF] text-[#0B0E1D] placeholder-gray-500"
            }`}
            placeholder="Library Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            className="p-2 rounded bg-[#0B0E1D] text-white"
            onChange={handleFileChange}
          />
          <button className="bg-[#BDD63B] hover:bg-[#A4C22F] p-3 rounded-lg text-black font-semibold transition-colors duration-300">
            CREATE LIBRARY
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        {/* USER LIBRARIES */}
        {libraries.length > 0 && (
          <div className="mt-10">
            <h2
              className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-[#BDD63B]" : "text-[#0B0E1D]"
              }`}
            >
              YOUR LIBRARIES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {libraries.map((lib) => (
                <div
                  key={lib.id}
                  className={`p-2 rounded-lg shadow cursor-pointer transition-colors duration-300 ${
                    lib.image_url
                      ? darkMode
                        ? "bg-[#0B0E1D]"
                        : "bg-[#F0F5FF]"
                      : darkMode
                      ? "bg-[#1A1F3D]"
                      : "bg-[#EAF1FF]"
                  }`}
                  onClick={() => (window.location.href = `/library/${lib.id}`)}
                >
                  <div className="w-full h-32 overflow-hidden rounded mb-2">
                    <img
                      src={
                        lib.image_url ||
                        "http://localhost:8000/static/default_library.png"
                      }
                      alt={lib.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold">{lib.title}</h3>
                  <p className="text-gray-400 dark:text-gray-300 text-xs">
                    {new Date(lib.created_at).toLocaleDateString()} by{" "}
                    {lib.user_name || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALL LIBRARIES SECTION */}
        {allLibraries.length > 0 && (
          <div className="mt-10">
            <h2
              className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-[#BDD63B]" : "text-[#0B0E1D]"
              }`}
            >
              ALL LIBRARIES
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allLibraries.map((lib) => (
                <div
                  key={lib.id}
                  className={`p-2 rounded-lg shadow transition-colors duration-300 ${
                    darkMode
                      ? "bg-[#1A1F3D] text-white"
                      : "bg-[#F0F5FF] text-[#0B0E1D]"
                  } text-sm`}
                >
                  <div className="w-full h-24 overflow-hidden rounded mb-2">
                    <img
                      src={
                        lib.image_url ||
                        "http://localhost:8000/static/default_library.png"
                      }
                      alt={lib.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold">{lib.title}</h3>
                  <p className="text-gray-400 dark:text-gray-300 text-xs">
                    {new Date(lib.created_at).toLocaleDateString()} by{" "}
                    {lib.user_name || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
