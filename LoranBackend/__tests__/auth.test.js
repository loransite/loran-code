import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import User from '../model/user.js';
import authRoutes from '../routes/authroutes.js';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Test data
const testUser = {
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'TestPass123!',
  roles: ['client']
};

describe('Authentication Tests', () => {
  
  beforeAll(async () => {
    // Connect to test database
    const mongoUri = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/loran-test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Cleanup and disconnect
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    
    it('should create a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', testUser.email.toLowerCase());
      expect(response.body.user).toHaveProperty('isEmailVerified', false);
    });

    it('should reject signup with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          password: 'weak'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Password must contain');
    });

    it('should reject signup with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          email: 'invalid-email'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email format');
    });

    it('should reject duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });

    it('should reject admin role signup', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          roles: ['admin']
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Admin accounts cannot be created');
    });

    it('should require password minimum length', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          password: 'Abc12!'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('at least 8 characters');
    });

    it('should require uppercase in password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          password: 'testpass123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('uppercase');
    });

    it('should require special character in password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          ...testUser,
          password: 'TestPass123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('special character');
    });
  });

  describe('POST /api/auth/login', () => {
    
    beforeEach(async () => {
      // Create a user for login tests
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', testUser.email.toLowerCase());
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPass123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid email or password');
    });

    it('should require email and password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });
  });

  describe('Password Validation', () => {
    
    const passwordTests = [
      { password: 'short', expected: 'at least 8 characters' },
      { password: 'nouppercase123!', expected: 'uppercase' },
      { password: 'NOLOWERCASE123!', expected: 'lowercase' },
      { password: 'NoNumbers!', expected: 'number' },
      { password: 'NoSpecial123', expected: 'special character' }
    ];

    passwordTests.forEach(({ password, expected }) => {
      it(`should reject password: ${password}`, async () => {
        const response = await request(app)
          .post('/api/auth/signup')
          .send({
            ...testUser,
            password
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain(expected);
      });
    });
  });
});
