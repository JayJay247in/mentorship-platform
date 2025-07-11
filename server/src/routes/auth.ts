// src/routes/auth.ts
import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { protect, AuthRequest } from '../middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/register', registerUser);
router.post('/login', loginUser);

// This is the GET /auth/me endpoint from your PRD
router.get('/me', protect, async (req: AuthRequest, res) => {
    // The `protect` middleware has already verified the token and added `user` to the request
    const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: { id: true, email: true, name: true, role: true, bio: true } // Select only safe fields
    });
    res.json(user);
});

export default router;