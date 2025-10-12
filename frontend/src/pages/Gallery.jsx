// import React, { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import API from "../api/axios";
// import { Images } from "lucide-react";

// import Header from "../components/Header";

// export default function Dashboard() {
//   const { token, logout, user } = useAuth();
//   const [images, setImages] = useState([]);
//   const [allLibraries, setAllLibraries] = useState([]);

//   // Dark mode
//   const [darkMode, setDarkMode] = useState(() => {
//     if (typeof window !== "undefined") {
//       return JSON.parse(localStorage.getItem("darkMode")) ?? true;
//     }
//     return true;
//   });

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//       console.log("Dark mode is ON 🌙");
//     } else {
//       document.documentElement.classList.remove("dark");
//       console.log("Dark mode is OFF ☀️");
//     }

//     localStorage.setItem("darkMode", JSON.stringify(darkMode));
//   }, [darkMode]);

//   const toggleDarkMode = () => setDarkMode((prev) => !prev);

//   // Fetch all libraries
//   useEffect(() => {
//     const fetchAllLibraries = async () => {
//       try {
//         const res = await API.get("/libraries/mine", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setAllLibraries(res.data);
//       } catch (err) {
//         console.error(err.response?.data || err);
//       }
//     };
//     fetchAllLibraries();
//   }, [token]);

//   return (
//     <div
//       className={`min-h-screen p-8 transition-colors duration-300 ${
//         darkMode ? "bg-black text-white" : "bg-white text-black"
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

//       {/* Portal Links */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
//         <a
//           href="/Upload"
//           className={`p-6 rounded-2xl shadow transition ${
//             darkMode
//               ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
//               : "bg-[#1E3A8A] text-white hover:bg-[#17306a]"
//           }`}
//         >
//           <h2 className="text-xl font-semibold">⬆️ Upload</h2>
//           <p className="mt-2">Upload your images</p>
//         </a>

//         <a
//           href="/Libraries"
//           className={`p-6 rounded-2xl shadow transition ${
//             darkMode
//               ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
//               : "bg-[#1E3A8A] text-white hover:bg-[#17306a]"
//           }`}
//         >
//           <h2 className="text-xl font-semibold">📚 Libraries</h2>
//           <p className="mt-2">Browse Collections of Images</p>
//         </a>

//         <a
//           href="/personal"
//           className={`p-6 rounded-2xl shadow transition ${
//             darkMode
//               ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
//               : "bg-[#1E3A8A] text-white hover:bg-[#17306a]"
//           }`}
//         >
//           <h2 className="text-xl font-semibold">📷 Personal</h2>
//           <p className="mt-2 flex items-center gap-1">
//             Manage your uploads <Images size={18} />
//           </p>
//         </a>
//       </div>

//       {/* Lower Gallery Bar */}
//       <div className="w-full h-auto">
//         <a
//           href="/Gallery"
//           className={`w-full flex flex-col items-center p-6 rounded-2xl shadow transition ${
//             darkMode
//               ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
//               : "bg-[#1E3A8A] text-white hover:bg-[#17306a]"
//           }`}
//         >
//           <h2 className="text-xl font-semibold flex items-center gap-2">
//             <span>📷 Gallery</span>
//           </h2>
//           <p className="mt-2 flex items-center gap-2">
//             Browse the main gallery
//           </p>
//         </a>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function Gallery() {
  const { token, logout, user } = useAuth();
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("darkMode")) ?? true;
    }
    return true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Fetch all images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await API.get("/images", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setImages(res.data);
      } catch (err) {
        console.error(err.response?.data || err);
      }
    };
    fetchImages();
  }, [token]);

  // Filter images based on search
  const filteredImages = images.filter(
    (img) =>
      img.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Header */}
      <Header
        introProps={{ user, imagesCount: images.length, darkMode }}
        navigationProps={{ darkMode, toggleDarkMode, logout }}
      />

      {/* Search Bar */}
      <div className="my-6">
        <input
          type="text"
          placeholder="Search images by title, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full p-3 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              : "bg-gray-100 border-gray-300 text-black placeholder-gray-500"
          }`}
        />
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.length > 0 ? (
          filteredImages.map((img) => (
            <Link key={img.id} to={`/images/${img.id}`}>
              <div
                className={`p-4 rounded-lg shadow-lg transition ${
                  darkMode
                    ? "bg-[#0B0E1D] text-white"
                    : "bg-[#F7FAFF] text-black"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">
                  {img.title || "N/A"}
                </h3>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center mt-10 text-gray-500">
            No images found.
          </p>
        )}
      </div>
    </div>
  );
}
