import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  company: { type: String, trim: true, maxlength: 150 },
  service: { type: String, required: true, trim: true, maxlength: 150 },
  preferredDate: { type: Date },
  preferredTime: { type: String, trim: true, maxlength: 50 },
  details: { type: String, trim: true, maxlength: 5000, default: '' },
  status: { type: String, enum: ['requested', 'confirmed', 'completed', 'cancelled'], default: 'requested' },
  adminNote: { type: String, trim: true, maxlength: 2000, default: '' }
}, { timestamps: true });

export default mongoose.model('Consultation', consultationSchema);
