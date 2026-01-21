import jwt from "jsonwebtoken";
import User from "../model/user.js";

export const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided. Please log in." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided. Please log in." });
    }

    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("[AUTH] JWT_SECRET not configured");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Check if user still exists in database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Attach user info to request - use active role from token
    req.user = {
      id: decoded.id,
      role: decoded.role, // Active role for this session
      roles: decoded.roles || [decoded.role], // All roles user has
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("[AUTH] JWT verification failed:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired. Please log in again." });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }
    
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export default protect;