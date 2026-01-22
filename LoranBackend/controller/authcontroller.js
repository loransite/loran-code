import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { generateVerificationToken, sendVerificationEmail, sendWelcomeEmail, resendVerificationEmail } from '../services/emailService.js';

// Helper: Validate password strength
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) errors.push(`at least ${minLength} characters`);
  if (!hasUpperCase) errors.push('one uppercase letter');
  if (!hasLowerCase) errors.push('one lowercase letter');
  if (!hasNumber) errors.push('one number');
  if (!hasSpecialChar) errors.push('one special character');

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? `Password must contain ${errors.join(', ')}` : null
  };
};

// Helper: Validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper: Generate JWT token with active role
const generateToken = (user, activeRole) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  
  return jwt.sign(
    { 
      id: user._id, 
      roles: user.roles || [user.role], // All roles user has
      role: activeRole, // Currently active role for this session
      email: user.email 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: "30d" } // Extended to 30 days
  );
};

// Helper: Format user response
const formatUserResponse = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  roles: user.roles || [user.role], // Support both old and new format
  role: user.roles?.[0] || user.role, // For backward compatibility
  avatarUrl: user.avatarUrl || null,
  yearsExperience: user.yearsExperience || 0,
  bio: user.bio || null,
  rating: user.rating || 0,
  designerStatus: user.designerStatus || 'none',
});

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, roles, yearsExperience, bio } = req.body;
    const profilePicture = req.file ? `uploads/${req.file.filename}` : undefined;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Full name, email and password are required" });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.errors });
    }

    // Parse roles - can be array or single string
    let userRoles = [];
    if (Array.isArray(roles)) {
      userRoles = roles;
    } else if (typeof roles === 'string') {
      try {
        userRoles = JSON.parse(roles);
      } catch {
        userRoles = [roles];
      }
    } else {
      return res.status(400).json({ message: "Valid role(s) required (client and/or designer)" });
    }

    // Validate roles
    const validRoles = userRoles.filter(r => ['client', 'designer'].includes(r));
    if (validRoles.length === 0) {
      return res.status(400).json({ message: "At least one valid role is required (client or designer)" });
    }

    // Block any attempt to signup as admin
    if (userRoles.includes('admin')) {
      return res.status(403).json({ message: "Admin accounts cannot be created through signup. Contact system administrator." });
    }

    // Password strength check
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      // Logic for adding a role to an existing user via signup form
      const alreadyHasAll = validRoles.every(r => existingUser.roles.includes(r));
      if (alreadyHasAll) {
        return res.status(400).json({ message: "User with this email already exists and already has these roles." });
      }

      // Check if trying to add designer (needs approval)
      if (validRoles.includes('designer') && !existingUser.roles.includes('designer')) {
        if (existingUser.designerStatus === 'pending') {
          return res.status(400).json({ message: "Your designer application is already pending." });
        }
        
        // Update details but wait for approval
        existingUser.brandName = req.body.brandName || existingUser.brandName;
        existingUser.phone = req.body.phone || existingUser.phone;
        existingUser.city = req.body.city || existingUser.city;
        existingUser.state = req.body.state || existingUser.state;
        existingUser.country = req.body.country || existingUser.country;
        existingUser.shopAddress = req.body.shopAddress || existingUser.shopAddress;
        existingUser.yearsExperience = req.body.yearsExperience || existingUser.yearsExperience;
        existingUser.expertiseLevel = req.body.expertiseLevel || existingUser.expertiseLevel;
        existingUser.bio = req.body.bio || existingUser.bio;
        existingUser.designerStatus = 'pending';
        
        await existingUser.save();
        return res.status(200).json({ 
          message: "You already have an account. Your designer application has been submitted for review!",
          status: 'pending' 
        });
      }

      // For other roles, just add them
      const newRoles = [...new Set([...existingUser.roles, ...validRoles])];
      existingUser.roles = newRoles;
      await existingUser.save();
      
      return res.status(200).json({ 
        message: "Account updated successfully with new roles!",
        user: formatUserResponse(existingUser),
        availableRoles: existingUser.roles
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user data
    // If they only picked designer, we still give them client role so they can login while waiting for approval
    const assignedRoles = validRoles.filter(r => r !== 'designer');
    if (assignedRoles.length === 0) assignedRoles.push('client');

    const userData = { 
      fullName, 
      email: email.toLowerCase(), 
      password: hashedPassword, 
      roles: assignedRoles, 
      designerStatus: validRoles.includes('designer') ? 'pending' : 'none'
    };
    
    // Add designer fields if pending
    if (validRoles.includes('designer')) {
      userData.brandName = req.body.brandName;
      userData.phone = req.body.phone;
      userData.city = req.body.city;
      userData.state = req.body.state;
      userData.country = req.body.country;
      userData.shopAddress = req.body.shopAddress;
      userData.yearsExperience = req.body.yearsExperience;
      userData.expertiseLevel = req.body.expertiseLevel || 'intermediate';
      userData.bio = req.body.bio;
    }
    if (profilePicture) userData.profilePicture = profilePicture;
    if (bio) userData.bio = bio;
    if (yearsExperience) userData.yearsExperience = Number(yearsExperience) || 0;

    // Generate email verification token (expires in 24 hours)
    const verificationToken = generateVerificationToken();
    userData.emailVerificationToken = verificationToken;
    userData.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    userData.isEmailVerified = false;

    // Save user
    const newUser = new User(userData);
    await newUser.save();

    // Send verification email (non-blocking)
    try {
      await sendVerificationEmail(newUser.email, newUser.fullName, verificationToken);
      console.log(`📧 Verification email sent to ${newUser.email}`);
    } catch (emailError) {
      console.error('⚠️  Failed to send verification email:', emailError.message);
      // Don't block signup if email fails
    }

    // Generate token with first role as active role
    const activeRoleForToken = newUser.roles.includes('client') ? 'client' : newUser.roles[0];
    const token = generateToken(newUser, activeRoleForToken);

    console.log(`[AUTH] User registered: ${newUser.email} (${newUser.roles.join(', ')})`);

    res.status(201).json({
      message: "User created successfully. Please check your email to verify your account.",
      user: {
        ...formatUserResponse(newUser),
        activeRole: activeRoleForToken,
        isEmailVerified: newUser.isEmailVerified
      },
      token,
      availableRoles: newUser.roles
    });
  } catch (error) {
    console.error("[AUTH] Signup error:", error.message);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    
    res.status(500).json({ message: "Server error during signup", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user (case-insensitive email)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userRoles = user.roles && user.roles.length > 0 ? user.roles : (user.role ? [user.role] : []);

    if (userRoles.length === 0) {
      console.error(`[AUTH] User ${user.email} has no roles assigned!`);
      return res.status(500).json({ message: "No roles assigned to this account. Please contact support." });
    }

    // If user has multiple roles and no role is specified, prompt for role selection
    if (userRoles.length > 1 && !role) {
      console.log(`[AUTH] Prompting role selection for user: ${user.email}`);
      return res.json({
        message: "Multiple roles found. Please select a role.",
        availableRoles: userRoles,
      });
    }

    // If a role is provided, verify the user has that role
    if (role && !userRoles.includes(role)) {
      // Check if they are trying to login as designer but are pending
      if (role === 'designer' && user.designerStatus === 'pending') {
        return res.status(403).json({ 
          message: "Your designer account is still pending approval. Please login as a client for now.",
          availableRoles: userRoles
        });
      }

      return res.status(403).json({ 
        message: `You don't have ${role} access. Please select a valid role.`,
        availableRoles: userRoles
      });
    }

    // Determine active role
    const activeRole = (role && userRoles.includes(role)) ? role : userRoles[0];

    // Generate token with the active role
    const token = generateToken(user, activeRole);

    console.log(`[AUTH] User logged in: ${user.email} as ${activeRole}`);

    res.json({
      message: "Login successful",
      token,
      user: {
        ...formatUserResponse(user),
        activeRole // Include active role in response
      },
      availableRoles: userRoles
    });
  } catch (err) {
    console.error("[AUTH] Login error:", err.message);
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
};

export const verifyToken = async (req, res) => {
  try {
    // Token already verified by protect middleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      valid: true,
      user: formatUserResponse(user),
    });
  } catch (err) {
    console.error("[AUTH] Verify token error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const switchRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.id; // From protect middleware

    if (!role) {
      return res.status(400).json({ message: "Target role is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRoles = user.roles && user.roles.length > 0 ? user.roles : (user.role ? [user.role] : []);

    if (!userRoles.includes(role)) {
      return res.status(403).json({ message: `Access denied. Your account does not have '${role}' permissions.` });
    }

    // Security: Check designer approval if switching to designer
    if (role === 'designer' && user.designerStatus !== 'approved') {
       return res.status(403).json({ message: "Your designer account is not yet approved by an administrator." });
    }

    // Generate NEW token with the NEW active role
    const token = generateToken(user, role);

    res.json({
      message: `Successfully switched to ${role} session`,
      token,
      user: {
        ...formatUserResponse(user),
        activeRole: role
      }
    });
  } catch (err) {
    console.error("[AUTH] Switch role error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists
      return res.json({ message: "If that email exists, a reset link has been sent" });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send reset email
    try {
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

      const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

      if (smtpHost && smtpPort && smtpUser && smtpPass) {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(smtpPort),
          secure: Number(smtpPort) === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });

        const fromAddress = process.env.FROM_EMAIL || smtpUser;
        await transporter.sendMail({
          from: fromAddress,
          to: email,
          subject: 'Password Reset Request — Loran',
          text: `Click this link to reset your password (valid for 1 hour): ${resetUrl}`,
          html: `<p>Click <a href="${resetUrl}">here</a> to reset your password (valid for 1 hour).</p>`,
        });

        console.log(`[AUTH] Password reset email sent to: ${email}`);
        return res.json({ message: 'Reset link sent to email' });
      } else {
        console.warn('[AUTH] SMTP not configured — returning reset token for development');
        return res.json({ 
          message: 'Reset token generated (development only)', 
          resetToken, 
          resetUrl 
        });
      }
    } catch (mailErr) {
      console.error('[AUTH] Error sending reset email:', mailErr);
      return res.json({ 
        message: 'Reset token generated (email failed)', 
        resetToken, 
        resetUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password/${resetToken}` 
      });
    }
  } catch (err) {
    console.error('[AUTH] Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Password strength check
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Hash the token to compare with DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    console.log(`[AUTH] Password reset successful for: ${user.email}`);

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('[AUTH] Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addRole = async (req, res) => {
  try {
    const { role, designerDetails } = req.body;
    const userId = req.user.id;

    if (!['designer', 'client'].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if user already has this role
    const currentRoles = user.roles || (user.role ? [user.role] : []);
    if (currentRoles.includes(role)) {
      return res.status(400).json({ message: `You are already a ${role}` });
    }

    // If adding designer role, follow "due process" (Pending Approval)
    if (role === 'designer') {
      if (user.designerStatus === 'pending') {
        return res.status(400).json({ message: "Your designer application is already pending review." });
      }

      if (designerDetails) {
        user.brandName = designerDetails.brandName || user.brandName;
        user.phone = designerDetails.phone || user.phone;
        user.city = designerDetails.city || user.city;
        user.state = designerDetails.state || user.state;
        user.country = designerDetails.country || user.country;
        user.shopAddress = designerDetails.shopAddress || user.shopAddress;
        user.yearsExperience = designerDetails.yearsExperience || user.yearsExperience;
        user.expertiseLevel = designerDetails.expertiseLevel || user.expertiseLevel;
        user.bio = designerDetails.bio || user.bio;
      }
      
      user.designerStatus = 'pending';
      await user.save();

      console.log(`[AUTH] User ${user.email} applied for designer role.`);

      return res.json({
        message: "Your application to become a designer has been submitted and is currently pending administrative review.",
        status: 'pending'
      });
    }

    // For other roles (like adding client role to a designer), add immediately
    user.roles = [...currentRoles, role];
    await user.save();

    // Generate new token with updated roles
    const token = generateToken(user, role);

    console.log(`[AUTH] User ${user.email} added role: ${role}`);

    res.json({
      message: `Successfully added ${role} role`,
      user: formatUserResponse(user),
      token,
      activeRole: role,
      availableRoles: user.roles
    });
  } catch (err) {
    console.error('[AUTH] Add role error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Verify email with token
 * POST /api/auth/verify-email/:token
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with valid token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired verification link. Please request a new one." 
      });
    }

    // Already verified
    if (user.isEmailVerified) {
      return res.status(200).json({ 
        message: "Email already verified!",
        alreadyVerified: true
      });
    }

    // Mark as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    console.log(`✅ Email verified for user: ${user.email}`);

    // Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail(user.email, user.fullName);
    } catch (emailError) {
      console.error('⚠️  Failed to send welcome email:', emailError.message);
    }

    res.status(200).json({ 
      message: "Email verified successfully! Welcome to Loran 🎉",
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('[AUTH] Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

/**
 * Resend verification email
 * POST /api/auth/resend-verification
 */
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({ 
        message: "If an account exists with this email, a verification link will be sent." 
      });
    }

    // Already verified
    if (user.isEmailVerified) {
      return res.status(200).json({ 
        message: "Email is already verified!" 
      });
    }

    // Generate new token
    const verificationToken = generateVerificationToken();
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await user.save();

    // Send email
    try {
      await resendVerificationEmail(user.email, user.fullName, verificationToken);
      console.log(`📧 Verification email resent to ${user.email}`);
    } catch (emailError) {
      console.error('❌ Failed to resend verification email:', emailError);
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.status(200).json({ 
      message: "Verification email sent! Please check your inbox." 
    });
  } catch (error) {
    console.error('[AUTH] Resend verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};