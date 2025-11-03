import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

// =========================
// IMPORTS
// =========================
const UserDataContext = createContext();

// =========================
// USER DATA PROVIDER
// =========================
export const UserDataProvider = ({ children }) => {
  // =========================
  // STATE
  // =========================
  const { user } = useAuth();
  const [librariesCount, setLibrariesCount] = useState(0);
  const [imagesCount, setImagesCount] = useState(0);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const librariesRes = await API.get("/libraries/mine");
        setLibrariesCount(librariesRes.data.length);

        const imagesRes = await API.get("/images/mine");
        setImagesCount(imagesRes.data.length);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  // =========================
  // REFRESH USER DATA
  // =========================
  const refreshUserData = async () => {
    if (!user) return;
    try {
      const librariesRes = await API.get("/libraries/mine");
      setLibrariesCount(librariesRes.data.length);

      const imagesRes = await API.get("/images/mine");
      setImagesCount(imagesRes.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, [user]);

  // =========================
  // RETURN
  // =========================
  return (
    <UserDataContext.Provider
      value={{ librariesCount, imagesCount, refreshUserData }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// =========================
// EXPORT USE USER DATA
// =========================
export const useUserData = () => useContext(UserDataContext);
