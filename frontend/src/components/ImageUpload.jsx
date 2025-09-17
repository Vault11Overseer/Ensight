import React, { useState } from "react";
import api from "../api/api";

function ImageUpload({ galleryId }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("gallery_id", galleryId);

    const res = await api.post("/images/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(res.data);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default ImageUpload;
