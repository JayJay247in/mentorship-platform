// server/src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit'; // <-- 1. Import the library

import { initSocketServer } from './socket';

// Import all route files
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import requestRoutes from './routes/requests';
import sessionRoutes from './routes/sessions';
import adminRoutes from './routes/admin';
import availabilityRoutes from './routes/availability';
import skillRoutes from './routes/skills';
import uploadRoutes from './routes/upload';
import messageRoutes from './routes/messages';
import conversationRoutes from './routes/conversations';
import notificationRoutes from './routes/notifications';
import dashboardRoutes from './routes/dashboard';

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? 'https://your-vercel-frontend-url.com'
      // Allow localhost for development
      : 'http://localhost:3000',
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- 2. Define the Rate Limiter Middleware ---
// This will apply to the routes we attach it to.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs (e.g., for login, register)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes',
});


// --- 3. Apply the limiter specifically to auth routes ---
// All other routes will not be rate-limited.
app.use('/api/auth', authLimiter, authRoutes);

// API Routes (without the rate limiter)
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.get('/api', (req: Request, res: Response) => {
  res.send('API is running...');
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: corsOptions
});

initSocketServer(io);

(global as any).io = io;

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;