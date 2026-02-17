import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../model/user.js';

dotenv.config();

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/find-user.mjs <email>');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const u = await User.findOne({ email }).lean();
    if (!u) {
      console.log('No user found with email:', email);
    } else {
      console.log('User found:');
      console.log(JSON.stringify(u, null, 2));
    }
    await mongoose.disconnect();
  } catch (e) {
    console.error('Error:', e.message);
    if (e.stack) console.error(e.stack);
    process.exit(1);
  }
})();