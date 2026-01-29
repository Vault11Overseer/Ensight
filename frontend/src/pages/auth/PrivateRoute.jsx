// frontend/src/pages/auth/PrivateRoute.jsx
// DONE

// PRIVATE ROUTE
// IMPORTS
import { Navigate } from "react-router-dom";
import { useUserData } from "../../services/UserDataContext";

// EXPORT
export default function PrivateRoute({ children }) {
  const { user } = useUserData();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
