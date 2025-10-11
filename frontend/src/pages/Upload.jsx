import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Sun, Moon } from "lucide-react";

export default function Upload() {
  const { user, logout } = useAuth();

  // Dark mode state
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

  // Form state
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [libraryId, setLibraryId] = useState("");

  // Libraries dropdown
  const [libraries, setLibraries] = useState([]);
  const [error, setError] = useState("");

  // User's images
  const [myImages, setMyImages] = useState([]);

  // Fetch user's images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await API.get("/images/mine");
        setMyImages(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    fetchImages();
  }, []);

  // Fetch libraries
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const res = await API.get("/libraries/mine");
        setLibraries(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    fetchLibraries();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await API.post("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { id, url } = uploadRes.data;
      setImageUrl(url);

      await API.post(`/images/${id}/metadata`, {
        title,
        description,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        library_id: libraryId || null,
      });

      // Add new image to state so image count updates
      setMyImages(prev => [...prev, { id, url, title, description, library_id: libraryId }]);

      alert("Upload + metadata saved successfully!");
      setFile(null);
      setTitle("");
      setDescription("");
      setTags("");
      setLibraryId("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Upload failed");
    }
  };

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">🖼️ Upload</h1>
          <p className="text-gray-400">
            Welcome, {user?.first_name || user?.username || "User"}
          </p>
          <p className={`mt-1 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
            You have <span className="text-indigo-400">{libraries.length}</span> libraries
          </p>
          <p className={`mt-1 ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
            You have uploaded <span className="text-indigo-400">{myImages.length}</span> images
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="group flex items-center space-x-2 p-2 rounded-full border-2 border-green-500 hover:bg-green-500/20 transition"
          >
            <ArrowLeft size={28} />
            <span className="hidden group-hover:inline">Back To Dashboard</span>
          </button>

          <button
            onClick={logout}
            className="text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition ${
              darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>

      {/* UPLOAD FORM */}
      <div className="w-full bg-gray-100 dark:bg-gray-900 p-6 rounded-2xl shadow transition-colors duration-300">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Upload a New Image
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black dark:text-white"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 rounded bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black dark:text-white"
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="p-3 rounded bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black dark:text-white"
          />
          <select
            value={libraryId}
            onChange={(e) => setLibraryId(e.target.value)}
            className="p-3 rounded bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black dark:text-white"
          >
            <option value="">-- None --</option>
            {libraries.map((lib) => (
              <option key={lib.id} value={lib.id}>
                {lib.title || lib.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={handleFileChange}
            className="p-2 rounded bg-gray-800 text-white"
          />
          <button
            onClick={handleUpload}
            className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg text-white"
          >
            Upload
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {imageUrl && (
            <div className="mt-8">
              <p className="font-semibold mb-2">Uploaded Image Preview:</p>
              <img src={imageUrl} alt="uploaded" className="rounded-lg shadow-lg" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
