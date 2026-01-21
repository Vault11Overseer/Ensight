import React, { useEffect, useState } from "react";
import Header from "../components/module/Header";
import AlbumCard from "../components/module/AlbumCard";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";

export default function Albums() {
  // =========================
  // STATE
  // =========================
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true;
  });

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

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

  const handleCreateAlbum = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/albums/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const newAlbum = await res.json();
      setAlbums((prev) => [newAlbum, ...prev]);

      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error creating album:", err);
      alert("Failed to create album.");
    }
  };

  if (loading) return <p className="p-8">Loading albums…</p>;

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
        introProps={{
          user: currentUser,
          darkMode,
          albumsCount: albums.length,
          imagesCount: 0,
        }}
        navigationProps={{
          darkMode,
          toggleDarkMode: () => setDarkMode((prev) => !prev),
        }}
      />

      {/* PAGE HEADER */}
      <section className="my-10">
        <h1 className="text-4xl font-bold">Albums</h1>
        <p className="opacity-80 mt-2">
          Manage your personal albums. The Main Gallery is system-controlled.
        </p>
      </section>

      {/* CREATE ALBUM FORM */}
      <section className="my-10 max-w-2xl">
        <form
          onSubmit={handleCreateAlbum}
          className={`p-6 rounded-2xl border-2 shadow space-y-4 ${
            darkMode
              ? "bg-[#1E1C29] border-[#BDD63B]"
              : "bg-gray-100 border-[#263248]"
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

          <button
            type="submit"
            className={`px-6 py-2 rounded-full font-semibold transition ${
              darkMode
                ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
                : "bg-[#263248] text-white hover:bg-[#122342]"
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
                />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}
