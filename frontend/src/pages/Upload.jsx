import React, { useState } from "react";
import axios from "axios";

export default function ImageUpload() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post("http://127.0.0.1:8000/images/upload", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setImageUrl(res.data.url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Upload an Image</h1>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload
      </button>

      {imageUrl && (
        <div className="mt-6">
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="uploaded" className="mt-2 max-w-sm rounded shadow" />
        </div>
      )}
    </div>
  );
}


