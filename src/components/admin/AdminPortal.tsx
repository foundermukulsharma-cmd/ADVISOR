/**
 * Secure Admin Portal Root Component
 * Houses the CRM, Follow-up engine, Message Assistant, Content Editor, and Audit Logs.
 */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Clock,
  MessageSquare,
  Globe,
  BarChart3,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Plus,
  RefreshCw,
  Bell
} from 'lucide-react';
import { CustomerLead, WebsiteContent, MessageTemplate, Language, UserRole } from '../../types';
import { getTranslation } from '../../lib/translations';
import { AdminLogin } from './AdminLogin';
import { CrmDashboard } from './CrmDashboard';
import { LeadsTable } from './LeadsTable';
import { ReconnectSystem } from './ReconnectSystem';
import { MessageAssistant } from './MessageAssistant';
import { ContentManager } from './ContentManager';
import { AnalyticsView } from './AnalyticsView';
import { AuditLogView } from './AuditLogView';
import { LeadDetailModal } from './LeadDetailModal';
import { AddLeadModal } from './AddLeadModal';
import { exportLeadsToCsv } from '../../lib/csvExport';
import { api, clearToken } from '../../services/api';

interface AdminPortalProps {
  onBackToSite: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  content: WebsiteContent;
  onContentUpdated: (newContent: WebsiteContent) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToSite,
  language,
  onLanguageChange,
  content,
  onContentUpdated
}) => {
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string; role: UserRole } | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'reconnect' | 'templates' | 'content' | 'analytics' | 'audit'>('dashboard');

  const [leads, setLeads] = useState<CustomerLead[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Check auth session
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await api.getMe();
        if (res.user) {
          setCurrentUser(res.user);
        }
      } catch (err) {
        // Not authenticated
        setCurrentUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    verifyAuth();
  }, []);

  const loadAllData = async () => {
    if (!currentUser) return;
    try {
      setIsLoadingData(true);
      const [leadsRes, tmplRes] = await Promise.all([
        api.getLeads({ limit: 500 }),
        api.getTemplates()
      ]);
      setLeads(leadsRes.leads || []);
      setTemplates(tmplRes || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadAllData();
    }
  }, [currentUser]);

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
  };

  const handleExportAll = () => {
    const res = exportLeadsToCsv(leads, 'Sarla_Hooda_All_Customers');
    if (res.success) {
      alert(`Exported ${res.count} records securely to ${res.filename}. Formula injection protected.`);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0A1726] flex items-center justify-center text-white text-sm">
        Verifying Security Session...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <AdminLogin
        onLoginSuccess={user => setCurrentUser(user)}
        onBackToSite={onBackToSite}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#10243A] flex flex-col font-sans">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-[#10243A] text-white border-b border-[#C5A46D]/30 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Identity */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C5A46D]/20 text-[#DFCA9B] border border-[#C5A46D]/40 flex items-center justify-center font-bold text-sm">
                SH
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-sm text-white">Sarla Hooda CRM</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C5A46D]/20 text-[#DFCA9B]">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* Quick Actions & Switchers */}
            <div className="flex items-center gap-3">
              <button
                onClick={loadAllData}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
                title="Refresh CRM Data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={onBackToSite}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold rounded-lg border border-white/10 transition-colors"
              >
                <span>Live Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold rounded-lg border border-rose-500/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{getTranslation(language, 'logout')}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Tab Strip */}
        <div className="border-t border-white/10 bg-[#0A1726]/60 overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'border-[#C5A46D] text-[#DFCA9B]'
                  : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{getTranslation(language, 'crmDashboard')}</span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'leads'
                  ? 'border-[#C5A46D] text-[#DFCA9B]'
                  : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{getTranslation(language, 'crmLeads')} ({leads.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reconnect')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'reconnect'
                  ? 'border-[#C5A46D] text-[#DFCA9B]'
                  : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Reconnect & Cold Leads</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'templates'
                  ? 'border-[#C5A46D] text-[#DFCA9B]'
                  : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>{getTranslation(language, 'crmTemplates')}</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'content'
                  ? 'border-[#C5A46D] text-[#DFCA9B]'
                  : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>{getTranslation(language, 'crmContent')}</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'analytics'
                  ? 'border-[#C5A46D] text-[#DFCA9B]'
                  : 'border-transparent text-slate-300 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{getTranslation(language, 'crmAnalytics')}</span>
            </button>

            {currentUser.role === 'Super Admin' && (
              <button
                onClick={() => setActiveTab('audit')}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'audit'
                    ? 'border-[#C5A46D] text-[#DFCA9B]'
                    : 'border-transparent text-slate-300 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{getTranslation(language, 'crmAudit')}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'dashboard' && (
          <CrmDashboard
            leads={leads}
            onOpenLead={id => setSelectedLeadId(id)}
            onNavigateTab={tab => setActiveTab(tab as any)}
            onAddNewLead={() => setIsAddLeadOpen(true)}
            onExportCsv={handleExportAll}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsTable
            leads={leads}
            onOpenLead={id => setSelectedLeadId(id)}
            onRefreshData={loadAllData}
            onAddNewLead={() => setIsAddLeadOpen(true)}
          />
        )}

        {activeTab === 'reconnect' && (
          <ReconnectSystem
            onOpenLead={id => setSelectedLeadId(id)}
            onRefreshData={loadAllData}
          />
        )}

        {activeTab === 'templates' && (
          <MessageAssistant
            templates={templates}
            onActivityLogged={loadAllData}
          />
        )}

        {activeTab === 'content' && (
          <ContentManager
            content={content}
            onContentUpdated={onContentUpdated}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView />
        )}

        {activeTab === 'audit' && (
          <AuditLogView />
        )}
      </main>

      {/* Modals */}
      {selectedLeadId && (
        <LeadDetailModal
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onLeadUpdated={loadAllData}
          templates={templates}
        />
      )}

      {isAddLeadOpen && (
        <AddLeadModal
          isOpen={isAddLeadOpen}
          onClose={() => setIsAddLeadOpen(false)}
          onLeadAdded={loadAllData}
        />
      )}

    </div>
  );
};
