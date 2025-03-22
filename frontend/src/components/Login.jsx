// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import { login } from "../store/authSlice";
// import GlassTextField from "../components/ui/GlassTextField";
// import {
//   Button,
//   FormControlLabel,
//   Checkbox,
//   Paper,
//   Container,
//   Typography,
// } from "@mui/material";
// import "../styles/Forms.css"; // ✅ Global styles

// // ✅ Yup schema for frontend validation ONLY
// const loginSchema = Yup.object().shape({
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   password: Yup.string().required("Password is required"),
// });

// const Login = () => {
//   console.log("🚀 Login component loaded");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // ✅ Handles backend error messaging (invalid credentials, etc.)
//   const [formError, setFormError] = useState("");

//   const {
//     register,
//     handleSubmit,
//     setError, // ✅ Set field-level errors manually (backend errors)
//     formState: { errors, isSubmitting },
//     watch,
//   } = useForm({
//     resolver: yupResolver(loginSchema),
//   });

//    // ✅ Watch and log validation errors on render
//    useEffect(() => {
//     console.log("🔥 Current validation errors:", errors);
//   }, [errors]);

//   const rememberMe = watch("rememberMe", false);

//   const onSubmit = async (data) => {
//     console.log("🟢 Submitting login:", data);
//     setFormError(""); // ✅ Clear previous backend error on submit

//     try {
//       const response = await axios.post("http://localhost:5000/api/auth/login", {
//         email: data.email,
//         password: data.password,
//       });

//       const { token, userRole } = response.data;

//       // ✅ Save token in Redux
//       dispatch(login({ token, role: userRole }));

//       // ✅ Session/local storage based on rememberMe
//       const storage = rememberMe ? localStorage : sessionStorage;
//       storage.setItem("user", JSON.stringify({ token, role: userRole }));

//       // ✅ Navigate user based on role
//       switch (userRole) {
//         case "admin":
//           navigate("/admin");
//           break;
//         case "recruiter":
//           navigate("/recruiter/dashboard");
//           break;
//         case "candidate":
//         default:
//           navigate("/candidate/dashboard");
//           break;
//       }

//     } catch (error) {
//       console.error("🔴 Backend error response:", error.response?.data);

//       const { fieldErrors, message } = error.response?.data || {};

//       if (fieldErrors) {
//         // ✅ Set specific field-level errors returned by backend
//         Object.entries(fieldErrors).forEach(([field, msg]) => {
//           console.log(`⚠️ Setting error for ${field}: ${msg}`);
//           setError(field, { type: "manual", message: msg });
//         });
//       }

//       // ✅ Set global form error if available
//       if (message) {
//         setFormError(message);
//       } else {
//         setFormError("Login failed. Please try again.");
//       }
//     }
//   };

//   return (
//     <Container maxWidth="sm">
//       <Paper elevation={5} className="glass-form login-form">
//         <Typography variant="h4" align="center" gutterBottom>
//           Log In
//         </Typography>

//         {/* ✅ Global backend error display */}
//         {formError && (
//           <Typography color="error" align="center" style={{ marginBottom: "10px" }}>
//             {formError}
//           </Typography>
//         )}

//         {/* <form onSubmit={handleSubmit(onSubmit)} noValidate> */}
//         <form onSubmit={handleSubmit((data) => {
//   console.log("✅ Form passed validation:", data);
//   onSubmit(data);
// })} noValidate>
//           {/* ✅ Email Field */}
//           <GlassTextField
//             label="Email"
//             type="email"
//             {...register("email")}
//             error={!!errors.email}
//             helperText={errors.email?.message}
//             className="full-width"
//             variant="outlined"
//             margin="normal"
//           />

//           {/* ✅ Password Field */}
//           <GlassTextField
//             label="Password"
//             type="password"
//             {...register("password")}
//             error={!!errors.password}
//             helperText={errors.password?.message}
//             className="full-width"
//             variant="outlined"
//             margin="normal"
//           />

//           {/* ✅ Remember Me Checkbox */}
//           <FormControlLabel
//             control={<Checkbox {...register("rememberMe")} />}
//             label="Remember Me"
//             style={{ color: "white" }} // Optional for theme consistency
//           />

//           {/* ✅ Submit Button (centered) */}
//           <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
//             <Button
//               type="submit"
//               variant="contained"
//               className="glass-button"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Logging in..." : "Log In"}
//             </Button>
//           </div>

//           {/* ✅ Forgot Password Link */}
//           <Typography
//             variant="body2"
//             align="center"
//             style={{ marginTop: "10px" }}
//           >
//             <Link
//               to="/forgot-password"
//               style={{ textDecoration: "none", color: "#1976d2" }}
//             >
//               Forgot Password?
//             </Link>
//           </Typography>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default Login;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { loginUser } from "../utils/api";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../store/authSlice";
import GlassTextField from "../components/ui/GlassTextField";
import {
  Button,
  FormControlLabel,
  Checkbox,
  Paper,
  Container,
  Typography,
} from "@mui/material";

import "../styles/Forms.css";

// ✅ Yup schema for frontend validation ONLY
const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  console.log("🚀 Login component loaded");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Handles backend error messaging (invalid credentials, etc.)
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setError, // ✅ Set field-level errors manually (backend errors)
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // ✅ Watch and log validation errors on render
  useEffect(() => {
    console.log("🔥 Current validation errors:", errors);
  }, [errors]);

  const rememberMe = watch("rememberMe", false);

  // ✅ Updated login handler
  const onSubmit = async (data) => {
    console.log("🟢 Submitting login:", data);
    setFormError(""); // ✅ Clear previous backend error on submit

    try {
      // ✅ Using loginUser from utils/api.js instead of axios.post
      const { token, userRole } = await loginUser(data.email, data.password);

      // ✅ Save token in Redux
      dispatch(login({ token, role: userRole }));

      // ✅ Session/local storage based on rememberMe
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify({ token, role: userRole }));

      // ✅ Navigate user based on role
      switch (userRole) {
        case "admin":
          navigate("/admin");
          break;
        case "recruiter":
          navigate("/recruiter/dashboard");
          break;
        case "candidate":
        default:
          navigate("/candidate/dashboard");
          break;
      }

    } catch (error) {
      console.error("🔴 Backend error response:", error.message);

      const { fieldErrors, message } = error;

      if (fieldErrors) {
        // ✅ Set specific field-level errors returned by backend
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          console.log(`⚠️ Setting error for ${field}: ${msg}`);
          setError(field, { type: "manual", message: msg });
        });
      }

      // ✅ Set global form error if available
      if (message) {
        setFormError(message);
      } else {
        setFormError("Login failed. Please try again.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={5} className="glass-form login-form">
        <Typography variant="h4" align="center" gutterBottom>
          Log In
        </Typography>

        {/* ✅ Global backend error display */}
        {formError && (
          <Typography color="error" align="center" style={{ marginBottom: "10px" }}>
            {formError}
          </Typography>
        )}

        <form
          onSubmit={handleSubmit((data) => {
            console.log("✅ Form passed validation:", data);
            onSubmit(data);
          })}
          noValidate
        >
          {/* ✅ Email Field */}
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

          {/* ✅ Password Field */}
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

          {/* ✅ Remember Me Checkbox */}
          <FormControlLabel
            control={<Checkbox {...register("rememberMe")} />}
            label="Remember Me"
            style={{ color: "white" }} // Optional for theme consistency
          />

          {/* ✅ Submit Button (centered) */}
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

          {/* ✅ Forgot Password Link */}
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
