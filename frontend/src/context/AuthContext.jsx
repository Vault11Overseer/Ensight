import React, { createContext, useContext, useState, useEffect } from "react";
import API, { setAuthToken } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // optional: to handle loading state

  // Set token in axios headers and localStorage
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Fetch user info when token changes
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token); // attach token to API requests
        const res = await API.get("/auth/me"); // your endpoint to get current user
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        logout(); // optional: logout if token invalid
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
