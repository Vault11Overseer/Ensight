import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Sun, Moon } from "lucide-react";

export default function Libraries() {
  const { user, logout } = useAuth();
  const [libraries, setLibraries] = useState([]);
  const [allLibraries, setAllLibraries] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [error, setError] = useState("");
  const [inlineEdits, setInlineEdits] = useState({});
  // 1. Initialize state from localStorage
// 1. Initialize state from localStorage
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

// 3. Toggle function
const toggleDarkMode = () => setDarkMode((prev) => !prev);






  const fetchMyLibraries = async () => {
    try {
      const res = await API.get("/libraries/mine");
      setLibraries(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const fetchAllLibraries = async () => {
    try {
      const res = await API.get("/libraries/");
      setAllLibraries(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

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
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.detail || "Failed to create library");
    }
  };

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

  const startEditingInline = (lib) => {
    setInlineEdits({
      id: lib.id,
      title: lib.title,
      description: lib.description,
    });
  };

  const handleInlineChange = (e) => {
    setInlineEdits({ ...inlineEdits, [e.target.name]: e.target.value });
  };

  const saveInlineEdits = async (libId) => {
    try {
      const payload = {
        title: inlineEdits.title,
        description: inlineEdits.description,
        image_base64: imageBase64 || null,
      };
      const res = await API.put(`/libraries/${libId}`, payload);
      setLibraries(libraries.map((lib) => (lib.id === libId ? res.data : lib)));
      setAllLibraries(allLibraries.map((lib) => (lib.id === libId ? res.data : lib)));
      setInlineEdits({});
      setImageFile(null);
      setImageBase64("");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.detail || "Failed to update library");
    }
  };

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

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">📚 Libraries</h1>
          <p className="text-gray-400">
            Welcome, {user?.first_name || user?.username || "User"} — You’ve created{" "}
            <span className="text-indigo-400">{libraries.length}</span> libraries
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => (window.location.href = "/")}
            className="group flex items-center space-x-2 hover:text-indigo-400 transition"
          >
            <ArrowLeft size={28} />
            <span className="hidden group-hover:inline">Back To Dashboard</span>
          </button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition ${
              darkMode
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-white text-black hover:bg-gray-200"
            }`}
            title="Toggle Light/Dark"
          >
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full bg-black p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-4">Create a New Library</h2>

          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <input
              className="p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              placeholder="Library Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="p-3 rounded bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              placeholder="Library Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="file"
              accept="image/*"
              className="p-2 rounded bg-gray-800 text-white"
              onChange={handleFileChange}
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg text-white">
              Create Library
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>

          {libraries.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Your Libraries</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {libraries.map((lib) => (
                  <div key={lib.id} className="bg-black p-2 rounded-lg shadow relative">
                    <img
                      src={lib.image_url || "/placeholder.png"}
                      alt={lib.title}
                      className="w-full h-32 object-cover rounded"
                    />

                    {inlineEdits.id === lib.id ? (
                      <div className="absolute top-2 left-2 right-2 bg-black/80 p-2 rounded">
                        <input
                          className="p-1 mb-1 rounded w-full text-white bg-gray-800"
                          name="title"
                          value={inlineEdits.title}
                          onChange={handleInlineChange}
                        />
                        <textarea
                          className="p-1 mb-1 rounded w-full text-white bg-gray-800"
                          name="description"
                          value={inlineEdits.description}
                          onChange={handleInlineChange}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="p-1 mb-2 rounded w-full bg-gray-800 text-white"
                          onChange={handleFileChange}
                        />
                        <div className="flex gap-2">
                          <button
                            className="bg-green-600 hover:bg-green-700 p-1 rounded text-sm"
                            onClick={() => saveInlineEdits(lib.id)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-600 hover:bg-gray-700 p-1 rounded text-sm"
                            onClick={() => setInlineEdits({})}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black/60 p-1 rounded">
                        <div>
                          <h2 className="font-bold text-white">{lib.title}</h2>
                          <p className="text-gray-400 text-sm">{lib.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 p-1 rounded text-sm text-black"
                            onClick={() => startEditingInline(lib)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 p-1 rounded text-sm"
                            onClick={() => handleDelete(lib.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ALL LIBRARIES GRID */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-white">All Libraries</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allLibraries.map((lib) => (
          <div key={lib.id} className="bg-black p-2 rounded-lg shadow text-sm">
            <div className="w-full h-24 overflow-hidden rounded">
              <img
                src={lib.image_url || "/placeholder.png"}
                alt={lib.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold text-white">{lib.title}</h3>
            <p className="text-gray-400 text-xs">
              {new Date(lib.created_at).toLocaleDateString()} by {lib.user_name || "Unknown"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
