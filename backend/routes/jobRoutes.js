const express = require("express");
const router = express.Router();

const {
  postJob,
  searchJobs,
  seedJobs,
  updateJob,
  deleteJob,
  getRecruiterJobs,   // ✅ Add this controller method
} = require("../controllers/jobController");

const { verifyRole, checkJobOwnership } = require("../middleware/verifyRole");

// ✅ Public Route - Get/Search Jobs
router.get("/", searchJobs);

// ✅ Recruiter-Specific Route ➜ Show Recruiter Jobs (Recruiters + Admin)
router.get(
  "/recruiter",
  verifyRole(["recruiter", "premiumrecruiter", "admin"]),
  getRecruiterJobs
);

// ✅ Post a New Job (Recruiters Only)
router.post("/", verifyRole("recruiter"), postJob);

// ✅ Seed Jobs (Admins Only)
router.post("/seed", verifyRole("admin"), seedJobs);

// ✅ Update a Job (Recruiters or Admin, but must own if recruiter)
router.put("/:jobId", verifyRole("recruiter"), checkJobOwnership, updateJob);

// ✅ Delete a Job (Recruiters or Admin, but must own if recruiter)
router.delete("/:jobId", verifyRole("recruiter"), checkJobOwnership, deleteJob);

module.exports = router;
