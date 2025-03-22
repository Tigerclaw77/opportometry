const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const { verifyRole } = require("../middleware/verifyRole");

// ✅ Admin Dashboard (Admins Only)
router.get("/dashboard", verifyRole("admin"), adminController.getAdminDashboard);

// ✅ Reset Failed Login Attempts (Admins Only)
router.post(
  "/reset-failed-attempts",
  verifyRole("admin"),
  adminController.resetFailedLoginAttempts
);

module.exports = router;
