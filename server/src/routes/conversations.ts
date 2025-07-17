// src/routes/conversations.ts
import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getMyConversations } from '../controllers/conversationController';

const router = Router();
router.use(protect);

router.get('/', getMyConversations);

export default router;