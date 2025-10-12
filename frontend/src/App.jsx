// /src/App.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Libraries from "./pages/Libraries";
import Gallery from "./pages/Gallery";
import ImageDetail from "./pages/ImageDetail";
import LibraryDetail from "./pages/LibraryDetail";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { UserDataProvider } from "./context/UserDataContext";

// Private route wrapper
const PrivateRoute = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/libraries" element={<Libraries />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/images/:id" element={<ImageDetail />} />
            <Route path="/library/:id" element={<LibraryDetail />} />
          </Route>
        </Routes>
      </UserDataProvider>
    </AuthProvider>
  );
}
