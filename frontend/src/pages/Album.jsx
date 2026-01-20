import React, { useEffect, useState } from "react";
import Header from "../components/module/Header";
import AlbumCard from "../components/module/AlbumCard";
import { format } from "date-fns";
import { API_BASE_URL } from "../api";

export default function Albums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) ?? true
  );

  const currentUser = JSON.parse(localStorage.getItem("user"));

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

  const canEdit = (album) =>
    album.owner_user_id === currentUser?.id || currentUser?.role === "admin";

  const handleOpenAlbum = (album) => {
    window.location.href = `/albums/${album.id}`;
  };

  const handleDeleteAlbum = async (album) => {
    if (!window.confirm(`Delete "${album.title}"?`)) return;

    const deleteImages = window.confirm(
      "Delete all images inside this album?\n\nCancel = images stay in Gallery"
    );

    try {
      await fetch(`${API_BASE_URL}/albums/${album.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delete_images: deleteImages }),
      });
      setAlbums(prev => prev.filter(a => a.id !== album.id));
    } catch (err) {
      console.error("Error deleting album:", err);
      alert("Failed to delete album.");
    }
  };

  if (loading) return <p className="p-8">Loading albums…</p>;

  return (
    <div className={darkMode ? "bg-black text-white" : "bg-white text-black"}>
      <Header />

      {/* PAGE HEADER */}
      <section className="px-8 py-10">
        <h1 className="text-4xl font-bold">Albums</h1>
        <p className="opacity-80 mt-2">
          Organize your images into albums and manage them here.
        </p>
      </section>

      {/* TOP 6 */}
      <section className="px-8 py-8 bg-gray-100 dark:bg-[#263248]">
        <h2 className="text-2xl font-semibold mb-6">Featured Albums</h2>

        {albums.length === 0 ? (
          <p>No albums yet. Upload albums to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6">
            {albums.slice(0, 6).map(album => (
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

      {/* YOUR ALBUMS LIST */}
      <section className="px-8 py-10">
        <h2 className="text-2xl font-semibold mb-4">Your Albums</h2>

        <div className="space-y-3">
          {albums
            .filter(a => a.owner_user_id === currentUser?.id)
            .map(album => (
              <div
                key={album.id}
                className="flex justify-between items-center p-4 rounded-xl bg-gray-100 dark:bg-[#263248]"
              >
                <div>
                  <h3 className="font-bold">{album.title}</h3>
                  <p className="text-sm opacity-80">{album.description}</p>
                  <p className="text-xs opacity-60">
                    Created {format(new Date(album.created_at), "PPP")}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
