import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Paper, Typography, CircularProgress, Button } from "@mui/material";
import { verifyEmail } from "../utils/api"; // ✅ Use centralized API
import "../styles/Forms.css";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("Invalid verification request.");
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus("Email verified successfully! You can now log in.");
      })
      .catch((err) => {
        setStatus(err.message || "Invalid or expired verification link.");
      });
  }, [searchParams]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={5} className="glass-form">
        <Typography variant="h4" align="center" gutterBottom>
          Email Verification
        </Typography>
        <Typography align="center">
          {status === "Verifying..." ? <CircularProgress /> : status}
        </Typography>
        {status.includes("successfully") && (
          <Button
            variant="contained"
            className="glass-button"
            fullWidth
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default VerifyEmail;
