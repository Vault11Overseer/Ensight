// frontend/src/pages/AlbumView.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/module/Header";
import { API_BASE_URL } from "../../services/api";
import defaultAlbumImage from "/default_album_image.png";
import { format } from "date-fns";

export default function AlbumView() {
  const { albumId } = useParams();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) ?? true;
  });

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/albums/${albumId}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Album not found");

        const data = await res.json();
        setAlbum(data);
        setTitle(data.title);
        setDescription(data.description || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [albumId]);

  // =========================
  // HELPERS
  // =========================
  const canEdit =
    album &&
    (album.owner_user_id === currentUser?.id ||
      currentUser?.role === "admin");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
    const input = document.getElementById("cover-image-input");
    if (input) input.value = "";
  };

  const handleUpdateAlbum = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description || "");

      if (coverImage) {
        formData.append("default_image", coverImage);
      }

      const res = await fetch(`${API_BASE_URL}/albums/${album.id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update album");

      const updated = await res.json();
      setAlbum(updated);
      setCoverImage(null);
      setCoverPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update album.");
    }
  };

  if (loading) return <p className="p-8">Loading album…</p>;
  if (!album) return <p className="p-8">Album not found.</p>;

  // =========================
  // RENDER
  // =========================
  return (
    <div
      className={`min-h-screen p-8 transition-colors ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* HEADER */}
      <Header
        introProps={{
          user: currentUser,
          darkMode,
          albumsCount: 0,
          imagesCount: album.image_count ?? 0,
        }}
        navigationProps={{
          darkMode,
          toggleDarkMode: () => setDarkMode((prev) => !prev),
        }}
      />

      {/* ALBUM HEADER */}
      <section className="my-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2 space-y-3">
          <h1 className="text-4xl font-bold">{album.title}</h1>
          <p className="opacity-80">
            {album.description || "No description provided."}
          </p>

          <div className="text-sm opacity-70 space-y-1">
            <p>Created by {album.owner_user?.username}</p>
            <p>{album.image_count ?? 0} images</p>
            <p>
              Created on {format(new Date(album.created_at), "PPP")}
            </p>
          </div>
        </div>

        <img
          src={album.cover_image_url || defaultAlbumImage}
          alt="Album cover"
          className="w-full h-48 object-contain rounded-xl border"
        />
      </section>

      {/* EDIT FORM */}
      {canEdit && (
        <section className="my-10 max-w-2xl">
          <form
            onSubmit={handleUpdateAlbum}
            className={`p-6 rounded-2xl shadow space-y-4 ${
              darkMode
                ? "bg-[#BDD63B] text-black"
                : "bg-[#263248] text-white"
            }`}
          >
            <h2 className="text-xl font-semibold">Edit Album</h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-white text-black outline-none"
              required
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-white text-black outline-none resize-none"
              rows={3}
            />

            {/* COVER IMAGE */}
            <div className="space-y-2">
              <p className="font-medium">Album Cover Image</p>

              {coverPreview ? (
                <div className="relative">
                  <img
                    src={coverPreview}
                    className="w-full h-48 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <input
                  id="cover-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              )}
            </div>

            <button
              type="submit"
              className={`px-6 py-2 rounded-full font-semibold ${
                darkMode
                  ? "bg-[#263248] text-white hover:bg-[#122342]"
                  : "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
              }`}
            >
              Save Changes
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
