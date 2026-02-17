import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../model/user.js';

dotenv.config();
const [email, newPassword] = process.argv.slice(2);
if (!email || !newPassword) {
  console.error('Usage: node scripts/reset-user-password.mjs <email> <newPassword>');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      process.exit(0);
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    console.log(`Password for ${email} updated successfully.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    if (e.stack) console.error(e.stack);
    process.exit(1);
  }
})();