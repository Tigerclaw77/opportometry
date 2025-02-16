// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom"; // For navigation
// import "../../styles/Profile.css";

// const CandidateProfile = () => {
//   const navigate = useNavigate();

//   const [preferences, setPreferences] = useState({
//     experienceLevel: "",
//     workPreference: [],
//     availability: "full-time",
//   });

//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     setPreferences((prev) => ({
//       ...prev,
//       workPreference: checked
//         ? [...prev.workPreference, name]
//         : prev.workPreference.filter((preference) => preference !== name),
//     }));
//   };

//   const handleRadioChange = (e) => {
//     const { name, value } = e.target;
//     setPreferences((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission (e.g., save preferences, etc.)
//     console.log("Preferences submitted:", preferences);
//   };

//   const handleGoToAccount = () => {
//     // Redirect to account page
//     navigate("/account");
//   };

//   return (
//     <div className="profile-container">
//       <h2>Profile Page</h2>
//       <form onSubmit={handleSubmit} className="profile-form">
//         <div>
//           <h3>Experience Level</h3>
//           <div>
//             <label>
//               <input
//                 type="radio"
//                 name="experienceLevel"
//                 value="beginner"
//                 onChange={handleRadioChange}
//                 checked={preferences.experienceLevel === "beginner"}
//               />
//               Beginner
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="experienceLevel"
//                 value="intermediate"
//                 onChange={handleRadioChange}
//                 checked={preferences.experienceLevel === "intermediate"}
//               />
//               Intermediate
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="experienceLevel"
//                 value="advanced"
//                 onChange={handleRadioChange}
//                 checked={preferences.experienceLevel === "advanced"}
//               />
//               Advanced
//             </label>
//           </div>
//         </div>

//         <div>
//           <h3>Work Preferences</h3>
//           <label>
//             <input
//               type="checkbox"
//               name="remote"
//               onChange={handleCheckboxChange}
//               checked={preferences.workPreference.includes("remote")}
//             />
//             Remote
//           </label>
//           <label>
//             <input
//               type="checkbox"
//               name="in-office"
//               onChange={handleCheckboxChange}
//               checked={preferences.workPreference.includes("in-office")}
//             />
//             In-Office
//           </label>
//         </div>

//         <div>
//           <h3>Availability</h3>
//           <label>
//             <input
//               type="radio"
//               name="availability"
//               value="full-time"
//               onChange={handleRadioChange}
//               checked={preferences.availability === "full-time"}
//             />
//             Full-Time
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="availability"
//               value="part-time"
//               onChange={handleRadioChange}
//               checked={preferences.availability === "part-time"}
//             />
//             Part-Time
//           </label>
//         </div>

//         <button type="submit">Save Preferences</button>
//       </form>

//       <div className="pricing-table">
//         <h3>Pricing Tiers</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Tier</th>
//               <th>Price</th>
//               <th>Features</th>
//               <th>Upgrade</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td>Free</td>
//               <td>Free</td>
//               <td>Basic Search, Limited Access</td>
//               <td>
//                 <button onClick={() => navigate("/upgrade")}>Upgrade</button>
//               </td>
//             </tr>
//             <tr>
//               <td>Level 1</td>
//               <td>$10/month</td>
//               <td>Enhanced Search, Apply 2 Jobs/Day</td>
//               <td>
//                 <button onClick={() => navigate("/upgrade")}>Upgrade</button>
//               </td>
//             </tr>
//             <tr>
//               <td>Level 2</td>
//               <td>$20/month</td>
//               <td>Premium Search, Apply 10 Jobs/Day, Post Resume</td>
//               <td>
//                 <button onClick={() => navigate("/upgrade")}>Upgrade</button>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>

//       <button onClick={handleGoToAccount}>Go to Account</button>
//     </div>
//   );
// };

// export default CandidateProfile;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Profile.css";
import Card from "../Card";

const CandidateProfile = () => {
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    experienceLevel: "",
    workPreference: [],
    availability: "full-time",
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      workPreference: checked
        ? [...prev.workPreference, name]
        : prev.workPreference.filter((preference) => preference !== name),
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Preferences submitted:", preferences);
  };

  const handleGoToAccount = () => {
    navigate("/account");
  };

  return (
    <div className="profile-container">
      <h2>Profile Page</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        {/* Experience Level Card */}
        <Card title="Experience Level">
          <div>
            <label>
              <input
                type="radio"
                name="experienceLevel"
                value="beginner"
                onChange={handleRadioChange}
                checked={preferences.experienceLevel === "beginner"}
              />
              Beginner
            </label>
            <label>
              <input
                type="radio"
                name="experienceLevel"
                value="intermediate"
                onChange={handleRadioChange}
                checked={preferences.experienceLevel === "intermediate"}
              />
              Intermediate
            </label>
            <label>
              <input
                type="radio"
                name="experienceLevel"
                value="advanced"
                onChange={handleRadioChange}
                checked={preferences.experienceLevel === "advanced"}
              />
              Advanced
            </label>
          </div>
        </Card>

        {/* Work Preferences Card */}
        <Card title="Work Preferences">
          <div>
            <label>
              <input
                type="checkbox"
                name="remote"
                onChange={handleCheckboxChange}
                checked={preferences.workPreference.includes("remote")}
              />
              Remote
            </label>
            <label>
              <input
                type="checkbox"
                name="in-office"
                onChange={handleCheckboxChange}
                checked={preferences.workPreference.includes("in-office")}
              />
              In-Office
            </label>
          </div>
        </Card>

        {/* Availability Card */}
        <Card title="Availability">
          <div>
            <label>
              <input
                type="radio"
                name="availability"
                value="full-time"
                onChange={handleRadioChange}
                checked={preferences.availability === "full-time"}
              />
              Full-Time
            </label>
            <label>
              <input
                type="radio"
                name="availability"
                value="part-time"
                onChange={handleRadioChange}
                checked={preferences.availability === "part-time"}
              />
              Part-Time
            </label>
          </div>
        </Card>

        <button type="submit">Save Preferences</button>
      </form>

      <div className="pricing-table">
        <h3>Pricing Tiers</h3>
        <table>
          <thead>
            <tr>
              <th>Tier</th>
              <th>Price</th>
              <th>Features</th>
              <th>Upgrade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Free</td>
              <td>Free</td>
              <td>Basic Search, Limited Access</td>
              <td>
                <button onClick={() => navigate("/upgrade")}>Upgrade</button>
              </td>
            </tr>
            <tr>
              <td>Level 1</td>
              <td>$10/month</td>
              <td>Enhanced Search, Apply 2 Jobs/Day</td>
              <td>
                <button onClick={() => navigate("/upgrade")}>Upgrade</button>
              </td>
            </tr>
            <tr>
              <td>Level 2</td>
              <td>$20/month</td>
              <td>Premium Search, Apply 10 Jobs/Day, Post Resume</td>
              <td>
                <button onClick={() => navigate("/upgrade")}>Upgrade</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button onClick={handleGoToAccount}>Go to Account</button>
    </div>
  );
};

export default CandidateProfile;
