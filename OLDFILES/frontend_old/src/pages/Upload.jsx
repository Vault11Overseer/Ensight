// frontend/src/pages/Upload.jsx

// =========================
// IMPORTS
// =========================
import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Header from "../components/module/Header"; // ✅ IMPORT SHARED HEADER COMPONENT

export default function Upload() {
  // =========================
  // AUTH CONTEXT
  // =========================
  const { user, logout } = useAuth();

  // =========================
  // DARK MODE STATE MANAGEMENT
  // =========================
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true;
  });

  useEffect(() => {
    // console.log(user);

    // ADD OR REMOVE DARK CLASS ON HTML
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    // SAVE CURRENT MODE TO LOCALSTORAGE
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // =========================
  // FORM STATE VARIABLES
  // =========================
  const [file, setFile] = useState(null); // SELECTED FILE
  const [imageUrl, setImageUrl] = useState(null); // UPLOADED IMAGE URL
  const [title, setTitle] = useState(""); // IMAGE TITLE
  const [description, setDescription] = useState(""); // IMAGE DESCRIPTION
  const [tags, setTags] = useState(""); // IMAGE TAGS
  const [libraryId, setLibraryId] = useState(""); // SELECTED LIBRARY
  const [success, setSuccess] = useState(""); // SUCCESS MESSAGE
  const [libraries, setLibraries] = useState([]); // USER LIBRARIES
  const [error, setError] = useState(""); // ERROR MESSAGE
  const [validatingLastUpload, setValidatingLastUpload] = useState(false);
  const [imageExists, setImageExists] = useState(true); // assume true until validated

  // LAST UPLOAD
  const [lastUpload, setLastUpload] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("lastUpload")) || null;
    }
    return null;
  });

  // =========================
  // VALIDATE LASTUPLOAD AGAINST BACKEND
  // =========================
  // validate lastUpload against backend (if present). If image was removed from DB/S3, drop it.
  useEffect(() => {
    const validateLast = async () => {
      if (!lastUpload || !lastUpload.id) {
        setImageExists(false);
        return;
      }

      setValidatingLastUpload(true);
      try {
        // Try to fetch the image by id from backend
        await API.get(`/images/${lastUpload.id}`);
        // If success, image exists
        setImageExists(true);
      } catch (err) {
        // If any error (404 etc.), clear stale lastUpload
        console.warn(
          "lastUpload validation failed, clearing local lastUpload:",
          err?.response?.data || err.message
        );
        setLastUpload(null);
        localStorage.removeItem("lastUpload");
        setImageExists(false);
      } finally {
        setValidatingLastUpload(false);
      }
    };

    validateLast();
  }, [lastUpload]);

  // EDIT MODE STATE
  const [isEditing, setIsEditing] = useState(false); // TOGGLE EDIT FORM

  // =========================
  // FETCH USER'S LIBRARIES
  // =========================
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

  // =========================
  // HANDLE FILE SELECTION
  // =========================
  const handleFileChange = (e) => setFile(e.target.files[0]);

  // =========================
  // HANDLE FILE UPLOAD + METADATA
  // =========================
  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      // Only append library_id if it's set
      if (libraryId) formData.append("library_id", parseInt(libraryId));

      // UPLOAD FILE
      const uploadRes = await API.post("/images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { id, url } = uploadRes.data;
      setImageUrl(url);

      // =========================
      // PREPARE UPLOADED DATA
      // =========================
      const selectedLibrary = libraries.find((lib) => lib.id === libraryId);
      const uploadedData = {
        id,
        title,
        description,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        library: selectedLibrary
          ? selectedLibrary.title || selectedLibrary.name
          : "None",
        libraryId: libraryId || "",
        fileName: file?.name || "N/A",
        fileSize: file ? (file.size / 1024).toFixed(2) + " KB" : "N/A",
        fileType: file?.type || "N/A",
        url,
        uploadedAt: new Date().toLocaleString(),
        uploadedBy:
          user?.first_name && user?.last_name
            ? `${user.first_name} ${user.last_name}`
            : user?.name || "Unknown",
      };
      setLastUpload(uploadedData);
      localStorage.setItem("lastUpload", JSON.stringify(uploadedData));

      // =========================
      // PREPARE METADATA OBJECT
      // =========================
      const metadata = {
        title,
        description,
        tags: uploadedData.tags,
        library_id: libraryId ? parseInt(libraryId) : null,
      };

      // =========================
      // SAVE METADATA
      // =========================
      await API.post(`/images/${id}/metadata`, metadata);

      await API.post(`/images/${id}/metadata`, metadata);

      // RESET FORM
      setSuccess("Upload + metadata saved successfully!");
      setError("");
      setFile(null);
      setTitle("");
      setDescription("");
      setTags("");
      setLibraryId("");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || err.message);
      setSuccess("");
    }
  };

  // =========================
  // HANDLE DELETE LAST UPLOAD
  // =========================
  const handleDelete = async () => {
    if (!lastUpload) return;
    try {
      await API.delete(`/images/${lastUpload.id}`);
      setLastUpload(null);
      localStorage.removeItem("lastUpload");
      setSuccess("Image deleted successfully!");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  };

  // =========================
  // HANDLE EDIT SAVE
  // =========================
  const handleEditSave = async () => {
    if (!lastUpload) return;
    try {
      const selectedLibrary = libraries.find((lib) => lib.id === libraryId);
      const updatedData = {
        ...lastUpload,
        title,
        description,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        library: selectedLibrary
          ? selectedLibrary.title || selectedLibrary.name
          : "None",
        libraryId: libraryId || "",
      };

      // SAVE TO BACKEND
      await API.put(`/images/${lastUpload.id}/metadata`, {
        title: updatedData.title,
        description: updatedData.description,
        tags: updatedData.tags,
        library_id: updatedData.libraryId || null,
      });

      setLastUpload(updatedData);
      localStorage.setItem("lastUpload", JSON.stringify(updatedData));
      setIsEditing(false);
      setSuccess("Changes saved successfully!");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  };

  // =========================
  // POPULATE FORM FIELDS FOR EDIT
  // =========================
  const handleEdit = () => {
    if (!lastUpload) return;
    setTitle(lastUpload.title);
    setDescription(lastUpload.description);
    setTags(lastUpload.tags.join(", "));
    setLibraryId(lastUpload.libraryId || "");
    setIsEditing(true);
    // ✅ DO NOT TOUCH lastUpload.id
  };

  // =========================
  // RENDER COMPONENT
  // =========================
  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-[#0B0E1D] text-white" : "bg-[#EAF1FF] text-black"
      }`}
    >
      {/* ✅ HEADER COMPONENT */}
      <Header
        introProps={{
          user: user,
          imagesCount: imageUrl ? 1 : 0,
          librariesCount: libraries.length,
          darkMode: darkMode,
        }}
        navigationProps={{
          darkMode: darkMode,
          toggleDarkMode: toggleDarkMode,
          logout: logout,
        }}
      />

      {/* UPLOAD FORM */}
      <div className="w-full bg-gray-100 dark:bg-gray-900 p-6 rounded-2xl shadow transition-colors duration-300 mt-10">
        <h2
          className={`text-2xl font-bold mb-4 ${
            darkMode ? "text-[#BDD63B]" : "text-[#BDD63B]"
          }`}
        >
          UPLOAD A NEW IMAGE
        </h2>

        <div className="flex flex-col gap-4">
          {/* TITLE INPUT */}
          <label htmlFor="Title" className="mb-1 font-semibold text-white">
            Title
          </label>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
              darkMode
                ? "bg-[#0B0E1D] text-white placeholder-gray-400"
                : "bg-[#DDE7FF] text-[#0B0E1D] placeholder-gray-500"
            }`}
          />
          {/* DESCRIPTION INPUT */}
          <label
            htmlFor="description"
            className="mb-1 font-semibold text-white"
          >
            Description
          </label>
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
              darkMode
                ? "bg-[#0B0E1D] text-white placeholder-gray-400"
                : "bg-[#DDE7FF] text-[#0B0E1D] placeholder-gray-500"
            }`}
          />
          {/* TAGS INPUT */}
          <label htmlFor="tags" className="mb-1 font-semibold text-white">
            Tags - (Comma,Seperated)
          </label>
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
              darkMode
                ? "bg-[#0B0E1D] text-white placeholder-gray-400"
                : "bg-[#DDE7FF] text-[#0B0E1D] placeholder-gray-500"
            }`}
          />
          {/* LIBRARY SELECT */}
          <label htmlFor="library" className="mb-1 font-semibold text-white">
            Library - (None is default)
          </label>
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
          {/* FILE INPUT */}
          <label htmlFor="file" className="mb-1 font-semibold text-white">
            Image Upload - (jpg, jpeg, png, svg) - (Max file size = "5 Gigs")
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
              darkMode
                ? "bg-[#0B0E1D] text-white"
                : "bg-[#DDE7FF] text-[#0B0E1D]"
            }`}
          />
          {/* UPLOAD BUTTON */}
          <button
            onClick={isEditing ? handleEditSave : handleUpload} // SAVE EDITS OR UPLOAD NEW
            className="bg-[#BDD63B] hover:bg-[#A4C22F] p-3 rounded-lg text-black font-semibold transition-colors duration-300"
          >
            {isEditing ? "Save Changes" : "Upload"}
          </button>
          {/* ERROR + SUCCESS MESSAGES */}
          {error && (
            <p className="text-red-500">
              {typeof error === "string"
                ? error
                : JSON.stringify(error, null, 2)}
            </p>
          )}
          {success && <p className="text-green-500">{success}</p>}
          {/* =========================
      LAST UPLOADED IMAGE SECTION
========================= */}
          <h2
            className={`text-2xl font-bold mb-0 mt-10 ${
              darkMode ? "text-[#BDD63B]" : "text-[#BDD63B]"
            }`}
          >
            MOST RECENT UPLOAD
          </h2>
          {
            /* If we're validating, show a small loading state */
            validatingLastUpload ? (
              <div className="p-6 mt-4 rounded-xl text-center shadow-lg">
                <p className="text-gray-400">Checking recent upload…</p>
              </div>
            ) : imageExists && lastUpload ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT COLUMN: IMAGE INFORMATION */}
                <div
                  className={`p-4 rounded-lg shadow-lg ${
                    darkMode
                      ? "bg-[#0B0E1D] text-white"
                      : "bg-[#F7FAFF] text-black"
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-4">
                    <strong>Title:</strong> {lastUpload.title || "N/A"}
                  </h3>
                  <p>
                    <strong>Description:</strong>{" "}
                    {lastUpload.description || "N/A"}
                  </p>
                  <p>
                    <strong>Tags:</strong>{" "}
                    {Array.isArray(lastUpload.tags) && lastUpload.tags.length
                      ? lastUpload.tags.join(", ")
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Library:</strong> {lastUpload.library || "N/A"}
                  </p>
                  <p>
                    <strong>File Name:</strong> {lastUpload.fileName || "N/A"}
                  </p>
                  <p>
                    <strong>File Size:</strong> {lastUpload.fileSize || "N/A"}
                  </p>
                  <p>
                    <strong>File Type:</strong> {lastUpload.fileType || "N/A"}
                  </p>
                  <p>
                    <strong>Uploaded URL:</strong>{" "}
                    {lastUpload.url ? (
                      <a
                        href={lastUpload.url}
                        className={`underline ${
                          darkMode ? "text-[#BDD63B]" : "text-[#263248]"
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {lastUpload.url}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                  <p>
                    <strong>Uploaded At:</strong>{" "}
                    {lastUpload.uploadedAt || "N/A"}
                  </p>
                  <p>
                    <strong>Uploaded By:</strong>{" "}
                    {lastUpload.uploadedBy || "N/A"}
                  </p>
                </div>

                {/* RIGHT COLUMN: IMAGE PREVIEW + BUTTONS */}
                <div className="flex flex-col items-center justify-center gap-4">
                  <img
                    src={
                      lastUpload.url ||
                      "https://via.placeholder.com/600x400?text=No+Image+Available"
                    }
                    alt={lastUpload.title || "default-image"}
                    className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
                  />
                </div>
              </div>
            ) : (
              <div
                className={`p-6 mt-4 rounded-xl text-center shadow-lg ${
                  darkMode
                    ? "bg-[#0B0E1D] text-white"
                    : "bg-[#F7FAFF] text-black"
                }`}
              >
                <img
                  src="https://via.placeholder.com/600x400?text=No+Recent+Uploads"
                  // alt="no-upload"
                  className="mx-auto mb-4 rounded-lg shadow-lg"
                />
                <p className="text-lg font-semibold text-gray-400">
                  No recent uploads found.
                </p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
