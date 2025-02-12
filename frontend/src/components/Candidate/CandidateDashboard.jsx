import React from "react";
import RecommendedJobs from "./RecommendedJobs";

const CandidateDashboard = () => {
  return (
    <div>
      <h1>Candidate Dashboard</h1>
      <RecommendedJobs /> {/* ✅ Now shows recommended jobs here */}
    </div>
  );
};

export default CandidateDashboard;
