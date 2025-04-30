// import React from "react";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import "../styles/Home.css";

// const OptionsSection = () => {
//   const { user, userRole } = useSelector((state) => state.auth);

//   return (
//     <div className="options-container">
//       {/* ✅ GUEST (Not Logged In) */}
//       {!user && (
//         <>
//           <button
//             className="option-button"
//             onClick={() => (window.location.href = "/recruiter/register")}
//           >
//             Register as a Recruiter
//           </button>
//           <button
//             className="option-button"
//             onClick={() => (window.location.href = "/candidate/register")}
//           >
//             Register as a Candidate
//           </button>
//           <Link to="/recruiter/register" className="option-card">
//             <img src="/images/recruiter.jpg" alt="Recruiter" />
//             <h3>Register as a Recruiter</h3>
//           </Link>
//           <Link to="/candidate/register" className="option-card">
//             <img src="/images/candidate.jpg" alt="Candidate" />
//             <h3>Register as a Candidate</h3>
//           </Link>
//           <Link to="/jobs" className="option-card">
//             <img src="/images/browse-jobs.jpg" alt="Browse Jobs" />
//             <h3>Browse Jobs</h3>
//           </Link>
//         </>
//       )}

//       {/* ✅ ADMIN OPTIONS */}
//       {userRole === "admin" && (
//         <>
//           <Link to="/admin" className="option-card">
//             <img src="/images/admin-dashboard.jpg" alt="Admin Dashboard" />
//             <h3>Admin Dashboard</h3>
//           </Link>
//           <Link to="/users" className="option-card">
//             <img src="/images/manage-users.jpg" alt="Manage Users" />
//             <h3>Manage Users</h3>
//           </Link>
//         </>
//       )}

//       {/* ✅ RECRUITER OPTIONS */}
//       {userRole === "recruiter" && (
//         <>
//           <Link to="/recruiter/addjob" className="option-card">
//             <img src="/images/post-job.jpg" alt="Post a Job" />
//             <h3>Post a Job</h3>
//           </Link>
//           <Link to="/recruiter/dashboard" className="option-card">
//             <img src="/images/edit-jobs.jpg" alt="Manage Jobs" />
//             <h3>Manage Jobs</h3>
//           </Link>
//           <Link to="/jobs" className="option-card">
//             <img src="/images/browse-jobs.jpg" alt="Browse Jobs" />
//             <h3>Browse Jobs</h3>
//           </Link>
//         </>
//       )}

//       {/* ✅ CANDIDATE OPTIONS */}
//       {userRole === "candidate" && user?.profile?.tier === 0 && (
//         <>
//           <Link to="/search/basic" className="option-card">
//             <img src="/images/basic-search.jpg" alt="Basic Search" />
//             <h3>Basic Search</h3>
//           </Link>
//           <Link to="/update-profile" className="option-card">
//             <img src="/images/update-profile.jpg" alt="Update Profile" />
//             <h3>Update Profile</h3>
//           </Link>
//           <Link to="/upgrade" className="option-card">
//             <img src="/images/upgrade.jpg" alt="Upgrade" />
//             <h3>Upgrade</h3>
//           </Link>
//         </>
//       )}

//       {/* ✅ Candidate Tier 1 */}
//       {userRole === "candidate" && user?.profile?.tier === 1 && (
//         <>
//           <Link to="/search/advanced" className="option-card">
//             <img src="/images/advanced-search.jpg" alt="Advanced Search" />
//             <h3>Advanced Search</h3>
//           </Link>
//           <Link to="/update-profile" className="option-card">
//             <img src="/images/update-profile.jpg" alt="Update Profile" />
//             <h3>Update Profile</h3>
//           </Link>
//         </>
//       )}

//       {/* ✅ Candidate Tier 2 */}
//       {userRole === "candidate" && user?.profile?.tier === 2 && (
//         <>
//           <Link to="/search/premium" className="option-card">
//             <img src="/images/premium-search.jpg" alt="Premium Search" />
//             <h3>Premium Search</h3>
//           </Link>
//           <Link to="/resume/post" className="option-card">
//             <img src="/images/post-resume.jpg" alt="Post Resume" />
//             <h3>Post Resume</h3>
//           </Link>
//           <Link to="/update-profile" className="option-card">
//             <img src="/images/update-profile.jpg" alt="Update Profile" />
//             <h3>Update Profile</h3>
//           </Link>
//         </>
//       )}
//     </div>
//   );
// };

