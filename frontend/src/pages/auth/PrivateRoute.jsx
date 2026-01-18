import { Navigate } from "react-router-dom";

/**
 * DEV-ONLY route guard
 * Replace later with real auth (JWT / Cognito)
 */
export default function PrivateRoute({ children }) {
  // DEV MODE: always allow access
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
