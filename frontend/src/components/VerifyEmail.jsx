// src/components/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import "../styles/forms.css";

export default function VerifyEmail() {
  const [msg, setMsg] = useState("Verifying…");
  const [ok, setOk] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Exchange code in the URL for a session (works for confirm + magic-link)
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) throw error;

        const { data } = await supabase.auth.getSession();
        if (!mounted) return;

        if (data.session) {
          setOk(true);
          setMsg("You're signed in. You're good to go!");
        } else {
          setOk(false);
          setMsg("Link processed, but no session found. Try logging in again.");
        }
      } catch (e) {
        if (!mounted) return;
        setOk(false);
        setMsg(e.message || "Invalid or expired link.");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [location.key]);

  return (
    <Container maxWidth="sm">
      <Paper elevation={5} className="glass-form">
        <Typography variant="h4" align="center" gutterBottom>
          Email Verification
        </Typography>
        <Typography align="center" sx={{ my: 2 }}>
          {msg === "Verifying…" ? <CircularProgress /> : msg}
        </Typography>

        {ok ? (
          <Button variant="contained" className="glass-button" fullWidth onClick={() => navigate("/")}>
            Continue
          </Button>
        ) : (
          <Button variant="outlined" className="glass-button" fullWidth onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        )}
      </Paper>
    </Container>
  );
}
