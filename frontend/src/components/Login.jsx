import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login as loginRedux } from "../store/authSlice";
import { fetchUserJobData } from "../store/jobSlice";
import GlassTextField from "../components/ui/GlassTextField";
import {
  Button,
  FormControlLabel,
  Checkbox,
  Paper,
  Container,
  Typography,
  Stack,
} from "@mui/material";
import { supabase } from "../utils/supabaseClient";
import "../styles/forms.css";

// Validation
const passwordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formError, setFormError] = useState("");
  const [sendingMagic, setSendingMagic] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [canResendVerify, setCanResendVerify] = useState(false);

  const base = window.location.origin;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm({ resolver: yupResolver(passwordSchema) });

  const email = watch("email", "");
  const rememberMe = watch("rememberMe", false);

  useEffect(() => {
    try {
      localStorage.setItem("rememberMe", JSON.stringify(!!rememberMe));
    } catch {}
  }, [rememberMe]);

  const roleFromUser = (user) =>
    user?.app_metadata?.role || user?.user_metadata?.role || "candidate";

  const redirectForRole = (role) => {
    if (role === "admin") return "/admin";
    if (role === "recruiter") return "/recruiter/dashboard";
    return "/candidate/dashboard";
  };

  const bootstrapReduxAfterSignIn = async (session) => {
    const user = session?.user ?? (await supabase.auth.getUser()).data.user;
    const token =
      session?.access_token ||
      (await supabase.auth.getSession()).data.session?.access_token;

    const userRole = roleFromUser(user);

    dispatch(
      loginRedux({
        token,
        userRole,
        user: {
          id: user?.id,
          email: user?.email,
          isVerified: !!user?.email_confirmed_at,
          ...user?.user_metadata,
        },
      })
    );

    // Stubbed for now—replace with real pulls later
    dispatch(
      fetchUserJobData({
        savedJobs: [],
        appliedJobs: [],
        recruiterJobs: [],
        hiddenJobs: [],
      })
    );

    navigate(redirectForRole(userRole));
  };

  // --- Password login
  const onPasswordLogin = async ({ email, password }) => {
    setFormError("");
    setCanResendVerify(false);
    setSigningIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      await bootstrapReduxAfterSignIn(data.session);
    } catch (err) {
      console.error("signInWithPassword error:", err);
      const msg = err?.message || "Login failed. Please try again.";
      if (/confirm|verified|not confirmed/i.test(msg)) {
        setCanResendVerify(true);
      }
      if (/password|credentials/i.test(msg)) {
        setError("password", { type: "manual", message: msg });
      } else {
        setFormError(msg);
      }
    } finally {
      setSigningIn(false);
    }
  };

  // --- Magic link
  const sendMagicLink = async () => {
    setFormError("");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("email", { type: "manual", message: "Please enter a valid email" });
      return;
    }
    setSendingMagic(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${base}/verify-email` },
      });
      if (error) throw error;
      alert("Check your inbox for your sign-in link.");
    } catch (err) {
      console.error("signInWithOtp error:", err);
      setFormError(err?.message || "Couldn’t send the magic link.");
    } finally {
      setSendingMagic(false);
    }
  };

  // --- Resend verification (if password login fails due to unverified email)
  const resendVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${base}/verify-email` },
      });
      if (error) throw error;
      alert("Verification email sent. Please check your inbox.");
    } catch (err) {
      console.error("resend verification error:", err);
      alert(err?.message || "Could not resend verification email.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={5} className="glass-form login-form">
        <Typography variant="h4" align="center" gutterBottom>
          Log In
        </Typography>

        {formError && (
          <Typography color="error" align="center" sx={{ mb: 1 }}>
            {formError}
          </Typography>
        )}

        <form onSubmit={handleSubmit(onPasswordLogin)} noValidate>
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
            sx={{ color: "white" }}
          />

          {canResendVerify && (
            <Typography align="center" sx={{ mt: 1 }}>
              <Button size="small" onClick={resendVerification}>
                Resend verification email
              </Button>
            </Typography>
          )}

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              className="glass-button"
              disabled={signingIn}
            >
              {signingIn ? "Logging in…" : "Log In"}
            </Button>

            <Button
              type="button"
              variant="outlined"
              className="glass-button"
              onClick={sendMagicLink}
              disabled={sendingMagic}
            >
              {sendingMagic ? "Sending…" : "Send Magic Link"}
            </Button>
          </Stack>

          <Typography variant="body2" align="center" sx={{ mt: 1.5 }}>
            <Link to="/forgot-password" style={{ textDecoration: "none", color: "#90caf9" }}>
              Forgot Password?
            </Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
}
