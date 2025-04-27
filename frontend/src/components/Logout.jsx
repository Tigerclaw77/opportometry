import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logout()); // ✅ Clears Redux state
    localStorage.removeItem("user"); // ✅ Removes persistent login
    sessionStorage.removeItem("user"); // ✅ Removes temporary login

    // ✅ Set timeout to redirect after 5 seconds
    const timeout = setTimeout(() => {
      navigate("/login");
    }, 5000);

    // ✅ Cleanup function to cancel redirect if user leaves early
    return () => clearTimeout(timeout);
  }, [dispatch, navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>You have been logged out.</h2>
      <p>Redirecting to login page in 5 seconds...</p>
      <p>
        If not redirected,{" "}
        <span
          onClick={() => navigate("/login")}
          style={{ color: "#1976d2", cursor: "pointer", textDecoration: "underline" }}
        >
          click here to log in
        </span>.
      </p>
    </div>
  );
};

export default Logout;
