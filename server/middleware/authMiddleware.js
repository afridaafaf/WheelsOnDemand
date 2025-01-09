const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Verify JWT and attach user details to the request object
exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET || 'your-secret-key');
    req.user = decoded; // Attach the decoded token (e.g., user ID, role) to the request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

// Middleware to check if the user is a Car Owner
exports.isCarOwner = (req, res, next) => {
  if (req.user.role !== "Car Owner") {
    return res.status(403).json({ message: "Access forbidden: Car Owners only." });
  }
  next();
};

// Middleware to check if the user is a Renter
exports.isRenter = (req, res, next) => {
  if (req.user.role !== "Renter") {
    return res.status(403).json({ message: "Access forbidden: Renters only." });
  }
  next();
};

// Middleware to check if the user has a specific role (generic handler)
exports.hasRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: `Access forbidden: ${role}s only.` });
    }
    next();
  };
};


