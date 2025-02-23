const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ Fetch User Profile
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.params.userId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update Profile & Archive Old Data
router.post("/update", async (req, res) => {
  const { userId, profileData } = req.body;
  try {
    const user = await User.findOne({ userID: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Archive current profile before updating
    if (user.profile) {
      user.profileHistory.push({ profileData: { ...user.profile }, archivedAt: new Date() });
    }

    // Update profile with new data
    user.profile = { ...profileData, updatedAt: new Date() };
    await user.save();

    res.json({ message: "Profile updated successfully", profile: user.profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
