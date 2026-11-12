import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { adminLogin } from '../controllers/authController.js';
const router = Router();
router.post('/login', [body('email').isEmail().withMessage('Valid email is required'), body('password').isString().notEmpty().withMessage('Password is required')], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  next();
}, adminLogin);
export default router;
