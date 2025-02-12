const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const User = require("../models/User");
const { authenticateUser } = require("../middleware/auth");

// ✅ Recommend Jobs Based on Saved Jobs & Applied Jobs
router.get("/recommend-jobs", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "candidate") return res.status(403).json({ message: "Unauthorized" });

    // Get saved job roles
    const savedRoles = await Job.find({ _id: { $in: user.savedJobs } }).distinct("role");

    // Recommend similar jobs
    const recommendedJobs = await Job.find({ role: { $in: savedRoles } }).limit(5);
    
    res.json(recommendedJobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recommendations", error: error.message });
  }
});

// ✅ Recommend Candidates Based on Job Post
router.get("/recommend-candidates/:jobId", authenticateUser, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Find candidates interested in this role
    const recommendedCandidates = await User.find({ role: job.role }).limit(5);
    
    res.json(recommendedCandidates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidate recommendations", error: error.message });
  }
});

// ✅ AI-Powered Recommendations (For Premium Users)
router.get("/recommend-jobs/ai", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.tier < 2) return res.status(403).json({ message: "Upgrade required for AI recommendations." });

    // Placeholder for AI-based recommendations (Pinecone, OpenAI, etc.)
    res.json({ message: "AI recommendations coming soon!" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching AI recommendations", error: error.message });
  }
});

module.exports = router;
