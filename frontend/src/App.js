import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Header from "./components/Header";
import Home from "./components/Home";
import AdminDashboard from "./components/Admin/AdminDashboard";
import RecruiterDashboard from "./components/Recruiter/RecruiterDashboard";
import CandidateDashboard from "./components/Candidate/CandidateDashboard";
import SearchJobs from "./components/Candidate/SearchJobs";
import JobList from "./components/JobList";
import Register from "./components/Register";
import Users from "./components/Users";
import AddJob from "./components/Recruiter/AddJob";
import EditJob from "./components/Recruiter/EditJob";
import ProtectedRoute from "./ProtectedRoute";

import "./styles.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/recruiter/register"
          element={<Register role="recruiter" />}
        />
        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRoles={["recruiter", "premiumrecruiter"]}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/addjob"
          element={
            <ProtectedRoute allowedRoles={["recruiter", "premiumrecruiter"]}>
              <AddJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/editjob/:jobId"
          element={
            <ProtectedRoute allowedRoles={["recruiter", "premiumrecruiter"]}>
              <EditJob />
            </ProtectedRoute>
          }
        />

        {/* Candidate Routes */}
        <Route
          path="/candidate/register"
          element={<Register role="candidate" />}
        />
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute allowedRoles={["candidate", "premiumcandidate"]}>
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search-jobs"
          element={
            <ProtectedRoute allowedRoles={["candidate", "premiumcandidate"]}>
              <SearchJobs />
            </ProtectedRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/jobs" element={<JobList />} />
      </Routes>
    </Router>
  );
}

export default App;
