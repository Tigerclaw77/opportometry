import React, { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Access denied");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Registered Users</h2>
      {error && <p>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : users.length > 0 ? (
        users.map((user) => (
          <div key={user._id} style={{ marginBottom: "16px" }}>
            <p>
              <strong>Name:</strong> {user.profile?.firstName} {user.profile?.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Users;
