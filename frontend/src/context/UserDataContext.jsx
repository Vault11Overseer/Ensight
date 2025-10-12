// /src/context/UserDataContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [librariesCount, setLibrariesCount] = useState(0);
  const [imagesCount, setImagesCount] = useState(0);

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

  return (
    <UserDataContext.Provider value={{ librariesCount, imagesCount }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
