const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// Get all job postings
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin-specific route for job postings
router.get("/admin/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs); // In a real-world app, add authentication/authorization
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/jobs", async (req, res) => {
  try {
    const job = new Job(req.body);
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/test", async (req, res) => {
  try {
    const testJob = new Job({
      title: "Test Job",
      description: "This is a test job",
      company: "Test Company",
      location: "Test Location",
      salary: 1000,
    });
    const savedJob = await testJob.save();
    res.json(savedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
