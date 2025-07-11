// src/routes/admin.ts
import { Router } from 'express';
import { protect, authorize } from '../middleware/authMiddleware';
import {
    getAllUsers,
    updateUserRole,
    getAllRequests,
    getAllSessions,
    createManualMatch
} from '../controllers/adminController';

const router = Router();

// Apply middleware to all routes in this file.
// This ensures that any user accessing these routes must be
// 1. Logged in (checked by 'protect')
// 2. Have the 'ADMIN' role (checked by 'authorize')
router.use(protect, authorize(['ADMIN']));

// Define Admin routes
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.get('/requests', getAllRequests);
router.get('/sessions', getAllSessions);
router.post('/matches', createManualMatch);

export default router;