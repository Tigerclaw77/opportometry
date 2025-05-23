import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../styles/Home.css";
import OptionsSection from "./OptionsSection";
import PricingTable from "./PricingTable";
import JobList from "./JobList";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const [showMap, setShowMap] = useState(true);

  return (
    <div className="home">
      {/* 🔹 Banner Section */}
      <p className="banner-text-upper">
        Connecting Eyecare Professionals with New Opportunities
      </p>

      {/* Mobile Banner */}
      <img
        src="/images/mobile-banner.jpg"
        alt="Eyecare Banner"
        className="mobile-banner"
      />

      {/* Scrolling Carousel */}
      {/* <div className="scrolling-container">
        <div className="scrolling-content">
          <img src="/images/eyedoctor.jpg" alt="Eyecare Doctor" />
          <img src="/images/optician.jpg" alt="Optician" />
          <img src="/images/tech.jpg" alt="Technician" />
          <img src="/images/staff.jpg" alt="Staff" />
          <img src="/images/eyedoctor2.jpg" alt="Eyecare Doctor" />
          <img src="/images/receptionist.jpg" alt="Receptionist" />
          <img src="/images/admin.jpg" alt="Admin Staff" />
          <img src="/images/eyedoctor.jpg" alt="Eyecare Doctor" />
          <img src="/images/optician.jpg" alt="Optician" />
          <img src="/images/tech.jpg" alt="Technician" />
          <img src="/images/staff.jpg" alt="Staff" />
          <img src="/images/eyedoctor2.jpg" alt="Eyecare Doctor" />
          <img src="/images/receptionist.jpg" alt="Receptionist" />
          <img src="/images/admin.jpg" alt="Admin Staff" />
        </div>
      </div> */}

      <p className="banner-text-lower">
        Doctors • Opticians • Techs • Receptionists • Office Managers • Billers
        • Support Staff
      </p>

      {/* 🔹 Option Cards and Pricing */}
      <div className="component-wrapper">
        <OptionsSection user={user} />
        <PricingTable user={user} />
      </div>

      {/* 🔹 Map Toggle */}
      {/* <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => setShowMap((prev) => !prev)}>
          {showMap ? "Hide Map" : "Show Map"}
        </button>
      </div> */}

      {/* 🔹 Job List */}
      <div className="component-wrapper">
        <JobList showMap={showMap} />
      </div>
    </div>
  );
};

export default Home;
