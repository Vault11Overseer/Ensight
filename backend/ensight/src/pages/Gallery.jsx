import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Header from "../components/module/Header";
import { Link } from "react-router-dom";

// =========================
// AUTH CONTEXT
// =========================
export default function Gallery() {
  const { token, logout, user } = useAuth();
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Dark mode
  // =========================
  // AUTH CONTEXT
  // =========================
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Fetch all images
  // =========================
  // AUTH CONTEXT
  // =========================
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await API.get("/images", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setImages(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    fetchImages();
  }, [token]);

  // Filter images based on search
  const filteredImages = images.filter(
    (img) =>
      img.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Header */}
      <Header
        introProps={{ user, imagesCount: images.length, darkMode }}
        navigationProps={{ darkMode, toggleDarkMode, logout }}
      />

      {/* Search Bar */}
      <div className="my-6">
        <input
          type="text"
          placeholder="Search images by title, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full p-3 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              : "bg-gray-100 border-gray-300 text-black placeholder-gray-500"
          }`}
        />
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.length > 0 ? (
          filteredImages.map((img) => (
            <Link key={img.id} to={`/images/${img.id}`}>
              <div
                className={`p-4 rounded-lg shadow-lg transition ${
                  darkMode
                    ? "bg-[#0B0E1D] text-white"
                    : "bg-[#F7FAFF] text-black"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">
                  {img.title || "N/A"}
                </h3>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center mt-10 text-gray-500">
            No images found.
          </p>
        )}
      </div>
    </div>
  );
}
