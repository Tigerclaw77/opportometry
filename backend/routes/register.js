const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

// Dynamic registration route
router.post("/", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!["candidate", "recruiter"].includes(role)) {
    return res.status(400).json({ message: "Invalid role specified." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res
      .status(201)
      .json({
        message: `${
          role.charAt(0).toUpperCase() + role.slice(1)
        } registered successfully!`,
      });
  } catch (error) {
    res.status(500).json({ error: "Error registering user." });
  }
});

module.exports = router;
