import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isDevMode =
    process.env.NODE_ENV === "development" ||
    process.env.REACT_APP_DEV_MODE === "true" ||
    localStorage.getItem("devMode") === "true";

  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("REACT_APP_DEV_MODE:", process.env.REACT_APP_DEV_MODE);
  console.log("isDevMode:", isDevMode);

  const userData = localStorage.getItem("user");
  console.log("LocalStorage userData:", userData);

  const user = isDevMode
    ? { role: "admin", token: "dev-token" } // ✅ Always fallback in dev
    : userData
      ? JSON.parse(userData)
      : null;

  console.log("Resolved user:", user);

  if (!user) {
    console.log("❌ No user found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    console.log("✅ Admin override: access granted");
    return children;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log(`❌ User role "${user.role}" not allowed. Redirecting to /unauthorized`);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ User role allowed: access granted");
  return children;
};

export default ProtectedRoute;
