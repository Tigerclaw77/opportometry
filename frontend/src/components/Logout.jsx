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
    navigate("/auth/login"); // ✅ Redirect to login page
  }, [dispatch, navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
