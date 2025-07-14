// src/routes/users.ts
import { Router } from 'express';
import {
  getMentors,
  getUserProfile,
  updateCurrentUserProfile,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate'; // Import validate middleware
import { updateProfileSchema } from '../schemas/userSchema'; // Import the new schema

const router = Router();

// This route remains public to find mentors
router.get('/mentors', getMentors);

// --- MODIFIED ROUTE ---
// Apply the validation middleware to the profile update route.
// It will run after 'protect' but before the controller.
router.put(
  '/me/profile',
  protect,
  validate(updateProfileSchema),
  updateCurrentUserProfile
);

// This route is for viewing a specific user's profile
router.get('/:id', protect, getUserProfile);

export default router;
