import React, { useState } from "react";

const AddEditJob = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Job submitted:", job);
  };

  return (
    <div>
      <h2>Add/Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Job Title" onChange={handleChange} />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <input name="company" placeholder="Company" onChange={handleChange} />
        <input name="location" placeholder="Location" onChange={handleChange} />
        <input name="salary" placeholder="Salary" onChange={handleChange} />
        <button type="submit">Save Job</button>
      </form>
    </div>
  );
};

export default AddEditJob;
