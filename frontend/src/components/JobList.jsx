import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API calls
import { useSelector } from "react-redux";
import "../styles/JobCard.css"; // Import the JobCard styles

const JobList = () => {
  const [jobs, setJobs] = useState([]); // Start with an empty array
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Access role from Redux (for conditional rendering of the edit button)
  const { role } = useSelector((state) => state.auth);

  // ✅ Fetch jobs from the API when component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/jobs"); // Adjust URL if needed
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []); // Runs only once when the component loads

  // ✅ Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  const toggleFavorite = (jobId) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(jobId)) {
        newFavorites.delete(jobId);
      } else {
        newFavorites.add(jobId);
      }
      return newFavorites;
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="job-list">
      <h2>Available Jobs</h2>
      {/* Dark Mode Toggle Button */}
      <button onClick={toggleDarkMode} className="dark-mode-toggle">
        {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      </button>

      {jobs.length > 0 ? (
        <div className="job-cards">
          {jobs.map((job) => (
            <div key={job._id} className="job-card" onClick={() => openModal(job)}>
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
              {/* Conditionally render the Edit button for admin or recruiter */}
              {(role === "admin" || role === "recruiter") && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Edit job ${job._id}`);
                  }}
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs available</p>
      )}

      {isModalOpen && selectedJob && (
        <div className="modal-overlay active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedJob.title}</h2>
            <p>
              <strong>Company:</strong> {selectedJob.company}
            </p>
            <p>
              <strong>Location:</strong> {selectedJob.location}
            </p>
            <p>
              <strong>Description:</strong> {selectedJob.description}
            </p>
            <p>
              <strong>Salary:</strong> ${selectedJob.salary}
            </p>
            <button onClick={() => toggleFavorite(selectedJob._id)}>
              {favorites.has(selectedJob._id) ? "Remove Favorite" : "Add Favorite"}
            </button>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
