const express = require("express");
const router = express.Router();
const Job = require("../models/Job"); // Adjust the path if needed

// Get all job postings
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new job posting
// router.post("/jobs", async (req, res) => {
//   const job = new Job(req.body);
//   try {
//     const newJob = await job.save();
//     res.status(201).json(newJob);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

router.post("/jobs", async (req, res) => {
  console.log("POST /jobs called with body:", req.body);
  const job = new Job(req.body);
  try {
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error saving job:", error.message);
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
