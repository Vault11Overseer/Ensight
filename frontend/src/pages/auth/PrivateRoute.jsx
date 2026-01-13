import { Navigate } from "react-router-dom";

/**
 * PrivateRoute
 * Guards routes that require authentication
 *
 * Current logic:
 * - Checks for auth token in localStorage
 *
 * Future (AWS Cognito):
 * - Replace token check with Cognito session check
 */
export default function PrivateRoute({ children }) {
  // Temporary auth check (works now, Cognito-ready later)
  const token = localStorage.getItem("access_token");

  // Not authenticated → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated → render protected page
  return children;
}
