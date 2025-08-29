// src/components/ResetPassword.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Button, Paper, Container, Typography, CircularProgress } from "@mui/material";
import { supabase } from "../utils/supabaseClient";
import GlassTextField from "./ui/GlassTextField";
import "../styles/forms.css";

const schema = Yup.object({
  newPassword: Yup.string().min(6, "Password must be at least 6 characters.").required("New password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match.")
    .required("Please confirm your new password."),
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("loading"); // "loading" | "form" | "done" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
      if (!mounted) return;
      if (error) {
        setPhase("error");
        setErrorMsg(error.message || "Invalid or expired recovery link. Please request a new email.");
      } else {
        setPhase("form");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async ({ newPassword }) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      await supabase.auth.signOut(); // end temporary recovery session
      reset();
      setPhase("done");
    } catch (err) {
      setPhase("error");
      setErrorMsg(err?.message || "Password reset failed.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={5} className="glass-form reset-password-form">
        <Typography variant="h4" align="center" gutterBottom>
          Reset Your Password
        </Typography>

        {phase === "loading" && (
          <Typography align="center" sx={{ my: 2 }}>
            <CircularProgress />
          </Typography>
        )}

        {phase === "error" && (
          <Typography color="error" align="center" sx={{ my: 2 }}>
            {errorMsg}
          </Typography>
        )}

        {phase === "form" && (
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

            <Button type="submit" variant="contained" className="glass-button" fullWidth disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}

        {phase === "done" && (
          <>
            <Typography align="center" sx={{ my: 2 }}>
              Your password has been updated. Please log in with your new password.
            </Typography>
            <Button variant="contained" className="glass-button" fullWidth onClick={() => navigate("/login")}>
              Go to Login
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
}
