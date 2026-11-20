// Creates the first admin account. Run once per environment:
//   ADMIN_NAME="Name" ADMIN_EMAIL=you@yourdomain.com ADMIN_PASSWORD='long-strong-password' npm run create-admin
// The password is read from the environment so it does not end up in shell history.
import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { User } from '../src/models/user.model.js';

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD.');
  process.exit(1);
}
if (ADMIN_PASSWORD.length < 12) {
  console.error('ADMIN_PASSWORD must be at least 12 characters.');
  process.exit(1);
}

await mongoose.connect(env.MONGODB_URI);
const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
if (existing) {
  console.log(`An account for ${ADMIN_EMAIL} already exists. Nothing changed.`);
} else {
  await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
  console.log(`Admin account created for ${ADMIN_EMAIL}.`);
}
await mongoose.disconnect();
