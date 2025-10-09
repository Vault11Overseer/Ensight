import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { Settings, Images } from "lucide-react"; // gear icon
import Search from "../components/Search";

export default function Dashboard() {
  const { token, logout, user } = useAuth(); // make sure AuthContext provides user info (e.g., { name, email })
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  
  // Debug the user object
  useEffect(() => {
    console.log("AuthContext user:", user);
  }, [user]);

  useEffect(() => {
    if (!token) return;
  }, [token]);

  // print(user)


  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {user?.first_name || user?.username || "User"}!
          </h1>
          <p className="text-gray-400">You have uploaded {images.length} images</p>
        </div>
        <div className="flex items-center gap-6">
          
          <button
            className="group flex items-center space-x-2 hover:text-indigo-400 transition"
            title="Settings"
          >
            <Settings size={28} />
            <span className="hidden group-hover:inline">User Settings</span>
          </button>
          
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
          
        </div>
      </div>

      {/* SEARCH FEATURE */}
      < Search />

      {/* Portal links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">

        {/* UPLOAD LINK */}
         <a
          href="/Upload"
          className="bg-[#1E1C29] p-6 rounded-2xl shadow hover:bg-[#272537] transition"
        >
          <h2 className="text-xl font-semibold">⬆️ Upload</h2>
          <p className="text-gray-400 mt-2">Upload your images </p>
        </a>

        {/* LIBRARIES LINK */}
        <a
          href="/Libraries"
          className="bg-[#1E1C29] p-6 rounded-2xl shadow hover:bg-[#272537] transition"
        >
          <h2 className="text-xl font-semibold">📚 Libraries</h2>
          <p className="text-gray-400 mt-2">Browse Collections of Images</p>
        </a>

        {/* PERSONAL LINKS */}
        <a
          href="/personal"
          className="bg-[#1E1C29] p-6 rounded-2xl shadow hover:bg-[#272537] transition"
        >
          <h2 className="text-xl font-semibold">📷 Personal</h2>
          <p className="text-gray-400 mt-2">Manage your uploads<Images /></p>
        </a>

      
        

      </div>

      {/* LOWER GALLERY BAR */}
      <div className="w-full h-1vh">
        <a
          href="/gallery"
          className="w-full flex flex-col items-center bg-[#1E1C29] p-6 rounded-2xl shadow hover:bg-[#272537] transition"
        >
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <span>📷 Gallery</span>
          </h2>
          <p className="text-gray-400 mt-2 flex items-center space-x-2">
            <span>Browse the main gallery</span>
            <Images size={18} />
          </p>
        </a>
      </div>



      {/* Image previews */}
      {images.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="uploaded"
                className="rounded-lg shadow"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
