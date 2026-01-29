// frontend/src/components/module/submodule/Intro.jsx
// DONE

// INTRO
// IMPORTS
import { useUserData } from "../../../services/UserDataContext";


// EXPORT INTRO
export default function Intro() {

  // STATE
  const { user, darkMode, albumsCount, imagesCount } = useUserData();

  // RETURN
  return (
    // WELCOME SECTION
    <div className="mb-10">
     <h1 className={`text-3xl font-bold ${ darkMode ? "text-white" : "text-black" }`}>
          Welcome,{" "}
        <span
          className={`underline ${ darkMode ? "text-[#BDD63B]" : "text-[#1E3A8A]"}`}>
          {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || "User"}
        </span>
        !
      </h1>

      {/* ALBUM COUNT */}
      <p className={`mt-3 text-lg font-semibold  ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
        You’ve created{" "}
        <span className={`font-bold text-xl underline ${darkMode ? "text-[#BDD63B]" : "text-[#1E3A8A]"}`}>
          {albumsCount}
        </span>{" "}
        albums.
      </p>

      {/* IMAGES COUNT */}
      <p className={`mt-2 text-lg font-semibold ${ darkMode ? "text-gray-200" : "text-gray-800" }`}>
        You have uploaded{" "}
          <span className={`font-bold text-xl underline ${darkMode ? "text-[#BDD63B]" : "text-[#1E3A8A]"}`}>
            {imagesCount}
          </span>{" "}
          images.
      </p>

    </div>
  );
}
