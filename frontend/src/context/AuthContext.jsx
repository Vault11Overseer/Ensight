// import React, { createContext, useContext, useState, useEffect } from "react";
// import API from "../api/axios"; // updated Axios instance with interceptors

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(localStorage.getItem("token") || null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true); // optional: to handle loading state

//   const login = (newToken) => {
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setToken(null);
//     setUser(null);
//   };

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!token) {
//         setUser(null);
//         setLoading(false);
//         return;
//       }

//       try {
//         // Token is automatically sent via axios interceptor
//         const res = await API.get("/auth/me");
//         setUser(res.data);
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//         logout();
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [token]);

//   return (
//     <AuthContext.Provider value={{ token, user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/me"); // token auto-attached via interceptor
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
