import React from "react";
import { authUtils } from "../../lib/api";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuth = authUtils.isAuthenticated();

  if (!isAuth) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
