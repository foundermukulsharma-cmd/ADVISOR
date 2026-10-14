/**
 * Leads and CRM API Routes
 */

import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAuth, requireRole, AuthRequest } from '../auth';
import { CustomerLead, LeadStatus, DealStatus } from '../../src/types';

export const leadRouter = Router();

/**
 * Public Endpoint: Submit Customer Lead / Quiz Consultation
 */
leadRouter.post('/', (req: Request, res: Response): void => {
  try {
    const {
      name,
      phone,
      email,
      villageCity,
      address,
      preferredLanguage,
      insuranceInterest,
      budgetRange,
      paymentFrequency,
      planningTerm,
      intendedFor,
      priorityGoal,
      quizSummary,
      quizAnswers,
      preferredContactMethod,
      consentStatus,
      locationSharedVoluntarily,
      source
    } = req.body;

    // Validate mandatory fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ error: 'Please provide a valid full name.' });
      return;
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      res.status(400).json({ error: 'Please provide a valid contact number.' });
      return;
    }

    if (!consentStatus) {
      res.status(400).json({ error: 'Consent to be contacted for the insurance consultation is required.' });
      return;
    }

    const cleanPhone = phone.trim();
    const cleanVillage = (villageCity && typeof villageCity === 'string') ? villageCity.trim() : 'Unspecified';

    const newLead = db.createLead({
      name: name.trim(),
      phone: cleanPhone,
      email: email ? email.trim() : undefined,
      villageCity: cleanVillage,
      address: address ? address.trim() : undefined,
      preferredLanguage: preferredLanguage === 'hi' ? 'hi' : 'en',
      insuranceInterest: insuranceInterest || 'General Life Insurance Advisory',
      budgetRange: budgetRange || undefined,
      paymentFrequency: paymentFrequency || undefined,
      planningTerm: planningTerm || undefined,
      intendedFor: intendedFor || undefined,
      priorityGoal: priorityGoal || undefined,
      quizSummary: quizSummary || undefined,
      quizAnswers: quizAnswers || undefined,
      leadStatus: 'New Lead',
      dealStatus: 'Open',
      source: source || 'Website Form',
      preferredContactMethod: preferredContactMethod || 'Either',
      consentStatus: true,
      consentTimestamp: new Date().toISOString(),
      locationSharedVoluntarily: Boolean(locationSharedVoluntarily),
      internalNotes: quizSummary ? `Enquiry from ${source || 'Website'}. Assessment summary: ${quizSummary}` : `Enquiry received via ${source || 'Website'}.`,
      followUpPriority: 'High',
      nextFollowUpDate: new Date().toISOString().slice(0, 10) // Prompt immediate same-day/next-day follow-up
    });

    // Add initial activity
    db.addActivity({
      leadId: newLead.id,
      leadName: newLead.name,
      type: 'NOTE',
      description: `New customer enquiry registered from ${cleanVillage} via ${newLead.source}.`,
      performedBy: 'System'
    });

    // Track analytics event
    db.recordAnalyticsEvent({
      eventType: 'form_submit',
      source: newLead.source,
      language: newLead.preferredLanguage,
      metadata: { interest: newLead.insuranceInterest, village: cleanVillage }
    });

    res.status(201).json({
      success: true,
      message: 'Consultation enquiry received successfully. Sarla Hooda will connect with you shortly.',
      leadId: newLead.id
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'An unexpected error occurred while saving your request.' });
  }
});

/**
 * Protected: Get Leads with Filtering, Search, Sorting, and Pagination
 */
leadRouter.get('/', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const { search, status, deal, sortBy, sortOrder = 'desc', page = '1', limit = '50' } = req.query;

    let leads = [...db.getLeads()];

    // Search filter
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase().trim();
      leads = leads.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        l.villageCity.toLowerCase().includes(q) ||
        l.insuranceInterest.toLowerCase().includes(q) ||
        (l.internalNotes && l.internalNotes.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (status && typeof status === 'string' && status !== 'ALL') {
      leads = leads.filter(l => l.leadStatus === status);
    }

    // Deal filter
    if (deal && typeof deal === 'string' && deal !== 'ALL') {
      leads = leads.filter(l => l.dealStatus === deal);
    }

    // Sorting
    leads.sort((a, b) => {
      if (sortBy === 'nextFollowUpDate') {
        const dateA = a.nextFollowUpDate ? new Date(a.nextFollowUpDate).getTime() : 0;
        const dateB = b.nextFollowUpDate ? new Date(b.nextFollowUpDate).getTime() : 0;
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      // default: createdAt
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const totalCount = leads.length;
    const paginated = leads.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      leads: paginated,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum)
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch customer leads.' });
  }
});

/**
 * Protected: Reconnect & Cold Lead Reminder System
 * Returns categorised items:
 * - Today's follow-ups
 * - Overdue follow-ups
 * - Upcoming follow-ups
 * - Cold leads needing attention (based on configurable days threshold)
 */
leadRouter.get('/reconnect-reminders', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const content = db.getContent();
    const thresholdDays = content.advisor.coldLeadDaysThreshold || 14;
    const leads = db.getLeads();

    const todayStr = new Date().toISOString().slice(0, 10);
    const now = new Date();

    const todayFollowUps: CustomerLead[] = [];
    const overdueFollowUps: CustomerLead[] = [];
    const upcomingFollowUps: CustomerLead[] = [];
    const coldLeads: CustomerLead[] = [];

    leads.forEach(lead => {
      // Check follow up date
      if (lead.nextFollowUpDate && lead.leadStatus !== 'Deal Won' && lead.leadStatus !== 'Deal Lost') {
        if (lead.nextFollowUpDate === todayStr) {
          todayFollowUps.push(lead);
        } else if (lead.nextFollowUpDate < todayStr) {
          overdueFollowUps.push(lead);
        } else {
          upcomingFollowUps.push(lead);
        }
      }

      // Check cold lead threshold:
      // either explicitly marked Cold Lead, or no contact for thresholdDays
      if (lead.leadStatus === 'Cold Lead') {
        if (!coldLeads.some(c => c.id === lead.id)) {
          coldLeads.push(lead);
        }
      } else if (lead.leadStatus !== 'Deal Won' && lead.leadStatus !== 'Deal Lost' && lead.leadStatus !== 'Not Interested') {
        const referenceDate = lead.lastContactDate ? new Date(lead.lastContactDate) : new Date(lead.createdAt);
        const diffDays = Math.floor((now.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= thresholdDays && !coldLeads.some(c => c.id === lead.id)) {
          coldLeads.push(lead);
        }
      }
    });

    res.json({
      thresholdDays,
      todayCount: todayFollowUps.length,
      overdueCount: overdueFollowUps.length,
      coldCount: coldLeads.length,
      todayFollowUps,
      overdueFollowUps,
      upcomingFollowUps,
      coldLeads
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to compute customer reminders.' });
  }
});

/**
 * Protected: Get Single Lead Details & Activity History
 */
leadRouter.get('/:id', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const lead = db.getLeadById(req.params.id);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found.' });
      return;
    }
    const activities = db.getActivities(lead.id);
    res.json({ lead, activities });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching lead details.' });
  }
});

