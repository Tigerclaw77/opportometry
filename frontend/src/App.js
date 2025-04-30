import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import {
  fetchNotifications,
  clearNotifications,
} from "./store/notificationsSlice";

import Login from "./components/Login";
import Logout from "./components/Logout";
import Header from "./components/Header";
import Home from "./components/Home";
import Notifications from "./components/Notifications";
import AdminDashboard from "./components/Admin/AdminDashboard";
import RecruiterDashboard from "./components/Recruiter/RecruiterDashboard";
import RecruiterRegistration from "./components/Recruiter/RecruiterRegistration";
import CandidateRegistration from "./components/Candidate/CandidateRegistration";
import CandidateProfile from "./components/Candidate/CandidateProfile";
import RecruiterProfile from "./components/Recruiter/RecruiterProfile";
import AdminProfile from "./components/Admin/AdminProfile";
import Profile from "./components/Profile";
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

import RoleSwitcher from "./components/RoleSwitcher";

import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import "./styles.css";
import "./styles/Forms.css";

function App() {
  const dispatch = useDispatch();

  // ✅ Restore auth and notifications on page load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.token && storedUser?.userRole && storedUser?.user) {
      dispatch(
        login({
          token: storedUser.token,
          userRole: storedUser.userRole,
          user: storedUser.user,
        })
      );
      dispatch(fetchNotifications()); // ✅ Load notifications on login
      console.log("✅ Rehydrated user and notifications from localStorage");
    } else {
      dispatch(logout()); // ✅ Cleanup if invalid user
      dispatch(clearNotifications());
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/email-verification" element={<CheckYourEmail />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Shared Profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  allowedUserRoles={["admin", "recruiter", "candidate"]}
                >
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedUserRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute allowedUserRoles={["admin"]}>
                  <AdminProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedUserRoles={["admin"]}>
                  <Users />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Routes */}
            <Route
              path="/recruiter/register"
              element={<RecruiterRegistration />}
            />
            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute
                  allowedUserRoles={["recruiter", "premiumrecruiter"]}
                >
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/profile"
              element={
                <ProtectedRoute allowedUserRoles={["recruiter"]}>
                  <RecruiterProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/addjob"
              element={
                <ProtectedRoute
                  allowedUserRoles={["recruiter", "premiumrecruiter", "admin"]}
                >
                  <AddJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/editjob/:jobId"
              element={
                <ProtectedRoute
                  allowedUserRoles={["recruiter", "premiumrecruiter"]}
                >
                  <EditJob />
                </ProtectedRoute>
              }
            />

            {/* Candidate Routes */}
            <Route
              path="/candidate/register"
              element={<CandidateRegistration />}
            />
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute
                  allowedUserRoles={["candidate", "premiumcandidate"]}
                >
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/profile"
              element={
                <ProtectedRoute allowedUserRoles={["candidate"]}>
                  <CandidateProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search-jobs"
              element={
                <ProtectedRoute
                  allowedUserRoles={["candidate", "premiumcandidate"]}
                >
                  <SearchJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route path="/role-switcher" element={<RoleSwitcher />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
