// src/services/authService.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import AppError from '../utils/AppError';
import { sendEmail } from './mailService';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

// Define payload types for clarity and type safety
interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

// --- REFACTORED REGISTER FUNCTION ---
export const register = async (payload: RegisterPayload) => {
  const { email, password, name } = payload;

  // This manual check is NO LONGER NEEDED because Zod handles it.
  // if (!email || !password || !name) {
  //   throw new AppError('All fields are required', 400);
  // }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// --- REFACTORED LOGIN FUNCTION ---
export const login = async (payload: LoginPayload) => {
  const { email, password } = payload;

  // The service still needs to check if the user exists and the password is correct.
  // This is business logic, not just validation.
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '1d',
  });

  return { token, userId: user.id, role: user.role };
};

// --- Existing forgotPassword function ---
export const forgotPassword = async (email: string, clientUrl: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log(`Password reset attempt for non-existent user: ${email}`);
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  const passwordResetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: { passwordResetToken, passwordResetTokenExpiry },
  });

  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Your Password Reset Link (Valid for 10 min)',
    html: `<p>Please click this link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
  });
};

// --- Existing resetPassword function ---
export const resetPassword = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired.', 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpiry: null,
    },
  });
};
