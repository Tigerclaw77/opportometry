// import React from "react";
// import { useDispatch } from "react-redux";
// import { login, logout } from "../store/authSlice";

// const RoleSwitcher = () => {
//   const dispatch = useDispatch();

//   const handleSwitch = (role, tier = 0) => {
//     if (!role) {
//       // If role is null, simulate logout
//       dispatch(logout());
//       localStorage.removeItem("user");
//       return;
//     }

//     const mockUser = {
//       _id: "fakeuserid123456", // You can customize
//       email: `${role}@example.com`,
//       profile: {
//         firstName: role.charAt(0).toUpperCase() + role.slice(1),
//         lastName: "Test",
//         updatedAt: new Date(),
//         tier: tier,
//       },
//     };

//     const token = "mockedtoken123"; // Fake token just to simulate being logged in

//     dispatch(
//       login({
//         token: token,
//         userRole: role,
//         user: mockUser,
//       })
//     );

//     // ✅ Also update localStorage so Home.jsx can pick it up
//     localStorage.setItem(
//       "user",
//       JSON.stringify({
//         token: token,
//         userRole: role,
//         user: mockUser,
//       })
//     );
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Role Switcher (Dev Only)</h2>
//       <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
//         <button onClick={() => handleSwitch(null)}>Logout (Guest)</button>
//         <button onClick={() => handleSwitch("candidate", 0)}>
//           Candidate (Free)
//         </button>
//         <button onClick={() => handleSwitch("candidate", 1)}>
//           Candidate (Tier 1)
//         </button>
//         <button onClick={() => handleSwitch("candidate", 2)}>
//           Candidate (Tier 2)
//         </button>
//         <button onClick={() => handleSwitch("recruiter")}>Recruiter</button>
//         <button onClick={() => handleSwitch("admin")}>Admin</button>
//       </div>
//     </div>
//   );
// };

// export default RoleSwitcher;

import React from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";

const RoleSwitcher = () => {
  const dispatch = useDispatch();

  const handleSwitch = (role, tier = 0) => {
    if (!role) {
      dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("user");
      return;
    }

    const token = "mocked-token-123";
    const mockUser = {
      _id: "fakeuserid123456",
      email: `${role}@example.com`,
      userRole: role,
      tier: tier,
      profile: {
        firstName: role.charAt(0).toUpperCase() + role.slice(1),
        lastName: "Test",
        updatedAt: new Date(),
      },
    };

    // ✅ Redux
    dispatch(
      login({
        token,
        userRole: role,
        user: mockUser,
      })
    );

    // ✅ LocalStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Role Switcher (Dev Only)</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <button onClick={() => handleSwitch(null)}>Logout (Guest)</button>
        <button onClick={() => handleSwitch("candidate", 0)}>Candidate (Free)</button>
        <button onClick={() => handleSwitch("candidate", 1)}>Candidate (Tier 1)</button>
        <button onClick={() => handleSwitch("candidate", 2)}>Candidate (Tier 2)</button>
        <button onClick={() => handleSwitch("recruiter", 3)}>Recruiter (Premium)</button>
        <button onClick={() => handleSwitch("admin", 999)}>Admin</button>
      </div>
    </div>
  );
};

export default RoleSwitcher;
