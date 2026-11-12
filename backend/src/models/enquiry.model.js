import mongoose from 'mongoose';

export const ROLE_ENUM = [
  'Startup Founder',
  'Business Owner',
  'Entrepreneur',
  'Individual',
  'Corporate Representative',
  'Other',
];

export const STATUS_ENUM = ['new', 'in_review', 'contacted', 'closed'];

const noteSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: 'Admin',
      trim: true,
    },
  },
  { timestamps: true }
);

const attachmentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
      maxlength: [120, 'Company name cannot exceed 120 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      maxlength: [30, 'Phone number is too long'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    service: {
      type: String,
      required: [true, 'Service required is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Enquiry description is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters long'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    status: {
      type: String,
      enum: STATUS_ENUM,
      default: 'new',
      index: true,
    },
    attachments: [attachmentSchema],
    notes: [noteSchema],
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Helpful compound indexes for queries
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ email: 1 });
enquirySchema.index({ status: 1, createdAt: -1 });

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
