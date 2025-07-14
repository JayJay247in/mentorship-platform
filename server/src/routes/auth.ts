// src/routes/auth.ts
import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate'; // Import our new middleware
import { registerSchema, loginSchema } from '../schemas/authSchema'; // Import our new schemas

const router = Router();

// Apply the validation middleware before the controller function is called.
// If validation fails, the controller will never even run.
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

// Other routes that can also have validation added later
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// This route is protected by a different middleware
router.get('/me', protect, getMe);

export default router;
