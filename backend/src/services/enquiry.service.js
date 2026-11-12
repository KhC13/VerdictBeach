import { Enquiry } from '../models/enquiry.model.js';
import { ApiError } from '../utils/apiError.js';
import { EmailService } from './email.service.js';

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

    // Fire non-blocking notifications asynchronously
    EmailService.sendEnquiryConfirmation({
      to: enquiry.email,
      name: enquiry.name,
      service: enquiry.service,
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

    if (status) {
      query.status = status;
    }

    if (service) {
      query.service = new RegExp(service, 'i');
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
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
