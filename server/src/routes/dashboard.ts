// server/src/routes/dashboard.ts

import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getDashboard } from '../controllers/dashboardController';

const router = Router();

// This is a single, protected GET route.
// It will be the only dashboard endpoint needed.
router.get('/', protect, getDashboard);

export default router;