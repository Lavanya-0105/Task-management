import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// 1. Authenticate that the user is logged in via JWT
export const protect = async (req, res, next) => {
  let token;

  // Check for token in the Authorization header (Format: Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from string
      token = req.headers.authorization.split(" ")[1];

      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB using the ID in the token, attach it to req.user (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      // Move to the next middleware/controller
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};

// 2. Authorize access based on specific roles
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is attached (passed through protect middleware first)
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Check if the user's role is included in the allowed roles for this route
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Access denied for role '${req.user.role}'`,
      });
    }

    next();
  };
};
