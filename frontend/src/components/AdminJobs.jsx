import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

const AdminJobs = () => {
  const [job, setJob] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
  });

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      /* eslint-disable-next-line */
      const response = await axios.post("http://localhost:5000/jobs", job);
      alert("Job added successfully");
      setJob({
        title: "",
        description: "",
        company: "",
        location: "",
        salary: "",
      });
    } catch (error) {
      console.error("Error adding job:", error);
      alert("Failed to add job");
    }
  };

  return (
    <div>
      <h2>Add Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={job.description}
          onChange={handleChange}
        />
        <input
          name="company"
          placeholder="Company"
          value={job.company}
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
        />
        <input
          name="salary"
          placeholder="Salary"
          value={job.salary}
          onChange={handleChange}
        />
        <button type="submit">Add Job</button>
      </form>
    </div>
  );
};

export default AdminJobs;
