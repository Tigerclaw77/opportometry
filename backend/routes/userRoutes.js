const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyUserRole } = require("../middleware/verifyUserRole");

// Admin-only route
router.get("/admin", verifyUserRole("admin"), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// Admin-only route to fetch all users
router.get("/", verifyUserRole("admin"), async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users); // Send as JSON response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Candidate-only route
router.get("/candidate", verifyUserRole("candidate"), (req, res) => {
  res.json({ message: "Welcome, Candidate!" });
});

// Recruiter-only route
router.get("/recruiter", verifyUserRole("recruiter"), (req, res) => {
  res.json({ message: "Welcome, Recruiter!" });
});

module.exports = router;
