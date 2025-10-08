import React, { useState, useEffect } from "react";
import API from "../api/axios"; // use our Axios instance
import { useAuth } from "../context/AuthContext";

export default function Libraries() {
  const { user } = useAuth(); // token is read automatically in Axios
  const [libraries, setLibraries] = useState([]);
  const [otherLibraries, setOtherLibraries] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyLibraries();
    fetchOtherLibraries();
  }, []);

  const fetchMyLibraries = async () => {
    try {
      const res = await API.get("/libraries/"); // note trailing slash
      setLibraries(res.data);
    } catch (err) {
      console.error("Error fetching libraries:", err.response?.data || err);
    }
  };

  const fetchOtherLibraries = async () => {
    try {
      const res = await API.get("/libraries/others");
      setOtherLibraries(res.data);
    } catch (err) {
      console.error("Error fetching other libraries:", err.response?.data || err);
    }
  };

const handleCreate = async (e) => {
  e.preventDefault();
  setError("");

  try {
    // Build JSON payload
    const payload = {
      title,
      description,
      image_base64: imageBase64 || null, // send base64 string or null
    };

    const res = await API.post("/libraries/", payload); // Axios sends JSON by default

    setLibraries([...libraries, res.data]);

    // clear form
    setTitle("");
    setDescription("");
    setImageFile(null);
    setImageBase64("");
  } catch (err) {
    console.error("Error creating library:", err.response?.data || err);
    setError(err.response?.data?.detail || "Failed to create library");
  }
};



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      const base64String = result.split(",")[1];
      setImageBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Your Libraries</h1>

      {libraries.length === 0 && (
        <div className="mb-8">
          <p>Start by making your first library!</p>
          <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-4">
            <input
              className="p-2 rounded bg-[#1E1C29]"
              placeholder="Library title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="p-2 rounded bg-[#1E1C29]"
              placeholder="Library description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="file"
              accept="image/*"
              className="p-2 rounded bg-[#1E1C29]"
              onChange={handleFileChange}
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded">
              Create Library
            </button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}

      {libraries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {libraries.map((lib) => (
            <div key={lib.id} className="bg-[#1E1C29] p-4 rounded-lg shadow">
              <img
                src={lib.image_url || "/placeholder.png"}
                alt={lib.title}
                className="rounded mb-2"
              />
              <h2 className="font-bold">{lib.title}</h2>
              <p className="text-gray-400">{lib.description}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Libraries from other users</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {otherLibraries.map((lib) => (
          <div key={lib.id} className="bg-[#1E1C29] p-4 rounded-lg shadow">
            <img
              src={lib.image_url || "/placeholder.png"}
              alt={lib.title}
              className="rounded mb-2"
            />
            <h2 className="font-bold">{lib.title}</h2>
            <p className="text-gray-400">{lib.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
