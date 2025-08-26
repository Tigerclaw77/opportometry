import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { loginUser } from "../utils/api";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../store/authSlice";
import { fetchUserJobData } from "../store/jobSlice";
import GlassTextField from "../components/ui/GlassTextField";
import {
  Button,
  FormControlLabel,
  Checkbox,
  Paper,
  Container,
  Typography,
} from "@mui/material";

import "../styles/forms.css";

// ✅ Yup validation schema
const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  console.log("🚀 Login component loaded");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    console.log("🔥 Current validation errors:", errors);
  }, [errors]);

  const rememberMe = watch("rememberMe", false);

  const onSubmit = async (data) => {
    setFormError("");

    try {
      // Step 1: Send login request to backend
      const response = await loginUser(data.email, data.password);
      console.log("🧾 Full login response:", response);

      const { token, userRole, redirect, user } = response;

      console.log("🔍 Received user from backend:", {
        email: user.email,
        isVerified: user.isVerified,
        type: typeof user.isVerified,
      });

      // Step 2: Check email verification
      if (!user.isVerified) {
        console.warn("⚠️ User not verified. Redirecting to email verification.");
        return navigate("/email-verification", {
          state: { reason: "unverified-login" },
        });
      }

      // Step 3: Save user to Redux store
      dispatch(login({ token, userRole, user }));

      // Step 4: Sync job interactions
      dispatch(
        fetchUserJobData({
          savedJobs: user.savedJobs || [],
          appliedJobs: user.appliedJobs || [],
          recruiterJobs: user.recruiterJobs || [],
          hiddenJobs: user.hiddenJobs || [],
        })
      );

      // Step 5: Navigate to dashboard
      navigate(redirect);
    } catch (error) {
      console.error("🔴 Backend error caught in login:", error);

      // Log full Axios response if it exists
      if (error.response) {
        console.error("📬 Axios error response data:", error.response.data);
        console.error("📦 Axios error response status:", error.response.status);
        console.error("📨 Axios error response headers:", error.response.headers);
      }

      const { fieldErrors, message } = error.response?.data || {};

      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          setError(field, { type: "manual", message: msg });
        });
      }

      setFormError(message || "Login failed. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={5} className="glass-form login-form">
        <Typography variant="h4" align="center" gutterBottom>
          Log In
        </Typography>

        {formError && (
          <Typography color="error" align="center" style={{ marginBottom: "10px" }}>
            {formError}
          </Typography>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <GlassTextField
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            className="full-width"
            variant="outlined"
            margin="normal"
          />

          <GlassTextField
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            className="full-width"
            variant="outlined"
            margin="normal"
          />

          <FormControlLabel
            control={<Checkbox {...register("rememberMe")} />}
            label="Remember Me"
            style={{ color: "white" }}
          />

          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <Button
              type="submit"
              variant="contained"
              className="glass-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
          </div>

          <Typography variant="body2" align="center" style={{ marginTop: "10px" }}>
            <Link to="/forgot-password" style={{ textDecoration: "none", color: "#1976d2" }}>
              Forgot Password?
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
