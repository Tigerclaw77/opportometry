// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { login } from "../store/authSlice";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const dispatch = useDispatch();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:5000/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await response.json();

//       if (response.ok) {
//         dispatch(login({ token: data.token, role: data.user.role }));
//         alert("Login successful!");
//         if (data.user.role === "admin") {
//           window.location.href = "/admin";
//         } else if (data.user.role === "recruiter") {
//           window.location.href = "/recruiter/dashboard";
//         } else if (data.user.role === "candidate") {
//           window.location.href = "/candidate/dashboard";
//         }
//       } else {
//         alert(data.message || "Login failed.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;

// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom"; // ✅ Use React Router instead of window.location
// import { login } from "../store/authSlice";
// import { loginUser } from "../utils/api"; // ✅ Import API helper

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(""); // ✅ Store error message
//   const dispatch = useDispatch();
//   const navigate = useNavigate(); // ✅ React Router for navigation

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(""); // Clear previous errors

//     try {
//       const data = await loginUser(email, password); // ✅ Call API function

//       // ✅ Dispatch Redux action
//       dispatch(login({ token: data.token, role: data.user.role }));

//       // ✅ Redirect based on user role
//       if (data.user.role === "admin") {
//         navigate("/admin");
//       } else if (data.user.role === "recruiter") {
//         navigate("/recruiter/dashboard");
//       } else if (data.user.role === "candidate") {
//         navigate("/candidate/dashboard");
//       }
//     } catch (error) {
//       setError(error.message); // ✅ Display error message inline
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>} {/* ✅ Show error inline */}
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import { loginUser } from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // ✅ "Remember Me" state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      // ✅ Store in Redux
      dispatch(login({ token: data.token, role: data.user.role }));

      // ✅ Store in localStorage only if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify({ token: data.token, role: data.user.role }));
      } else {
        sessionStorage.setItem("user", JSON.stringify({ token: data.token, role: data.user.role }));
      }

      // ✅ Redirect based on user role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else {
        navigate("/candidate/dashboard");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {error && <p style={styles.error}>{error}</p>} {/* ✅ Styled error message */}
      
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        {/* ✅ "Remember Me" Checkbox */}
        <label style={styles.rememberMe}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          Remember Me
        </label>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? <div style={styles.spinner}></div> : "Login"} {/* ✅ Spinner */}
        </button>
      </form>
    </div>
  );
};

// ✅ Inline Styles
const styles = {
  container: {
    width: "300px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    background: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  rememberMe: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#005a78",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  spinner: {
    width: "20px",
    height: "20px",
    border: "3px solid white",
    borderTop: "3px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default Login;
