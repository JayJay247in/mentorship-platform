// src/schemas/userSchema.ts
import { z } from 'zod';

// Schema for updating a user's profile
export const updateProfileSchema = z.object({
  body: z.object({
    // Keep existing validations
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .optional(),

    bio: z
      .string()
      .max(500, 'Bio cannot exceed 500 characters')
      .optional(),
      
    skills: z
      .array(z.string().cuid('Invalid skill ID format'))
      .optional(),

    // --- THIS IS THE FIX ---
    // Add avatarUrl to the schema. It must be a valid URL string, and it's optional.
    avatarUrl: z
      .string()
      .url({ message: 'Invalid URL format for avatar' })
      .optional(),
  }),
});