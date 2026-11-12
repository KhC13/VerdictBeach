import { Router } from 'express';
import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import { createEnquiry, createConsultation } from '../controllers/publicController.js';

const router = Router();
const email = body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail();
const name = body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 });
const phone = body('phone').optional({ values: 'falsy' }).trim().isLength({ min: 7, max: 30 }).withMessage('Enter a valid phone number');
const collectErrors = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: result.array().map(({ path, msg }) => ({ field: path, message: msg })) });
  next();
};

router.post('/enquiries', [name, email, phone, body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 })], collectErrors, createEnquiry);
router.post('/consultations', [name, email, body('phone').trim().notEmpty().withMessage('Phone is required').isLength({ min: 7, max: 30 }), body('service').trim().notEmpty().withMessage('Please select a service'), body('details').optional().isLength({ max: 5000 })], collectErrors, createConsultation);

export default router;
