import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
// import Dashboard from "./pages/Dashboard";
// import PrivateRoute from "./pages/auth/PrivateRoute";
import { healthCheck } from "./api";



function App() {


  const [status, setStatus] = useState("Loading...");
  const [dbStatus, setDbStatus] = useState("Checking DB...");

  // USE EFFECT - HEALTH CHECK FOR BACKEND CONNECTION
  useEffect(() => {
    healthCheck()
      .then(data => {
        setStatus(data.status);
        if (data.db) setDbStatus(data.db);
        console.log("Backend status:", data.status, "DB status:", data.db);
      })
      .catch(err => {
        setStatus("Error");
        console.error("Health check error:", err);
      });
  }, []);


  // RETURN
  return (
    <Router>
      <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Insight Frontend</h1>
        <p>Backend status: {status}</p>
        <p>Database status: {dbStatus}</p>

        <Routes>
          {/* PUBLIC PAGES */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED PAGES */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* REDIRECTS */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
