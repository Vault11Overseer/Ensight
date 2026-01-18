// frontend/src/pages/Personal.jsx

// PERSONAL PAGE COMPONENT - SHOWS USER'S IMAGES, SEARCH, EDIT & DELETE
// THIS FILE RENDERS THE PERSONAL PAGE (HEADER + SEARCH + GRID OF IMAGES BELONGING TO THE SIGNED-IN USER).
// IT ALSO PROVIDES VIEW, EDIT, DELETE ACTIONS FOR EACH IMAGE (EDIT OPENS AN INLINE EDIT FORM / DELETE CALLS THE BACKEND).
// KEEPING THE SAME DARK/LIGHT COLOR SCHEME AS OTHER PAGES (DARK BLUE / HOT GREEN ACCENT).

// =========================
// AUTH CONTEXT
// =========================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../OLDFILES/frontend_old/src/context/AuthContext";
import API from "../../../OLDFILES/frontend_old/src/api/axios";
import Header from "../../../OLDFILES/frontend_old/src/components/module/Header";
import { Edit2, Trash2, Eye } from "lucide-react";

// =========================
// PERSONAL MODULE
// =========================
export default function Personal() {
  // GET AUTH CONTEXT (PROVIDES user, token, logout)

  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  // PAGE STATE
  const [images, setImages] = useState([]); // USER IMAGES FROM /images/mine
  const [searchQuery, setSearchQuery] = useState(""); // SEARCH INPUT
  const [darkMode, setDarkMode] = useState(() => {
    // LOAD THEME FROM LOCALSTORAGE OR DEFAULT TO TRUE
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true;
  });

  // EDIT MODAL / INLINE EDIT STATE
  const [editingImage, setEditingImage] = useState(null); // IMAGE OBJECT WE ARE EDITING
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editLibraryId, setEditLibraryId] = useState("");
  const [libraries, setLibraries] = useState([]); // USER LIBRARIES FOR SELECT
  const [loading, setLoading] = useState(false); // GENERIC LOADING FLAG
  const [error, setError] = useState("");

  // =========================
  // AUTH CONTEXT
  // =========================
  // SYNC DARK MODE CLASS ON <html>
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // FETCH USER IMAGES (DERIVED FROM JWT)
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await API.get("/images/mine", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setImages(res.data || []);
      } catch (err) {
        console.error("FETCH IMAGES ERROR", err);
        setError(err.response?.data || err.message || "Failed to fetch images");
      }
    };

    const fetchLibraries = async () => {
      try {
        const res = await API.get("/libraries/mine", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setLibraries(res.data || []);
      } catch (err) {
        console.error("FETCH LIBRARIES ERROR", err);
      }
    };

    fetchImages();
    fetchLibraries();
  }, [token]);

  // FILTERED IMAGES BASED ON SEARCH QUERY
  const filteredImages = images.filter((img) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (img.title || "").toLowerCase().includes(q) ||
      (img.description || "").toLowerCase().includes(q) ||
      (Array.isArray(img.tags) &&
        img.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  // NAVIGATE TO IMAGE DETAIL VIEW
  const handleView = (img) => {
    navigate(`/images/${img.id}`);
  };
  // OPEN EDIT PANEL AND POPULATE FIELDS
  const handleOpenEdit = (img) => {
    setEditingImage(img);
    setEditTitle(img.title || "");
    setEditDescription(img.description || "");
    setEditTags(Array.isArray(img.tags) ? img.tags.join(", ") : img.tags || "");
    setEditLibraryId(img.library_id || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // SAVE EDITS (PUT /images/{id}/metadata)
  const handleSaveEdit = async () => {
    if (!editingImage) return;
    setLoading(true);
    try {
      const tagsArray = editTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await API.put(
        `/images/${editingImage.id}/metadata`,
        {
          title: editTitle,
          description: editDescription,
          tags: tagsArray,
          library_id: editLibraryId || null,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // UPDATE LOCAL UI COPY
      setImages((prev) =>
        prev.map((im) =>
          im.id === editingImage.id
            ? {
                ...im,
                title: editTitle,
                description: editDescription,
                tags: tagsArray,
                library_id: editLibraryId || null,
              }
            : im
        )
      );

      // IF LAST-UPLOAD OR PERSISTENT UI ITEMS EXIST, UPDATE THEM AS NEEDED (NOT REMOVED)
      setEditingImage(null);
      setEditTitle("");
      setEditDescription("");
      setEditTags("");
      setEditLibraryId("");
    } catch (err) {
      console.error("SAVE EDIT ERROR", err);
      setError(err.response?.data || err.message || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  // DELETE IMAGE (ASK CONFIRM, CALL BACKEND, THEN REMOVE FROM UI)
  const handleDelete = async (img) => {
    if (!img) return;
    const ok = window.confirm(
      "Are you sure you want to delete this image? This cannot be undone."
    );
    if (!ok) return;
    setLoading(true);
    try {
      await API.delete(`/images/${img.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // Remove from UI
      setImages((prev) => prev.filter((i) => i.id !== img.id));

      // Clear lastUpload if it matches
      try {
        const last = JSON.parse(localStorage.getItem("lastUpload"));
        if (last && last.id === img.id) localStorage.removeItem("lastUpload");
      } catch {}
    } catch (err) {
      console.error("DELETE ERROR", err);
      setError(err.response?.data || err.message || "Failed to delete image");
    } finally {
      setLoading(false);
    }
  };

  // SMALL UI FOR LIBRARY TITLE LOOKUP (OPTIONAL)
  const libraryTitleById = (id) => {
    const lib = libraries.find((l) => String(l.id) === String(id));
    return lib ? lib.title || lib.name : "None";
  };

  // TAILWINDS DARK / LIGHT THEME WRAPPER
  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-[#0B0E1D] text-white" : "bg-[#EAF1FF] text-black"
      }`}
    >
      {/* HEADER SECTION */}
      <Header
        introProps={{
          user,
          imagesCount: images.length,
          librariesCount: libraries.length,
          darkMode,
        }}
        navigationProps={{
          darkMode,
          toggleDarkMode: () => setDarkMode((p) => !p),
          logout,
        }}
      />

      {/* PAGE TITLE */}
      <div id="pageTitle">
        <h2
          className={`text-2xl font-bold mb-4 ${
            darkMode ? "text-[#BDD63B]" : "text-[#263248]"
          }`}
        >
          Personal Uploads
        </h2>
        <p
          className={`text-1xl font-bold mb-4 ${
            darkMode ? "text-[#BDD63B]" : "text-[#263248]"
          }`}
        >
          Search... view, edit, and delete all your person uploaded images here.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="mt-6 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your images by title, description, tages, and more..."
          className={`flex-1 p-3 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              : "bg-gray-100 border-gray-300 text-black placeholder-gray-500"
          }`}
        />
      </div>

      {/* MY IMAGES */}
      {editingImage && (
        <div
          className={`w-full max-w-2xl mx-auto p-6 rounded-2xl shadow transition-colors duration-300 mb-6 ${
            darkMode ? "bg-[#1A1F3D]" : "bg-white"
          }`}
        >
          <h3 className="text-xl font-semibold mb-3">Edit Image</h3>

          <div className="flex flex-col gap-3">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
                darkMode ? "bg-[#0B0E1D] text-white" : "bg-[#F3F7FF] text-black"
              }`}
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
              className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
                darkMode ? "bg-[#0B0E1D] text-white" : "bg-[#F3F7FF] text-black"
              }`}
            />
            <input
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
              placeholder="Tags (comma-separated)"
              className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
                darkMode ? "bg-[#0B0E1D] text-white" : "bg-[#F3F7FF] text-black"
              }`}
            />
            <select
              value={editLibraryId}
              onChange={(e) => setEditLibraryId(e.target.value)}
              className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
                darkMode ? "bg-[#0B0E1D] text-white" : "bg-[#F3F7FF] text-black"
              }`}
            >
              <option value="">-- None --</option>
              {libraries.map((lib) => (
                <option key={lib.id} value={lib.id}>
                  {lib.title || lib.name}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={handleSaveEdit}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#BDD63B] text-black font-semibold"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setEditingImage(null)}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white"
              >
                Cancel
              </button>
            </div>
            {error && <p className="text-red-500">{String(error)}</p>}
          </div>
        </div>
      )}

      {/* IMAGES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500">
            You have no images yet.
          </div>
        ) : (
          filteredImages.map((img) => (
            <div
              key={img.id}
              className={`relative p-3 rounded-lg shadow transition overflow-hidden ${
                darkMode ? "bg-[#0B0E1D] text-white" : "bg-[#F7FAFF] text-black"
              }`}
            >
              <div
                className="overflow-hidden rounded-md cursor-pointer"
                onClick={() => handleView(img)}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-48 object-cover rounded-md transition-transform transform hover:scale-105"
                />
              </div>

              <h4 className=" text-center mt-3 font-semibold">
                {img.title || "Untitled"}
              </h4>
              {/* IMAGE BUTTON NAV */}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleView(img)}
                  className="w-3/4 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-transparent border border-gray-600 hover:bg-gray-700/30"
                  title="View"
                >
                  <Eye size={20} />
                  <span>OR</span>
                  <Edit2 size={20} />
                </button>

                <button
                  onClick={() => handleDelete(img)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FULL WIDTH LINK TO PERSONAL PAGE "EDIT ALL YOUR PERSONAL IMAGES" */}
      {/* <div className="mt-8">
        <button
          onClick={() => navigate("/Personal")}
          className={`w-full p-3 rounded-lg font-semibold transition ${
            darkMode ? "bg-[#BDD63B] text-black" : "bg-[#1E3A8A] text-white"
          }`}
        >
          Edit all your personal images
        </button>
      </div> */}
    </div>
  );
}
