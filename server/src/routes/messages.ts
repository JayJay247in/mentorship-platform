// src/routes/messages.ts
import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getMessages, markAsRead } from '../controllers/messageController'; // <-- Import markAsRead

const router = Router();
router.use(protect);

router.get('/:requestId', getMessages);
router.put('/read/:requestId', markAsRead); // <-- ADD THIS NEW ROUTE

export default router;