import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';

// Import domain routes
import authRoutes from './routes/authRoutes';
import requestsRoutes from './routes/requestsRoutes';
import donorsRoutes from './routes/donorsRoutes';
import hospitalsRoutes from './routes/hospitalsRoutes';
import adminRoutes from './routes/adminRoutes';
import notificationsRoutes from './routes/notificationsRoutes';

export const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Let frontend assets load flexibly in development
  })
);

// CORS configuration
app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Global Rate Limiter for general endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests created from this IP, please try again after 15 minutes.',
  },
});

app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'BloodBridge Real-Time Coordination API',
    version: '1.0.0',
  });
});

// Domain Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/donors', donorsRoutes);
app.use('/api/hospitals', hospitalsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationsRoutes);

// Fallback 404 handler for API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' does not exist.`,
  });
});

// Production-ready global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);

  const statusCode = err.status || err.statusCode || 500;
  const userMessage =
    config.nodeEnv === 'production' && statusCode === 500
      ? "We couldn't complete this coordination request right now. Please try again or contact hospital coordinator."
      : err.message || 'An internal platform error occurred.';

  res.status(statusCode).json({
    success: false,
    message: userMessage,
    ...(config.nodeEnv !== 'production' && { stack: err.stack }),
  });
});
