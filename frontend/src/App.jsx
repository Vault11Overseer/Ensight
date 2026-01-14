// =========================
// APP PAGE
// =========================

// IMPORTS
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PrivateRoute from "./pages/auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import { healthCheck } from "./api";

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

        {/* PUBLIC AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* CATCH-ALL */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
