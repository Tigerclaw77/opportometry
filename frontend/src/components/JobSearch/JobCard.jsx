import React from "react";
import { Star, CheckCircle } from "lucide-react";

const JobCard = ({ job, isFavorite, isApplied, onFavoriteClick, onClick }) => {
  return (
    <div className="job-card" onClick={onClick}>
      <div className="job-icon-container">
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
      <h3>{job.title}</h3>
      <p>{job.company}</p>
      <p>{job.location}</p>
      {job.role && job.hours && <p>{job.role} - {job.hours}</p>}
    </div>
  );
};

export default JobCard;
