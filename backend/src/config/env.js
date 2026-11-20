import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Default to production so a missing NODE_ENV never enables dev-only behaviour.
const NODE_ENV = process.env.NODE_ENV || 'production';
const isProduction = NODE_ENV === 'production';

let JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  if (isProduction) {
    throw new Error('JWT_SECRET must be set in production. Refusing to start.');
  }
  // Development only: a random per-process secret. Tokens reset on restart.
  JWT_SECRET = crypto.randomBytes(32).toString('hex');
  console.warn('[Config] JWT_SECRET not set. Using a temporary development secret.');
}

export const env = {
  NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/verdict_beach',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  isProduction,
  isDevelopment: NODE_ENV === 'development',
};
