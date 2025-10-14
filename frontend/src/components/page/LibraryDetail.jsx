import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import Header from "../module/Header";

export default function LibraryDetail({
  darkMode,
  toggleDarkMode,
  user,
  logout,
}) {
  const { id } = useParams();
  const [library, setLibrary] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await API.get(`/libraries/${id}`);
        setLibrary(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    const fetchLibraryImages = async () => {
      try {
        const res = await API.get(`/images/library/${id}`);
        setImages(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    fetchLibrary();
    fetchLibraryImages();
  }, [id]);

  if (!library) return <p className="p-8">Loading...</p>;

  return (
    <div
      className={`min-h-screen p-8 ${
        darkMode ? "bg-[#0B0E1D] text-white" : "bg-[#EAF1FF] text-black"
      }`}
    >
      <Header
        introProps={{
          user: user,
          imagesCount: images.length,
          librariesCount: 1,
          darkMode: darkMode,
        }}
        navigationProps={{
          darkMode: darkMode,
          toggleDarkMode: toggleDarkMode,
          logout: logout,
        }}
      />

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Library Default Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto rounded overflow-hidden">
          <img
            src={
              library.image_url ||
              "http://localhost:8000/static/default_library.png"
            }
            alt={library.title}
            className="w-full h-full object-cover rounded"
          />
        </div>

        {/* Library Info */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h2 className="text-3xl font-bold">{library.title}</h2>
          <p className="text-gray-400 dark:text-gray-300">
            {library.description}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-300">
            Created on {new Date(library.created_at).toLocaleDateString()} by{" "}
            {library.user_name || "Unknown"}
          </p>
        </div>
      </div>

      {/* Library Images */}
      {images.length > 0 && (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="w-full h-32 overflow-hidden rounded">
              <img
                src={img.url}
                alt={img.title || "Library Image"}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
