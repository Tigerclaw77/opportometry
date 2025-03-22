// 
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { FiBell, FiUser, FiLogOut, FiSettings } from "react-icons/fi";
import LoadingSpinner from "./ui/LoadingSpinner";

const Header = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  const handleLogout = async () => {
    setLoading(true);
    setShowLogoutModal(false);

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

  return (
    <>
      {loading && <LoadingSpinner />}

      <header style={styles.header}>
        <div style={styles.container}>
          <Link to="/" style={styles.logo}>
            jobs<span style={{ color: "#e63946" }}>.</span>vision
          </Link>

          <nav style={styles.nav}>
            <Link to="/notifications" style={styles.icon}><FiBell /></Link>

            {user ? (
              <div style={styles.accountContainer} ref={dropdownRef}>
                <button style={styles.accountLink} onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <FiUser />
                  <span style={styles.userName}>{user.name}</span>
                </button>

                {dropdownOpen && (
                  <div style={styles.dropdownMenu}>
                    <Link to="/account" style={styles.dropdownItem}>
                      <FiSettings /> Profile
                    </Link>
                    <button style={styles.dropdownItem} onClick={openLogoutModal}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={styles.icon}>
                <FiUser />
                <span style={styles.signInText}>Sign In</span>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {showLogoutModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div style={styles.buttonGroup}>
              <button onClick={handleLogout} style={styles.confirm}>Yes, Logout</button>
              <button onClick={closeLogoutModal} style={styles.cancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  header: {
    position: "sticky",
    top: 0,
    width: "100%",
    background: "white",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "2px 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "60px",
    zIndex: 1000,
  },
  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "bold",
    textDecoration: "none",
    color: "#005a78",
    marginLeft: "-10px",
  },
  nav: {
    display: "flex",
    gap: "20px",
  },
  icon: {
    fontSize: "22px",
    color: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    padding: 0,
    transition: "color 0.3s ease",
  },
  signInText: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#333",
  },
  accountContainer: {
    position: "relative",
  },
  accountLink: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    textDecoration: "none",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
  },
  userName: {
    fontSize: "14px",
    color: "#333",
    fontWeight: "500",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    background: "white",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "6px",
    width: "150px",
    display: "flex",
    flexDirection: "column",
    padding: "5px 0",
    zIndex: 1001,
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "10px",
    padding: "10px 15px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    textDecoration: "none",
    transition: "background 0.3s ease",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    background: "none",
    border: "none",
  },
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
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    width: "300px",
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
};

export default Header;
