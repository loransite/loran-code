// middleware/authmiddleware.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    // Get token from header (e.g., "Authorization: Bearer <token>")
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to the request
    req.user = decoded;

    // Continue to the next middleware or controller
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
export default protect;