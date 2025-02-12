const express = require("express");
const router = express.Router();
const { registerUser, loginUser, verifyEmail, forgotPassword } = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

// ✅ Rate Limiting to Prevent Abuse
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 login attempts per IP
  message: "Too many login attempts. Please try again later.",
});

// ✅ Register Route
router.post("/register", registerUser);

// ✅ Login Route (With Rate Limiting)
router.post("/login", loginLimiter, loginUser);

// ✅ Email Verification Route
router.post("/verify-email", verifyEmail);

// ✅ Password Reset Request (Placeholder for Future Implementation)
router.post("/forgot-password", forgotPassword);

module.exports = router;
