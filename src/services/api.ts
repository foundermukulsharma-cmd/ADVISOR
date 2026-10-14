/**
 * Frontend Typed API Client for Communicating with Backend
 */

import {
  CustomerLead,
  WebsiteContent,
  MessageTemplate,
  AnalyticsSummary,
  AuditLogEntry,
  UserRole
} from '../types';

const TOKEN_KEY = 'sarla_hooda_admin_token';

function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    // ignore
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    // ignore
  }
}

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers
  });

  if (!res.ok) {
    let errorMsg = `Server error ${res.status}`;
    try {
      const errData = await res.json();
      if (errData && errData.error) {
        errorMsg = errData.error;
      }
    } catch (e) {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Public
  async getContent(): Promise<WebsiteContent> {
    return fetchJson<WebsiteContent>('/api/content');
  },

  async submitLead(data: any): Promise<{ success: boolean; message: string; leadId: string }> {
    return fetchJson('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async trackEvent(eventType: string, metadata?: Record<string, any>, source?: string, language?: string): Promise<void> {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType, metadata, source, language })
      });
    } catch (e) {
      // Fail silently for analytics tracking
    }
  },

  // Auth
  async login(email: string, password: string): Promise<{ success: boolean; token: string; user: { id: string; email: string; name: string; role: UserRole } }> {
    const res = await fetchJson<{ success: boolean; token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.token) {
      setToken(res.token);
    }
    return res;
  },

  async getMe(): Promise<{ user: { id: string; email: string; name: string; role: UserRole } }> {
    return fetchJson('/api/auth/me');
  },

  async logout(): Promise<void> {
    try {
      await fetchJson('/api/auth/logout', { method: 'POST' });
    } finally {
      clearToken();
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return fetchJson('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  // Leads & CRM
  async getLeads(params?: {
    search?: string;
    status?: string;
    deal?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }): Promise<{ leads: CustomerLead[]; totalCount: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params) {
      if (params.search) query.set('search', params.search);
      if (params.status) query.set('status', params.status);
      if (params.deal) query.set('deal', params.deal);
      if (params.sortBy) query.set('sortBy', params.sortBy);
      if (params.sortOrder) query.set('sortOrder', params.sortOrder);
      if (params.page) query.set('page', String(params.page));
      if (params.limit) query.set('limit', String(params.limit));
    }
    const url = `/api/leads?${query.toString()}`;
    return fetchJson(url);
  },

  async getLead(id: string): Promise<{ lead: CustomerLead; activities: any[] }> {
    return fetchJson(`/api/leads/${id}`);
  },

  async updateLead(id: string, updates: Partial<CustomerLead>): Promise<{ success: boolean; lead: CustomerLead }> {
    return fetchJson(`/api/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteLead(id: string): Promise<{ success: boolean; message: string }> {
    return fetchJson(`/api/leads/${id}`, {
      method: 'DELETE'
    });
  },

  async logLeadActivity(id: string, activityData: {
    type: string;
    description: string;
    updateLastContactDate?: boolean;
    nextFollowUpDate?: string;
  }): Promise<any> {
    return fetchJson(`/api/leads/${id}/activity`, {
      method: 'POST',
      body: JSON.stringify(activityData)
    });
  },

  // Cold Lead & Reconnect
  async getReconnectReminders(): Promise<{
    thresholdDays: number;
    todayCount: number;
    overdueCount: number;
    coldCount: number;
    todayFollowUps: CustomerLead[];
    overdueFollowUps: CustomerLead[];
    upcomingFollowUps: CustomerLead[];
    coldLeads: CustomerLead[];
  }> {
    return fetchJson('/api/leads/reconnect-reminders');
  },

  // Website Content Management
  async updateContent(updates: Partial<WebsiteContent>): Promise<{ success: boolean; content: WebsiteContent }> {
    return fetchJson('/api/content', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  // Message Assistant Templates
  async getTemplates(): Promise<MessageTemplate[]> {
    return fetchJson<MessageTemplate[]>('/api/templates');
  },

  async updateTemplate(id: string, data: Partial<MessageTemplate>): Promise<MessageTemplate> {
    return fetchJson<MessageTemplate>(`/api/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async createTemplate(data: Omit<MessageTemplate, 'id'>): Promise<MessageTemplate> {
    return fetchJson<MessageTemplate>('/api/templates', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async deleteTemplate(id: string): Promise<{ success: boolean }> {
    return fetchJson<{ success: boolean }>(`/api/templates/${id}`, {
      method: 'DELETE'
    });
  },

  // Analytics & Audits
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return fetchJson<AnalyticsSummary>('/api/analytics/summary');
  },

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    return fetchJson<AuditLogEntry[]>('/api/audit-logs');
  }
};
