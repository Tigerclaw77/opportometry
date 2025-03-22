const jwt = require("jsonwebtoken");
const Job = require("../models/Job");
require("dotenv").config();

/**
 * Middleware to authenticate and authorize roles.
 * Also bypasses checks in development mode.
 */
const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    console.log("🔹 verifyRole middleware executing...");
    console.log("🔹 NODE_ENV:", process.env.NODE_ENV);

    // ✅ Dev Mode: bypass checks
    if (process.env.NODE_ENV === "development") {
      console.log("🟢 Dev mode active: auto-authenticated as admin");
      req.user = { id: "dev-admin-id", role: "admin" };
      return next();
    }

    // ✅ Normal mode: JWT auth
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("🔴 No token provided.");
      return res.status(401).json({ message: "Authentication token is required" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log(`🟢 Token valid: user ${decoded.userId}, role ${decoded.role}`);

      // ✅ Role validation (optional per route)
      if (requiredRole && decoded.role !== requiredRole) {
        console.log(`🔴 Role mismatch. Required: ${requiredRole}, Found: ${decoded.role}`);
        return res.status(403).json({ message: `Access denied. Requires ${requiredRole} role.` });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.log("🔴 JWT error:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

/**
 * Middleware to check job ownership (Recruiters must own their job)
 * ✅ Admins bypass this check!
 */
const checkJobOwnership = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ✅ Admins can bypass ownership check
    if (req.user.role === "admin") {
      console.log(`🟢 Admin override for job ${jobId}`);
      return next();
    }

    // ✅ Recruiters must own the job (field assumed to be 'createdBy')
    if (job.createdBy.toString() !== req.user.id) {
      console.log(`🔴 Recruiter ${req.user.id} does not own job ${jobId}`);
      return res.status(403).json({ message: "Unauthorized: You do not own this job." });
    }

    console.log(`🟢 Recruiter ${req.user.id} owns job ${jobId}`);
    next();
  } catch (error) {
    console.error("🚨 Error in checkJobOwnership:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  verifyRole,
  checkJobOwnership
};
