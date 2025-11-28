// middlewares/user.js
const jwt = require("jsonwebtoken");

const userMiddleware = (req, res, next) => {
  try {
    let token = null;

    // 🔹 1. Try from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 🔹 2. Fallback to cookies (for web clients)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      console.warn("❌ No token provided in request");
      return res.status(401).json({ error: "Unauthorized! Token missing." });
    }

    // 🔹 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("❌ Token validation failed:", error.message);
    return res.status(401).json({ error: "Invalid or expired token!" });
  }
};

// 🔹 Role-based access control
const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized!" });
    }

    const { role } = req.user;
    if (!role || !allowedRoles.includes(role)) {
      console.warn(`🚫 Access denied for role: ${role}`);
      return res.status(403).json({ error: "Access denied!" });
    }

    next();
  };
};

module.exports = { userMiddleware, roleMiddleware };
