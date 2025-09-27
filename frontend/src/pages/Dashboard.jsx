import React, { useState, useEffect } from "react";
import API, { setAuthToken } from "../api/api";
import { useAuth } from "../context/AuthContext";


export default function Dashboard() {
  const { token, logout } = useAuth();
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    setAuthToken(token);
    // You can later implement a GET endpoint to fetch user's images
  }, [token]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("images/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages(prev => [...prev, res.data.url]);
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-blue-600">Dashboard</h1>
      <button onClick={logout}>Logout</button>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      <div>
        {images.map((url, idx) => <img key={idx} src={url} alt="uploaded" width={200} />)}
      </div>
    </div>
  );
}
