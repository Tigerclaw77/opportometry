const jwt = require("jsonwebtoken");
const Job = require("../models/Job");
require("dotenv").config();

/**
 * ✅ General Auth Middleware (Validates JWT and sets req.user)
 * Used for basic user session validation (e.g., /auth/me)
 */
const verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded._id || !decoded.userRole) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = {
      _id: decoded._id,
      userRole: decoded.userRole,
      tier: decoded.tier || "free",
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/**
 * ✅ Role-based Middleware (Checks userRole + handles dev override)
 */
const verifyUserRole = (requiredUserRole) => {
  return (req, res, next) => {
    if (process.env.NODE_ENV === "development") {
      req.user = {
        _id: "67ccb98f866cbc48ae78d3e0",
        userRole: "admin",
        tier: "premium",
      };
      return next();
    }

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication token is required" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded._id || !decoded.userRole) {
        return res.status(401).json({ message: "Invalid token structure" });
      }

      const userRole = decoded.userRole;
      const userTier = decoded.tier || "free";

      if (
        requiredUserRole &&
        (
          (Array.isArray(requiredUserRole) && !requiredUserRole.includes(userRole)) ||
          (!Array.isArray(requiredUserRole) && userRole !== requiredUserRole)
        )
      ) {
        return res.status(403).json({
          message: `Access denied. Requires ${requiredUserRole} role.`,
        });
      }

      req.user = {
        _id: decoded._id,
        userRole,
        tier: userTier,
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

/**
 * ✅ Job Ownership Middleware (for recruiters only)
 */
const checkJobOwnership = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (req.user.userRole === "admin") {
      return next();
    }

    if (job.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized: You do not own this job." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  verifyUser,
  verifyUserRole,
  checkJobOwnership,
};