// export default OptionsSection;

import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../styles/Home.css";

const OptionsSection = () => {
  const { user, userRole } = useSelector((state) => state.auth);

  return (
    <div className="options-container">
      {/* ✅ GUEST (Not Logged In) */}
      {!user && (
        <>
          <button
            className="option-button"
            onClick={() => (window.location.href = "/recruiter/register")}
          >
            Register as a Recruiter
          </button>
          <button
            className="option-button"
            onClick={() => (window.location.href = "/candidate/register")}
          >
            Register as a Candidate
          </button>
          <Link to="/recruiter/register" className="option-card">
            <img src="/images/recruiter.jpg" alt="Recruiter" />
            <h3>Register as a Recruiter</h3>
          </Link>
          <Link to="/candidate/register" className="option-card">
            <img src="/images/candidate.jpg" alt="Candidate" />
            <h3>Register as a Candidate</h3>
          </Link>
          <Link to="/jobs" className="option-card">
            <img src="/images/browse-jobs.jpg" alt="Browse Jobs" />
            <h3>Browse Jobs</h3>
          </Link>
        </>
      )}

      {/* ✅ ADMIN OPTIONS */}
      {userRole === "admin" && (
        <>
          <Link to="/admin" className="option-card">
            <img src="/images/admin-dashboard.jpg" alt="Admin Dashboard" />
            <h3>Admin Dashboard</h3>
          </Link>
          <Link to="/users" className="option-card">
            <img src="/images/manage-users.jpg" alt="Manage Users" />
            <h3>Manage Users</h3>
          </Link>
        </>
      )}

      {/* ✅ RECRUITER OPTIONS */}
      {userRole === "recruiter" && (
        <>
          <Link to="/recruiter/addjob" className="option-card">
            <img src="/images/post-job.jpg" alt="Post a Job" />
            <h3>Post a Job</h3>
          </Link>
          <Link to="/recruiter/dashboard" className="option-card">
            <img src="/images/edit-jobs.jpg" alt="Manage Jobs" />
            <h3>Manage Jobs</h3>
          </Link>
          <Link to="/jobs" className="option-card">
            <img src="/images/browse-jobs.jpg" alt="Browse Jobs" />
            <h3>Browse Jobs</h3>
          </Link>
        </>
      )}

      {/* ✅ CANDIDATE OPTIONS */}
      {userRole === "candidate" && user?.profile?.tier === 0 && (
        <>
          <Link to="/search/basic" className="option-card">
            <img src="/images/basic-search.jpg" alt="Basic Search" />
            <h3>Basic Search</h3>
          </Link>
          <Link to="/update-profile" className="option-card">
            <img src="/images/update-profile.jpg" alt="Update Profile" />
            <h3>Update Profile</h3>
          </Link>
          <Link to="/upgrade" className="option-card">
            <img src="/images/upgrade.jpg" alt="Upgrade" />
            <h3>Upgrade</h3>
          </Link>
        </>
      )}

      {/* ✅ Candidate Tier 1 */}
      {userRole === "candidate" && user?.profile?.tier === 1 && (
        <>
          <Link to="/search/advanced" className="option-card">
            <img src="/images/advanced-search.jpg" alt="Advanced Search" />
            <h3>Advanced Search</h3>
          </Link>
          <Link to="/update-profile" className="option-card">
            <img src="/images/update-profile.jpg" alt="Update Profile" />
            <h3>Update Profile</h3>
          </Link>
        </>
      )}

      {/* ✅ Candidate Tier 2 */}
      {userRole === "candidate" && user?.profile?.tier === 2 && (
        <>
          <Link to="/search/premium" className="option-card">
            <img src="/images/premium-search.jpg" alt="Premium Search" />
            <h3>Premium Search</h3>
          </Link>
          <Link to="/resume/post" className="option-card">
            <img src="/images/post-resume.jpg" alt="Post Resume" />
            <h3>Post Resume</h3>
          </Link>
          <Link to="/update-profile" className="option-card">
            <img src="/images/update-profile.jpg" alt="Update Profile" />
            <h3>Update Profile</h3>
          </Link>
        </>
      )}
    </div>
  );
};

export default OptionsSection;
