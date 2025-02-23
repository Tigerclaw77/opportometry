const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password, role } = req.body;

  // ✅ Ensure required fields are present
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // ✅ Validate role
  if (!["candidate", "recruiter"].includes(role)) {
    return res.status(400).json({ message: "Invalid role specified." });
  }

  try {
    // ✅ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Extract first and last name from full name
    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // ✅ Create new user with profile
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profile: {
        firstName,
        lastName
      }
    });

    await newUser.save();

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`,
      userID: newUser.userID,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;
