// src/routes/users.ts
import { Router } from 'express';
import { getMentors, getUserProfile, updateCurrentUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Define the routes
router.get('/mentors', getMentors); // Public route to find mentors
router.put('/me/profile', protect, updateCurrentUserProfile); // Private route to update own profile
router.get('/:id', protect, getUserProfile); // Private route to view a specific profile

export default router;