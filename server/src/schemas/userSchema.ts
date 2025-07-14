// src/schemas/userSchema.ts
import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name cannot be empty' }),

    bio: z.string().optional(), // .optional() allows the field to be undefined

    // We can also validate the skills array if it's sent
    skills: z
      .array(z.string().cuid({ message: 'Each skill must be a valid CUID' }))
      .optional(),
  }),
});
