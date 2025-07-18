// server/src/routes/auth.ts

import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword, // Make sure these are imported
  resetPassword,  // Make sure these are imported
} from '../controllers/authController';
import { validate } from '../middleware/validate';
import { protect } from '../middleware/authMiddleware';

// Assuming you have these zod schemas defined elsewhere
// import { registerSchema, loginSchema } from '../schemas/authSchema';

const router = Router();

// --- We can add Zod validation here for extra security ---
// Example: router.post('/register', validate(registerSchema), registerUser);
router.post('/register', registerUser);
router.post('/login', loginUser);

// Routes for password management
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// This route is protected - you must have a valid token to access it
router.get('/me', protect, getMe);

export default router;