import React from "react";
import { useSelector } from "react-redux";
import "../styles/Home.css";
import OptionsSection from "./OptionsSection";
import PricingTable from "./PricingTable";

const Home = () => {
  console.log("✅ Home.jsx is rendering");

  const user = useSelector((state) => state.auth.user);

  return (
    <div className="home">
      {/* 🔹 Content Veil Background */}
      <div className="content-veil" />

      {/* 🔹 Banner Text */}
      <p className="banner-text-upper">
        Connecting Eyecare Professionals with New Opportunities
      </p>
      <p className="banner-text-lower">
        Doctors • Opticians • Techs • Receptionists • Office Managers • Billers • Support Staff
      </p>

      {/* 🔹 Option Cards and Pricing */}
      <div className="component-wrapper">
        <OptionsSection user={user} />
        <PricingTable user={user} />
      </div>
    </div>
  );
};

export default Home;
