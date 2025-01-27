const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "candidate",
    });
    await newUser.save();
    res.status(201).json({ message: "Candidate registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error registering candidate." });
  }
});

module.exports = router;
