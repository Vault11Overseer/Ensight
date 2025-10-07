import React, { useState, useEffect } from "react";
import API, { setAuthToken } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Libraries() {
  const { token, user } = useAuth();
  const [libraries, setLibraries] = useState([]);
  const [otherLibraries, setOtherLibraries] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);

    fetchMyLibraries();
    fetchOtherLibraries();
  }, [token]);

  async function fetchMyLibraries() {
    try {
      const res = await API.get("/libraries/");
      setLibraries(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchOtherLibraries() {
    try {
      const res = await API.get("/libraries/others");
      setOtherLibraries(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreate(e) {
  e.preventDefault();
  try {
    const res = await API.post("/libraries/", {
      title,
      description,
      image_base64: imageBase64, // send the Base64 string
    });
    setLibraries([...libraries, res.data]);
    setTitle("");
    setDescription("");
    setImageBase64(null);
  } catch (err) {
    console.error(err);
  }
}


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
  onChange={async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result); // store Base64 in state
    };
    reader.readAsDataURL(file);
  }}
/>


            <button className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded">
              Create Library
            </button>
          </form>
        </div>
      )}

      {libraries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {libraries.map((lib) => (
            <div key={lib.id} className="bg-[#1E1C29] p-4 rounded-lg shadow">
              <img
                src={lib.image_url || "/placeholder.png"}
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
