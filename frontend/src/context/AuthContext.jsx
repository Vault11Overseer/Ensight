// frontend/src/context/AuthContext.jsx

// =========================
// AUTHENTICATION CONTEXT
// =========================

// =========================
// IMPORTS
// =========================
import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

// =========================
// AUTH CONTEXT
// =========================
const AuthContext = createContext();

// =========================
// AUTH PROVIDER
// =========================
export const AuthProvider = ({ children }) => {
  // =========================
  // STATE
  // =========================
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOGIN
  // =========================
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  // =========================
  // FETCH USER
  // =========================
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await API.get("/auth/me");
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

  // =========================
  // RETURN
  // =========================
  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// =========================
// EXPORT USER AUTHENTICATION
// =========================
export const useAuth = () => useContext(AuthContext);
