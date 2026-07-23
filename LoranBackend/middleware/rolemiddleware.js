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

    // Designer privileges require an approved application. This closes the gap
    // where a token issued before rejection/pending would otherwise keep working.
    if (activeRole === 'designer' && allowedRoles.includes('designer')) {
      if (req.user.designerStatus && req.user.designerStatus !== 'approved') {
        return res.status(403).json({
          message: "Your designer access is currently paused. You can keep using Loran as a client, and our team will notify you once it's active again.",
          designerAccessPaused: true
        });
      }
    }

    next();
  };
};

export default authorizeRoles;