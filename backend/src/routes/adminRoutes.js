import { Router } from 'express';
import { param, validationResult } from 'express-validator';
import { requireAdmin } from '../middleware/auth.js';
import { listRecords, updateRecord, deleteRecord } from '../controllers/adminController.js';
const router = Router();
router.use(requireAdmin);
const validateId = [param('id').isMongoId().withMessage('Invalid record ID'), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  next();
}];
for (const type of ['enquiries', 'consultations']) {
  router.get(`/${type}`, listRecords(type));
  router.patch(`/${type}/:id`, validateId, updateRecord(type));
  router.delete(`/${type}/:id`, validateId, deleteRecord(type));
}
export default router;
