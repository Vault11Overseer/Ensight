// frontend/src/components/page/ImageDetail.jsx

// =========================
// IMAGE DETAIL
// =========================

// =========================
// IMPORTS
// =========================
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import API from "../../services/api";
// import { useAuth } from "../../context/AuthContext";
import Header from "../../components/module/Header";
import { Link } from "react-router-dom";


// =========================
// IMAGE DETAIL COMPONENT
// =========================
export default function ImageDetail() {
  const { id } = useParams();
  const { user, token, logout } = useAuth();
  const [image, setImage] = useState(null);

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
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // =========================
  // FETCH IMAGE
  // =========================
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await API.get(`/images/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setImage(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    fetchImage();
  }, [id, token]);

  // =========================
  // FORM STATE VARIABLES
  // =========================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [libraryId, setLibraryId] = useState("");
  const [libraries, setLibraries] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =========================
  // POPULATE FROM WHEN IMAGE LOADS
  // =========================
  useEffect(() => {
    if (image) {
      setTitle(image.title || "");
      setDescription(image.description || "");
      setTags(image.tags?.join(", ") || "");
      setLibraryId(image.libraryId || "");
    }
  }, [image]);

  // =========================
  // FETCH USER'S LIBRARIES
  // =========================
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const res = await API.get("/libraries/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLibraries(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    fetchLibraries();
  }, [token]);

  // =========================
  // HANDLE FORM SUBMIT
  // =========================
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const metadata = {
        title,
        description,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        library_id: libraryId ? parseInt(libraryId) : null,
      };

      await API.post(`/images/${id}/metadata`, metadata, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setImage({ ...image, ...metadata, tags: metadata.tags });
      setSuccess("Image updated successfully!");
      setError("");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || err.message);
      setSuccess("");
    }
  };

  if (!image) return <p className="text-center mt-10">Loading...</p>;

  // =========================
  // RETURN
  // =========================
  return (
    // =========================
    // DARK / LIGHT THEME
    // =========================
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* =========================
          HEADER
      ========================= */}
      <Header
        introProps={{
          user: user,
          imagesCount: 1,
          librariesCount: libraries.length,
          darkMode: darkMode,
        }}
        navigationProps={{
          darkMode: darkMode,
          toggleDarkMode: toggleDarkMode,
          logout: logout,
        }}
      />

      {/* =========================
          IMAGE INFO + PREVIEW
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div
          className={`p-4 rounded-lg shadow-lg ${
            darkMode ? "bg-[#263248]" : "bg-[#F7FAFF]"
          }`}
        >
          <h3 className="text-xl font-bold mb-4">{image.title || "N/A"}</h3>
          <p className="mb-2">
            <strong>Description:</strong> {image.description || "N/A"}
          </p>
          {image.tags && image.tags.length > 0 && (
            <p className="mb-2">
              <strong>Tags:</strong> {image.tags.join(", ")}
            </p>
          )}
          <p className="mb-2">
            <strong>Library:</strong> {image.library || "N/A"}
          </p>
          <p className="mb-2">
            <strong>File Name:</strong> {image.fileName || "N/A"}
          </p>
          <p className="mb-2">
            <strong>File Size:</strong> {image.fileSize || "N/A"}
          </p>
          <p className="mb-2">
            <strong>File Type:</strong> {image.fileType || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Uploaded URL:</strong>{" "}
            <Link
              to={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline ${
                darkMode ? "text-green-400" : "text-blue-700"
              }`}
            >
              {image.url}
            </Link>
          </p>
          <p className="mb-2">
            <strong>Uploaded At:</strong> {image.uploadedAt || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Uploaded By:</strong> {image.uploadedBy || "N/A"}
          </p>
        </div>

        <div className="flex justify-center items-center">
          <img
            src={image.url}
            alt={image.title}
            className="w-full max-h-[600px] object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* =========================
          IMAGE UPDATE FORM
      ========================= */}
      <div
        className={`mt-10 p-6 rounded-lg shadow-lg transition-colors duration-300 ${
          darkMode ? "bg-[#0B0E1D]" : "bg-[#F7FAFF]"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">Update Image Information</h2>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <label className="font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
              darkMode
                ? "bg-[#0B0E1D] text-white placeholder-gray-400"
                : "bg-[#DDE7FF] text-[#0B0E1D] placeholder-gray-500"
            }`}
          />

          <label className="font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
              darkMode
                ? "bg-[#0B0E1D] text-white placeholder-gray-400"
                : "bg-[#DDE7FF] text-[#0B0E1D] placeholder-gray-500"
            }`}
          />

          <label className="font-semibold">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
              darkMode
                ? "bg-[#0B0E1D] text-white placeholder-gray-400"
                : "bg-[#DDE7FF] text-[#0B0E1D] placeholder-gray-500"
            }`}
          />

          <label className="font-semibold">Library</label>
          <select
            value={libraryId}
            onChange={(e) => setLibraryId(e.target.value)}
            className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
              darkMode
                ? "bg-[#0B0E1D] text-white"
                : "bg-[#DDE7FF] text-[#0B0E1D]"
            }`}
          >
            <option value="">-- None --</option>
            {libraries.map((lib) => (
              <option key={lib.id} value={lib.id}>
                {lib.title || lib.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="mt-4 px-5 py-3 rounded-md bg-[#BDD63B] text-black font-semibold hover:bg-[#AACC2B] transition"
          >
            Update
          </button>

          {success && <p className="text-green-400 mt-2">{success}</p>}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
