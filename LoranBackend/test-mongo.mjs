import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;

(async () => {
  try {
    if (!uri) throw new Error('MONGO_URI is not set in .env');

    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('Connected OK');
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error('Connect failed:', e.message);
    if (e.stack) console.error(e.stack);
    process.exit(1);
  }
})();
