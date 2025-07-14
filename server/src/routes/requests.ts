// src/routes/requests.ts
import { Router } from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
  createMentorshipRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
} from '../controllers/requestController';

const router = Router();

// All routes in this file are protected, so we can use 'protect' middleware at the top level
router.use(protect);

// Define the routes with role-based authorization
router.post('/', authorize(['MENTEE']), createMentorshipRequest);
router.get('/sent', authorize(['MENTEE']), getSentRequests);
router.get('/received', authorize(['MENTOR']), getReceivedRequests);
router.put('/:id', authorize(['MENTOR']), updateRequestStatus);

export default router;
