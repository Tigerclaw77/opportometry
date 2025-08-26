import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedUserRoles = [],
  allowedTiers = [],
}) => {
  const isDevMode =
    process.env.NODE_ENV === "development" ||
    process.env.REACT_APP_DEV_MODE === "true" ||
    localStorage.getItem("devMode") === "true";

  const reduxUser = useSelector((state) => state.auth.user);

  // ✅ Fallback to dev-mode user if needed
  const user = isDevMode
    ? { userRole: "admin", tier: "premium" }
    : reduxUser;

  console.log("🔐 ProtectedRoute check");
  console.log("User:", user);
  console.log("Allowed roles:", allowedUserRoles);
  console.log("Allowed tiers:", allowedTiers);

  if (!user) {
    console.log("❌ No user: redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (user.userRole === "admin") {
    console.log("✅ Admin override: access granted");
    return children;
  }

  const roleAllowed =
    allowedUserRoles.length === 0 || allowedUserRoles.includes(user.userRole);

  const tierAllowed =
    allowedTiers.length === 0 || allowedTiers.includes(user.tier);

  if (!roleAllowed) {
    console.log(`❌ Blocked: userRole "${user.userRole}" not allowed`);
    return <Navigate to="/unauthorized" replace />;
  }

  if (!tierAllowed) {
    console.log(`❌ Blocked: tier "${user.tier}" not allowed`);
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ Access granted");
  return children;
};

export default ProtectedRoute;
