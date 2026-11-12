import { EnquiryService } from '../services/enquiry.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class EnquiryController {
  /**
   * Handle POST /api/enquiries (supports multipart file uploads)
   */
  static createEnquiry = asyncHandler(async (req, res) => {
    const metadata = {
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
      userAgent: req.headers['user-agent'] || '',
    };

    const attachments = (req.files || []).map((file) => ({
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/documents/${file.filename}`,
    }));

    const enquiry = await EnquiryService.createEnquiry(
      {
        ...req.body,
        attachments,
      },
      metadata
    );

    return res.status(201).json(
      ApiResponse.created(
        enquiry,
        'Your enquiry has been submitted successfully. Our team will contact you shortly.'
      )
    );
  });

  /**
   * Handle GET /api/enquiries (Protected)
   */
  static listEnquiries = asyncHandler(async (req, res) => {
    const result = await EnquiryService.listEnquiries(req.query);

    return res.status(200).json(
      ApiResponse.success(result, 'Enquiries retrieved successfully')
    );
  });

  /**
   * Handle GET /api/enquiries/stats (Protected)
   */
  static getEnquiryStats = asyncHandler(async (req, res) => {
    const stats = await EnquiryService.getEnquiryStats();

    return res.status(200).json(
      ApiResponse.success(stats, 'Enquiry statistics retrieved successfully')
    );
  });

  /**
   * Handle GET /api/enquiries/:id (Protected)
   */
  static getEnquiryById = asyncHandler(async (req, res) => {
    const enquiry = await EnquiryService.getEnquiryById(req.params.id);

    return res.status(200).json(
      ApiResponse.success(enquiry, 'Enquiry retrieved successfully')
    );
  });

  /**
   * Handle PATCH /api/enquiries/:id (Protected)
   */
  static updateEnquiry = asyncHandler(async (req, res) => {
    const { status, note, author } = req.body;
    const authorName = author || req.user?.name || 'Counsel';
    const updated = await EnquiryService.updateEnquiry(req.params.id, {
      status,
      note,
      author: authorName,
    });

    return res.status(200).json(
      ApiResponse.success(updated, 'Enquiry updated successfully')
    );
  });

  /**
   * Handle DELETE /api/enquiries/:id (Protected)
   */
  static deleteEnquiry = asyncHandler(async (req, res) => {
    await EnquiryService.deleteEnquiry(req.params.id);

    return res.status(200).json(
      ApiResponse.success(null, 'Enquiry deleted successfully')
    );
  });
}
