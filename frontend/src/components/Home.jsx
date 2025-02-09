import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import OptionsSection from "./OptionsSection";
import PricingTable from "./PricingTable";

const Home = () => {
  const [user, setUser] = useState(null); // Default: Not logged in

  useEffect(() => {
    // Check localStorage for user data
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Function to manually set a user role for testing
  const handleUserChange = (role, tier = 0) => {
    const newUser = role ? { role, tier } : null;
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser)); // Persist across refreshes
  };

  return (
    <div className="home">
      {/* 🔹 Banner Section */}
      <p className="banner-text-upper">
        Connecting Eyecare Professionals with New Opportunities
      </p>

      {/* Mobile Banner (Hidden on Large Screens) */}
      <img
        src="/images/mobile-banner.jpg"
        alt="Eyecare Banner"
        className="mobile-banner"
      />

      {/* Scrolling Carousel (Hidden on Small Screens) */}
      <div className="scrolling-container">
        <div className="scrolling-content">
          <img src="/images/eyedoctor.jpg" alt="Eyecare Doctor" />
          <img src="/images/optician.jpg" alt="Optician" />
          <img src="/images/tech.jpg" alt="Technician" />
          <img src="/images/staff.jpg" alt="Staff" />
          <img src="/images/eyedoctor2.jpg" alt="Eyecare Doctor" />
          <img src="/images/receptionist.jpg" alt="Receptionist" />
          <img src="/images/admin.jpg" alt="Admin Staff" />
          {/* duplicate images to stabiliize looping animation */}
          <img src="/images/eyedoctor.jpg" alt="Eyecare Doctor" />
          <img src="/images/optician.jpg" alt="Optician" />
          <img src="/images/tech.jpg" alt="Technician" />
          <img src="/images/staff.jpg" alt="Staff" />
          <img src="/images/eyedoctor2.jpg" alt="Eyecare Doctor" />
          <img src="/images/receptionist.jpg" alt="Receptionist" />
          <img src="/images/admin.jpg" alt="Admin Staff" />
        </div>
      </div>

      <p className="banner-text-lower">
        Doctors • Opticians • Techs • Receptionists • Office Managers • Billers
        • Support Staff
      </p>

      {/* 🔹 User Role Selection for Testing */}
      <div className="test-controls">
        <p>🔧 Change User Role for Testing:</p>
        <button onClick={() => handleUserChange(null)}>Logout (Guest)</button>
        <button onClick={() => handleUserChange("recruiter")}>Recruiter</button>
        <button onClick={() => handleUserChange("candidate", 0)}>
          Candidate (Free)
        </button>
        <button onClick={() => handleUserChange("candidate", 1)}>
          Candidate (Level 1)
        </button>
        <button onClick={() => handleUserChange("candidate", 2)}>
          Candidate (Level 2)
        </button>
      </div>

      {/* 🔹 Pass user data to OptionsSection */}
      <div className="component-wrapper">
        <OptionsSection user={user} />
        <h3>Search and apply for free!</h3>
        <PricingTable user={user} />
      </div>
    </div>
  );
};

export default Home;
