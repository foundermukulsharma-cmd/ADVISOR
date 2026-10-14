/**
 * Real Analytics and Event Tracking Routes
 */

import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthRequest } from '../auth';
import { AnalyticsSummary } from '../../src/types';

export const analyticsRouter = Router();

/**
 * Public: Track Website Event
 */
analyticsRouter.post('/track', (req: Request, res: Response): void => {
  try {
    const { eventType, source, language, metadata } = req.body;
    const allowedTypes = [
      'page_view',
      'vcf_download',
      'call_click',
      'whatsapp_click',
      'quiz_start',
      'quiz_complete',
      'form_submit',
      'share_click'
    ];

    if (!eventType || !allowedTypes.includes(eventType)) {
      res.status(400).json({ error: 'Invalid event type.' });
      return;
    }

    const event = db.recordAnalyticsEvent({
      eventType,
      source: source || 'web',
      language: language || 'en',
      metadata
    });

    res.status(201).json({ success: true, eventId: event.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record event.' });
  }
});

/**
 * Protected: Compute Real Analytics Summary
 */
analyticsRouter.get('/summary', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const events = db.getAnalyticsEvents();
    const leads = db.getLeads();

    let pageViews = 0;
    let vcfDownloads = 0;
    let callClicks = 0;
    let whatsAppClicks = 0;
    let quizStarts = 0;
    let quizCompletions = 0;
    let formSubmissions = 0;

    events.forEach(e => {
      switch (e.eventType) {
        case 'page_view': pageViews++; break;
        case 'vcf_download': vcfDownloads++; break;
        case 'call_click': callClicks++; break;
        case 'whatsapp_click': whatsAppClicks++; break;
        case 'quiz_start': quizStarts++; break;
        case 'quiz_complete': quizCompletions++; break;
        case 'form_submit': formSubmissions++; break;
      }
    });

    const leadsWon = leads.filter(l => l.leadStatus === 'Deal Won' || l.dealStatus === 'Won').length;
    const leadsLost = leads.filter(l => l.leadStatus === 'Deal Lost' || l.dealStatus === 'Lost').length;
    const totalLeads = leads.length;
    const conversionRate = totalLeads > 0 ? Math.round((leadsWon / totalLeads) * 100) : 0;

    const summary: AnalyticsSummary = {
      totalPageViews: pageViews,
      totalVcfDownloads: vcfDownloads,
      totalCallClicks: callClicks,
      totalWhatsAppClicks: whatsAppClicks,
      totalQuizStarts: quizStarts,
      totalQuizCompletions: quizCompletions,
      totalFormSubmissions: formSubmissions,
      totalLeads,
      leadsWon,
      leadsLost,
      conversionRate,
      recentEvents: events.slice(-30).reverse()
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate analytics summary.' });
  }
});
