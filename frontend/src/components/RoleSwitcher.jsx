import React from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "../store/authSlice";

const RoleSwitcher = () => {
  const dispatch = useDispatch();

  const handleSwitch = (role, tier = 0) => {
    if (!role) {
      // If role is null, simulate logout
      dispatch(logout());
      localStorage.removeItem("user");
      return;
    }

    const mockUser = {
      _id: "fakeuserid123456", // You can customize
      email: `${role}@example.com`,
      profile: {
        firstName: role.charAt(0).toUpperCase() + role.slice(1),
        lastName: "Test",
        updatedAt: new Date(),
        tier: tier,
      },
    };

    const token = "mockedtoken123"; // Fake token just to simulate being logged in

    dispatch(
      login({
        token: token,
        userRole: role,
        user: mockUser,
      })
    );

    // ✅ Also update localStorage so Home.jsx can pick it up
    localStorage.setItem(
      "user",
      JSON.stringify({
        token: token,
        userRole: role,
        user: mockUser,
      })
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Role Switcher (Dev Only)</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <button onClick={() => handleSwitch(null)}>Logout (Guest)</button>
        <button onClick={() => handleSwitch("candidate", 0)}>
          Candidate (Free)
        </button>
        <button onClick={() => handleSwitch("candidate", 1)}>
          Candidate (Tier 1)
        </button>
        <button onClick={() => handleSwitch("candidate", 2)}>
          Candidate (Tier 2)
        </button>
        <button onClick={() => handleSwitch("recruiter")}>Recruiter</button>
        <button onClick={() => handleSwitch("admin")}>Admin</button>
      </div>
    </div>
  );
};

export default RoleSwitcher;
