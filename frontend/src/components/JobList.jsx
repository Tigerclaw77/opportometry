// import React, { useState, useEffect } from "react";
// import axiosInstance from "../axiosInstance"; // Use the Axios instance
// import { useSelector } from "react-redux";

// const JobList = () => {
//   const [jobs, setJobs] = useState([]);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [favorites, setFavorites] = useState(new Set());

//   // Access role from Redux
//   const { role } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await axiosInstance.get("/jobs"); // Fetch jobs using the axios instance
//         setJobs(response.data);
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//       }
//     };
//     fetchJobs();
//   }, []);

//   const openModal = (job) => {
//     setSelectedJob(job);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setSelectedJob(null);
//     setIsModalOpen(false);
//   };

//   const toggleFavorite = (jobId) => {
//     setFavorites((prevFavorites) => {
//       const newFavorites = new Set(prevFavorites);
//       if (newFavorites.has(jobId)) {
//         newFavorites.delete(jobId);
//       } else {
//         newFavorites.add(jobId);
//       }
//       return newFavorites;
//     });
//   };

//   return (
//     <div className="job-list">
//       <h2>Available Jobs</h2>
//       {jobs.length > 0 ? (
//         <div className="job-cards">
//           {jobs.map((job) => (
//             <div
//               key={job._id}
//               className="job-card"
//               onClick={() => openModal(job)}
//             >
//               <h3>{job.title}</h3>
//               <p>{job.company}</p>
//               <p>{job.location}</p>
//               {/* Conditionally render the Edit button for admin or recruiter */}
//               {role === "admin" || role === "recruiter" ? (
//                 <button onClick={() => console.log(`Edit job ${job._id}`)}>
//                   Edit
//                 </button>
//               ) : null}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>No jobs available</p>
//       )}
//       {isModalOpen && selectedJob && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div
//             className="modal-content"
//             onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
//           >
//             <h2>{selectedJob.title}</h2>
//             <p>
//               <strong>Company:</strong> {selectedJob.company}
//             </p>
//             <p>
//               <strong>Location:</strong> {selectedJob.location}
//             </p>
//             <p>
//               <strong>Description:</strong> {selectedJob.description}
//             </p>
//             <p>
//               <strong>Salary:</strong> ${selectedJob.salary}
//             </p>
//             <button onClick={() => toggleFavorite(selectedJob._id)}>
//               {favorites.has(selectedJob._id)
//                 ? "Remove Favorite"
//                 : "Add Favorite"}
//             </button>
//             <button onClick={closeModal}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobList;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./JobCard.css"; // Import the JobCard styles

const JobList = () => {
  const [jobs, setJobs] = useState([
    {
      _id: "1",
      title: "Optometrist",
      company: "Optometry Solutions",
      location: "New York, NY",
      salary: "100,000",
      description: "Join our growing clinic offering excellent benefits and a competitive salary.",
    },
    {
      _id: "2",
      title: "Software Engineer",
      company: "Tech Innovators",
      location: "San Francisco, CA",
      salary: "120,000",
      description: "Work on cutting-edge software development with a team of experts.",
    },
    {
      _id: "3",
      title: "Optometrist",
      company: "Optometry Solutions",
      location: "New York, NY",
      salary: "100,000",
      description: "Join our growing clinic offering excellent benefits and a competitive salary.",
    },
    {
      _id: "4",
      title: "Software Engineer",
      company: "Tech Innovators",
      location: "San Francisco, CA",
      salary: "120,000",
      description: "Work on cutting-edge software development with a team of experts.",
    },
    {
      _id: "5",
      title: "Optometrist",
      company: "Optometry Solutions",
      location: "New York, NY",
      salary: "100,000",
      description: "Join our growing clinic offering excellent benefits and a competitive salary.",
    },
    {
      _id: "6",
      title: "Software Engineer",
      company: "Tech Innovators",
      location: "San Francisco, CA",
      salary: "120,000",
      description: "Work on cutting-edge software development with a team of experts.",
    },
    // Add more jobs as needed
  ]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [isDarkMode, setIsDarkMode] = useState(false); // Track dark mode state

  // Access role from Redux (for conditional rendering of the edit button)
  const { role } = useSelector((state) => state.auth);

  useEffect(() => {
    // Toggle dark mode on the body element
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]); // When dark mode is toggled, update the body class

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
            <div
              key={job._id}
              className="job-card"
              onClick={() => openModal(job)}
            >
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
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
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
