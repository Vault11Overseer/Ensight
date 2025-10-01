import React, { useState, useEffect } from "react";
import API from "../api/api";

export default function ImageUpload() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState(""); // comma-separated string
  const [libraries, setLibraries] = useState([]);
  const [libraryId, setLibraryId] = useState("");

  // Fetch user's libraries on load
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await API.get("/libraries", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLibraries(res.data);
      } catch (err) {
        console.error("Error fetching libraries:", err);
      }
    };
    fetchLibraries();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }
    if (!title) {
      alert("Please enter a title");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags); // backend will split and merge with AI tags
    formData.append("library_id", libraryId);

    try {
      const token = localStorage.getItem("access_token");
      const res = await API.post("/images/upload", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setImageUrl(res.data.url);
      alert("Upload successful!");
      // Reset form
      setFile(null);
      setTitle("");
      setDescription("");
      setTags("");
      setLibraryId("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Upload failed");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload an Image</h1>

      <div className="mb-4">
        <label className="block mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded border border-gray-300"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded border border-gray-300"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 rounded border border-gray-300"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Select Library</label>
        <select
          value={libraryId}
          onChange={(e) => setLibraryId(e.target.value)}
          className="w-full p-2 rounded border border-gray-300"
        >
          <option value="">-- None --</option>
          {libraries.map((lib) => (
            <option key={lib.id} value={lib.id}>
              {lib.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Choose File</label>
        <input type="file" onChange={handleFileChange} />
      </div>

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Upload
      </button>

      {imageUrl && (
        <div className="mt-6">
          <p>Uploaded Image:</p>
          <img
            src={imageUrl}
            alt="uploaded"
            className="mt-2 max-w-sm rounded shadow"
          />
        </div>
      )}
    </div>
  );
}
