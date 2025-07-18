// server/src/schemas/userSchema.ts

import { z } from 'zod';

// Define a schema for the optional social links JSON object
const socialLinksSchema = z.object({
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
}).optional();

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  // Add validation for the new fields
  title: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  socialLinks: socialLinksSchema, // Use the new nested schema
  
  // Keep skill validation
  skills: z.array(z.string()).optional(),
  // We don't validate avatarUrl here as it's handled by the upload endpoint
});