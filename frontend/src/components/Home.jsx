import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => (
  <div className="home">
    <h1 className="home-title">
      jobs<span className="highlight">.</span>vision
    </h1>
    <p className="home-subtitle">Your gateway to new opportunities.</p>

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
