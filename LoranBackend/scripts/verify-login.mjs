import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../model/user.js';

dotenv.config();
const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: node scripts/verify-login.mjs <email> <password>');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email }).lean();
    if (!user) {
      console.log('User not found');
      process.exit(0);
    }
    console.log(`Found user: ${user.email} (id: ${user._id})`);
    const ok = await bcrypt.compare(password, user.password);
    console.log('Password match:', ok);
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    if (e.stack) console.error(e.stack);
    process.exit(1);
  }
})();