// frontend/src/pages/Dashboard.jsx
// DONE

// DASHBOARD
// IMPORTS
import { Images, ImageUp, LibraryBig, GalleryVerticalEnd } from "lucide-react";
import Header from "../components/module/Header";
import { Link } from "react-router-dom";
import { useUserData } from "../services/UserDataContext";

// EXPORT
export default function Dashboard() {
    const { darkMode, setDarkMode } = useUserData();
  
  // RENDER
  return (
    // PAGE BODY
    <div className={`page-set ${ darkMode ? "page-set-dark" : "page-set-light" }`}>

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
          className={`bg-set-hover ${ darkMode ? "bg-set-hover-dark" : "bg-set-hover-light"  }`}
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <ImageUp size={30} className={`${ darkMode ? "text-[#BDD63B]" : "text-[#1E3A8A]"  }`}/> Upload
          </h2>
          <hr className={`my-4 w-full border-t-2 border-black-500 ${darkMode ? "border-white" : "border-black"}`}/>
          <h6 className="w-[85%] text-center font-bold">Upload your very own images, and add them to your albums now or later, but they all end up in the Gallery.</h6>
        </Link>
      </div>


      {/* TWO COLUMN SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">

        {/* ALBUMS */}
        <Link
          to="/albums"
          className={`bg-set-hover ${ darkMode ? "bg-set-hover-dark" : "bg-set-hover-light"  }`}
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold ">
            <LibraryBig size={30} className={`${ darkMode ? "text-[#BDD63B]" : "text-[#1E3A8A]"  }`}/> Albums
          </h2>
          <hr className={`my-4 w-full border-t-2 border-black-500 ${darkMode ? "border-white" : "border-black"}`}/>
          <h6 className="w-[85%] text-center font-bold">Create, View, Update, and Delete your own personal albums, and view others' albums.</h6>
        </Link>

          {/* PERSONAL IMAGES */}
        <Link
          to="/images"
          className={`bg-set-hover ${ darkMode ? "bg-set-hover-dark" : "bg-set-hover-light"  }`}
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Images size={30} className={`${ darkMode ? "text-[#BDD63B]" : "text-[#1E3A8A]"  }`}/> Personal Images
          </h2>
          <hr className={`my-4 w-full border-t-2 border-black-500 ${darkMode ? "border-white" : "border-black"}`}/>
          <h6 className="w-[85%] text-center font-bold">View, Update, and Delete your personal images.</h6>
        </Link>
      </div>

      {/* FULL SECTION */}
      {/* GALLERY */}
      <div className="w-full">
        <Link
          to="/gallery"
          className={`bg-set-hover ${ darkMode ? "bg-set-hover-dark" : "bg-set-hover-light"  }`}
        >
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <GalleryVerticalEnd size={30} className={`${ darkMode ? "text-[#BDD63B]" : "text-[#1E3A8A]"  }`}/>Gallery
          </h2>
          <hr className={`my-4 w-full border-t-2 border-black-500 ${darkMode ? "border-white" : "border-black"}`}/>
          <h6 className="w-[85%] text-center font-bold">Browse, Download, or Share all images uploaded to Insight.</h6>
        </Link>
      </div>

{/* END */}
</div>
  );
}
