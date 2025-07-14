// src/routes/availability.ts
import { Router } from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  setMyAvailability,
  getMentorAvailability,
  getMyAvailability,
} from '../controllers/availabilityController';

const router = Router();

router.use(protect); // All routes are protected

// A mentor setting their OWN availability
router.put('/me', authorize(['MENTOR']), setMyAvailability);

// A user getting the availability OF a mentor
router.get('/:mentorId', getMentorAvailability);

router.get('/me', authorize(['MENTOR']), getMyAvailability);

export default router;
