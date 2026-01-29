import React, { useEffect, useState } from "react";
import Header from "../components/module/Header";
import ImageCard from "../components/module/ImageCard";
import SearchBar from "../components/module/Searchbar";
import { API_BASE_URL } from "../services/api";
import { Images as ImagesIcon } from "lucide-react";
import { useUserData } from "../services/UserDataContext";

export default function Images() {
  // =========================
  // STATE
  // =========================
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user: currentUser, darkMode, setDarkMode } = useUserData();

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/images/user`, {
          credentials: "include",
        });

        const data = await res.json();
        const safeImages = Array.isArray(data) ? data : [];

        setImages(safeImages);
        setFilteredImages(safeImages);
      } catch (err) {
        console.error("Error fetching images:", err);
        setImages([]);
        setFilteredImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // =========================
  // SEARCH
  // =========================
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredImages(images);
      return;
    }

    const lower = query.toLowerCase();
    setFilteredImages(
      images.filter((img) =>
        img.title?.toLowerCase().includes(lower) ||
        img.description?.toLowerCase().includes(lower)
      )
    );
  };

  if (loading) return <p className="p-8">Loading images…</p>;

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
        <ImagesIcon size={32} />
        <h1 className="text-4xl font-semibold">Images</h1>
        <p className="text-1xl opacity-80 mt-2">
          Manage your own personal images.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="mb-8 w-full">
        <SearchBar  />
      </div>

      {/* EMPTY STATE */}
      {filteredImages.length === 0 ? (
        <div
          className={`p-10 rounded-2xl text-center shadow ${
            darkMode
              ? "bg-[#BDD63B] text-black"
              : "bg-[#263248] text-white"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-2">
            No images uploaded yet
          </h2>
          <p className="opacity-80">
            Please upload an image to see it appear here.
          </p>
        </div>
      ) : (
        /* IMAGE GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
          {filteredImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              darkMode={darkMode}
              canEdit={
                image.uploader_user_id === currentUser?.id ||
                currentUser?.role === "admin"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
