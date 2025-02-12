import React, { useState, useEffect } from "react";
import axios from "axios";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5000/jobs/saved", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSavedJobs(response.data);
    } catch (error) {
      setError("Error fetching saved jobs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>My Saved Jobs</h2>

      {loading && <p>Loading jobs...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {savedJobs.length === 0 && !loading && <p>No saved jobs yet.</p>}

      <ul style={styles.jobList}>
        {savedJobs.map((job) => (
          <li key={job._id} style={styles.jobItem}>
            <h3>{job.title} at {job.company}</h3>
            <p><strong>Hours:</strong> {job.hours}</p>
            <p><strong>Role:</strong> {job.role}</p>
            <p><strong>Practice Mode:</strong> {job.practiceMode}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: { width: "80%", margin: "20px auto", textAlign: "center" },
  jobList: { listStyle: "none", padding: 0 },
  jobItem: { border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "5px" },
  error: { color: "red" },
};

export default SavedJobs;
