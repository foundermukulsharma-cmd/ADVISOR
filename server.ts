/**
 * Full-Stack Express Server with Vite Middlewares
 * Serves API routes on /api/* and handles frontend SPA dev/prod serving on port 3000.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { authRouter } from './server/routes/authRoutes';
import { leadRouter } from './server/routes/leadRoutes';
import { contentRouter } from './server/routes/contentRoutes';
import { templateRouter } from './server/routes/templateRoutes';
import { analyticsRouter } from './server/routes/analyticsRoutes';
import { auditRouter } from './server/routes/auditRoutes';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

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

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/leads', leadRouter);
app.use('/api/content', contentRouter);
app.use('/api/templates', templateRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/audit-logs', auditRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'Sarla Hooda LIC Advisory & Smart CRM',
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  if (!isProduction) {
    // Dynamic import vite in dev mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Sarla Hooda LIC Platform] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
