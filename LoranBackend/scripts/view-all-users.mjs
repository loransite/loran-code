// Direct database access script to view all registered users
// Run this from LoranBackend folder with: node scripts/view-all-users.mjs

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  role: String,
  phone: String,
  city: String,
  state: String,
  country: String,
  brandName: String,
  yearsExperience: Number,
  expertiseLevel: String,
  height: Number,
  bmi: Number,
  createdAt: Date
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function viewAllUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpiry').lean();
    
    console.log(`📊 Total Users: ${users.length}\n`);
    console.log('=' .repeat(80));

    // Group by role
    const byRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || []).concat(user);
      return acc;
    }, {});

    // Display by role
    for (const [role, roleUsers] of Object.entries(byRole)) {
      console.log(`\n👤 ${role.toUpperCase()}S (${roleUsers.length}):`);
      console.log('-'.repeat(80));
      
      roleUsers.forEach((user, i) => {
        console.log(`\n${i + 1}. ${user.fullName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   ID: ${user._id}`);
        
        if (role === 'client') {
          if (user.height) console.log(`   Height: ${user.height} cm`);
          if (user.bmi) console.log(`   BMI: ${user.bmi}`);
        }
        
        if (role === 'designer') {
          if (user.brandName) console.log(`   Brand: ${user.brandName}`);
          if (user.phone) console.log(`   Phone: ${user.phone}`);
          if (user.city || user.country) {
            console.log(`   Location: ${[user.city, user.state, user.country].filter(Boolean).join(', ')}`);
          }
          if (user.yearsExperience) {
            console.log(`   Experience: ${user.yearsExperience} years (${user.expertiseLevel || 'N/A'})`);
          }
        }
        
        if (user.createdAt) {
          console.log(`   Joined: ${new Date(user.createdAt).toLocaleDateString()}`);
        }
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n✅ Done!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

viewAllUsers();
