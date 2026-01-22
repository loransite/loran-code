import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import User from '../model/user.js';
import authRoutes from '../routes/authroutes.js';
import { generateVerificationToken } from '../services/emailService.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Email Verification Tests', () => {
  
  let testUser;
  let verificationToken;

  beforeAll(async () => {
    const mongoUri = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/loran-test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    
    // Create a test user
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
        roles: ['client']
      });

    testUser = response.body.user;
    
    // Get the verification token from database
    const user = await User.findById(testUser.id);
    verificationToken = user.emailVerificationToken;
  });

  describe('GET /api/auth/verify-email/:token', () => {
    
    it('should verify email with valid token', async () => {
      const response = await request(app)
        .get(`/api/auth/verify-email/${verificationToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('verified successfully');

      // Check user in database
      const user = await User.findById(testUser.id);
      expect(user.isEmailVerified).toBe(true);
      expect(user.emailVerificationToken).toBeUndefined();
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-email/invalid-token-123');

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid or expired');
    });

    it('should reject expired token', async () => {
      // Set token as expired
      await User.findByIdAndUpdate(testUser.id, {
        emailVerificationExpires: new Date(Date.now() - 1000) // 1 second ago
      });

      const response = await request(app)
        .get(`/api/auth/verify-email/${verificationToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid or expired');
    });

    it('should handle already verified email', async () => {
      // Verify first time
      await request(app)
        .get(`/api/auth/verify-email/${verificationToken}`);

      // Try to verify again
      const response = await request(app)
        .get(`/api/auth/verify-email/${verificationToken}`);

      expect(response.status).toBe(200);
      expect(response.body.alreadyVerified).toBe(true);
    });
  });

  describe('POST /api/auth/resend-verification', () => {
    
    it('should resend verification email', async () => {
      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: testUser.email });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Verification email sent');

      // Check that token was updated
      const user = await User.findById(testUser.id);
      expect(user.emailVerificationToken).toBeDefined();
      expect(user.emailVerificationToken).not.toBe(verificationToken);
    });

    it('should handle already verified user', async () => {
      // Verify email first
      await User.findByIdAndUpdate(testUser.id, {
        isEmailVerified: true,
        emailVerificationToken: undefined
      });

      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: testUser.email });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('already verified');
    });

    it('should require email', async () => {
      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });

    it('should not reveal if user does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'nonexistent@example.com' });

      // Should return success even if user doesn't exist (security)
      expect(response.status).toBe(200);
    });
  });

  describe('User Creation with Email Verification', () => {
    
    it('should create user with isEmailVerified false', async () => {
      const user = await User.findById(testUser.id);
      
      expect(user.isEmailVerified).toBe(false);
      expect(user.emailVerificationToken).toBeDefined();
      expect(user.emailVerificationExpires).toBeDefined();
      expect(user.emailVerificationExpires.getTime()).toBeGreaterThan(Date.now());
    });

    it('should set token expiry to 24 hours', async () => {
      const user = await User.findById(testUser.id);
      
      const expectedExpiry = Date.now() + (24 * 60 * 60 * 1000);
      const actualExpiry = user.emailVerificationExpires.getTime();
      
      // Allow 1 minute difference for test execution time
      expect(actualExpiry).toBeGreaterThan(expectedExpiry - 60000);
      expect(actualExpiry).toBeLessThan(expectedExpiry + 60000);
    });
  });

  describe('Token Generation', () => {
    
    it('should generate unique tokens', () => {
      const token1 = generateVerificationToken();
      const token2 = generateVerificationToken();
      
      expect(token1).not.toBe(token2);
      expect(token1).toHaveLength(64); // 32 bytes as hex = 64 chars
      expect(token2).toHaveLength(64);
    });

    it('should generate valid hex tokens', () => {
      const token = generateVerificationToken();
      
      expect(token).toMatch(/^[a-f0-9]{64}$/);
    });
  });
});
