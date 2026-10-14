/**
 * Vercel Serverless Function Entry Point
 * Routes all /api/* requests to the Express application backend on Vercel.
 */

import app from '../server/app';

export default function handler(req: any, res: any) {
  // If Vercel edge rewrite modified req.url to /api, recover the original path
  const originalUri = req.headers['x-forwarded-uri'] || req.headers['x-matched-path'];
  if (typeof originalUri === 'string' && (req.url === '/api' || req.url === '/api/' || req.url === '/')) {
    req.url = originalUri;
  }
  return app(req, res);
}
