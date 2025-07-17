// src/controllers/authController.ts
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as authService from '../services/authService';
import handleError from '../utils/errorHandler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json(user);
    } catch (error) {
        handleError(error, res);
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const data = await authService.login(req.body);
        res.json(data);
    } catch (error) {
        handleError(error, res);
    }
};

// --- THIS IS THE MODIFIED FUNCTION ---
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        // Find the user based on the token's payload
        const user = await prisma.user.findUnique({
            where: { id: req.user!.userId },
            // Ensure the 'select' block includes the avatarUrl
            select: { 
                id: true, 
                email: true, 
                name: true, 
                role: true, 
                bio: true,
                avatarUrl: true, // <-- THIS IS THE FIX
            }
        });

        if (!user) {
            // This case should be rare if the JWT is valid, but it's good practice
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        handleError(error, res);
    }
};
// --- END OF MODIFIED FUNCTION ---

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const clientUrl = req.headers.origin || 'http://localhost:3000';
        await authService.forgotPassword(email, clientUrl);
        res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    } catch (error) {
        handleError(error, res);
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        
        if (!token) {
            return res.status(400).json({ message: 'Password reset token is required.' });
        }

        await authService.resetPassword(token, password);
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        handleError(error, res);
    }
};