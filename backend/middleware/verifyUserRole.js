const jwt = require("jsonwebtoken");
const Job = require("../models/Job");
require("dotenv").config();

/**
 * ✅ General Auth Middleware (Validates JWT and sets req.user)
 */
const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("🔴 No token provided.");
    return res.status(401).json({ message: "Authentication token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded._id) {
      console.log("🔴 Invalid token payload: missing _id");
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = decoded; // contains _id and userRole
    console.log("🟢 verifyUser: User verified:", decoded);
    next();
  } catch (error) {
    console.log("🔴 verifyUser: JWT error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * ✅ Role-based Middleware (Checks userRole)
 */
const verifyUserRole = (requiredUserRole) => {
  return (req, res, next) => {
    console.log("🔹 verifyUserRole middleware executing...");
    console.log("🔹 NODE_ENV:", process.env.NODE_ENV);

    // ✅ Dev mode override
    if (process.env.NODE_ENV === "development") {
      req.user = {
        _id: "67ccb98f866cbc48ae78d3e0", // mock _id
        userRole: "admin"
      };
      console.log("🛠️ Dev mode override in verifyUserRole");
      return next();
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("🔴 No token provided.");
      return res.status(401).json({ message: "Authentication token is required" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded._id || !decoded.userRole) {
        console.log("🔴 Invalid token payload:", decoded);
        return res.status(401).json({ message: "Invalid token structure." });
      }

      console.log(`🟢 Token valid: _id ${decoded._id}, userRole ${decoded.userRole}`);

      if (
        requiredUserRole &&
        (
          (Array.isArray(requiredUserRole) && !requiredUserRole.includes(decoded.userRole)) ||
          (!Array.isArray(requiredUserRole) && decoded.userRole !== requiredUserRole)
        )
      ) {
        console.log(`🔴 userRole mismatch. Required: ${requiredUserRole}, Found: ${decoded.userRole}`);
        return res.status(403).json({
          message: `Access denied. Requires ${requiredUserRole} userRole.`,
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.log("🔴 JWT verification error:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

/**
 * ✅ Job Ownership Middleware (for recruiters)
 */
const checkJobOwnership = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (req.user.userRole === "admin") {
      console.log(`🟢 Admin override for job ${jobId}`);
      return next();
    }

    if (job.createdBy.toString() !== req.user._id) {
      console.log(`🔴 Recruiter ${req.user._id} does not own job ${jobId}`);
      return res.status(403).json({ message: "Unauthorized: You do not own this job." });
    }

    console.log(`🟢 Recruiter ${req.user._id} owns job ${jobId}`);
    next();
  } catch (error) {
    console.error("🚨 Error in checkJobOwnership:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  verifyUser,
  verifyUserRole,
  checkJobOwnership
};
