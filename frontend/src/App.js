import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminJobs from "./components/AdminJobs";
import JobList from "./components/JobList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/admin" element={<AdminJobs />} />
      </Routes>
    </Router>
  );
}

export default App;
