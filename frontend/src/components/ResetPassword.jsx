import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../utils/api"; // ✅ NEW IMPORT
import { Button, Paper, Container, Typography } from "@mui/material";
import GlassTextField from "./ui/GlassTextField";
import "../styles/forms.css";

// ✅ Validation schema
const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters.")
    .required("New password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match.")
    .required("Please confirm your new password."),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Extract token from URL query
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      alert("Invalid or missing token. Please check your email link.");
      return;
    }

    try {
      const response = await resetPassword(token, data.newPassword); // ✅ Use centralized API call

      alert(response.message || "Password reset successful!");
      reset();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("🔴 Reset Password Error:", error);
      alert(error.message || "Password reset failed.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={5} className="glass-form reset-password-form">
        <Typography variant="h4" align="center" gutterBottom>
          Reset Your Password
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <GlassTextField
            label="New Password"
            type="password"
            {...register("newPassword")}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <GlassTextField
            label="Confirm New Password"
            type="password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            className="glass-button"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
