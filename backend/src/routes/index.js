import { Router } from 'express';
import healthRoutes from './health.routes.js';
import enquiryRoutes from './enquiry.routes.js';
import authRoutes from './auth.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/enquiries', enquiryRoutes);

export default router;
