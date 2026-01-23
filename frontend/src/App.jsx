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

// APP
function App() {
  // =========================
  // BACKEND / DB HEALTH CHECK
  // =========================
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

  // =========================
  // ROUTING
  // =========================
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

  <Route
    path="/albums"
    element={
      <PrivateRoute>
        <Albums />
      </PrivateRoute>
    }
  />

  <Route
    path="/albums/:albumId"
    element={
      <PrivateRoute>
        <AlbumView />
      </PrivateRoute>
    }
  />

  <Route
    path="/gallery"
    element={
      <PrivateRoute>
        <Gallery />
      </PrivateRoute>
    }
  />

<Route
    path="/upload"
    element={
      <PrivateRoute>
        <Upload />
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
