export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user's active role matches any of the allowed roles
    const activeRole = req.user.role;
    
    if (!allowedRoles.includes(activeRole)) {
      return res.status(403).json({ 
        message: `Access denied. This action requires ${allowedRoles.join(' or ')} role. You are currently logged in as ${activeRole}.` 
      });
    }

    next();
  };
};

export default authorizeRoles;