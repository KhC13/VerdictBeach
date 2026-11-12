import Enquiry from '../models/Enquiry.js';
import Consultation from '../models/Consultation.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const models = { enquiries: Enquiry, consultations: Consultation };

export const listRecords = (type) => asyncHandler(async (req, res) => {
  const Model = models[type];
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 20));
  const filter = req.query.status ? { status: req.query.status } : {};
  const [items, total] = await Promise.all([
    Model.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Model.countDocuments(filter)
  ]);
  res.json({ success: true, data: items, pagination: { total, page, limit, pages: Math.ceil(total / limit) } });
});

export const updateRecord = (type) => asyncHandler(async (req, res) => {
  const Model = models[type];
  const allowed = type === 'enquiries'
    ? ['status', 'adminNote']
    : ['status', 'adminNote', 'preferredDate', 'preferredTime'];
  const updates = {};
  for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
  if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: 'No valid fields supplied' });
  const item = await Model.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ success: false, message: 'Record not found' });
  res.json({ success: true, data: item });
});

export const deleteRecord = (type) => asyncHandler(async (req, res) => {
  const item = await models[type].findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Record not found' });
  res.json({ success: true, message: 'Record deleted successfully' });
});
