/**
 * Express Application Setup
 * Shared by local dev / standalone server (server.ts) and Vercel serverless functions (api/index.ts).
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { authRouter } from './routes/authRoutes';
import { leadRouter } from './routes/leadRoutes';
import { contentRouter } from './routes/contentRoutes';
import { templateRouter } from './routes/templateRoutes';
import { analyticsRouter } from './routes/analyticsRoutes';
import { auditRouter } from './routes/auditRoutes';

dotenv.config();

export const app = express();

// Body parser
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// CORS & Security headers for API
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Primary API Routes (mounted under /api/*)
app.use('/api/auth', authRouter);
app.use('/api/leads', leadRouter);
app.use('/api/content', contentRouter);
app.use('/api/templates', templateRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/audit-logs', auditRouter);

// Alias routes without /api prefix for Vercel serverless flexibility
// In case Vercel rewrites forward requests as /leads instead of /api/leads
app.use('/auth', authRouter);
app.use('/leads', leadRouter);
app.use('/content', contentRouter);
app.use('/templates', templateRouter);
app.use('/analytics', analyticsRouter);
app.use('/audit-logs', auditRouter);

// Health check endpoint
const healthHandler = (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'Sarla Hooda LIC Advisory & Smart CRM',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL ? 'vercel-serverless' : (process.env.NODE_ENV || 'development')
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

export default app;
