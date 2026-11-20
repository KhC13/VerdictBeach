import { Enquiry } from '../models/enquiry.model.js';
import { ApiError } from '../utils/apiError.js';
import { EmailService } from './email.service.js';

// Escape user input before building a RegExp so it is matched literally.
const escapeRegex = (text = '') => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class EnquiryService {
  /**
   * Create a new consultation enquiry
   */
  static async createEnquiry(payload, metadata = {}) {
    const enquiry = await Enquiry.create({
      ...payload,
      ipAddress: metadata.ipAddress || '',
      userAgent: metadata.userAgent || '',
    });

    // Notifications run after the response is sent; failures are logged, never returned to the visitor.
    const reference = String(enquiry._id).slice(-8).toUpperCase();
    EmailService.sendEnquiryConfirmation({
      to: enquiry.email,
      name: enquiry.name,
      service: enquiry.service,
      reference,
    }).catch((err) => console.error('[EnquiryService] Confirmation email error:', err.message));

    EmailService.sendAdminNotification(enquiry).catch((err) =>
      console.error('[EnquiryService] Admin alert email error:', err.message)
    );

    return enquiry;
  }

  /**
   * List enquiries with pagination, searching, and filtering
   */
  static async listEnquiries({
    page = 1,
    limit = 10,
    status,
    service,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }) {
    const query = {};
    const pattern = search ? escapeRegex(search) : '';

    if (status) {
      query.status = status;
    }

    if (service) {
      query.service = { $regex: escapeRegex(service), $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: pattern, $options: 'i' } },
        { email: { $regex: pattern, $options: 'i' } },
        { companyName: { $regex: pattern, $options: 'i' } },
        { message: { $regex: pattern, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [enquiries, total] = await Promise.all([
      Enquiry.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Enquiry.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Get single enquiry by ID
   */
  static async getEnquiryById(id) {
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      throw ApiError.notFound(`Enquiry not found with ID: ${id}`);
    }
    return enquiry;
  }

  /**
   * Update enquiry status or add an internal note
   */
  static async updateEnquiry(id, { status, note, author }) {
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      throw ApiError.notFound(`Enquiry not found with ID: ${id}`);
    }

    if (status) {
      enquiry.status = status;
    }

    if (note) {
      enquiry.notes.push({
        note,
        author: author || 'Counsel',
      });
    }

    await enquiry.save();
    return enquiry;
  }

  /**
   * Delete an enquiry by ID
   */
  static async deleteEnquiry(id) {
    const enquiry = await Enquiry.findByIdAndDelete(id);
    if (!enquiry) {
      throw ApiError.notFound(`Enquiry not found with ID: ${id}`);
    }
    return enquiry;
  }

  /**
   * Get dashboard summary statistics of enquiries
   */
  static async getEnquiryStats() {
    const [total, byStatus, recentCount] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Enquiry.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    const statusMap = {
      new: 0,
      in_review: 0,
      contacted: 0,
      closed: 0,
    };

    byStatus.forEach((item) => {
      if (item._id in statusMap) {
        statusMap[item._id] = item.count;
      }
    });

    return {
      total,
      last7Days: recentCount,
      byStatus: statusMap,
    };
  }
}
