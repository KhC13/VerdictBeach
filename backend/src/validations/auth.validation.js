import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Please enter your name.' })
      .trim()
      .min(2, 'Name must be at least 2 characters.')
      .max(100, 'Name cannot exceed 100 characters.'),
    email: z
      .string({ required_error: 'Please enter your email.' })
      .trim()
      .email('Please enter a valid email address.')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Please enter your password.' })
      .min(6, 'Password must be at least 6 characters.'),
    role: z
      .enum(['admin', 'staff', 'counsel'])
      .optional()
      .default('admin'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Please enter your email.' })
      .trim()
      .email('Please enter a valid email address.')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Please enter your password.' })
      .min(1, 'Password is required.'),
  }),
});
