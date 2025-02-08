import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => (
  <div className="home">
    {/* <h1 className="home-title">
      jobs<span className="highlight">.</span>vision
    </h1> */}
    {/* <p className="home-subtitle">Your gateway to new opportunities.</p> */}
{/* Banner Section */}
<div className="banner">
        <div className="banner-text">
          <h2>Connecting Eyecare Professionals with New Opportunities</h2>
          <p>For doctors, opticians, techs, receptionists, and more.</p>
        </div>
        <div className="banner-images">
          <img src="/images/eyecare-doctor.jpg" alt="Eyecare Doctor" />
          <img src="/images/optician.jpg" alt="Optician" />
          <img src="/images/technician.jpg" alt="Technician" />
          <img src="/images/receptionist.jpg" alt="Receptionist" />
        </div>
      </div>
      
      {/* Main Content */}
    <div className="options-container">
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
    </div>
  </div>
);

export default Home;
