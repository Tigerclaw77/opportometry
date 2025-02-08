import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiBell, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import "./Header.css";

const Header = () => {
  const [user, setUser] = useState({
    isLoggedIn: true, // Change to false to test logged-out state
    name: "John Doe",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for the dropdown menu

  // 🔹 Detect clicks outside and close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="container">
        {/* Logo */}
        <Link to="/" className="logo">
          jobs<span className="highlight">.</span>vision
        </Link>

        {/* Navigation Icons */}
        <nav className="nav">
          <Link to="/notifications" className="icon"><FiBell /></Link>

          {/* If logged in, show account dropdown */}
          {user.isLoggedIn ? (
            <div className="account-container" ref={dropdownRef}>
              <button className="account-link" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FiUser />
                <span className="user-name">{user.name}</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="dropdown-menu">
                <Link to="/account" className="dropdown-item">
    <FiSettings /> Profile
  </Link>
  <button id="logout-button" className="dropdown-item logout" onClick={() => alert("Logging out...")}>
    <FiLogOut /> Logout
  </button>
                {/* <Link to="/logout" className="dropdown-item logout">
  <FiLogOut /> Logout
</Link> */}

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
  );
};

export default Header;
