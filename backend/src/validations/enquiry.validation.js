import { z } from 'zod';
import { STATUS_ENUM } from '../models/enquiry.model.js';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createEnquirySchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Please enter your full name.' })
      .trim()
      .min(2, 'Name must be at least 2 characters.'),
    companyName: z
      .string()
      .trim()
      .optional()
      .default(''),
    email: z
      .string({ required_error: 'Please enter your email address.' })
      .trim()
      .email('Please enter a valid email address.')
      .toLowerCase(),
    phone: z
      .string({ required_error: 'Please enter your phone number.' })
      .trim()
      .regex(/^\+?[0-9\s\-().]{7,20}$/, 'Please enter a valid phone number.')
      .refine((val) => val.replace(/\D/g, '').length >= 7, {
        message: 'Phone number must contain at least 7 digits.',
      }),
    role: z
      .string({ required_error: 'Please tell us who you are.' })
      .trim()
      .min(1, 'Please tell us who you are.'),
    service: z
      .string({ required_error: 'Please select the service you need.' })
      .trim()
      .min(1, 'Please select the service you need.'),
    message: z
      .string({ required_error: 'Please tell us a little about your enquiry.' })
      .trim()
      .min(10, 'Please add a little more detail (at least 10 characters).'),
  }),
});

export const updateEnquiryStatusSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid enquiry ID format'),
  }),
  body: z.object({
    status: z.enum(STATUS_ENUM, {
      errorMap: () => ({ message: `Status must be one of: ${STATUS_ENUM.join(', ')}` }),
    }).optional(),
    note: z.string().trim().min(1, 'Note cannot be empty').optional(),
    author: z.string().trim().optional(),
  }).refine((data) => data.status !== undefined || data.note !== undefined, {
    message: 'Either status or note must be provided for update',
  }),
});

export const getEnquiryByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid enquiry ID format'),
  }),
});

export const listEnquiriesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum(STATUS_ENUM).optional(),
    service: z.string().trim().optional(),
    search: z.string().trim().optional(),
    sortBy: z.enum(['createdAt', 'name', 'status']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});
