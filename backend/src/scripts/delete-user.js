import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const email = process.argv[2] || 'user@store.com';

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const result = await User.deleteOne({ email });
  if (result.deletedCount) {
    console.log(`User ${email} removed.`);
  } else {
    console.log(`No user found with email: ${email}`);
  }
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
