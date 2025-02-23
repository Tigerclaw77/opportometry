const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Job = require("../models/Job"); // ✅ Import Job model
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const verifyRole = require("../middleware/authMiddleware");

// ✅ Allowed Companies & Their Official Domains
const approvedCompanies = ["walmart", "luxottica", "visionworks"];

// ✅ Get All Jobs (Admin Can View All, Others Get Limited Jobs)
// router.get("/", authenticateUser, async (req, res) => {
  router.get("/", async (req, res) => {
  try {
    let filter = {};

    if (!req.user || req.user.role !== "admin") { // ✅ Safe check for req.user
      const { role, hours, practiceMode, corporation, company } = req.query;

      if (role) filter.role = role;
      if (hours) filter.hours = hours;
      if (practiceMode) filter.practiceMode = practiceMode;
      if (corporation) filter.corporation = corporation;
      if (company) filter.company = company;
    }

    const jobs = await Job.find(filter);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
});

// ✅ Post a New Job (Admins & Recruiters)
router.post("/", async (req, res) => {
  console.log("🔹 jobs.js: Job posting request received...");
  console.log("🔹 NODE_ENV:", process.env.NODE_ENV);

  // ✅ Assign a user ID (Bypass authentication in dev mode)
  let createdBy = req.user?.id;
  if (process.env.NODE_ENV === "development") {
    console.log("🟢 Development mode active: No authentication required.");
    createdBy = new mongoose.Types.ObjectId("65e4a12345b6cdef7890abcd"); // ✅ Fixed admin ID for dev mode
  }

  try {
    const { title, description, company, corporation = null } = req.body;
const practiceMode = req.body.practiceMode || null; // ✅ Default to null if missing


// ✅ Ensure missing optional fields default to null
const hours = req.body.hours || null;
const role = req.body.role || null;



    const newJob = new Job({
      title,
      description,
      company,
      hours,
      role,
      practiceMode,
      corporation, // ✅ Now optional, defaults to null
      createdBy,
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully!", job: newJob });
  } catch (error) {
    console.error("❌ Error posting job:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// ✅ Seed Jobs (For Development Only)
router.post("/seed", authenticateUser, authorizeRoles(["admin"]), async (req, res) => {
  try {
    const existingJobs = await Job.find();
    if (existingJobs.length > 0) {
      return res.status(400).json({ message: "Jobs are already seeded." });
    }

    const dummyJobs = [
      {
        title: "Optometrist",
        description: "Join our growing clinic offering excellent benefits and a competitive salary.",
        corporation: "Optometrist Corp",
        company: "Optometry Solutions",
        hours: "full-time",
        role: "Optometrist",
        practiceMode: "employed",
        createdBy: req.user.id,
      },
      {
        title: "Optometrist or Ophthalmologist",
        description: "Part-time opportunity at a well-established clinic with flexible hours.",
        corporation: "EyeCare Group",
        company: "Houston Eye Clinic",
        hours: "part-time",
        role: "Optometrist",
        practiceMode: "contract",
        createdBy: req.user.id,
      },
    ];

    await Job.insertMany(dummyJobs);
    res.status(201).json({ message: "Dummy jobs seeded successfully!", jobs: dummyJobs });
  } catch (error) {
    res.status(500).json({ message: "Error seeding jobs", error: error.message });
  }
});

// ✅ Update a Job (Admins Can Edit Anything, Recruiters Can Edit Their Own Jobs)
router.put("/:jobId", authenticateUser, async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const updatedJobData = req.body;

    // ✅ Admins can edit any job
    if (req.user.role === "admin") {
      const updatedJob = await Job.findByIdAndUpdate(jobId, updatedJobData, { new: true });
      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found" });
      }
      return res.json(updatedJob);
    }

    // ✅ Recruiters can only edit jobs they created
    const job = await Job.findById(jobId);
    if (!job || job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this job." });
    }

    const updatedJob = await Job.findByIdAndUpdate(jobId, updatedJobData, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error: error.message });
  }
});

// ✅ Delete a Job (Admins Can Delete Anything, Recruiters Can Delete Their Own Jobs)
router.delete("/:jobId", authenticateUser, async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // ✅ Admins can delete any job
    if (req.user.role === "admin") {
      const deletedJob = await Job.findByIdAndDelete(jobId);
      if (!deletedJob) {
        return res.status(404).json({ message: "Job not found" });
      }
      return res.json({ message: "Job deleted successfully by Admin." });
    }

    // ✅ Recruiters can only delete jobs they created
    const job = await Job.findById(jobId);
    if (!job || job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this job." });
    }

    await Job.findByIdAndDelete(jobId);
    res.json({ message: "Job deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error: error.message });
  }
});

module.exports = router;
