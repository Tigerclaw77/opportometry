import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile.css";
import Card from "../Card";

const CandidateProfile = ({ registeredName }) => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    title: "",
    firstName: registeredName?.firstName || "",
    preferredName: "",
    middleName: "",
    lastName: registeredName?.lastName || "",
    role: [],
    otherRole: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      role: checked ? [...prev.role, name] : prev.role.filter((r) => r !== name),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile submitted:", profile);
  };

  return (
    <div className="profile-container">
      <h2>Profile Page</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        {/* Name Fields */}
        <Card title="Personal Information">
          <div className="name-fields">
            <div className="input-group title-group">
              <label>Title</label>
              <select name="title" value={profile.title} onChange={handleInputChange} className="title-dropdown">
                <option value="">--</option>
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Dr.">Dr.</option>
              </select>
            </div>
            <div className="input-group">
              <label>First Name *</label>
              <input type="text" name="firstName" value={profile.firstName} onChange={handleInputChange} maxLength={15} required />
            </div>
            <div className="input-group">
              <label>Middle Name</label>
              <input type="text" name="middleName" value={profile.middleName} onChange={handleInputChange} maxLength={15} />
            </div> 
            <div className="input-group">
              <label>Last Name *</label>
              <input type="text" name="lastName" value={profile.lastName} onChange={handleInputChange} required />
            </div>
          </div>
        </Card>

        {/* Role Selection */}
        <Card title="Select Your Role">
          <div className="role-selection">
            {[
              "Optometrist", "Ophthalmologist", "Optician",
               "Office Manager", "Optometric Tech", "Ophthalmic Tech", "Surgical Tech", "Scribe", "Front Desk/Reception", "Insurance/Billing"
            ].map((role) => (
              <label key={role} className="checkbox-group">
                <input type="checkbox" name={role} onChange={handleCheckboxChange} checked={profile.role.includes(role)} />
                {role}
              </label>
            ))}
            <div className="checkbox-group other-role">
              <input
                type="checkbox"
                id="other-checkbox"
                name="other"
                onChange={handleCheckboxChange}
                checked={profile.role.includes("other")}
              />
              <label>Other:</label>
              <input
                type="text"
                name="otherRole"
                value={profile.otherRole}
                onChange={handleInputChange}
                placeholder="Specify other role"
                className="other-role-input"
              />
            </div>
          </div>
        </Card>

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default CandidateProfile;
