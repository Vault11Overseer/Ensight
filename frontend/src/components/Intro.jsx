// import React from "react";
// import { useUserData } from "../context/UserDataContext";

// export default function Intro({ user, darkMode }) {
//   const { librariesCount, imagesCount } = useUserData();

//   return (
//     <div className="mb-10">
//       <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
//         Welcome, {user?.first_name || user?.username || "User"}!
//       </h1>

//       <p className={`mt-3 text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
//         You’ve created{" "}
//         <span className={`font-bold text-xl ${darkMode ? "text-[#BDD63B]" : "text-[#1E3A8A]"}`}>
//           {librariesCount}
//         </span>{" "}
//         libraries
//       </p>

//       <p className={`mt-2 text-lg font-semibold ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
//         You have uploaded{" "}
//         <span className={`font-bold text-xl ${darkMode ? "text-[#BDD63B]" : "text-[#1E3A8A]"}`}>
//           {imagesCount}
//         </span>{" "}
//         images
//       </p>
//     </div>
//   );
// }

import React from "react";
import { useUserData } from "../context/UserDataContext";

export default function Intro({ user, darkMode }) {
  const { librariesCount, imagesCount } = useUserData();

  return (
    <div className="mb-10">
      <h1
        className={`text-3xl font-bold ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        Welcome, {user?.first_name || user?.username || "User"}!
      </h1>

      <p
        className={`mt-3 text-lg font-semibold ${
          darkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        You’ve created{" "}
        <span
          className={`font-bold text-xl ${
            darkMode ? "text-[#BDD63B]" : "text-[#1E3A8A]"
          }`}
        >
          {librariesCount}
        </span>{" "}
        libraries
      </p>

      <p
        className={`mt-2 text-lg font-semibold ${
          darkMode ? "text-gray-200" : "text-gray-800"
        }`}
      >
        You have uploaded{" "}
        <span
          className={`font-bold text-xl ${
            darkMode ? "text-[#BDD63B]" : "text-[#1E3A8A]"
          }`}
        >
          {imagesCount}
        </span>{" "}
        images
      </p>
    </div>
  );
}
