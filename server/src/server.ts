// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';

// Import all route files
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import requestRoutes from './routes/requests';
import sessionRoutes from './routes/sessions';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api', (req: Request, res: Response) => {
    res.send('API is running...');
});

// Start the server only if this file is run directly
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;