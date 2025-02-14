import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userData = localStorage.getItem("user");
  // const user = userData ? JSON.parse(userData) : null;

  const user = process.env.NODE_ENV === "development" 
  ? { role: "admin" }  // ✅ Auto-set admin in development
  : JSON.parse(localStorage.getItem("user"));


  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
