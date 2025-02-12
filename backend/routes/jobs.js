const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const User = require("../models/User");
const { authenticateUser, authorizeRoles, checkJobOwnership } = require("../middleware/auth");
const verifyRole = require("../middleware/authMiddleware");

// ✅ Allowed Companies & Their Official Domains
const approvedCompanies = ["walmart", "luxottica", "visionworks"];

// ✅ Get All Job Postings (Public)
router.get("/", async (req, res) => {
  try {
    const { role, hours, practiceMode, corporation, company } = req.query;
    const query = {};

    if (role) query.role = role;
    if (hours) query.hours = hours;
    if (practiceMode) query.practiceMode = practiceMode;
    if (corporation) query.corporation = corporation;
    if (company) query.company = company;

    const jobs = await Job.find(query);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
});

// ✅ Post a New Job (Anyone Can Post, but Company Posting is Restricted)
router.post("/", authenticateUser, verifyRole("recruiter"), async (req, res) => {
  try {
    const { company, title, description, hours, role, practiceMode } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can post jobs." });
    }

    // ✅ Restrict Posting for Approved Companies
    if (approvedCompanies.includes(company.toLowerCase()) && !user.isCompanyVerified) {
      return res.status(403).json({ message: `You are not authorized to post jobs for ${company}.` });
    }

    const job = new Job({
      title,
      description,
      company,
      hours,
      role,
      practiceMode,
      createdBy: user._id,
    });

    await job.save();
    res.status(201).json({ message: "Job posted successfully!", job });
  } catch (error) {
    res.status(400).json({ message: "Error posting job", error: error.message });
  }
});

// ✅ Update a Job (Only the Owner Can Edit)
router.put("/:jobId", authenticateUser, authorizeRoles(["recruiter", "premiumrecruiter"]), checkJobOwnership, async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error: error.message });
  }
});

// ✅ Admin: Get All Jobs (Only Admins Can Access)
router.get("/admin/jobs", authenticateUser, verifyRole("admin"), async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
});

// ✅ Save Job for Candidates
router.post("/save-job", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can save jobs." });
    }

    const { jobId } = req.body;
    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }

    res.status(200).json({ message: "Job saved successfully!", savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: "Error saving job", error: error.message });
  }
});

// ✅ Remove Saved Job (New Feature)
router.delete("/remove-saved-job", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can remove saved jobs." });
    }

    const { jobId } = req.body;
    user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    await user.save();

    res.status(200).json({ message: "Job removed from saved list!", savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: "Error removing saved job", error: error.message });
  }
});

// ✅ Save Job Template (For High-Tier Recruiters)
router.post("/save-template", authenticateUser, verifyRole("recruiter"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.tier < 2) {
      return res.status(403).json({ message: "Upgrade your account to save job templates." });
    }

    user.jobTemplates.push(req.body);
    await user.save();

    res.status(201).json({ message: "Template saved!", templates: user.jobTemplates });
  } catch (error) {
    res.status(500).json({ message: "Error saving template", error: error.message });
  }
});

// ✅ Get Job Templates (For High-Tier Recruiters)
router.get("/templates", authenticateUser, verifyRole("recruiter"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.tier < 2) {
      return res.status(403).json({ message: "Upgrade your account to access job templates." });
    }

    res.status(200).json(user.jobTemplates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching templates", error: error.message });
  }
});

// ✅ Get Saved Jobs for Candidate
router.get("/saved", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedJobs");
    if (!user || user.role !== "candidate") {
      return res.status(403).json({ message: "Only candidates can access saved jobs." });
    }
    res.status(200).json(user.savedJobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved jobs", error: error.message });
  }
});

// ✅ Recruiter: Get Saved Count for Their Jobs
router.get("/saved-count", authenticateUser, verifyRole("recruiter"), async (req, res) => {
  try {
    const recruiterJobs = await Job.find({ createdBy: req.user.id });

    const jobStats = await Promise.all(
      recruiterJobs.map(async (job) => {
        const savedCount = await User.countDocuments({ savedJobs: job._id });
        return { jobTitle: job.title, company: job.company, savedCount };
      })
    );

    res.status(200).json(jobStats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job stats", error: error.message });
  }
});

module.exports = router;
