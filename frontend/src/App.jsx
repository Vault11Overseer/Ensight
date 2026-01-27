// =========================
// APP PAGE
// =========================

// IMPORTS
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate,} from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoute from "./pages/auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Albums from "./pages/Album";
import Gallery from "./pages/Gallery";
import { API_BASE_URL,healthCheck } from "./services/api";
import AlbumView from "./components/page/AlbumView"
import Upload from "./pages/Upload"
import Settings from "./pages/Settings"
import Images from "./pages/Images"
import ImageDetail from "./components/page/ImageDetail"
// APP
function App() {

  // BACKEND / DB HEALTH CHECK
  useEffect(() => {
    healthCheck()
      .then((data) => {
        console.log("HEALTH DATA:", data);
        console.log("✅ Backend health check");
      })
      .catch((err) => {
        console.error("❌ HEALTH CHECK ERROR", err.response?.data || err.message);
      });
  }, []);

  // RETURN
  return (


<Router>
<Routes>
  {/* ROOT */}
  <Route path="/" element={<Navigate to="/login" replace />} />

  {/* PUBLIC */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* PROTECTED */}
  <Route
    path="/dashboard"
    element={
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    }
  />
{/* ALBUMS */}
  <Route
    path="/albums"
    element={
      <PrivateRoute>
        <Albums />
      </PrivateRoute>
    }
  />

{/* SINGLE ALBUM */}
  <Route
    path="/albums/:albumId"
    element={
      <PrivateRoute>
        <AlbumView />
      </PrivateRoute>
    }
  />
{/* GALLERY */}
  <Route
    path="/gallery"
    element={
      <PrivateRoute>
        <Gallery />
      </PrivateRoute>
    }
  />
{/* UPLOAD */}
<Route
    path="/upload"
    element={
      <PrivateRoute>
        <Upload />
      </PrivateRoute>
    }
  />
{/* SETTINGS */}
<Route
    path="/settings"
    element={
      <PrivateRoute>
        <Settings />
      </PrivateRoute>
    }
  />
{/* IMAGES */}
  <Route
    path="/images"
    element={
      <PrivateRoute>
        <Images />
      </PrivateRoute>
    }
  />

  {/* SINGLE IMAGE */}
  <Route
    path="/imagedetail"
    element={
      <PrivateRoute>
        <ImageDetail />
      </PrivateRoute>
    }
  />

  {/* FALLBACK */}
  <Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
</Router>











  
  );
}

export default App;
