import { Router } from 'express';
import { EnquiryController } from '../controllers/enquiry.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { uploadAttachments } from '../middlewares/upload.middleware.js';
import { validate } from '../middlewares/validate.js';
import {
  createEnquirySchema,
  updateEnquiryStatusSchema,
  getEnquiryByIdSchema,
  listEnquiriesSchema,
} from '../validations/enquiry.validation.js';

const router = Router();

// Public: Submit enquiry (supports multipart/form-data file uploads)
router.post(
  '/',
  uploadAttachments,
  validate(createEnquirySchema),
  EnquiryController.createEnquiry
);

// Protected: All management routes require JWT authentication
router.use(authenticate);

// Stats route (must precede :id route)
router.get('/stats', EnquiryController.getEnquiryStats);

// Collection listing route
router.get('/', validate(listEnquiriesSchema), EnquiryController.listEnquiries);

// Item routes
router
  .route('/:id')
  .get(validate(getEnquiryByIdSchema), EnquiryController.getEnquiryById)
  .patch(validate(updateEnquiryStatusSchema), EnquiryController.updateEnquiry)
  .delete(validate(getEnquiryByIdSchema), EnquiryController.deleteEnquiry);

export default router;
