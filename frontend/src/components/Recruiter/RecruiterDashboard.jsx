import React, { useState, useEffect } from "react";
import {
  fetchRecruiterJobs,
  deleteJob,
  migrateRecruiterJobTemplates
} from "../../utils/api";
import AddJob from "./AddJob";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [archivedJobs, setArchivedJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch only jobs created by the logged-in recruiter
  const getRecruiterJobs = async () => {
    try {
      const recruiterJobs = await fetchRecruiterJobs(); // Now using centralized API
      console.log("✅ Recruiter Jobs Fetched:", recruiterJobs);

      // Separate active and archived jobs
      const activeJobs = recruiterJobs.filter(job => job.status === "open");
      const archived = recruiterJobs.filter(job => job.status !== "open");

      setJobs(activeJobs);
      setArchivedJobs(archived);
    } catch (error) {
      console.error("❌ Error fetching recruiter jobs:", error.message);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await deleteJob(jobId); // ✅ Using centralized delete function
      getRecruiterJobs();     // ✅ Refresh job list after delete
      alert("Job deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting job:", error.message);
      alert("Failed to delete job");
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
  };

  useEffect(() => {
    getRecruiterJobs();
  }, []);

  // ✅ Search Functionality
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Job Template Migration (Convert Job Templates into Jobs)
  const handleMigrateTemplates = async () => {
    try {
      await migrateRecruiterJobTemplates(); // ✅ Centralized function
      alert("Job templates migrated successfully!");
      getRecruiterJobs(); // ✅ Refresh job list
    } catch (error) {
      console.error("❌ Error migrating job templates:", error.message);
      alert("Failed to migrate job templates");
    }
  };

  return (
    <div className="recruiter-dashboard-container">
      <h1>Recruiter Dashboard</h1>

      {/* ✅ Add or Edit Job Form */}
      <AddJob jobToEdit={editingJob} onSuccess={getRecruiterJobs} />

      {/* ✅ Search Bar */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ✅ Active Jobs */}
      <h2>Your Active Jobs</h2>
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <div className="job-actions">
              <button onClick={() => handleEdit(job)}>Edit</button>
              <button onClick={() => handleDelete(job._id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <p>No active jobs found</p>
      )}

      {/* ✅ Archived Jobs */}
      <h2>Archived Jobs</h2>
      {archivedJobs.length > 0 ? (
        archivedJobs.map((job) => (
          <div key={job._id} className="job-card archived">
            <h3>{job.title}</h3>
            <p>{job.description}</p>
          </div>
        ))
      ) : (
        <p>No archived jobs found</p>
      )}

      {/* ✅ Migrate Job Templates Button */}
      <div style={{ marginTop: "30px" }}>
        <button onClick={handleMigrateTemplates}>Migrate Job Templates</button>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
