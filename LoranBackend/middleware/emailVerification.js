import User from '../model/user.js';

/**
 * Middleware to check if user's email is verified
 * Use this on routes that require verified email
 */
export const requireEmailVerification = async (req, res, next) => {
  try {
    // req.user should be set by the auth middleware (protect)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        message: 'Unauthorized - Please login first' 
      });
    }

    // Get fresh user data from database
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email address to access this feature',
        emailVerificationRequired: true,
        email: user.email
      });
    }

    // Email is verified, proceed
    next();
  } catch (error) {
    console.error('[MIDDLEWARE] Email verification check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Soft email verification check - warns but doesn't block
 * Adds verification status to request
 */
export const checkEmailVerification = async (req, res, next) => {
  try {
    if (req.user && req.user.id) {
      const user = await User.findById(req.user.id);
      req.emailVerified = user ? user.isEmailVerified : false;
    } else {
      req.emailVerified = false;
    }
    next();
  } catch (error) {
    console.error('[MIDDLEWARE] Email verification soft check error:', error);
    req.emailVerified = false;
    next();
  }
};

export default {
  requireEmailVerification,
  checkEmailVerification
};
