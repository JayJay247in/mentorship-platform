// src/controllers/authController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// A secret key for JWT. Store this in your .env file in a real app!
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

export const registerUser = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name },
        });

        // Don't send the password back
        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(409).json({ message: 'User with this email already exists' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
            expiresIn: '1d', // Token expires in 1 day
        });
        
        res.json({ token, userId: user.id, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};