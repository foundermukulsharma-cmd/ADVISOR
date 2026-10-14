/**
 * Security Audit Log Routes
 */

import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, requireRole, AuthRequest } from '../auth';

export const auditRouter = Router();

auditRouter.get('/', requireAuth, requireRole(['Super Admin']), (req: AuthRequest, res: Response): void => {
  try {
    const logs = db.getAuditLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve audit logs.' });
  }
});
