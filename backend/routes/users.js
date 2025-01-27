const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyRole = require("../middleware/authMiddleware");

// Admin-only route
router.get("/admin", verifyRole("admin"), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// Admin-only route to fetch all users
router.get("/", verifyRole("admin"), async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users); // Send as JSON response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Candidate-only route
router.get("/candidate", verifyRole("candidate"), (req, res) => {
  res.json({ message: "Welcome, Candidate!" });
});

// Recruiter-only route
router.get("/recruiter", verifyRole("recruiter"), (req, res) => {
  res.json({ message: "Welcome, Recruiter!" });
});

module.exports = router;
