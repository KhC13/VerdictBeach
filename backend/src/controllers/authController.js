import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword || !process.env.JWT_SECRET) {
    return res.status(500).json({ success: false, message: 'Admin authentication is not configured' });
  }
  const emailMatches = email.toLowerCase() === adminEmail.toLowerCase();
  const passwordMatches = await bcrypt.compare(password, adminPassword).catch(() => false);
  // During initial setup, ADMIN_PASSWORD may be a bcrypt hash. Plain-text passwords are intentionally not accepted.
  if (!emailMatches || !passwordMatches) return res.status(401).json({ success: false, message: 'Invalid email or password' });
  const token = jwt.sign({ role: 'admin', email: adminEmail }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
  res.json({ success: true, message: 'Login successful', token, admin: { email: adminEmail } });
});
