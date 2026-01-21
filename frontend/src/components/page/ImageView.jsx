import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/module/Header";
import { API_BASE_URL } from "../api";
import { format } from "date-fns";

export default function ImageView() {
  const { imageId } = useParams();

  const [image, setImage] = useState(null);
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

  // =========================
  // EFFECTS
  // =========================
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/images/${imageId}`);
        const data = await res.json();

        setImage(data);
        setTitle(data.title);
        setDescription(data.description || "");
      } catch (err) {
        console.error("Error loading image:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [imageId]);

  const canEdit =
    image &&
    (image.owner_user_id === currentUser?.id ||
      currentUser?.role === "admin");

  const handleUpdateImage = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE_URL}/images/${image.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const updated = await res.json();
      setImage(updated);
    } catch (err) {
      console.error("Failed to update image:", err);
      alert("Failed to update image.");
    }
  };

  if (loading) return <p className="p-8">Loading image…</p>;
  if (!image) return <p className="p-8">Image not found.</p>;

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
          albumsCount: 0,
          imagesCount: 1,
        }}
        navigationProps={{
          darkMode,
          toggleDarkMode: () => setDarkMode((prev) => !prev),
        }}
      />

      {/* IMAGE DISPLAY */}
      <section className="my-10 max-w-4xl mx-auto">
        <div
          className={`rounded-2xl border-2 shadow overflow-hidden ${
            darkMode
              ? "bg-[#1E1C29] border-[#BDD63B]"
              : "bg-gray-100 border-[#263248]"
          }`}
        >
          <img
            src={image.url}
            alt={image.title}
            className="w-full object-contain max-h-[70vh]"
          />

          <div className="p-6">
            <h1 className="text-2xl font-bold">{image.title}</h1>
            <p className="opacity-80 mt-2">
              {image.description || "No description provided."}
            </p>

            <div className="text-sm opacity-70 mt-4 space-y-1">
              <p>
                Created{" "}
                {format(new Date(image.created_at), "PPP")}
              </p>
              <p>Image ID: {image.id}</p>
              <p>Owner ID: {image.owner_user_id}</p>
            </div>
          </div>
        </div>
      </section>

      {/* EDIT IMAGE */}
      {canEdit && (
        <section className="my-10 max-w-3xl mx-auto">
          <form
            onSubmit={handleUpdateImage}
            className={`p-6 rounded-2xl border-2 shadow space-y-4 ${
              darkMode
                ? "bg-[#1E1C29] border-[#BDD63B]"
                : "bg-gray-100 border-[#263248]"
            }`}
          >
            <h2 className="text-xl font-semibold">Edit Image</h2>

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

            <button
              type="submit"
              className={`px-6 py-2 rounded-full font-semibold transition ${
                darkMode
                  ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
                  : "bg-[#263248] text-white hover:bg-[#122342]"
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