/**
 * Protected: Update Lead Info, Status, Notes, Follow-up
 */
leadRouter.put('/:id', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const currentLead = db.getLeadById(id);
    if (!currentLead) {
      res.status(404).json({ error: 'Lead not found.' });
      return;
    }

    const updates = req.body;
    const previousStatus = currentLead.leadStatus;
    const previousDealStatus = currentLead.dealStatus;

    const updated = db.updateLead(id, updates);

    // Track status change activity
    if (updates.leadStatus && updates.leadStatus !== previousStatus) {
      db.addActivity({
        leadId: id,
        leadName: currentLead.name,
        type: 'STATUS_CHANGE',
        description: `Lead status changed from '${previousStatus}' to '${updates.leadStatus}'.`,
        performedBy: req.user?.name || 'Admin'
      });
    }

    if (updates.dealStatus && updates.dealStatus !== previousDealStatus) {
      db.addActivity({
        leadId: id,
        leadName: currentLead.name,
        type: 'DEAL_UPDATE',
        description: `Deal status updated to '${updates.dealStatus}'.`,
        performedBy: req.user?.name || 'Admin'
      });
    }

    db.logAudit({
      adminId: req.user!.id,
      adminEmail: req.user!.email,
      action: 'LEAD_UPDATED',
      targetResource: 'CustomerLead',
      targetId: id,
      details: `Updated details for customer ${currentLead.name}`
    });

    res.json({ success: true, lead: updated });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update customer record.' });
  }
});

/**
 * Protected: Record Lead Activity (Call, WhatsApp, Note, Meeting)
 */
leadRouter.post('/:id/activity', requireAuth, (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const lead = db.getLeadById(id);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found.' });
      return;
    }

    const { type, description, updateLastContactDate, nextFollowUpDate } = req.body;

    if (!type || !description) {
      res.status(400).json({ error: 'Activity type and description are required.' });
      return;
    }

    const activity = db.addActivity({
      leadId: id,
      leadName: lead.name,
      type,
      description,
      performedBy: req.user?.name || 'Sarla Hooda'
    });

    const leadUpdates: Partial<CustomerLead> = {};
    if (updateLastContactDate) {
      leadUpdates.lastContactDate = new Date().toISOString().slice(0, 10);
      // If was a new or cold lead, transition to Contacted
      if (lead.leadStatus === 'New Lead' || lead.leadStatus === 'Cold Lead') {
        leadUpdates.leadStatus = 'Contacted';
      }
    }
    if (nextFollowUpDate) {
      leadUpdates.nextFollowUpDate = nextFollowUpDate;
    }

    if (Object.keys(leadUpdates).length > 0) {
      db.updateLead(id, leadUpdates);
    }

    res.status(201).json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log customer interaction.' });
  }
});

/**
 * Protected: Delete Lead (Retention & GDPR/Privacy Compliance)
 */
leadRouter.delete('/:id', requireAuth, requireRole(['Super Admin']), (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const lead = db.getLeadById(id);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found.' });
      return;
    }

    const deleted = db.deleteLead(id);
    if (deleted) {
      db.logAudit({
        adminId: req.user!.id,
        adminEmail: req.user!.email,
        action: 'LEAD_DELETED',
        targetResource: 'CustomerLead',
        targetId: id,
        details: `Deleted customer record ${lead.name} (${lead.phone}) in compliance with retention policy.`
      });
      res.json({ success: true, message: 'Customer record deleted permanently.' });
    } else {
      res.status(500).json({ error: 'Could not delete lead.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting lead.' });
  }
});
