import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function ImageDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [image, setImage] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true;
  });

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await API.get(`/images/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setImage(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    fetchImage();
  }, [id, token]);

  if (!image) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: info */}
        <div
          className={`p-4 rounded-lg shadow-lg ${
            darkMode ? "bg-[#0B0E1D]" : "bg-[#F7FAFF]"
          }`}
        >
          <h3 className="text-xl font-bold mb-4">{image.title || "N/A"}</h3>
          <p className="mb-2">
            <strong>Description:</strong> {image.description || "N/A"}
          </p>
          {image.tags && image.tags.length > 0 && (
            <p className="mb-2">
              <strong>Tags:</strong> {image.tags.join(", ")}
            </p>
          )}
          <p className="mb-2">
            <strong>Library:</strong> {image.library || "N/A"}
          </p>
          <p className="mb-2">
            <strong>File Name:</strong> {image.fileName || "N/A"}
          </p>
          <p className="mb-2">
            <strong>File Size:</strong> {image.fileSize || "N/A"}
          </p>
          <p className="mb-2">
            <strong>File Type:</strong> {image.fileType || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Uploaded URL:</strong>{" "}
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline ${
                darkMode ? "text-green-400" : "text-blue-700"
              }`}
            >
              {image.url}
            </a>
          </p>
          <p className="mb-2">
            <strong>Uploaded At:</strong> {image.uploadedAt || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Uploaded By:</strong> {image.uploadedBy || "N/A"}
          </p>
        </div>

        {/* Right column: image */}
        <div className="flex justify-center items-center">
          <img
            src={image.url}
            alt={image.title}
            className="w-full max-h-[600px] object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
