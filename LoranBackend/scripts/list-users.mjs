import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../model/user.js';

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find().sort({ createdAt: -1 }).limit(20).lean();
    console.log(`Found ${users.length} users (most recent first):`);
    users.forEach((u) => console.log(`${u.email} — ${u.fullName} — role: ${u.role} — createdAt: ${u.createdAt}`));
    await mongoose.disconnect();
  } catch (e) {
    console.error('Error:', e.message);
    if (e.stack) console.error(e.stack);
    process.exit(1);
  }
})();