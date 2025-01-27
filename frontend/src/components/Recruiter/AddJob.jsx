import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Add this to generate unique IDs (Install using `npm install uuid`)

const AddJob = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    id: uuidv4(), // Generate a unique job ID
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    jobType: [], // Array to store multiple options (e.g., full-time, part-time)
    position: "", // Single value for position type (e.g., leaseholder, employee)
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value] // Add value to array if checked
          : prev[name].filter((item) => item !== value), // Remove value if unchecked
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add new job
      await axios.post("http://localhost:5000/jobs", formData);
      alert("Job added successfully!");

      onSuccess(); // Trigger refresh on parent component
      setFormData({
        id: uuidv4(), // Reset unique job ID for new job
        title: "",
        description: "",
        company: "",
        location: "",
        salary: "",
        jobType: [],
        position: "",
      });
    } catch (error) {
      console.error("Error submitting job:", error);
      alert("Failed to submit job");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        placeholder="Job Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />
      <input
        name="company"
        placeholder="Company"
        value={formData.company}
        onChange={handleChange}
        required
      />
      <input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />
      <input
        name="salary"
        placeholder="Salary"
        value={formData.salary}
        onChange={handleChange}
        required
      />

      {/* Job Type (Checkboxes for part-time/full-time) */}
      <fieldset>
        <legend>Job Type</legend>
        <label>
          <input
            type="checkbox"
            name="jobType"
            value="Full-time"
            checked={formData.jobType.includes("Full-time")}
            onChange={handleChange}
          />
          Full-time
        </label>
        <label>
          <input
            type="checkbox"
            name="jobType"
            value="Part-time"
            checked={formData.jobType.includes("Part-time")}
            onChange={handleChange}
          />
          Part-time
        </label>
      </fieldset>

      {/* Position Type (Radio buttons for leaseholder, associate, or employee) */}
      <fieldset>
        <legend>Position Type</legend>
        <label>
          <input
            type="radio"
            name="position"
            value="Leaseholder"
            checked={formData.position === "Leaseholder"}
            onChange={handleChange}
          />
          Leaseholder
        </label>
        <label>
          <input
            type="radio"
            name="position"
            value="Associate"
            checked={formData.position === "Associate"}
            onChange={handleChange}
          />
          Associate
        </label>
        <label>
          <input
            type="radio"
            name="position"
            value="Employee"
            checked={formData.position === "Employee"}
            onChange={handleChange}
          />
          Employee
        </label>
      </fieldset>

      <button type="submit">Add Job</button>
    </form>
  );
};

export default AddJob;
