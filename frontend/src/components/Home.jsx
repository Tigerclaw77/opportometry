import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const Home = () => (
  <div className="home">
    <h1>Welcome to jobs.vision</h1>
    <p>Your gateway to new opportunities.</p>
    <div>
      <Link to="/recruiter/register">For Recruiters</Link>
      <Link to="/candidate/register">For Candidates</Link>
    </div>
  </div>
);

export default Home;
