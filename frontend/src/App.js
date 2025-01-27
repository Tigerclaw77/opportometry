import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import AdminDashboard from "./components/Admin/AdminDashboard";
import RecruiterRegistration from "./components/Recruiter/RecruiterRegistration";
import CandidateRegistration from "./components/Candidate/CandidateRegistration";
import RecruiterDashboard from "./components/Recruiter/RecruiterDashboard";
import CandidateDashboard from "./components/Candidate/CandidateDashboard";
import SearchJobs from "./components/Candidate/SearchJobs";
import Users from "./components/Users"; // New Users page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/recruiter/register" element={<RecruiterRegistration />} />
        <Route path="/candidate/register" element={<CandidateRegistration />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/jobs" element={<SearchJobs />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
