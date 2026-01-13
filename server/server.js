import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import { startCronJobs } from './cron/expireListings.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

connectDB();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://via.placeholder.com"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
      },
    },
  })
);

app.use(mongoSanitize());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes (these should come BEFORE the frontend routes)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Collexa API is running' });
});

// Handle unknown API routes (must come after API routes but before frontend)
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`
  });
});

// ===============================
// Serve React frontend
// ===============================
if (process.env.NODE_ENV === 'production') {
  // Production: serve built React app
  const publicPath = path.join(__dirname, 'public');

  app.use(express.static(publicPath));

  // React Router fallback for production
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  // Development: provide helpful message
  app.get('/', (req, res) => {
    res.json({
      message: 'Collexa API Server',
      status: 'running',
      environment: 'development',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        users: '/api/users',
        listings: '/api/listings',
        reports: '/api/reports',
        admin: '/api/admin',
      },
      note: 'Frontend should be running on http://localhost:5173 (or your configured FRONTEND_URL)',
    });
  });

  // Catch any other non-API routes in development
  app.get('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found. This is the backend API server.',
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    });
  });
}

// Error handler (must be last)
app.use(errorHandler);

// Start cron jobs
startCronJobs();

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🎨 Frontend should be running on: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`💡 Backend API available at: http://localhost:${PORT}/api`);
  }
});