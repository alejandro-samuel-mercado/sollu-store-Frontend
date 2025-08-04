import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/Auth/useAuth";
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userRole !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
