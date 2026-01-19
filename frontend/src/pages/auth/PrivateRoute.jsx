import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
