import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import AddJob from "./AddJob";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const response = await axiosInstance.get("/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await axiosInstance.delete(`/jobs/${jobId}`);
      fetchJobs(); // Refresh job list
      alert("Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <h1>Recruiter Dashboard</h1>
      <AddJob jobToEdit={editingJob} onSuccess={fetchJobs} />
      <h2>Your Jobs</h2>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job._id}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <button onClick={() => handleEdit(job)}>Edit</button>
            <button onClick={() => handleDelete(job._id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No jobs found</p>
      )}
    </div>
  );
};

export default RecruiterDashboard;
