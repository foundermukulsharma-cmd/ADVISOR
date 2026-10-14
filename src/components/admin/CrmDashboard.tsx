/**
 * CRM Executive Dashboard Overview
 * KPI cards, cold-lead alerts, and quick actions.
 */

import React from 'react';
import {
  Users,
  UserPlus,
  Flame,
  Clock,
  AlertTriangle,
  Award,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import { CustomerLead, AnalyticsSummary } from '../../types';

interface CrmDashboardProps {
  leads: CustomerLead[];
  onOpenLead: (leadId: string) => void;
  onNavigateTab: (tab: string) => void;
  onAddNewLead: () => void;
  onExportCsv: () => void;
}

export const CrmDashboard: React.FC<CrmDashboardProps> = ({
  leads,
  onOpenLead,
  onNavigateTab,
  onAddNewLead,
  onExportCsv
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.leadStatus === 'New Lead').length;
  const coldLeads = leads.filter(l => l.leadStatus === 'Cold Lead').length;
  
  const todayFollowUps = leads.filter(
    l => l.nextFollowUpDate === todayStr && l.dealStatus === 'Open'
  );

  const overdueFollowUps = leads.filter(
    l => l.nextFollowUpDate && l.nextFollowUpDate < todayStr && l.dealStatus === 'Open'
  );

  const dealsWon = leads.filter(l => l.leadStatus === 'Deal Won' || l.dealStatus === 'Won').length;
  const dealsLost = leads.filter(l => l.leadStatus === 'Deal Lost' || l.dealStatus === 'Lost').length;
  const closedDeals = dealsWon + dealsLost;
  const winRate = closedDeals > 0 ? Math.round((dealsWon / closedDeals) * 100) : 0;

  // High priority urgent lead for the prominent reminder banner
  const priorityLead = overdueFollowUps[0] || todayFollowUps[0] || leads.find(l => l.leadStatus === 'Cold Lead');

  return (
    <div className="space-y-6">
      
      {/* Prominent "Reconnect with Customers" Reminder Banner */}
      {priorityLead && (
        <div
          onClick={() => onOpenLead(priorityLead.id)}
          className="bg-gradient-to-r from-amber-900/90 via-[#10243A] to-[#1A3755] text-white p-5 sm:p-6 rounded-3xl border border-amber-400/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:border-amber-400 transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/30 mb-1">
                <span>Attention Needed</span>
                <span>•</span>
                <span>Click to View Customer Profile</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                “You last contacted {priorityLead.name} on {new Date(priorityLead.lastContactDate || priorityLead.createdAt).toLocaleDateString()}. Would you like to follow up?”
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Requirement: <span className="text-amber-100 font-semibold">{priorityLead.insuranceInterest}</span> • {priorityLead.villageCity} • {priorityLead.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open Customer Record <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      )}

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Leads */}
        <div
          onClick={() => onNavigateTab('leads')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#10243A] shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Customers
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#10243A] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#10243A]">{totalLeads}</div>
          <p className="text-[11px] text-slate-400 mt-1">Active CRM records</p>
        </div>

        {/* New Leads */}
        <div
          onClick={() => onNavigateTab('leads')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-500 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              New Enquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{newLeads}</div>
          <p className="text-[11px] text-slate-400 mt-1">Pending first contact</p>
        </div>

        {/* Today's Follow-ups */}
        <div
          onClick={() => onNavigateTab('reconnect')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-500 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Due Today
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-blue-700">{todayFollowUps.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Scheduled for today</p>
        </div>

        {/* Overdue Follow-ups */}
        <div
          onClick={() => onNavigateTab('reconnect')}
          className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-rose-500 shadow-sm transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Overdue
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-600">{overdueFollowUps.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Require immediate call</p>
        </div>

      </div>

      {/* Secondary Metrics & Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Cold Leads */}
        <div
          onClick={() => onNavigateTab('reconnect')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Cold Leads Needing Warm-up</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {coldLeads}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Customers with no recent interaction for over 14 days. Re-engage with the Message Assistant.
          </p>
        </div>

        {/* Deals Won */}
        <div
          onClick={() => onNavigateTab('leads')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-400 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Policies Issued (Deals Won)</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {dealsWon}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Successfully concluded policies. Keep in touch with anniversary and renewal greetings.
          </p>
        </div>

        {/* Win Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Lead Conversion Rate</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#C5A46D]/20 text-[#9F7E47]">
              {winRate}% Win Rate
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {dealsWon} won vs {dealsLost} lost out of {closedDeals} resolved cases.
          </p>
        </div>

      </div>

      {/* Quick Action Shortcuts */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={onAddNewLead}
          className="flex items-center gap-2 px-5 py-3 bg-[#10243A] hover:bg-[#1A3755] text-white rounded-xl text-xs sm:text-sm font-bold shadow transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-[#DFCA9B]" />
          <span>Add New Customer Lead</span>
        </button>

        <button
          onClick={() => onNavigateTab('reconnect')}
          className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-600 text-[#10243A] rounded-xl text-xs sm:text-sm font-bold shadow transition-colors cursor-pointer"
        >
          <Clock className="w-4 h-4" />
          <span>Open Follow-Up Manager</span>
        </button>

        <button
          onClick={onExportCsv}
          className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
        >
          <span>Export All Leads to CSV</span>
        </button>
      </div>

    </div>
  );
};
