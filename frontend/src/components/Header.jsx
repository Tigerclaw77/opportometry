// import React, { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { logout } from "../store/authSlice";
// import { FiBell, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
// import LoadingSpinner from "./LoadingSpinner"; // ✅ Import global loading spinner
// import "../styles/Header.css";

// const Header = () => {
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showLogoutModal, setShowLogoutModal] = useState(false); // ✅ Custom modal state
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ✅ Show logout modal instead of window.confirm()
//   const openLogoutModal = () => setShowLogoutModal(true);
//   const closeLogoutModal = () => setShowLogoutModal(false);

//   // ✅ Logout Function with Global Loading
//   const handleLogout = async () => {
//     setLoading(true);
//     setShowLogoutModal(false); // Close modal when logging out

//     setTimeout(() => {
//       dispatch(logout());
//       localStorage.removeItem("user");
//       sessionStorage.removeItem("user");
//       setUser(null);
//       setDropdownOpen(false);
//       setLoading(false);
//       navigate("/logout-success");
//     }, 1500);
//   };

//   return (
//     <>
//       {loading && <LoadingSpinner />} {/* ✅ Show global loading spinner */}

//       <header className="header">
//         <div className="container">
//           <Link to="/" className="logo">
//             jobs<span className="highlight">.</span>vision
//           </Link>

//           <nav className="nav">
//             <Link to="/notifications" className="icon"><FiBell /></Link>

//             {user ? (
//               <div className="account-container" ref={dropdownRef}>
//                 <button className="account-link" onClick={() => setDropdownOpen(!dropdownOpen)}>
//                   <FiUser />
//                   <span className="user-name">{user.name}</span>
//                 </button>

//                 {dropdownOpen && (
//                   <div className="dropdown-menu">
//                     <Link to="/account" className="dropdown-item">
//                       <FiSettings /> Profile
//                     </Link>
//                     <button className="dropdown-item logout" onClick={openLogoutModal}>
//                       <FiLogOut /> Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link to="/auth/login" className="icon account-link">
//                 <FiUser />
//                 <span className="sign-in-text">Sign In</span>
//               </Link>
//             )}
//           </nav>
//         </div>
//       </header>

//       {/* ✅ Logout Confirmation Modal */}
//       {showLogoutModal && (
//         <div style={modalStyles.overlay}>
//           <div style={modalStyles.modal}>
//             <h3>Confirm Logout</h3>
//             <p>Are you sure you want to log out?</p>
//             <div style={modalStyles.buttonGroup}>
//               <button onClick={handleLogout} style={modalStyles.confirm}>Yes, Logout</button>
//               <button onClick={closeLogoutModal} style={modalStyles.cancel}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// // ✅ Styles for Modal
// const modalStyles = {
//   overlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 10000,
//     animation: "fadeIn 0.3s ease-in-out", // ✅ Fade-in effect
//   },
//   modal: {
//     backgroundColor: "white",
//     padding: "20px",
//     borderRadius: "8px",
//     textAlign: "center",
//     width: "300px",
//     opacity: 0,
//     animation: "fadeInModal 0.3s forwards", // ✅ Smooth modal animation
//   },
//   buttonGroup: {
//     display: "flex",
//     justifyContent: "space-around",
//     marginTop: "10px",
//   },
//   confirm: {
//     backgroundColor: "#e63946",
//     color: "white",
//     padding: "8px 15px",
//     border: "none",
//     cursor: "pointer",
//   },
//   cancel: {
//     backgroundColor: "#ccc",
//     padding: "8px 15px",
//     border: "none",
//     cursor: "pointer",
//   },
// };

// // ✅ Global CSS for Animations
// const globalStyles = `
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }

// @keyframes fadeInModal {
//   from { opacity: 0; transform: translateY(-20px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// `;

// // ✅ Inject Global Styles for Animations
// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = globalStyles;
// document.head.appendChild(styleSheet);


// export default Header;

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { FiBell, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import LoadingSpinner from "./LoadingSpinner"; // ✅ Import global loading spinner
import "../styles/Header.css";

const Header = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ✅ Custom modal state
  const [devMode, setDevMode] = useState(localStorage.getItem("devMode") === "true"); // ✅ Track Dev Mode
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Show logout modal instead of window.confirm()
  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  // ✅ Logout Function with Global Loading
  const handleLogout = async () => {
    setLoading(true);
    setShowLogoutModal(false); // Close modal when logging out

    setTimeout(() => {
      dispatch(logout());
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      setUser(null);
      setDropdownOpen(false);
      setLoading(false);
      navigate("/logout-success");
    }, 1500);
  };

  // ✅ Toggle Dev Mode function
  const toggleDevMode = () => {
    const newDevMode = !devMode;
    localStorage.setItem("devMode", newDevMode); // Store the dev mode status in localStorage
    setDevMode(newDevMode); // Update the state
    window.location.reload(); // Refresh the page to apply the change
  };

  return (
    <>
      {loading && <LoadingSpinner />} {/* ✅ Show global loading spinner */}

      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            jobs<span className="highlight">.</span>vision
          </Link>

          <nav className="nav">
            <Link to="/notifications" className="icon"><FiBell /></Link>

            {/* Add Dev Mode toggle button */}
            {/* <button onClick={toggleDevMode} className="dev-mode-toggle">
              Dev Mode: {devMode ? "ON" : "OFF"}
            </button> */}

            {user ? (
              <div className="account-container" ref={dropdownRef}>
                <button className="account-link" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <FiUser />
                  <span className="user-name">{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/account" className="dropdown-item">
                      <FiSettings /> Profile
                    </Link>
                    <button className="dropdown-item logout" onClick={openLogoutModal}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth/login" className="icon account-link">
                <FiUser />
                <span className="sign-in-text">Sign In</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ✅ Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div style={modalStyles.buttonGroup}>
              <button onClick={handleLogout} style={modalStyles.confirm}>Yes, Logout</button>
              <button onClick={closeLogoutModal} style={modalStyles.cancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ✅ Styles for Modal and Dev Mode button
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
    animation: "fadeIn 0.3s ease-in-out", // ✅ Fade-in effect
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    width: "300px",
    opacity: 0,
    animation: "fadeInModal 0.3s forwards", // ✅ Smooth modal animation
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "10px",
  },
  confirm: {
    backgroundColor: "#e63946",
    color: "white",
    padding: "8px 15px",
    border: "none",
    cursor: "pointer",
  },
  cancel: {
    backgroundColor: "#ccc",
    padding: "8px 15px",
    border: "none",
    cursor: "pointer",
  },
  devModeToggle: {
    background: "#ffcc00",
    border: "none",
    padding: "8px 15px",
    cursor: "pointer",
    fontSize: "14px",
    borderRadius: "5px",
  },
};

// ✅ Global CSS for Animations
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInModal {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

// ✅ Inject Global Styles for Animations
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

export default Header;
