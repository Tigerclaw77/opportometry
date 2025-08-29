// src/components/ForgotPassword.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Button, Paper, Container, Typography } from "@mui/material";
import { supabase } from "../utils/supabaseClient";
import "../styles/forms.css";
import GlassTextField from "./ui/GlassTextField";

const schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const base = window.location.origin;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async ({ email }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${base}/reset-password`,
      });
      if (error) throw error;

      alert("If an account exists for this email, a password-reset link has been sent.");
      navigate("/login");
    } catch (err) {
      console.error("Forgot password error:", err);
      alert(err?.message || "An error occurred.");
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
            {isSubmitting ? "Sending…" : "Send Reset Link"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
