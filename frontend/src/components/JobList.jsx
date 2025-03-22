import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Star, Eye, CheckCircle } from "lucide-react";
import {
  fetchJobs,
  addJobToFavorites,
  toggleWatchlistJob,
  applyToJob,
} from "../utils/api"; // ✅ API helper functions
import "../styles/JobCard.css";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [watchList, setWatchList] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [promptType, setPromptType] = useState("");

  const navigate = useNavigate();
  const { userId, role } = useSelector((state) => state.auth);

  // ✅ Fetch jobs
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
      }
    };

    loadJobs();
  }, []);

  // ✅ Fetch user job-related data (optional)
  // You can add an endpoint in `api.js` to handle this, but it's omitted for now

  // ✅ Toggle favorites
  const handleFavorite = async (jobId) => {
    if (!userId) {
      setPromptType("favorite");
      setShowAuthPrompt(true);
      return;
    }

    try {
      await addJobToFavorites(jobId);

      setFavorites((prev) => {
        const updated = new Set(prev);
        updated.has(jobId) ? updated.delete(jobId) : updated.add(jobId);
        return updated;
      });
    } catch (error) {
      console.error("Error updating favorites:", error.message);
    }
  };

  // ✅ Toggle watchlist
  const handleWatchlist = async (jobId) => {
    if (!userId) {
      setPromptType("watchlist");
      setShowAuthPrompt(true);
      return;
    }

    try {
      await toggleWatchlistJob(jobId);

      setWatchList((prev) => {
        const updated = new Set(prev);
        updated.has(jobId) ? updated.delete(jobId) : updated.add(jobId);
        return updated;
      });
    } catch (error) {
      console.error("Error updating watchlist:", error.message);
    }
  };

  // ✅ Apply to job
  const handleApply = async (jobId) => {
    if (!userId) {
      setPromptType("apply");
      setShowAuthPrompt(true);
      return;
    }

    if (appliedJobs.has(jobId)) return;

    try {
      await applyToJob(jobId);

      setAppliedJobs((prev) => {
        const updated = new Set(prev);
        updated.add(jobId);
        return updated;
      });
    } catch (error) {
      console.error("Error applying to job:", error.message);
    }
  };

  // ✅ Modal handlers
  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  const closeAuthPrompt = () => {
    setShowAuthPrompt(false);
    setPromptType("");
  };

  return (
    <div className="job-list">
      <h2>Available Jobs</h2>

      {jobs.length > 0 ? (
        <div className="job-cards">
          {jobs.map((job) => (
            <div key={job._id} className="job-card" onClick={() => openModal(job)}>
              {/* Icon Buttons */}
              <div className="job-icon-container">

                {/* Favorite Icon */}
                <div className="tooltip-wrapper">
                  <Star
                    size={18}
                    className={favorites.has(job._id) ? "job-icon favorite active" : "job-icon favorite"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorite(job._id);
                    }}
                  />
                  <span className="tooltip favorite-tooltip">
                    {favorites.has(job._id) ? "Remove favorite" : "Add favorite"}
                  </span>
                </div>

                {/* Watchlist Icon */}
                <div className="tooltip-wrapper">
                  <Eye
                    size={18}
                    className={watchList.has(job._id) ? "job-icon watchlist active" : "job-icon watchlist"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWatchlist(job._id);
                    }}
                  />
                  <span className="tooltip left-align-tooltip">
                    {watchList.has(job._id) ? "Remove from watchlist" : "Watch this job"}
                  </span>
                </div>

                {/* Apply Icon */}
                <div className="tooltip-wrapper">
                  <CheckCircle
                    size={18}
                    className={appliedJobs.has(job._id) ? "job-icon applied active" : "job-icon applied"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(job._id);
                    }}
                  />
                  <span className="tooltip applied-tooltip">
                    {appliedJobs.has(job._id) ? "You already applied" : "Apply here"}
                  </span>
                </div>
              </div>

              {/* Job Info */}
              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>

              {/* Edit Button */}
              {(role === "admin" || role === "recruiter") && (
                <button onClick={(e) => e.stopPropagation()}>Edit</button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs available</p>
      )}

      {/* Modal - Job Details */}
      {isModalOpen && selectedJob && (
        <div className="modal-overlay active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedJob.title}</h2>
            <p><strong>Company:</strong> {selectedJob.company}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            {selectedJob.salary && <p><strong>Salary:</strong> ${selectedJob.salary}</p>}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Modal - Login/Register Prompt */}
      {showAuthPrompt && (
        <div className="modal-overlay active" onClick={closeAuthPrompt}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <h3>
              {promptType === "favorite"
                ? "Save to Favorites"
                : promptType === "watchlist"
                ? "Add to Watchlist"
                : "Apply to Job"}
            </h3>
            <p>
              You need to log in or register to{" "}
              {promptType === "favorite"
                ? "save this job"
                : promptType === "watchlist"
                ? "add this job to your watchlist"
                : "apply for this job"}.
            </p>

            <div className="modal-buttons">
              <button onClick={() => navigate("/login")}>Log In</button>
              <button onClick={() => navigate("/register")}>Register</button>
              <button className="close-btn" onClick={closeAuthPrompt}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
