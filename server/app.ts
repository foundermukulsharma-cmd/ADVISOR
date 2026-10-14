/**
 * Express Application Setup
 * Shared by local dev / standalone server (server.ts) and Vercel serverless functions (api/index.ts).
 */

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { authRouter } from './routes/authRoutes';
import { leadRouter } from './routes/leadRoutes';
import { contentRouter } from './routes/contentRoutes';
import { templateRouter } from './routes/templateRoutes';
import { analyticsRouter } from './routes/analyticsRoutes';
import { auditRouter } from './routes/auditRoutes';

dotenv.config();

export const app = express();

// CORS & Security headers for API
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Resilient Body Parser middleware compatible with both standalone Node & Vercel serverless
// On Vercel, the serverless runtime may have already parsed or consumed req.body.
app.use((req: Request, res: Response, next: NextFunction) => {
  // If req.body has already been parsed into an object by upstream runner
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return next();
  }

  // If req.body is already a string, attempt JSON parse
  if (typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
      return next();
    } catch {
      // not JSON string, proceed
    }
  }

  // Fallback to Express body-parsers with graceful error catching
  express.json({ limit: '5mb' })(req, res, (err) => {
    if (err) {
      console.warn('[BodyParser JSON Warning]:', err.message);
    }
    express.urlencoded({ extended: true, limit: '5mb' })(req, res, (err2) => {
      if (err2) {
        console.warn('[BodyParser UrlEncoded Warning]:', err2.message);
      }
      next();
    });
  });
});

// URL Path normalizer middleware for Vercel Serverless Function rewrites
// Ensures requests rewritten to /api or containing x-forwarded-uri are properly routed
app.use((req: Request, res: Response, next: NextFunction) => {
  const forwardedUri = (req.headers['x-forwarded-uri'] || req.headers['x-matched-path']) as string | undefined;
  if (typeof forwardedUri === 'string' && (req.url === '/api' || req.url === '/api/' || req.url === '/')) {
    req.url = forwardedUri;
  }
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

// Catch-all 404 for unhandled API routes (guarantees JSON response, never HTML 404)
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    error: `API route not found: ${req.method} ${req.originalUrl || req.url}`,
    status: 404
  });
});

// Global Error Handler (guarantees JSON error response, never HTML 500)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Server Error Caught]:', err);
  const status = typeof err.status === 'number' ? err.status : (typeof err.statusCode === 'number' ? err.statusCode : 500);
  res.status(status).json({
    error: err.message || 'Internal server error occurred.',
    status
  });
});

export default app;
