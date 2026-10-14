/**
 * Message Assistant Templates API Routes
 */

import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthRequest } from '../auth';

export const templateRouter = Router();

templateRouter.get('/', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const templates = db.getTemplates();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates.' });
  }
});

templateRouter.post('/', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const { category, titleEn, titleHi, contentEn, contentHi } = req.body;
    if (!category || !titleEn || !contentEn) {
      res.status(400).json({ error: 'Template title, category, and content are required.' });
      return;
    }

    const template = db.createTemplate({
      category,
      titleEn,
      titleHi: titleHi || titleEn,
      contentEn,
      contentHi: contentHi || contentEn
    });

    db.logAudit({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'TEMPLATE_CREATED',
      targetResource: 'MessageTemplate',
      targetId: template.id,
      details: `Created message template '${titleEn}'`
    });

    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create template.' });
  }
});

templateRouter.put('/:id', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const updated = db.updateTemplate(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Template not found.' });
      return;
    }

    db.logAudit({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'TEMPLATE_UPDATED',
      targetResource: 'MessageTemplate',
      targetId: req.params.id,
      details: `Updated message template '${updated.titleEn}'`
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update template.' });
  }
});

templateRouter.delete('/:id', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const deleted = db.deleteTemplate(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Template not found.' });
      return;
    }

    db.logAudit({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'TEMPLATE_DELETED',
      targetResource: 'MessageTemplate',
      targetId: req.params.id,
      details: `Deleted message template with ID ${req.params.id}`
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template.' });
  }
});
