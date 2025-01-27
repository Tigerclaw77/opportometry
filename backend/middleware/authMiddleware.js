// const jwt = require("jsonwebtoken");

// const verifyAdmin = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1]; // Extract token from 'Bearer <token>'
//   if (!token) {
//     return res
//       .status(403)
//       .json({ message: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
//     if (decoded.role !== "admin") {
//       // Check if the user is an admin
//       return res.status(403).json({ message: "Access denied. Not an admin." });
//     }
//     req.user = decoded; // Attach user info to the request
//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token." });
//   }
// };

// module.exports = verifyAdmin;

const jwt = require("jsonwebtoken");

const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from 'Bearer <token>'
    if (!token) {
      return res
        .status(403)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
      if (decoded.role !== requiredRole) {
        // Check if the user's role matches the required role
        return res
          .status(403)
          .json({ message: `Access denied. Must be a ${requiredRole}.` });
      }
      req.user = decoded; // Attach user info to the request
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: "Invalid token." });
    }
  };
};

module.exports = verifyRole;
