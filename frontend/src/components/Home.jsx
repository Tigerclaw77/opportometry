import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="home">
    <h1>Welcome to jobs.vision</h1>
    <p>Your gateway to new opportunities.</p>
    <div>
      <Link to="/recruiter/register">
        <button>Register as a Recruiter</button>
      </Link>
      <Link to="/candidate/register">
        <button>Register as a Candidate</button>
      </Link>
    </div>
  </div>
);

export default Home;
