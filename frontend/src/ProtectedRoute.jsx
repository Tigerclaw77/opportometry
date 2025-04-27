import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedUserRoles = [] }) => {
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
    ? { userRole: "admin", token: "dev-token" } // ✅ Always fallback in dev
    : userData
      ? JSON.parse(userData)
      : null;

  console.log("Resolved user:", user);

  if (!user) {
    console.log("❌ No user found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (user.userRole === "admin") {
    console.log("✅ Admin override: access granted");
    return children;
  }

  if (!allowedUserRoles.includes(user.userRole)) {
    console.log(`❌ userRole "${user.userRole}" not allowed. Redirecting to /unauthorized`);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ userRole allowed: access granted");
  return children;
};

export default ProtectedRoute;
