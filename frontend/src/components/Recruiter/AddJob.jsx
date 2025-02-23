// import React, { useState } from "react";
// import axios from "axios";
// import { v4 as uuidv4 } from "uuid";

// const AddJob = ({ onSuccess }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     company: "",
//     location: "",
//     salary: "",
//     jobType: [],
//     position: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: checked
//           ? [...prev[name], value]
//           : prev[name].filter((item) => item !== value),
//       }));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.post(
//         "http://localhost:5000/api/jobs",
//         { ...formData }, // Ensure we're sending only required fields
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("Job added successfully!");
//       onSuccess();
//       setFormData({
//         title: "",
//         description: "",
//         company: "",
//         location: "",
//         salary: "",
//         jobType: [],
//         position: "",
//       });
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to submit job");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={styles.form}>
//       <h2>Add a Job</h2>
//       <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} required />
//       <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
//       <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
//       <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
//       <input name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} required />

//       {/* Job Type (Checkboxes) */}
//       <fieldset>
//         <legend>Job Type</legend>
//         <label>
//           <input type="checkbox" name="jobType" value="Full-time" checked={formData.jobType.includes("Full-time")} onChange={handleChange} /> Full-time
//         </label>
//         <label>
//           <input type="checkbox" name="jobType" value="Part-time" checked={formData.jobType.includes("Part-time")} onChange={handleChange} /> Part-time
//         </label>
//       </fieldset>

//       {/* Position Type (Radio Buttons) */}
//       <fieldset>
//         <legend>Position Type</legend>
//         <label>
//           <input type="radio" name="position" value="Leaseholder" checked={formData.position === "Leaseholder"} onChange={handleChange} /> Leaseholder
//         </label>
//         <label>
//           <input type="radio" name="position" value="Associate" checked={formData.position === "Associate"} onChange={handleChange} /> Associate
//         </label>
//         <label>
//           <input type="radio" name="position" value="Employee" checked={formData.position === "Employee"} onChange={handleChange} /> Employee
//         </label>
//       </fieldset>

//       <button type="submit" disabled={loading} style={styles.submitButton}>
//         {loading ? "Posting..." : "Post Job"}
//       </button>
//     </form>
//   );
// };

// // ✅ Styles for Better UI
// const styles = {
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//     width: "300px",
//     margin: "20px auto",
//   },
//   submitButton: {
//     backgroundColor: "#005a78",
//     color: "white",
//     border: "none",
//     padding: "10px",
//     cursor: "pointer",
//     borderRadius: "5px",
//     fontSize: "16px",
//   },
// };

// export default AddJob;

// import React, { useState } from "react";
// import axios from "axios";

// const AddJob = ({ onSuccess }) => {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     company: "",
//     location: "",
//     salary: "",
//     jobType: [],
//     position: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: checked
//           ? [...prev[name], value]
//           : prev[name].filter((item) => item !== value),
//       }));
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
  
//     try {
//       const token = localStorage.getItem("token");
//       console.log("🔹 Token being sent:", token); // Debugging
  
//       // ✅ Prevent sending "Authorization: Bearer null"
//       if (!token) {
//         alert("You must be logged in to post a job.");
//         setLoading(false);
//         return;
//       }
  
//       const response = await axios.post(
//         "http://localhost:5000/api/jobs",
//         { ...formData },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
  
//       alert("Job added successfully!");
//       onSuccess();
//       setFormData({
//         title: "",
//         description: "",
//         company: "",
//         location: "",
//         salary: "",
//         jobType: [],
//         position: "",
//       });
//     } catch (error) {
//       console.error("❌ Job submission error:", error);
//       alert(error.response?.data?.message || "Failed to submit job.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={styles.form}>
//       <h2>Add a Job</h2>
//       <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} required />
//       <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
//       <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
//       <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
//       <input name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} required />

//       {/* Job Type (Checkboxes) */}
//       <fieldset>
//         <legend>Job Type</legend>
//         <label>
//           <input type="checkbox" name="jobType" value="Full-time" checked={formData.jobType.includes("Full-time")} onChange={handleChange} /> Full-time
//         </label>
//         <label>
//           <input type="checkbox" name="jobType" value="Part-time" checked={formData.jobType.includes("Part-time")} onChange={handleChange} /> Part-time
//         </label>
//       </fieldset>

//       {/* Position Type (Radio Buttons) */}
//       <fieldset>
//         <legend>Position Type</legend>
//         <label>
//           <input type="radio" name="position" value="Leaseholder" checked={formData.position === "Leaseholder"} onChange={handleChange} /> Leaseholder
//         </label>
//         <label>
//           <input type="radio" name="position" value="Associate" checked={formData.position === "Associate"} onChange={handleChange} /> Associate
//         </label>
//         <label>
//           <input type="radio" name="position" value="Employee" checked={formData.position === "Employee"} onChange={handleChange} /> Employee
//         </label>
//       </fieldset>

//       <button type="submit" disabled={loading} style={styles.submitButton}>
//         {loading ? "Posting..." : "Post Job"}
//       </button>
//     </form>
//   );
// };

// // ✅ Styles for Better UI
// const styles = {
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//     width: "300px",
//     margin: "20px auto",
//   },
//   submitButton: {
//     backgroundColor: "#005a78",
//     color: "white",
//     border: "none",
//     padding: "10px",
//     cursor: "pointer",
//     borderRadius: "5px",
//     fontSize: "16px",
//   },
// };

// export default AddJob;

import React, { useState } from "react";
import axios from "axios";

const AddJob = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    jobType: [],
    position: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {}; // ✅ Send token only if available

      console.log("🔹 Sending job posting request:", formData); // ✅ Debugging log

      const response = await axios.post(
        "http://localhost:5000/api/jobs",
        { ...formData },
        { headers }
      );

      console.log("✅ Job posted successfully:", response.data); // ✅ Debugging log
      alert("Job added successfully!");
      onSuccess();
      setFormData({
        title: "",
        description: "",
        company: "",
        location: "",
        salary: "",
        jobType: [],
        position: "",
      });
    } catch (error) {
      console.error("❌ Job submission error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to submit job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Add a Job</h2>
      <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
      <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />
      <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
      <input name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} required />

      {/* Job Type (Checkboxes) */}
      <fieldset>
        <legend>Job Type</legend>
        <label>
          <input type="checkbox" name="jobType" value="Full-time" checked={formData.jobType.includes("Full-time")} onChange={handleChange} /> Full-time
        </label>
        <label>
          <input type="checkbox" name="jobType" value="Part-time" checked={formData.jobType.includes("Part-time")} onChange={handleChange} /> Part-time
        </label>
      </fieldset>

      {/* Position Type (Radio Buttons) */}
      <fieldset>
        <legend>Position Type</legend>
        <label>
          <input type="radio" name="position" value="Leaseholder" checked={formData.position === "Leaseholder"} onChange={handleChange} /> Leaseholder
        </label>
        <label>
          <input type="radio" name="position" value="Associate" checked={formData.position === "Associate"} onChange={handleChange} /> Associate
        </label>
        <label>
          <input type="radio" name="position" value="Employee" checked={formData.position === "Employee"} onChange={handleChange} /> Employee
        </label>
      </fieldset>

      <button type="submit" disabled={loading} style={styles.submitButton}>
        {loading ? "Posting..." : "Post Job"}
      </button>
    </form>
  );
};

// ✅ Styles for Better UI
const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
    margin: "20px auto",
  },
  submitButton: {
    backgroundColor: "#005a78",
    color: "white",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "16px",
  },
};

export default AddJob;
