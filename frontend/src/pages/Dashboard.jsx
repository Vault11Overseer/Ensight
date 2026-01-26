// frontend/src/pages/Dashboard.jsx

// =========================
// DASHBOARD PAGE
// =========================

// IMPORTS
// import React, { useState, useEffect } from "react";
import { Images, ImageUp, LibraryBig, GalleryVerticalEnd } from "lucide-react";
import Header from "../components/module/Header";
import { Link } from "react-router-dom";
import { useUserData } from "../services/UserDataContext";
import SearchBar from "../components/module/submodule/Searchbar";




export default function Dashboard() {
  // =========================
  // STATE
  // =========================

  const {
    darkMode,
    setDarkMode,
  } = useUserData();
  

  // =========================
  // RENDER
  // =========================
  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >

      {/* HEADER */}
      <Header
        navigationProps={{
          toggleDarkMode: () => setDarkMode((prev) => !prev),
        }}
      />


        {/* UPLOAD */}
        <div className="w-full">
        <Link
          to="/upload"
          className={`w-full flex flex-col items-center p-6 rounded-2xl shadow transition ${
            darkMode
              ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
              : "bg-[#263248] text-white hover:bg-[#122342]"
          }`}
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
          <ImageUp size={30} /> Upload
          </h2>
          <hr className="my-4 border-black w-full" />
          <p>Upload your very own images. Add them to your albums, but they all end up in the Gallery.</p>
        </Link>
      </div>


      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">


        {/* ALBUMS */}
        <Link
          to="/albums"
          className={`p-6 rounded-2xl shadow transition ${
            darkMode
              ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
              : "bg-[#263248] text-white hover:bg-[#122342]"
          }`}
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <LibraryBig size={30} /> Albums
          </h2>
          <hr className="my-4 border-black w-full" />
          <p>Create, View, Update, and Delete your own personal albums, and view others' albums.</p>
        </Link>

          {/* PERSONAL IMAGES */}
        <Link
          to="/images"
          className={`p-6 rounded-2xl shadow transition ${
            darkMode
              ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
              : "bg-[#263248] text-white hover:bg-[#122342]"
          }`}
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Images size={30} /> Personal Images
          </h2>
          <hr className="my-4 border-black w-full" />
          <p>View, Update, and Delete your personal images.</p>
        </Link>

      </div>

      {/* GALLERY */}
      <div className="w-full">
        <Link
          to="/gallery"
          className={`w-full flex flex-col items-center p-6 rounded-2xl shadow transition ${
            darkMode
              ? "bg-[#BDD63B] text-black hover:bg-[#a4c12d]"
              : "bg-[#263248] text-white hover:bg-[#122342]"
          }`}
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <GalleryVerticalEnd size={30} />Gallery
          </h2>
          <hr className="my-4 border-black w-full" />
          <p>Browse, Download, or Share all images uploaded to Insight.</p>
        </Link>
      </div>

    


{/* END */}
</div>
  );
}
