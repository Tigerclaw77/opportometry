// const express = require("express");
// const router = express.Router();
// const Job = require("../models/Job");
// const verifyRole = require("../middleware/authMiddleware");

// // Get all job postings (public)
// router.get("/", async (req, res) => {
//   try {
//     const jobs = await Job.find();
//     res.json(jobs);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Post a new job (protected for recruiters)
// router.post("/", verifyRole("recruiter"), async (req, res) => {
//   try {
//     const job = new Job(req.body);
//     const newJob = await job.save();
//     res.status(201).json(newJob);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // Get all jobs (protected for admins)
// router.get("/admin/jobs", verifyRole("admin"), async (req, res) => {
//   try {
//     const jobs = await Job.find();
//     res.json(jobs);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const { authenticateUser, authorizeRoles, checkJobOwnership } = require("../middleware/auth"); // Import correct middlewares
const verifyRole = require("../middleware/authMiddleware"); // Keep this for existing role checks

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
    const job = new Job({
      ...req.body,
      recruiterId: req.user.id, // Ensure the job is tied to the recruiter creating it
    });
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a job (Only the recruiter who owns it can edit)
router.put(
  "/:jobId",
  authenticateUser, // Ensure user is logged in
  authorizeRoles(["recruiter", "premiumrecruiter"]), // Ensure only recruiters can edit
  checkJobOwnership, // Ensure recruiter owns this job
  async (req, res) => {
    try {
      const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true });
      res.json(updatedJob);
    } catch (error) {
      res.status(500).json({ message: "Error updating job" });
    }
  }
);

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
