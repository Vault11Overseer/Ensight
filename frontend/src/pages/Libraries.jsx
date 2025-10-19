// import React, { useState, useEffect } from "react";
// import API from "../api/axios";
// import { useAuth } from "../context/AuthContext";
// import Header from "../components/module/Header";

// export default function Libraries() {
//   const { user, logout } = useAuth();

//   const [libraries, setLibraries] = useState([]);
//   const [allLibraries, setAllLibraries] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [imageBase64, setImageBase64] = useState("");
//   const [error, setError] = useState("");
//   const [inlineEdits, setInlineEdits] = useState({});
//   const [images, setImages] = useState([]);

//   const [darkMode, setDarkMode] = useState(() => {
//     if (typeof window !== "undefined") {
//       return JSON.parse(localStorage.getItem("darkMode")) ?? true;
//     }
//     return true;
//   });

//   useEffect(() => {
//     if (darkMode) document.documentElement.classList.add("dark");
//     else document.documentElement.classList.remove("dark");
//     localStorage.setItem("darkMode", JSON.stringify(darkMode));
//   }, [darkMode]);

//   const toggleDarkMode = () => setDarkMode((prev) => !prev);

//   const fetchMyLibraries = async () => {
//     try {
//       const res = await API.get("/libraries/mine");
//       setLibraries(res.data);
//     } catch (err) {
//       console.error(err.response?.data || err);
//     }
//   };

//   const fetchAllLibraries = async () => {
//     try {
//       const res = await API.get("/libraries/");
//       setAllLibraries(res.data);
//     } catch (err) {
//       console.error(err.response?.data || err);
//     }
//   };

//   useEffect(() => {
//     fetchMyLibraries();
//     fetchAllLibraries();
//   }, []);

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     if (imageFile) formData.append("image", imageFile);

//     try {
//       const res = await API.post("/libraries/", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setLibraries([...libraries, res.data]);
//       setAllLibraries([...allLibraries, res.data]);
//       setTitle("");
//       setDescription("");
//       setImageFile(null);
//       setError("");
//     } catch (err) {
//       console.error(err.response?.data || err);
//       setError(err.response?.data?.detail || "Failed to create library");
//     }
//   };

//   const handleDelete = async (libId) => {
//     try {
//       await API.delete(`/libraries/${libId}`);
//       setLibraries(libraries.filter((lib) => lib.id !== libId));
//       setAllLibraries(allLibraries.filter((lib) => lib.id !== libId));
//     } catch (err) {
//       console.error(err.response?.data || err);
//       setError(err.response?.data?.detail || "Failed to delete library");
//     }
//   };

//   const startEditingInline = (lib) => {
//     setInlineEdits({
//       id: lib.id,
//       title: lib.title,
//       description: lib.description,
//     });
//   };

//   const handleInlineChange = (e) => {
//     setInlineEdits({ ...inlineEdits, [e.target.name]: e.target.value });
//   };

//   const saveInlineEdits = async (libId) => {
//     try {
//       const payload = {
//         title: inlineEdits.title,
//         description: inlineEdits.description,
//         image_base64: imageBase64 || null,
//       };
//       const res = await API.put(`/libraries/${libId}`, payload);
//       setLibraries(libraries.map((lib) => (lib.id === libId ? res.data : lib)));
//       setAllLibraries(
//         allLibraries.map((lib) => (lib.id === libId ? res.data : lib))
//       );
//       setInlineEdits({});
//       setImageFile(null);
//       setImageBase64("");
//       setError("");
//     } catch (err) {
//       console.error(err.response?.data || err);
//       setError(err.response?.data?.detail || "Failed to update library");
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setImageFile(file);

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const result = reader.result;
//       const base64String = result.split(",")[1];
//       setImageBase64(base64String);
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div
//       className={`min-h-screen p-8 transition-colors duration-300 ${
//         darkMode ? "bg-[#0B0E1D] text-white" : "bg-[#EAF1FF] text-black"
//       }`}
//     >
//       <Header
//         introProps={{
//           user: user,
//           imagesCount: images.length,
//           librariesCount: allLibraries.length,
//           darkMode: darkMode,
//         }}
//         navigationProps={{
//           darkMode: darkMode,
//           toggleDarkMode: toggleDarkMode,
//           logout: logout,
//         }}
//       />

//       {/* CREATE LIBRARY FORM */}
//       <div className="flex flex-col md:flex-row gap-10 mt-6">
//         <div
//           className={`w-full p-6 rounded-2xl shadow transition-colors duration-300 ${
//             darkMode ? "bg-[#1A1F3D]" : "bg-white"
//           }`}
//         >
//           <h2
//             className={`text-2xl font-bold mb-4 ${
//               darkMode ? "text-[#BDD63B]" : "text-[#0B0E1D]"
//             }`}
//           >
//             CREATE A NEW LIBRARY
//           </h2>

