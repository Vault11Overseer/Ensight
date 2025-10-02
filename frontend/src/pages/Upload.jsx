

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api/api";

// export default function ImageUpload() {
//   const navigate = useNavigate();
//   const [file, setFile] = useState(null);
//   const [imageUrl, setImageUrl] = useState(null);
//   const [uploadedImageId, setUploadedImageId] = useState(null);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [tags, setTags] = useState("");
//   const [libraries, setLibraries] = useState([]);
//   const [libraryId, setLibraryId] = useState("");

//   useEffect(() => {
//     const fetchLibraries = async () => {
//       try {
//     const token = localStorage.getItem("token"); // or wherever you store it
//     const response = await axios.get("http://localhost:8000/libraries/", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log(response.data);
//   } catch (err) {
//     console.error("Error fetching libraries:", err);
//   }
//     };
//     fetchLibraries();
//   }, []);

//   const handleFileChange = (e) => setFile(e.target.files[0]);

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please select a file first");
//       return;
//     }

//     try {
//       const token = localStorage.getItem("access_token");

//       // Upload file
//       const formData = new FormData();
//       formData.append("file", file);

//       const uploadRes = await API.post("/images/upload", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       const { id, url } = uploadRes.data;
//       setUploadedImageId(id);
//       setImageUrl(url);

//       // Send metadata
//       const metadata = {
//         title,
//         description,
//         tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
//         library_id: libraryId || null,
//       };

//       await API.post(`/images/${id}/metadata`, metadata, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert("Upload + metadata saved successfully!");

//       // Reset form
//       setFile(null);
//       setTitle("");
//       setDescription("");
//       setTags("");
//       setLibraryId("");
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.detail || "Upload failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white p-8 max-w-3xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">Upload an Image</h1>
//         <button
//           onClick={() => navigate("/")}
//           className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
//         >
//           ⬅️ Back to Dashboard
//         </button>
//       </div>

//       <div className="space-y-6">
//         <div>
//           <label className="block mb-2 font-semibold">Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:border-indigo-500 focus:ring focus:ring-indigo-400/20 outline-none"
//           />
//         </div>

//         <div>
//           <label className="block mb-2 font-semibold">Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:border-indigo-500 focus:ring focus:ring-indigo-400/20 outline-none"
//           />
//         </div>

//         <div>
//           <label className="block mb-2 font-semibold">Tags (comma-separated)</label>
//           <input
//             type="text"
//             value={tags}
//             onChange={(e) => setTags(e.target.value)}
//             className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:border-indigo-500 focus:ring focus:ring-indigo-400/20 outline-none"
//           />
//         </div>

//         <div>
//           <label className="block mb-2 font-semibold">Select Library</label>
//           <select
//             value={libraryId}
//             onChange={(e) => setLibraryId(e.target.value)}
//             className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:border-indigo-500 focus:ring focus:ring-indigo-400/20 outline-none"
//           >
//             <option value="">-- None --</option>
//             {libraries.map((lib) => (
//               <option key={lib.id} value={lib.id}>
//                 {lib.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block mb-2 font-semibold">Choose File</label>
//           <input
//             type="file"
//             onChange={handleFileChange}
//             className="text-white"
//           />
//         </div>

//         <button
//           onClick={handleUpload}
//           className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition"
//         >
//           Upload
//         </button>

//         {imageUrl && (
//           <div className="mt-8">
//             <p className="font-semibold mb-2">Uploaded Image Preview:</p>
//             <img src={imageUrl} alt="uploaded" className="rounded-lg shadow-lg" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // <-- import axios
import API from "../api/api";

export default function ImageUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadedImageId, setUploadedImageId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [libraries, setLibraries] = useState([]);
  const [libraryId, setLibraryId] = useState("");

  // Fetch libraries for select dropdown
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const token = localStorage.getItem("token"); // or wherever you store it
        const response = await axios.get("http://localhost:8000/libraries/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLibraries(response.data); // populate libraries state
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

    try {
      const token = localStorage.getItem("access_token");

      // Upload file
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await API.post("/images/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const { id, url } = uploadRes.data;
      setUploadedImageId(id);
      setImageUrl(url);

      // Send metadata
      const metadata = {
        title,
        description,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        library_id: libraryId || null,
      };

      await API.post(`/images/${id}/metadata`, metadata, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Upload + metadata saved successfully!");

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
    <div className="min-h-screen bg-black text-white p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Upload an Image</h1>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        >
          ⬅️ Back to Dashboard
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:border-indigo-500 focus:ring focus:ring-indigo-400/20 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:border-indigo-500 focus:ring focus:ring-indigo-400/20 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:border-indigo-500 focus:ring focus:ring-indigo-400/20 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Select Library</label>
          <select
            value={libraryId}
            onChange={(e) => setLibraryId(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-900 focus:border-indigo-500 focus:ring focus:ring-indigo-400/20 outline-none"
          >
            <option value="">-- None --</option>
            {libraries.map((lib) => (
              <option key={lib.id} value={lib.id}>
                {lib.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Choose File</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="text-white"
          />
        </div>

        <button
          onClick={handleUpload}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition"
        >
          Upload
        </button>

        {imageUrl && (
          <div className="mt-8">
            <p className="font-semibold mb-2">Uploaded Image Preview:</p>
            <img src={imageUrl} alt="uploaded" className="rounded-lg shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
}

