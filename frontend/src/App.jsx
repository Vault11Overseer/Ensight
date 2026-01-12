import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { healthCheck } from "./api";

function App() {
  useEffect(() => {
    healthCheck()
      .then((data) => {
        console.log("✅ Backend health check:");
        console.log("Status:", data.status);
        console.log("Database:", data.db);
      })
      .catch((err) => {
        console.error("❌ Health check failed:", err);
      });
  }, []);

  return (
    <Router>
      <Routes>
        {/* ROOT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
