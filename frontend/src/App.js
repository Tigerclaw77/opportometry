import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Logout from "./components/Logout";
import LogoutSuccess from "./components/LogoutSuccess";
import Header from "./components/Header";
import Home from "./components/Home";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import RecruiterDashboard from "./components/Recruiter/RecruiterDashboard";
import RecruiterRegistration from "./components/Recruiter/RecruiterRegistration"; // ✅ Import this
import CandidateRegistration from "./components/Candidate/CandidateRegistration";
import CandidateProfile from "./components/Candidate/CandidateProfile";
import CandidateDashboard from "./components/Candidate/CandidateDashboard";
import SearchJobs from "./components/Candidate/SearchJobs";
import JobList from "./components/JobList";
import CheckYourEmail from "./components/CheckYourEmail";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Users from "./components/Users";
import AddJob from "./components/Recruiter/AddJob";
import EditJob from "./components/Recruiter/EditJob";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "./components/Unauthorized";
import Footer from "./components/Footer";

import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import "./styles.css";
import "./styles/Forms.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        {/* Main Content Wrapper */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/logout-success" element={<LogoutSuccess />} />

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
            <Route path="/recruiter/register" element={<RecruiterRegistration />} />
            <Route path="/email-verification" element={<CheckYourEmail />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute allowedRoles={["recruiter", "premiumrecruiter"]} >
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/addjob"
              element={
                <ProtectedRoute allowedRoles={["recruiter", "premiumrecruiter", "admin"]} >
                  <AddJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/editjob/:jobId"
              element={
                <ProtectedRoute allowedRoles={["recruiter", "premiumrecruiter"]} >
                  <EditJob />
                </ProtectedRoute>
              }
            />

            {/* Candidate Routes */}
            <Route path="/candidate/register" element={<CandidateRegistration />} />
            <Route path="/candidateprofile" element={<CandidateProfile />} />
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute allowedRoles={["candidate", "premiumcandidate"]} >
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search-jobs"
              element={
                <ProtectedRoute allowedRoles={["candidate", "premiumcandidate"]} >
                  <SearchJobs />
                </ProtectedRoute>
              }
            />

            {/* Public Routes */}
            <Route path="/jobs" element={<JobList />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
