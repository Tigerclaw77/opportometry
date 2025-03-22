import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { resetPasswordRequest } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Button, Paper, Container, Typography } from "@mui/material";
import "../styles/Forms.css";
import GlassTextField from "./ui/GlassTextField";

// ✅ Validation schema
const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await resetPasswordRequest(data.email);  
      alert(response.message || "If an account exists for this email, a reset link has been sent.");
      navigate("/login");
    } catch (error) {
      console.error("Forgot password error:", error);
      alert(error.message || "An error occurred.");
    }
  };  

  return (
    <Container maxWidth="sm">
      <Paper elevation={5} className="glass-form forgot-password-form">
        <Typography variant="h4" align="center" gutterBottom>
          Forgot Password
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <GlassTextField
            label="Email Address"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
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
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
