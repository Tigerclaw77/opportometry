const jwt = require("jsonwebtoken");

/**
 * Admin Authentication Middleware
 * Verifies JWT and admin role.
 * Bypasses authentication in development mode.
 */
const adminAuth = (req, res, next) => {
  // ✅ Bypass authentication in development mode
  if (process.env.NODE_ENV === "development") {
    console.log("🔧 Dev mode: skipping adminAuth check");
    return next();
  }

  // ✅ Expect Authorization header with Bearer token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing or invalid." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Ensure user has admin role
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // ✅ Attach decoded user to request for future use
    req.user = decoded;

    console.log(`✅ Admin access granted to user: ${decoded.userId}`);
    next(); // ✅ Proceed to next middleware or controller
  } catch (error) {
    console.error("🚨 Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = adminAuth;
