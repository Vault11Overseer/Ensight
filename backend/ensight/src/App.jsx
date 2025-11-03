"use client"
import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import Login from "./pages/auth/Login.jsx"
import Register from "./pages/auth/Register"
import Dashboard from "./pages/Dashboard"
import Upload from "./pages/Upload"
import Libraries from "./pages/Libraries"
import Gallery from "./pages/Gallery"
import ImageDetail from "./components/page/ImageDetail"
import LibraryDetail from "./components/page/LibraryDetail"
import Personal from "./pages/Personal.jsx"
import Settings from "./pages/auth/Settings.jsx"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { UserDataProvider } from "./context/UserDataContext"

// =========================
// PRIVATE ROUTER WRAPPER
// =========================
const PrivateRoute = () => {
  const { token } = useAuth()
  return token ? <Outlet /> : <Navigate to="/login" />
}

// =========================
// APP FUNCTION
// =========================
export default function App() {
  // =========================
  // RETURN
  // =========================
  return (
    <AuthProvider>
      <UserDataProvider>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* PROTECTED ROUTES */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/libraries" element={<Libraries />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/personal" element={<Personal />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/images/:id" element={<ImageDetail />} />
            <Route path="/library/:id" element={<LibraryDetail />} />
          </Route>
        </Routes>
      </UserDataProvider>
    </AuthProvider>
  )
}
