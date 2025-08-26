import React from "react";
import { Star, CheckCircle } from "lucide-react";
import "../../styles/components.css";

const JobModal = ({ job, isFavorite, isApplied, onFavoriteClick, onClose }) => {
  if (!job) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{job.title}</h2>
        <p><strong>Company:</strong> {job.company}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Description:</strong> {job.description}</p>
        {job.salary && <p><strong>Salary:</strong> ${job.salary}</p>}

        <div className="modal-icons">
          <Star
            size={18}
            className={isFavorite ? "job-icon favorite active" : "job-icon favorite"}
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteClick(job._id);
            }}
          />
          <CheckCircle
            size={18}
            className={isApplied ? "job-icon applied active" : "job-icon applied"}
          />
        </div>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default JobModal;
