/**
 * Sarla Hooda LIC Insurance Platform - TypeScript Type Definitions
 */

export type Language = 'en' | 'hi';

export type LeadStatus =
  | 'New Lead'
  | 'Cold Lead'
  | 'Contacted'
  | 'Interested'
  | 'Follow-up Required'
  | 'Consultation Scheduled'
  | 'Deal Won'
  | 'Deal Lost'
  | 'Not Interested';

export type DealStatus = 'Open' | 'Won' | 'Lost';

export type ContactMethod = 'WhatsApp' | 'Phone Call' | 'Either';

export interface QuizAnswers {
  primaryRequirement?: string;
  approxBudget?: string;
  paymentFrequency?: string;
  planningTerm?: string;
  intendedFor?: string;
  priorityGoal?: string;
  callbackPreference?: string;
  ageGroup?: string;
  notes?: string;
}

export interface CustomerLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  villageCity: string;
  address?: string;
  preferredLanguage: Language;
  insuranceInterest: string;
  budgetRange?: string;
  paymentFrequency?: string;
  planningTerm?: string;
  intendedFor?: string;
  priorityGoal?: string;
  quizSummary?: string;
  quizAnswers?: QuizAnswers;
  leadStatus: LeadStatus;
  dealStatus: DealStatus;
  source: string;
  preferredContactMethod: ContactMethod;
  consentStatus: boolean;
  consentTimestamp: string;
  locationSharedVoluntarily: boolean;
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  internalNotes: string;
  followUpPriority?: 'High' | 'Medium' | 'Low';
}

export type ActivityType =
  | 'CALL'
  | 'WHATSAPP'
  | 'NOTE'
  | 'STATUS_CHANGE'
  | 'DEAL_UPDATE'
  | 'FOLLOW_UP_SCHEDULED'
  | 'FOLLOW_UP_COMPLETED'
  | 'EMAIL'
  | 'MEETING';

export interface LeadActivity {
  id: string;
  leadId: string;
  leadName?: string;
  type: ActivityType;
  description: string;
  performedBy: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface MessageTemplate {
  id: string;
  category: 'DEAL_WON' | 'DEAL_LOST' | 'COLD_LEAD' | 'FOLLOW_UP' | 'GREETING' | 'RENEWAL';
  titleEn: string;
  titleHi: string;
  contentEn: string;
  contentHi: string;
  isDefault?: boolean;
}

export interface InsuranceServiceItem {
  id: string;
  titleEn: string;
  titleHi: string;
  taglineEn: string;
  taglineHi: string;
  descEn: string;
  descHi: string;
  licCategories: string[];
  keyHighlightsEn: string[];
  keyHighlightsHi: string[];
  icon: string;
  badge?: string;
}

export interface FAQItem {
  id: string;
  questionEn: string;
  questionHi: string;
  answerEn: string;
  answerHi: string;
  category: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  location: string;
  serviceCategory: string;
  policySince: string;
  commentEn: string;
  commentHi: string;
  consentConfirmed: boolean;
  rating: number;
}

export interface AdvisorSettings {
  name: string;
  profession: string;
  achievement: string;
  clientBase: string;
  phone: string;
  whatsapp: string;
  emailPlaceholder: string;
  officeAddressPlaceholder: string;
  photoUrl: string;
  heroHeadlineEn: string;
  heroHeadlineHi: string;
  heroSubtitleEn: string;
  heroSubtitleHi: string;
  aboutTextEn: string;
  aboutTextHi: string;
  coldLeadDaysThreshold: number;
  publicUrl: string;
}

export interface WebsiteContent {
  advisor: AdvisorSettings;
  services: InsuranceServiceItem[];
  faqs: FAQItem[];
  testimonials: TestimonialItem[];
  disclaimerEn: string;
  disclaimerHi: string;
  privacyNoticeEn: string;
  privacyNoticeHi: string;
}

export type UserRole = 'Super Admin' | 'Lead Manager' | 'Content Admin';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetResource: string;
  targetId?: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface AnalyticsEvent {
  id: string;
  eventType:
    | 'page_view'
    | 'vcf_download'
    | 'call_click'
    | 'whatsapp_click'
    | 'quiz_start'
    | 'quiz_complete'
    | 'form_submit'
    | 'share_click';
  timestamp: string;
  source?: string;
  language?: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  totalVcfDownloads: number;
  totalCallClicks: number;
  totalWhatsAppClicks: number;
  totalQuizStarts: number;
  totalQuizCompletions: number;
  totalFormSubmissions: number;
  totalLeads: number;
  leadsWon: number;
  leadsLost: number;
  conversionRate: number;
  recentEvents: AnalyticsEvent[];
}
