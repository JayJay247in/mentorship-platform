// src/schemas/authSchema.ts
import { z } from 'zod';

// Schema for user registration
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Name is required' }) // Use .min(1) for required strings
      .min(2, 'Name must be at least 2 characters long'),

    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email('Invalid email address'),

    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),
  }),
});

// Schema for user login
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email('Invalid email address'),

    password: z.string().min(1, { message: 'Password is required' }),
  }),
});
