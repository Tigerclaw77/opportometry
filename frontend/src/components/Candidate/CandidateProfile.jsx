import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom"; // Use Navigate instead of Redirect

const CandidateProfile = () => {
  const user = useSelector((state) => state.auth.user); // Access user from Redux store

  // If the user is null (not logged in), redirect to the login page
  if (!user) {
    return <Navigate to="/login" />; // Use Navigate for redirection
  }

  return (
    <div>
      <h2>Candidate Profile</h2>
      <p><strong>First Name:</strong> {user.firstName || "N/A"}</p>
      <p><strong>Last Name:</strong> {user.lastName || "N/A"}</p>
      <p><strong>Email:</strong> {user.email}</p>
      {/* Add more profile details as needed */}
    </div>
  );
};

export default CandidateProfile;