//           <form onSubmit={handleCreate} className="flex flex-col gap-4">
//             <label className="font-semibold">Library Title</label>
//             <input
//               className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
//                 darkMode
//                   ? "bg-[#0B0E1D] text-white placeholder-gray-400"
//                   : "bg-[#DDE7FF] text-[#0B0E1D] placeholder-gray-500"
//               }`}
//               placeholder="Library Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />

//             <label className="font-semibold">Library Description</label>
//             <textarea
//               className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
//                 darkMode
//                   ? "bg-[#0B0E1D] text-white placeholder-gray-400"
//                   : "bg-[#DDE7FF] text-[#0B0E1D] placeholder-gray-500"
//               }`}
//               placeholder="Library Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               required
//             />

//             <label className="font-semibold">Library Image</label>
//             <input
//               type="file"
//               accept="image/*"
//               className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
//                 darkMode
//                   ? "bg-[#0B0E1D] text-white"
//                   : "bg-[#DDE7FF] text-[#0B0E1D]"
//               }`}
//               onChange={handleFileChange}
//             />

//             <button className="bg-[#BDD63B] hover:bg-[#A4C22F] p-3 rounded-lg text-black font-semibold transition-colors duration-300">
//               CREATE LIBRARY
//             </button>

//             {error && <p className="text-red-500 mt-2">{error}</p>}
//           </form>
//         </div>
//       </div>

