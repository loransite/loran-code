// Script to create an admin user directly in the database
// Run this from LoranBackend folder with: node scripts/create-admin.mjs

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  role: String,
  roles: [String],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🔐 Creating Admin User');
    console.log('='.repeat(50));

    const fullName = await question('Full Name: ');
    const email = await question('Email: ');
    const password = await question('Password (min 6 chars): ');

    // Validation
    if (!fullName || !email || !password) {
      console.log('\n❌ Error: All fields are required');
      rl.close();
      await mongoose.disconnect();
      return;
    }

    if (password.length < 6) {
      console.log('\n❌ Error: Password must be at least 6 characters');
      rl.close();
      await mongoose.disconnect();
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('\n❌ Error: User with this email already exists');
      console.log(`   Current role: ${existingUser.role}`);
      
      if (existingUser.role === 'admin' || (existingUser.roles && existingUser.roles.includes('admin'))) {
        console.log('   This user is already an admin.');
      } else {
        const upgrade = await question('\nUpgrade existing user to admin? (yes/no): ');
        if (upgrade.toLowerCase() === 'yes') {
          existingUser.role = 'admin';
          existingUser.roles = [...(existingUser.roles || []), 'admin'];
          await existingUser.save();
          console.log('\n✅ User upgraded to admin successfully!');
          console.log(`   Email: ${existingUser.email}`);
          console.log(`   Name: ${existingUser.fullName}`);
        }
      }
      rl.close();
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const admin = new User({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin',
      roles: ['admin'],
      createdAt: new Date()
    });

    await admin.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('='.repeat(50));
    console.log(`Email: ${admin.email}`);
    console.log(`Name: ${admin.fullName}`);
    console.log(`Role: ${admin.role}`);
    console.log(`\n🔑 Login credentials:`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: [the password you entered]`);
    console.log(`\n📝 Admin can access: /dashboard/admin`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

createAdmin();
