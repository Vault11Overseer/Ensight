// src/components/ProtectedRoute.jsx

// =========================
// PROTECTED ROUTE
// =========================

// =========================
// IMPORTS
// =========================
import { Navigate } from "react-router-dom";

// =========================
// PROTECTED ROUTE FUNCTION
// =========================
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
