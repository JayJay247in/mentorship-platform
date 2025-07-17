// src/routes/upload.ts
import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getCloudinarySignature } from '../controllers/uploadController';

const router = Router();
router.get('/signature', protect, getCloudinarySignature);
export default router;