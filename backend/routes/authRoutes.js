const express = require("express");
const router = express.Router();

const {
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const rateLimit = require("express-rate-limit");
const User = require("../models/User");

const { verifyUserRole } = require("../middleware/verifyUserRole");
const { verifyUser } = require("../middleware/verifyUserRole");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: "Too many login attempts. Please try again later.",
});

// Login Route
router.post("/login", loginLimiter, loginUser);

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  await forgotPassword(req, res);
});

// Reset Password Route
router.post("/reset-password", async (req, res) => {
  try {
    await resetPassword(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Email Verification Route
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link." });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res
      .status(200)
      .json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ NEW: Authenticated User Session Route
router.get("/me", verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
