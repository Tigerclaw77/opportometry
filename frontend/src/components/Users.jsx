// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Users = () => {
//   const [users, setUsers] = useState([]);

//   const fetchUsers = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.error("No token found. Please log in.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:5000/users", {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Access denied");
//       }

//       const users = await response.json();
//       console.log(users);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   // Call this function when the Users page loads
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // useEffect(() => {
//   //   const fetchUsers = async () => {
//   //     try {
//   //       const response = await axios.get("http://localhost:5000/users");
//   //       setUsers(response.data);
//   //     } catch (error) {
//   //       console.error("Error fetching users:", error);
//   //     }
//   //   };
//   //   fetchUsers();
//   // }, []);

//   return (
//     <div>
//       <h2>Registered Users</h2>
//       {users.length > 0 ? (
//         users.map((user) => (
//           <div key={user._id}>
//             <p>Name: {user.name}</p>
//             <p>Email: {user.email}</p>
//           </div>
//         ))
//       ) : (
//         <p>No users found</p>
//       )}
//     </div>
//   );
// };

// export default Users;

import React, { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
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
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Registered Users</h2>
      {error && <p>{error}</p>}
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user._id}>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        ))
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default Users;
