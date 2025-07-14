// src/routes/sessions.ts
import { Router } from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  scheduleSession,
  getSessionsAsMentee,
  getSessionsAsMentor,
  submitFeedback,
  getSessionsOfUser,
} from '../controllers/sessionController';

const router = Router();

// All routes here are for authenticated users
router.use(protect);

// Define the specific routes with role-based authorization
router.post('/', authorize(['MENTEE']), scheduleSession);
router.get('/mentee', authorize(['MENTEE']), getSessionsAsMentee);
router.get('/mentor', authorize(['MENTOR']), getSessionsAsMentor);
router.put('/:id/feedback', authorize(['MENTEE']), submitFeedback); // Per PRD, mentee provides rating

export default router;
