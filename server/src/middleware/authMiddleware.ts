// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

// Extend the Express Request type to include the user payload
export interface AuthRequest extends Request {
    user?: { userId: string; role: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = (req as Request).headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// NEW AUTHORIZATION MIDDLEWARE
export const authorize = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as Role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required role to access this resource.' });
    }
    next();
  };
};