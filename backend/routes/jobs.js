const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const verifyRole = require("../middleware/authMiddleware");

// Get all job postings (public)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post a new job (protected for recruiters)
router.post("/", verifyRole("recruiter"), async (req, res) => {
  try {
    const job = new Job(req.body);
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all jobs (protected for admins)
router.get("/admin/jobs", verifyRole("admin"), async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
