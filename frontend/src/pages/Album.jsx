import React, { useEffect, useState } from "react";
import Header from "../components/module/Header";
import AlbumCard from "../components/module/AlbumCard";
import { API_BASE_URL } from "../services/api";
import { useNavigate } from "react-router-dom";
import { LibraryBig } from "lucide-react";
import defaultAlbumImage from "/default_album_image.png";
import { useUserData } from "../services/UserDataContext";

export default function Albums() {
  // =========================
  // STATE
  // =========================
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  const { user: currentUser, darkMode, setDarkMode } = useUserData();
  const navigate = useNavigate();

  // =========================
  // EFFECTS
  // =========================

  
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/albums/`);
        const data = await res.json();
        setAlbums(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching albums:", err);
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  // =========================
  // HELPERS
  // =========================
  const canEdit = (album) =>
    album.owner_user_id === currentUser?.id ||
    currentUser?.role === "admin";

  const handleOpenAlbum = (album) => {
    navigate(`/albums/${album.id}`);
  };

  const handleDeleteAlbum = async (album) => {
    if (!window.confirm(`Delete "${album.title}"?`)) return;

    try {
      await fetch(`${API_BASE_URL}/albums/${album.id}`, {
        method: "DELETE",
      });

      setAlbums((prev) => prev.filter((a) => a.id !== album.id));
    } catch (err) {
      console.error("Error deleting album:", err);
      alert("Failed to delete album.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setCoverImage(null);
      setCoverImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById("cover-image-input");
    if (fileInput) fileInput.value = "";
  };

  // =========================
  // CREATE ALBUM
  // =========================
  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (description) {
        formData.append("description", description);
      }

      // Only append image if user selected one
      // Backend will use default image if none is provided
      if (coverImage) {
        formData.append("default_image", coverImage);
      }

      const res = await fetch(`${API_BASE_URL}/albums/`, {
        method: "POST",
        body: formData, // multipart/form-data
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: "Failed to create album" }));
        throw new Error(error.detail || "Failed to create album");
      }

      const newAlbum = await res.json();
      setAlbums((prev) => [newAlbum, ...prev]);

      // Reset form
      setTitle("");
      setDescription("");
      setCoverImage(null);
      setCoverImagePreview(null);
      const fileInput = document.getElementById("cover-image-input");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create album.");
    }
  };

  if (loading) return <p className="p-8">Loading albums…</p>;

  console.log(albums)
  // =========================
  // RENDER
  // =========================
  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* HEADER */}
      <Header
        navigationProps={{
          toggleDarkMode: () => setDarkMode((prev) => !prev),
        }}
      />

      {/* PAGE HEADER */}
      <div className="flex items-center gap-2 mt-10 mb-6">
        <LibraryBig size={32} />
        <h1 className="text-4xl font-semibold">Albums</h1>
        <p className="text-1xl opacity-80 mt-2">
          Manage your personal albums.
        </p>
      </div>

      {/* CREATE ALBUM FORM */}
      <section className="my-10 max-w-2xl">
        <form
          onSubmit={handleCreateAlbum}
          className={`p-6 rounded-2xl shadow space-y-4 ${
            darkMode
              ? "bg-[#BDD63B] text-black"
              : "bg-[#263248] text-white"
          }`}
        >
          <h2 className="text-xl font-semibold">Create New Album</h2>

          <input
            type="text"
            placeholder="Album title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-black outline-none"
            required
          />

          <textarea
            placeholder="Album description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-black outline-none resize-none"
            rows={3}
          />

          {/* COVER IMAGE UPLOAD */}
          <div className="space-y-2">
            <p className="block text-l font-medium">
              Album Cover Image (optional)
            </p>
            <p className="text-l opacity-70">
              {coverImage
                ? "Custom image selected. Click 'Remove' to use default image."
                : "If no image is selected, the default album image will be used."}
            </p>

            {coverImagePreview ? (
              <div className="relative">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-48 object-contain rounded-lg border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="relative">
                <label
                  htmlFor="cover-image-input"
                  className={`flex flex-col bg-white text-black items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition ${
                    darkMode
                      ? "border-gray-600 hover:border-gray-500 bg-gray-800"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-2 opacity-50 "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-xl opacity-70">
                      <span className="font-semibold ">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-bold text-black opacity-50 ">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <input
                    id="cover-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {!coverImage && (
                  <div className="mt-2 p-2 text-l bg-white text-black rounded-lg opacity-60 text-center">
                    Default image preview:
                    <img
                      src={defaultAlbumImage}
                      alt="Default album"
                      className="mt-2 w-full p-2 h-24 object-contain rounded border-12"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className={` px-6 py-2 rounded-full font-semibold transition ${
              darkMode
                ? "bg-[#263248] text-white hover:bg-[#122342]"
                : "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
            }`}
          >
            Create Album
          </button>
        </form>
      </section>

      {/* YOUR ALBUMS */}
      <section className="my-10">
        <h2 className="text-2xl font-semibold mb-6">Your Albums</h2>

        {albums.filter((a) => a.owner_user_id === currentUser?.id).length ===
        0 ? (
          <p className="opacity-70">No Albums uploaded as of yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
            {albums
              .filter((a) => a.owner_user_id === currentUser?.id)
              .map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  canEdit={canEdit(album)}
                  onOpen={handleOpenAlbum}
                  onDelete={handleDeleteAlbum}
                  darkMode={darkMode}
                />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
