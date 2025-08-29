import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import GlassTextField from "../ui/GlassTextField";
import { supabase } from "../../utils/supabaseClient";
import "../../styles/forms.css";

// Validation
const recruiterSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required."),
  lastName: Yup.string().required("Last name is required."),
  email: Yup.string().email("Invalid email address.").required("Email is required."),
  password: Yup.string().min(6, "Password must be at least 6 characters.").required("Password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match.")
    .required("Please confirm your password."),
  recruiterType: Yup.string().oneOf(["independent", "corporate"]).required("Recruiter type is required."),
});

export default function RecruiterRegistration() {
  const navigate = useNavigate();
  const base = window.location.origin;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(recruiterSchema),
    defaultValues: { recruiterType: "independent" },
  });

  const recruiterType = watch("recruiterType");

  const onSubmit = async (data) => {
    try {
      // Sign up with Supabase; store profile + role in user_metadata for MVP
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${base}/verify-email`,
          data: {
            role: "recruiter",
            firstName: data.firstName,
            lastName: data.lastName,
            recruiterType: data.recruiterType,
          },
        },
      });
      if (error) throw error;

      alert("Recruiter registered! Check your email to confirm your account.");
      reset();
      navigate("/login");
    } catch (err) {
      alert(err.message || "Registration failed. Please try again.");
    }
  };

  const handleCheckboxChange = (e) => {
    setValue("recruiterType", e.target.checked ? "corporate" : "independent");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={5} className="glass-form register-form">
        <Typography variant="h4" align="center" gutterBottom>
          Recruiter Registration
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <GlassTextField
            label="First Name"
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <GlassTextField
            label="Last Name"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <GlassTextField
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <GlassTextField
            label="Password"
            type="password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <GlassTextField
            label="Confirm Password"
            type="password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            fullWidth
            variant="outlined"
            margin="normal"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={recruiterType === "corporate"}
                onChange={handleCheckboxChange}
              />
            }
            label="Corporate recruiter? (must use a corporate email address)"
          />

          <Button
            type="submit"
            variant="contained"
            className="glass-button"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register as Recruiter"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
