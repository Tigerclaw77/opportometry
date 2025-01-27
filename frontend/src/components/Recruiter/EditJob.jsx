import React, { useState, useEffect } from "react";
import axios from "axios";

const EditJob = ({ jobToEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    id: "", // This will hold the job ID when editing
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    jobType: [], // Array to store multiple options (e.g., full-time, part-time)
    position: "", // Single value for position type (e.g., leaseholder, employee)
  });

  useEffect(() => {
    if (jobToEdit) {
      setFormData(jobToEdit); // Pre-fill the form with job details
    }
  }, [jobToEdit]);

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
      if (formData.id) {
        // Edit existing job
        await axios.put(`http://localhost:5000/jobs/${formData.id}`, formData);
        alert("Job updated successfully!");
      } else {
        alert("Job ID is missing!");
        return;
      }

      onSuccess(); // Trigger refresh on parent component
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Failed to update job");
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

      <button type="submit">Update Job</button>
    </form>
  );
};

export default EditJob;
