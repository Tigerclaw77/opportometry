import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/jobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div>
      <h2>Available Jobs</h2>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job._id}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p>
              <strong>Company:</strong> {job.company}
            </p>
            <p>
              <strong>Location:</strong> {job.location}
            </p>
            <p>
              <strong>Salary:</strong> ${job.salary}
            </p>
          </div>
        ))
      ) : (
        <p>No jobs available</p>
      )}
    </div>
  );
};

export default JobList;
