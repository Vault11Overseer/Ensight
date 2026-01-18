// // frontend/src/pages/auth/Login.jsx

// import React, { useState, useEffect } from "react";
// import { Eye, EyeOff, Sun, Moon } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import Slideshow from "../../components/module/Slideshow";

// export default function Login() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

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

//   // Slideshow slides
//   const slides = [
//     { image: "/images/winter-at-the-strater.jpg", title: "Secure access", subtitle: "Internal use only" },
//     { image: "/images/durango_road.jpg", title: "Team collaboration", subtitle: "Stay connected" },
//     { image: "/images/durango_train.jpg", title: "Data insights", subtitle: "Drive decisions" },
//   ];

//   // ============================
//   // DEV LOGIN (for SPA redirect)
//   // ============================
//   const handleDevLogin = async () => {
//     try {
//       const res = await fetch("http://localhost:8000/auth/login");
//       if (!res.ok) throw new Error("Dev user not found");
  
//       const devUser = await res.json();  // <-- full user object
//       localStorage.setItem("user", JSON.stringify(devUser));  // <-- store for app
//       localStorage.setItem("devLoggedIn", "true");
  
//       navigate("/dashboard");  // redirect to dashboard
//     } catch (err) {
//       console.error(err);
//       alert("Error connecting to backend or dev user missing.");
//     }
//   };
  
  
  

//   // ============================
//   // FORM SUBMISSION
//   // ============================
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log({ email, password });
//     alert("Login submitted! (Cognito login pending)");
//     // navigate("/dashboard"); // Uncomment when backend auth is ready
//   };

//   // ============================
//   // RENDER
//   // ============================
//   return (
//     <div
//       className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
//         darkMode ? "bg-black text-white" : "bg-white text-black"
//       }`}
//     >
//       <div
//         className={`flex w-[900px] max-w-full rounded-2xl shadow-2xl overflow-hidden transition-colors duration-500 ${
//           darkMode ? "bg-[#1E1C29]" : "bg-gray-100"
//         }`}
//         style={{ maxHeight: "90vh" }}
//       >
//         {/* LEFT SLIDESHOW */}
//         <div className="w-1/2 hidden md:block">
//           <Slideshow slides={slides} darkMode={darkMode} containerHeight="80vh" />
//         </div>

//         {/* RIGHT LOGIN FORM */}
//         <div className="w-full md:w-1/2 p-10 flex flex-col justify-center overflow-y-auto">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>Welcome back</h2>
//             <button onClick={toggleDarkMode} className="p-2 rounded-full transition-colors duration-300">
//               {darkMode ? <Sun className="text-[#BDD63B]" size={20} /> : <Moon className="text-[#1E1C29]" size={20} />}
//             </button>
//           </div>

//           <p className={`text-sm mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
//             Sign in to access Insight
//           </p>

//           <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] transition-colors duration-300 ${
//                 darkMode ? "bg-[#2D2B3A] text-white placeholder-gray-400" : "bg-gray-200 text-black placeholder-gray-600"
//               }`}
//             />

//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] transition-colors duration-300 ${
//                   darkMode ? "bg-[#2D2B3A] text-white placeholder-gray-400" : "bg-gray-200 text-black placeholder-gray-600"
//                 }`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>

//             <button
//               type="submit"
//               className="bg-[#BDD63B] hover:bg-[#A4C22F] text-black font-semibold p-3 rounded-lg transition-colors duration-300"
//             >
//               Sign In
//             </button>
//           </form>

//           <button
//             onClick={handleDevLogin}
//             className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg transition-colors duration-300"
//           >
//             Dev Login
//           </button>

//           <p className={`text-sm mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
//             Don't have an account?{" "}
//             <a href="/register" className={`font-medium hover:underline ${darkMode ? "text-[#BDD63B]" : "text-[#1E1C29]"}`}>
//               Register
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }






// frontend/src/pages/auth/Login.jsx

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Slideshow from "../../components/module/Slideshow";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

  const slides = [
    { image: "/images/winter-at-the-strater.jpg", title: "Secure access", subtitle: "Internal use only" },
    { image: "/images/durango_road.jpg", title: "Team collaboration", subtitle: "Stay connected" },
    { image: "/images/durango_train.jpg", title: "Data insights", subtitle: "Drive decisions" },
  ];

  // ============================
  // DEV LOGIN HANDLER
  // ============================
  const handleDevLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/login");
      const data = await res.json();

      if (res.ok && data.status === "dev user ready") {
        // Store minimal user object in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // SPA redirect
        navigate("/dashboard");
      } else {
        alert("Dev user missing. Run init_db.py first.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
    alert("Login submitted! (Cognito login pending)");
    // navigate("/dashboard"); // Uncomment when backend auth is ready
  };

  // ============================
  // RENDER
  // ============================
  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`flex w-[900px] max-w-full rounded-2xl shadow-2xl overflow-hidden transition-colors duration-500 ${
          darkMode ? "bg-[#1E1C29]" : "bg-gray-100"
        }`}
        style={{ maxHeight: "90vh" }}
      >
        {/* LEFT SLIDESHOW */}
        <div className="w-1/2 hidden md:block">
          <Slideshow slides={slides} darkMode={darkMode} containerHeight="80vh" />
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}>Welcome back</h2>
            <button onClick={toggleDarkMode} className="p-2 rounded-full transition-colors duration-300">
              {darkMode ? <Sun className="text-[#BDD63B]" size={20} /> : <Moon className="text-[#1E1C29]" size={20} />}
            </button>
          </div>

          <p className={`text-sm mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Sign in to access Insight
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] transition-colors duration-300 ${
                darkMode ? "bg-[#2D2B3A] text-white placeholder-gray-400" : "bg-gray-200 text-black placeholder-gray-600"
              }`}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BDD63B] transition-colors duration-300 ${
                  darkMode ? "bg-[#2D2B3A] text-white placeholder-gray-400" : "bg-gray-200 text-black placeholder-gray-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="bg-[#BDD63B] hover:bg-[#A4C22F] text-black font-semibold p-3 rounded-lg transition-colors duration-300"
            >
              Sign In
            </button>
          </form>

          <button
            onClick={handleDevLogin}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg transition-colors duration-300"
          >
            Dev Login
          </button>

          <p className={`text-sm mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Don't have an account?{" "}
            <a href="/register" className={`font-medium hover:underline ${darkMode ? "text-[#BDD63B]" : "text-[#1E1C29]"}`}>
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
