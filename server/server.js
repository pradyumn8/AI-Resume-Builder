import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import "dotenv/config";
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security headers
app.use(helmet());

// CORS — restrict to frontend origin
app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173', 
        'http://localhost:5000'].filter(Boolean),
    credentials: true,
}));

// Body parser with size limit to prevent large-payload DoS
app.use(express.json({ limit: '1mb' }));

// Global rate limiter — 100 requests per 15 min per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);

// Stricter rate limiter for auth routes — 20 requests per 15 min
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many login attempts, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limiter for AI routes — 30 requests per 15 min
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { message: 'Too many AI requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.get('/', (req, res) => res.send("Server is live..."));
app.use('/api/users', authLimiter, userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiLimiter, aiRouter);

// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();