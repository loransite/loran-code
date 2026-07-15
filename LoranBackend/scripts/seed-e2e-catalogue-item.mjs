import 'dotenv/config';
import mongoose from 'mongoose';
import Catalogue from '../model/catalogue.js';
import User from '../model/user.js';

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  let admin = await User.findOne({ roles: 'admin' }).select('_id fullName');
  if (!admin) {
    admin = await User.findOne({ role: 'admin' }).select('_id fullName');
  }
  if (!admin) {
    admin = await User.create({
      fullName: 'E2E Seed Admin',
      email: `e2e.seed.admin.${Date.now()}@example.com`,
      password: 'temporary',
      role: 'admin',
      roles: ['admin'],
      isEmailVerified: true,
      designerStatus: 'none',
    });
  }

  const existing = await Catalogue.findOne({ title: 'E2E Test Catalogue Item' }).select('_id');
  if (existing) {
    console.log(existing._id.toString());
    await mongoose.disconnect();
    return;
  }

  const item = await Catalogue.create({
    title: 'E2E Test Catalogue Item',
    description: 'Temporary seed for strict order/payment E2E validation',
    price: 15000,
    category: 'test',
    image: '/uploads/e2e-test.jpg',
    designer: {
      id: admin._id,
      name: admin.fullName || 'E2E Seed Admin',
    },
    status: 'approved',
    uploadedBy: admin._id,
  });

  console.log(item._id.toString());
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
