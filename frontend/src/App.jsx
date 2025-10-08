import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Upload from "./pages/Upload";
import Libraries from "./pages/Libraries";

// const PrivateRoute = ({ children }) => {
//   const { token } = useAuth();
//   return token ? children : <Navigate to="/login" />;
// };

const PrivateRoute = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" />;
};


export default function App() {
  return (
    
    <AuthProvider>
      {/* <Routes>
       <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
      </Routes> */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* All routes below require authentication */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/libraries" element={<Libraries />} />

          {/* Add more protected routes here */}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

// export default PrivateRoute;
