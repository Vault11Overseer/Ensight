// frontend/src/services/UserDataContext.jsx


// USER DATA CONTEXT
// IMPORT
import React, {createContext, useContext, useEffect, useState,} from "react";
import { API_BASE_URL } from "./api";
  
// STATE
const UserDataContext = createContext(null);

// EXPORT
export function UserDataProvider({ children }) {
  const [user, setUser] = useState(null);
  const [albumsCount, setAlbumsCount] = useState(0);
  const [imagesCount, setImagesCount] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) ?? true;
  });

  // LOAD USER FROM LOCAL STORAGE
  useEffect(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // SYNC DARK MODE
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // FETCH ALBUM AND IMAGE COUNT
  useEffect(() => {
    if (!user) return;

    const fetchCounts = async () => {
      try {
        // ALBUM COUNT
        const albumsRes = await fetch(`${API_BASE_URL}/albums/`, {
          credentials: "include",
        });

        if (albumsRes.ok) {
          const albums = await albumsRes.json();
          setAlbumsCount(
            albums.filter((a) => a.owner_user_id === user.id).length
          );
        }

        // IMAGE COUNT
        const imagesRes = await fetch(`${API_BASE_URL}/images/`, {
          credentials: "include",
        });

        if (imagesRes.ok) {
          const images = await imagesRes.json();
          setImagesCount(
            images.filter((img) => img.uploader_user_id === user.id).length
          );
        }
      } catch (err) {
        console.error("Failed to load counts:", err);
      }
    };

    fetchCounts();
  }, [user]);

  return (
    <UserDataContext.Provider
      value={{
        user,
        albumsCount,
        imagesCount,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

// EXPORT USE CONTEXT
export function useUserData() {
  return useContext(UserDataContext);
}
