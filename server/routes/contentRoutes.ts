/**
 * Website Content and Advisor Configuration Routes
 */

import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAuth, requireRole, AuthRequest } from '../auth';

export const contentRouter = Router();

/**
 * Public: Get Website Content
 */
contentRouter.get('/', (req: Request, res: Response): void => {
  try {
    const content = db.getContent();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve website content.' });
  }
});

/**
 * Protected: Update Website Content & Settings
 */
contentRouter.put('/', requireAuth, requireRole(['Super Admin', 'Content Admin']), (req: AuthRequest, res: Response): void => {
  try {
    const updates = req.body;
    const updatedContent = db.updateContent(updates);

    db.logAudit({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'CONTENT_UPDATED',
      targetResource: 'WebsiteContent',
      details: 'Published updates to website copy, contact details, or services.'
    });

    res.json({ success: true, content: updatedContent });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update website content.' });
  }
});
