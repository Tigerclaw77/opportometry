const express = require("express");
const router = express.Router();

const {
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const rateLimit = require("express-rate-limit");
const User = require("../models/User");

// ✅ Middleware for verifying roles (e.g., recruiter, admin)
const { verifyUserRole } = require("../middleware/verifyUserRole");

// ✅ Rate Limiter: Limit login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                   // limit to 5 attempts per windowMs
  message: "Too many login attempts. Please try again later.",
});

// ✅ Login Route
router.post("/login", loginLimiter, loginUser);

// ✅ Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  console.log("📩 Forgot Password Route Hit");
  await forgotPassword(req, res);
});

// ✅ Reset Password Route
router.post("/reset-password", async (req, res) => {
  try {
    console.log("🔍 Received Reset Password Request:", req.body);
    await resetPassword(req, res);
  } catch (error) {
    console.error("🚨 Reset Password Route Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Email Verification Route
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    console.log("📩 Received Email Verification Request, Token:", token);

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      console.log("🚨 Invalid or Expired Verification Token:", token);
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link." });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    console.log("✅ Email Verified Successfully for:", user.email);
    res
      .status(200)
      .json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("🚨 Verification Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