//       {/* USER LIBRARIES */}
//       {libraries.length > 0 && (
//         <div className="mt-10">
//           <h2
//             className={`text-2xl font-bold mb-4 ${
//               darkMode ? "text-[#BDD63B]" : "text-[#0B0E1D]"
//             }`}
//           >
//             YOUR LIBRARIES
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {libraries.map((lib) => (
//               <div
//                 key={lib.id}
//                 className={`p-2 rounded-lg shadow relative transition-colors duration-300 ${
//                   lib.image_url
//                     ? darkMode
//                       ? "bg-[#0B0E1D]"
//                       : "bg-[#F0F5FF]"
//                     : darkMode
//                     ? "bg-[#1A1F3D]"
//                     : "bg-[#EAF1FF]"
//                 }`}
//               >
//                 <img
//                   src={
//                     lib.image_url ||
//                     "http://localhost:8000/static/default_library.png"
//                   }
//                   alt={lib.title}
//                   className="w-full h-32 object-cover rounded"
//                 />

//                 {/* INLINE EDIT MODE */}
//                 {inlineEdits.id === lib.id ? (
//                   <div className="absolute top-2 left-2 right-2 bg-black/80 p-2 rounded">
//                     <label className="text-white text-sm">Title</label>
//                     <input
//                       className="p-1 mb-1 rounded w-full text-white bg-[#0B0E1D]"
//                       name="title"
//                       value={inlineEdits.title}
//                       onChange={handleInlineChange}
//                     />
//                     <label className="text-white text-sm">Description</label>
//                     <textarea
//                       className="p-1 mb-1 rounded w-full text-white bg-[#0B0E1D]"
//                       name="description"
//                       value={inlineEdits.description}
//                       onChange={handleInlineChange}
//                     />
//                     <label className="text-white text-sm">Image</label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className="p-1 mb-2 rounded w-full bg-[#0B0E1D] text-white"
//                       onChange={handleFileChange}
//                     />
//                     <div className="flex gap-2">
//                       <button
//                         className="bg-[#BDD63B] hover:bg-[#A4C22F] p-1 rounded text-sm"
//                         onClick={() => saveInlineEdits(lib.id)}
//                       >
//                         SAVE
//                       </button>
//                       <button
//                         className="bg-gray-600 hover:bg-gray-700 p-1 rounded text-sm"
//                         onClick={() => setInlineEdits({})}
//                       >
//                         CANCEL
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black/60 p-1 rounded">
//                     <div>
//                       <h2 className="font-bold text-white">{lib.title}</h2>
//                       <p className="text-gray-400 text-sm">{lib.description}</p>
//                     </div>
//                     <div className="flex gap-1">
//                       <button
//                         className="bg-yellow-500 hover:bg-yellow-600 p-1 rounded text-sm text-black"
//                         onClick={() => startEditingInline(lib)}
//                       >
//                         EDIT
//                       </button>
//                       <button
//                         className="bg-red-600 hover:bg-red-700 p-1 rounded text-sm"
//                         onClick={() => handleDelete(lib.id)}
//                       >
//                         DELETE
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ALL LIBRARIES SECTION */}
//       <h2
//         className={`pt-6 text-2xl font-bold mb-4 ${
//           darkMode ? "text-[#BDD63B]" : "text-[#0B0E1D]"
//         }`}
//       >
//         ALL LIBRARIES
//       </h2>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {allLibraries.map((lib) => (
//           <div
//             key={lib.id}
//             className={`p-2 rounded-lg shadow transition-colors duration-300 ${
//               darkMode
//                 ? "bg-[#1A1F3D] text-white"
//                 : "bg-[#F0F5FF] text-[#0B0E1D]"
//             } text-sm`}
//           >
//             <div className="w-full h-24 overflow-hidden rounded mb-2">
//               <img
//                 src={
//                   lib.image_url ||
//                   "http://localhost:8000/static/default_library.png"
//                 }
//                 alt={lib.title}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <h3 className="font-bold">{lib.title}</h3>
//             <p className="text-gray-400 dark:text-gray-300 text-xs">
//               {new Date(lib.created_at).toLocaleDateString()} by{" "}
//               {lib.user_name || "Unknown"}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Header from "../components/module/Header";
import { useUserData } from "../context/UserDataContext";

export default function Libraries() {
  const { user, logout } = useAuth();

  const [libraries, setLibraries] = useState([]);
  const [allLibraries, setAllLibraries] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [error, setError] = useState("");
  const [inlineEdits, setInlineEdits] = useState({});
  const [images, setImages] = useState([]);

  // ✅ Added state for search
  const [searchTerm, setSearchTerm] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const fetchMyLibraries = async () => {
    try {
      const res = await API.get("/libraries/mine");
      setLibraries(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const fetchAllLibraries = async () => {
    try {
      const res = await API.get("/libraries/");
      setAllLibraries(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchMyLibraries();
    fetchAllLibraries();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await API.post("/libraries/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLibraries([...libraries, res.data]);
      setAllLibraries([...allLibraries, res.data]);
      setTitle("");
      setDescription("");
      setImageFile(null);
      setError("");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.detail || "Failed to create library");
    }
  };

  const handleDelete = async (libId) => {
    try {
      await API.delete(`/libraries/${libId}`);
      setLibraries(libraries.filter((lib) => lib.id !== libId));
      setAllLibraries(allLibraries.filter((lib) => lib.id !== libId));
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.detail || "Failed to delete library");
    }
  };

  const startEditingInline = (lib) => {
    setInlineEdits({
      id: lib.id,
      title: lib.title,
      description: lib.description,
    });
  };

  const handleInlineChange = (e) => {
    setInlineEdits({ ...inlineEdits, [e.target.name]: e.target.value });
  };

  const saveInlineEdits = async (libId) => {
    try {
      const payload = {
        title: inlineEdits.title,
        description: inlineEdits.description,
        image_base64: imageBase64 || null,
      };
      const res = await API.put(`/libraries/${libId}`, payload);
      setLibraries(libraries.map((lib) => (lib.id === libId ? res.data : lib)));
      setAllLibraries(
        allLibraries.map((lib) => (lib.id === libId ? res.data : lib))
      );
      setInlineEdits({});
      setImageFile(null);
      setImageBase64("");
      setError("");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.detail || "Failed to update library");
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

  // ✅ Filtered libraries based on search term
  const filteredLibraries = libraries.filter((lib) =>
    lib.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredAllLibraries = allLibraries.filter((lib) =>
    lib.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-[#0B0E1D] text-white" : "bg-[#EAF1FF] text-black"
      }`}
    >
      <Header
        introProps={{
          user: user,
          imagesCount: images.length,
          librariesCount: allLibraries.length,
          darkMode: darkMode,
        }}
        navigationProps={{
          darkMode: darkMode,
          toggleDarkMode: toggleDarkMode,
          logout: logout,
        }}
      />

      {/* CREATE LIBRARY FORM */}
      <div className="flex flex-col md:flex-row gap-10 mt-6">
        <div
          className={`w-full p-6 rounded-2xl shadow transition-colors duration-300 ${
            darkMode ? "bg-[#1A1F3D]" : "bg-white"
          }`}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-[#BDD63B]" : "text-[#0B0E1D]"
            }`}
          >
            CREATE A NEW LIBRARY
          </h2>

          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <label className="font-semibold">Library Title</label>
            <input
              className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
                darkMode
                  ? "bg-[#0B0E1D] text-white placeholder-gray-400"
                  : "bg-[#DDE7FF] text-[#0B0E1D] placeholder-gray-500"
              }`}
              placeholder="Library Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label className="font-semibold">Library Description</label>
            <textarea
              className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
                darkMode
                  ? "bg-[#0B0E1D] text-white placeholder-gray-400"
                  : "bg-[#DDE7FF] text-[#0B0E1D] placeholder-gray-500"
              }`}
              placeholder="Library Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <label className="font-semibold">Library Image</label>
            <input
              type="file"
              accept="image/*"
              className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
                darkMode
                  ? "bg-[#0B0E1D] text-white"
                  : "bg-[#DDE7FF] text-[#0B0E1D]"
              }`}
              onChange={handleFileChange}
            />

            <button className="bg-[#BDD63B] hover:bg-[#A4C22F] p-3 rounded-lg text-black font-semibold transition-colors duration-300">
              CREATE LIBRARY
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
        </div>
      </div>

      {/* ✅ SEARCH BAR - full width and positioned after form */}
      <div className="w-full mt-10 mb-6">
        <input
          type="text"
          placeholder="Search libraries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#BDD63B] ${
            darkMode
              ? "bg-white text-white border-gray-700 placeholder-gray-400"
              : "bg-[#DDE7FF] text-[#0B0E1D] border-gray-300 placeholder-gray-500"
          }`}
        />
      </div>

      {/* USER LIBRARIES */}
      {filteredLibraries.length > 0 && (
        <div className="mt-10">
          <h2
            className={`text-2xl font-bold mb-4 ${
              darkMode ? "text-[#BDD63B]" : "text-[#0B0E1D]"
            }`}
          >
            YOUR LIBRARIES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredLibraries.map((lib) => (
              <div
                key={lib.id}
                className={`p-2 rounded-lg shadow relative transition-colors duration-300 ${
                  lib.image_url
                    ? darkMode
                      ? "bg-[#0B0E1D]"
                      : "bg-[#F0F5FF]"
                    : darkMode
                    ? "bg-[#1A1F3D]"
                    : "bg-[#EAF1FF]"
                }`}
              >
                <img
                  src={
                    lib.image_url ||
                    "http://localhost:8000/static/default_library.png"
                  }
                  alt={lib.title}
                  className="w-full h-32 object-cover rounded"
                />
                {/* INLINE EDIT MODE (unchanged) */}
                {inlineEdits.id === lib.id ? (
                  <div className="absolute top-2 left-2 right-2 bg-black/80 p-2 rounded">
                    <label className="text-white text-sm">Title</label>
                    <input
                      className="p-1 mb-1 rounded w-full text-white bg-[#0B0E1D]"
                      name="title"
                      value={inlineEdits.title}
                      onChange={handleInlineChange}
                    />
                    <label className="text-white text-sm">Description</label>
                    <textarea
                      className="p-1 mb-1 rounded w-full text-white bg-[#0B0E1D]"
                      name="description"
                      value={inlineEdits.description}
                      onChange={handleInlineChange}
                    />
                    <label className="text-white text-sm">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="p-1 mb-2 rounded w-full bg-[#0B0E1D] text-white"
                      onChange={handleFileChange}
                    />
                    <div className="flex gap-2">
                      <button
                        className="bg-[#BDD63B] hover:bg-[#A4C22F] p-1 rounded text-sm"
                        onClick={() => saveInlineEdits(lib.id)}
                      >
                        SAVE
                      </button>
                      <button
                        className="bg-gray-600 hover:bg-gray-700 p-1 rounded text-sm"
                        onClick={() => setInlineEdits({})}
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black/60 p-1 rounded">
                    <div>
                      <h2 className="font-bold text-white">{lib.title}</h2>
                      <p className="text-gray-400 text-sm">{lib.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 p-1 rounded text-sm text-black"
                        onClick={() => startEditingInline(lib)}
                      >
                        EDIT
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 p-1 rounded text-sm"
                        onClick={() => handleDelete(lib.id)}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALL LIBRARIES SECTION */}
      <h2
        className={`pt-6 text-2xl font-bold mb-4 ${
          darkMode ? "text-[#BDD63B]" : "text-[#0B0E1D]"
        }`}
      >
        ALL LIBRARIES
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredAllLibraries.map((lib) => (
          <div
            key={lib.id}
            className={`p-2 rounded-lg shadow transition-colors duration-300 ${
              darkMode ? "bg-[#1A1F3D] text-white" : "bg-white text-[#0B0E1D]"
            } text-sm`}
          >
            <div className="w-full h-24 overflow-hidden rounded mb-2">
              <img
                src={
                  lib.image_url ||
                  "http://localhost:8000/static/default_library.png"
                }
                alt={lib.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-bold">{lib.title}</h3>
            <p className="text-white dark:text-[#263248] text-xs">
              {new Date(lib.created_at).toLocaleDateString()} by{" "}
              {lib.user_name || "Unknown"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
