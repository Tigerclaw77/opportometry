import React from "react";
import { useSelector } from "react-redux";
import "../styles/Home.css";
import OptionsSection from "./OptionsSection";
import PricingTable from "./PricingTable";

const Home = () => {
  // ✅ Get user directly from Redux
  const user = useSelector((state) => state.auth.user);

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
      <div className="scrolling-container">
        <div className="scrolling-content">
          <img src="/images/eyedoctor.jpg" alt="Eyecare Doctor" />
          <img src="/images/optician.jpg" alt="Optician" />
          <img src="/images/tech.jpg" alt="Technician" />
          <img src="/images/staff.jpg" alt="Staff" />
          <img src="/images/eyedoctor2.jpg" alt="Eyecare Doctor" />
          <img src="/images/receptionist.jpg" alt="Receptionist" />
          <img src="/images/admin.jpg" alt="Admin Staff" />
          {/* Duplicate images for looping stability */}
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

      {/* 🔹 Core Content */}
      <div className="component-wrapper">
        <OptionsSection user={user} />
        <PricingTable user={user} />
      </div>
    </div>
  );
};

export default Home;
