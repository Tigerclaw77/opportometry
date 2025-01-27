import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      setMessage("You must log in as an Admin to view this page.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Send token for authentication
        },
      });

      if (!response.ok) {
        throw new Error("Access denied");
      }

      const data = await response.json();
      setUsers(data);
      setMessage(""); // Clear any error message
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Access denied. Ensure you are logged in as an Admin.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {message && <p>{message}</p>}
      <h2>Registered Users</h2>
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user._id}>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
