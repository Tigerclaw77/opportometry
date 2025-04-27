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

const { verifyUserRole, checkJobOwnership } = require("../middleware/verifyUserRole");

// ✅ Public Route - Get/Search Jobs
router.get("/", searchJobs);

// ✅ Recruiter-Specific Route ➜ Show Recruiter Jobs (Recruiters + Admin)
router.get(
  "/recruiter",
  verifyUserRole(["recruiter", "premiumrecruiter", "admin"]),
  getRecruiterJobs
);

// ✅ Post a New Job (Recruiters Only)
router.post("/", verifyUserRole("recruiter"), postJob);

// ✅ Seed Jobs (Admins Only)
router.post("/seed", verifyUserRole("admin"), seedJobs);

// ✅ Update a Job (Recruiters or Admin, but must own if recruiter)
router.put("/:jobId", verifyUserRole("recruiter"), checkJobOwnership, updateJob);

// ✅ Delete a Job (Recruiters or Admin, but must own if recruiter)
router.delete("/:jobId", verifyUserRole("recruiter"), checkJobOwnership, deleteJob);

module.exports = router;
