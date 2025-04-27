import React, { useState } from "react";
import axios from "axios";

const UserTable = ({ users, lockedUsers }) => {
  const [filter, setFilter] = useState("");

  const filteredUsers = users.filter((user) =>
    user.userRole.toLowerCase().includes(filter.toLowerCase())
  );

  const resetAttempts = async (email) => {
    const token = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).token
      : "";

    try {
      await axios.post(
        "http://localhost:5000/api/admin/reset-failed-attempts",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`Reset login attempts for ${email}`);
    } catch (error) {
      console.error("Failed to reset attempts", error);
    }
  };

  return (
    <div className="user-table">
      <h3>User Management</h3>
      <input
        type="text"
        placeholder="Filter by role (admin/recruiter/candidate)"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Failed Attempts</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.email}>
              <td>{user.email}</td>
              <td>{user.userRole}</td>
              <td>{user.failedLoginAttempts || 0}</td>
              <td>
                {user.failedLoginAttempts > 0 && (
                  <button onClick={() => resetAttempts(user.email)}>
                    Reset Attempts
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
