import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import publicRoutes from './routes/publicRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    const allowed = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((item) => item.trim());
    if (!origin || allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.get('/api/health', (_req, res) => res.json({ success: true, message: 'VERDICT BEACH API is running' }));
const publicLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Too many requests. Please try again later.' } });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Too many login attempts. Try again later.' } });
app.use('/api', publicLimiter);
app.use('/api/auth', loginLimiter, authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use((req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((err, req, res, _next) => {
  console.error(err);
  if (err.message === 'Origin not allowed by CORS') return res.status(403).json({ success: false, message: err.message });
  if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Validation failed', errors: Object.values(err.errors).map((e) => e.message) });
  if (err.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid resource ID' });
  res.status(500).json({ success: false, message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message });
});
export default app;
