// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from 'http'; // <-- Import createServer
import { Server } from 'socket.io'; // <-- Import Socket.IO Server
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

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? 'https://your-vercel-frontend-url.com'
      : 'http://localhost:3000',
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);

app.get('/api', (req: Request, res: Response) => {
  res.send('API is running...');
});

// 1. Create the HTTP server from the Express app
const httpServer = createServer(app);

// 2. Create the Socket.IO server and attach it to the HTTP server
const io = new Server(httpServer, {
  cors: corsOptions // Use the same CORS options for the WebSocket server
});

// 3. Initialize our custom socket logic
initSocketServer(io);

(global as any).io = io;

// 4. Listen on the httpServer, not the Express app
if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
