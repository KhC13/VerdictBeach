import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Behind a reverse proxy (Render, Railway, Nginx), trust the first hop for client IPs.
app.set('trust proxy', 1);

app.use(helmet());

const allowedOrigins = [
  env.CLIENT_URL,
  ...(env.isDevelopment ? ['http://localhost:5173', 'http://127.0.0.1:5173'] : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without an Origin header (curl, server-to-server) are allowed.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(morgan(env.isProduction ? 'combined' : 'dev'));

// Body limits are small: enquiry text is capped at 5000 chars and files go via multipart.
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Brute-force protection on login.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, statusCode: 429, message: 'Too many login attempts. Please try again later.' },
});
app.use('/api/auth/login', loginLimiter);

// Spam protection on the public enquiry form.
const enquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many enquiries from this connection. Please try again later or contact us directly.',
  },
});
app.use('/api/enquiries', (req, res, next) => (req.method === 'POST' ? enquiryLimiter(req, res, next) : next()));

app.get('/', (req, res) => {
  res.status(200).json({ name: 'Verdict Beach API', version: '1.0.0', status: 'online', documentation: '/api/health' });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
