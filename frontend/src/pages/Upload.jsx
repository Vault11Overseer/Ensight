// frontend/src/pages/Upload.jsx

import React, { useState, useEffect } from "react";
import Header from "../components/module/Header";
import { API_BASE_URL } from "../services/api";
import defaultImage from "/default_album_image.png";
import { useUserData } from "../services/UserDataContext";

export default function Upload() {
  const { user: currentUser, darkMode, setDarkMode } = useUserData();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userTags, setUserTags] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [albums, setAlbums] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // Load user albums for selection
  // =========================
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/albums/`);
        const data = await res.json();
        setAlbums(
          Array.isArray(data)
            ? data.filter((a) => a.owner_user_id === currentUser?.id)
            : []
        );
      } catch (err) {
        console.error("Failed to fetch albums", err);
      }
    };
    if (currentUser) fetchAlbums();
  }, [currentUser]);

  // =========================
  // Image file selection & preview
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    const input = document.getElementById("image-input");
    if (input) input.value = "";
  };

  // =========================
  // Upload image handler
  // =========================
  const handleUpload = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) return alert("Title is required");
    if (!description.trim()) return alert("Description is required");
    if (!imageFile) return alert("Image file is required");
    if (!userTags.trim()) return alert("Please provide at least one tag");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", imageFile);
      formData.append("user_tags", userTags);
      formData.append("username", currentUser.username); // backend uses this to create folder
      if (albumId) formData.append("album_id", albumId);

      const res = await fetch(`${API_BASE_URL}/images/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload image");

      const newImage = await res.json();

      setRecentUploads([newImage, ...recentUploads]);
      // Reset form
      setTitle("");
      setDescription("");
      setImageFile(null);
      setImagePreview(null);
      setUserTags("");
      setAlbumId("");
      const input = document.getElementById("image-input");
      if (input) input.value = "";
    } catch (err) {
      console.error(err);
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Update existing image
  // =========================
  const handleUpdateImage = async (imageId, updates) => {
    try {
      const formData = new FormData();
      if (updates.title) formData.append("title", updates.title);
      if (updates.description) formData.append("description", updates.description);
      if (updates.user_tags !== undefined) formData.append("user_tags", updates.user_tags);
      if (updates.image_file) formData.append("image", updates.image_file);

      const res = await fetch(`${API_BASE_URL}/images/${imageId}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update image");

      const updated = await res.json();
      setRecentUploads((prev) =>
        prev.map((img) => (img.id === updated.id ? updated : img))
      );
    } catch (err) {
      console.error(err);
      alert(err.message || "Update failed");
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className={`min-h-screen p-8 transition-colors ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      {/* HEADER */}
      <Header
        navigationProps={{ toggleDarkMode: () => setDarkMode((prev) => !prev) }}
      />

      {/* UPLOAD FORM */}
      <section className="my-10 max-w-2xl">
        <form
          onSubmit={handleUpload}
          className={`p-6 rounded-2xl shadow space-y-4 ${darkMode ? "bg-[#BDD63B] text-black" : "bg-[#263248] text-white"}`}
        >
          <h2 className="text-xl font-semibold">Upload New Image</h2>

          <input
            type="text"
            placeholder="Image title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-black outline-none"
            required
          />

          <textarea
            placeholder="Description (required)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-black outline-none resize-none"
            rows={3}
            required
          />

          {/* User tags */}
          <input
            type="text"
            placeholder="Tags (comma-separated, at least one)"
            value={userTags}
            onChange={(e) => setUserTags(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-black outline-none"
            required
          />

          {/* Optional album */}
          <select
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-black outline-none"
          >
            <option value="">Add to Album (optional)</option>
            {albums.map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>

          {/* Image file */}
          <div className="space-y-2">
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-contain rounded-lg border-2 border-gray-300" />
                <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">Remove</button>
              </div>
            ) : (
              <label htmlFor="image-input" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${darkMode ? "border-gray-600 hover:border-gray-500 bg-gray-800" : "border-gray-300 hover:border-gray-400 bg-gray-50"}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-xl opacity-70">Click to upload or drag & drop</p>
                </div>
                <input id="image-input" type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
              </label>
            )}
          </div>

          <button type="submit" className={`px-6 py-2 rounded-full font-semibold ${darkMode ? "bg-[#263248] text-white hover:bg-[#122342]" : "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"}`}>
            Upload Image
          </button>
        </form>
      </section>

      {/* RECENT UPLOADS */}
      {recentUploads.length > 0 && (
        <section className="my-10 space-y-6">
          {recentUploads.map((img) => (
            <div key={img.id} className={`p-6 rounded-2xl shadow space-y-4 ${darkMode ? "bg-[#BDD63B] text-black" : "bg-[#263248] text-white"}`}>
              <h3 className="text-lg font-semibold">{img.title}</h3>
              <img src={img.preview_url || defaultImage} alt={img.title} className="w-full h-48 object-contain rounded-lg" />
              <p>{img.description}</p>
              <p className="opacity-70">Tags: {img.user_tags?.join(", ")}</p>
              <p className="opacity-70">Album: {img.album_title || "None"}</p>
              <p className="opacity-70">Uploaded: {new Date(img.created_at).toLocaleString()}</p>

              {/* Edit inline */}
              <button
                onClick={() => {
                  const newTitle = prompt("New title", img.title) || img.title;
                  const newDescription = prompt("New description", img.description) || img.description;
                  const newTags = prompt("Tags (comma-separated)", img.user_tags?.join(", ") || "") || "";
                  handleUpdateImage(img.id, {
                    title: newTitle,
                    description: newDescription,
                    user_tags: newTags
                  });
                }}
                className="px-4 py-1 rounded-full border border-white hover:bg-white hover:text-black transition"
              >
                Edit Info
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
