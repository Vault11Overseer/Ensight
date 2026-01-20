// frontend/src/pages/Gallery.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../api";

export default function Gallery() {
  const [search, setSearch] = useState("");
  const [albums, setAlbums] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch albums
    fetch(`${API_BASE_URL}/albums/`)
      .then((res) => res.json())
      .then((data) => setAlbums(Array.isArray(data) ? data : []))
      .catch(() => setAlbums([]));

    // Fetch images
    fetch(`${API_BASE_URL}/images/`)
      .then((res) => res.json())
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredAlbums = albums.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredImages = images.filter((i) =>
    i.metadata?.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading gallery...</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Main Gallery</h1>

      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Search albums or images..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-2 border rounded"
      />

      {/* TOP 10 POPULAR ALBUMS */}
      <h2 className="text-2xl font-semibold mb-4">Top 10 Albums</h2>
      {filteredAlbums.length > 0 ? (
        filteredAlbums.slice(0, 10).map((a) => (
          <div key={a.id} className="p-3 mb-2 border rounded">
            <h3 className="font-bold">{a.title}</h3>
            <p className="text-sm">{a.description}</p>
          </div>
        ))
      ) : (
        <p>No albums yet.</p>
      )}

      {/* ALL IMAGES */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">All Images</h2>
      {filteredImages.length > 0 ? (
        filteredImages.map((img) => (
          <div key={img.id} className="p-3 mb-2 border rounded">
            <p>{img.metadata?.title || "Untitled Image"}</p>
          </div>
        ))
      ) : (
        <p>No images uploaded yet.</p>
      )}
    </div>
  );
}
