import Enquiry from '../models/Enquiry.js';
import Consultation from '../models/Consultation.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { sendSubmissionNotification } from '../utils/mailer.js';

export const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create({
    name: req.body.name, email: req.body.email, phone: req.body.phone,
    company: req.body.company, service: req.body.service,
    subject: req.body.subject, message: req.body.message
  });
  sendSubmissionNotification('contact enquiry', enquiry.toObject()).catch((error) => console.error('Notification email failed:', error.message));
  res.status(201).json({ success: true, message: 'Your enquiry has been submitted successfully.', data: { id: enquiry._id } });
});

export const createConsultation = asyncHandler(async (req, res) => {
  const consultation = await Consultation.create({
    name: req.body.name, email: req.body.email, phone: req.body.phone,
    company: req.body.company, service: req.body.service,
    preferredDate: req.body.preferredDate || undefined,
    preferredTime: req.body.preferredTime, details: req.body.details
  });
  sendSubmissionNotification('consultation request', consultation.toObject()).catch((error) => console.error('Notification email failed:', error.message));
  res.status(201).json({ success: true, message: 'Your consultation request has been received.', data: { id: consultation._id } });
});
