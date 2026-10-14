/**
 * "Reconnect with Customers" - Cold Lead & Follow-Up Reminder System
 * Configurable thresholds, overdue reminders, today's schedule, and direct WhatsApp/Call links.
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Phone,
  MessageCircle,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  ChevronRight,
  Filter,
  Sparkles
} from 'lucide-react';
import { CustomerLead } from '../../types';
import { api } from '../../services/api';

interface ReconnectSystemProps {
  onOpenLead: (leadId: string) => void;
  onRefreshData: () => void;
}

export const ReconnectSystem: React.FC<ReconnectSystemProps> = ({
  onOpenLead,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'overdue' | 'cold' | 'upcoming'>('today');
  const [reminders, setReminders] = useState<{
    thresholdDays: number;
    todayCount: number;
    overdueCount: number;
    coldCount: number;
    todayFollowUps: CustomerLead[];
    overdueFollowUps: CustomerLead[];
    upcomingFollowUps: CustomerLead[];
    coldLeads: CustomerLead[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const loadReminders = async () => {
    try {
      setIsLoading(true);
      const data = await api.getReconnectReminders();
      setReminders(data);
    } catch (err) {
      console.error('Failed to load reminders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleMarkFollowedUp = async (lead: CustomerLead, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.logLeadActivity(lead.id, {
        type: 'FOLLOW_UP_COMPLETED',
        description: `Follow-up completed on ${new Date().toLocaleDateString()}. Status moved to Contacted.`,
        updateLastContactDate: true
      });
      await loadReminders();
      onRefreshData();
    } catch (err) {
      alert('Error recording follow-up.');
    }
  };

  const handleReschedule = async (lead: CustomerLead, e: React.MouseEvent) => {
    e.stopPropagation();
    const newDate = prompt('Enter new follow-up date (YYYY-MM-DD):', new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10));
    if (newDate) {
      try {
        await api.updateLead(lead.id, { nextFollowUpDate: newDate });
        await loadReminders();
        onRefreshData();
      } catch (err) {
        alert('Failed to reschedule.');
      }
    }
  };

  const renderLeadCard = (lead: CustomerLead, category: 'today' | 'overdue' | 'cold' | 'upcoming') => {
    const lastDate = lead.lastContactDate
      ? new Date(lead.lastContactDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      : new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    const diffDays = Math.floor(
      (Date.now() - new Date(lead.lastContactDate || lead.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <div
        key={lead.id}
        onClick={() => onOpenLead(lead.id)}
        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#C5A46D] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
      >
        <div>
          {/* Card Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h4 className="font-bold text-sm text-[#10243A] leading-tight">
                {lead.name}
              </h4>
              <p className="text-xs text-slate-500 font-mono">
                {lead.phone} • {lead.villageCity}
              </p>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              category === 'overdue' ? 'bg-rose-100 text-rose-700' :
              category === 'today' ? 'bg-amber-100 text-amber-800' :
              category === 'cold' ? 'bg-blue-100 text-blue-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {lead.leadStatus}
            </span>
          </div>

          {/* Primary Reminder Narrative as specified in prompt */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 mb-3 space-y-1">
            <p className="font-semibold text-[#10243A]">
              “You last contacted this customer on {lastDate}. Would you like to follow up?”
            </p>
            <p className="text-[11px] text-slate-500">
              Interest: <span className="font-medium text-slate-800">{lead.insuranceInterest}</span> • {diffDays} days elapsed
            </p>
          </div>

          {/* Internal Notes Snippet */}
          {lead.internalNotes && (
            <p className="text-xs text-slate-500 italic mb-4 line-clamp-2">
              Note: "{lead.internalNotes}"
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${lead.phone}`}
              onClick={e => e.stopPropagation()}
              className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1"
              title="Call Customer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call</span>
            </a>

            <a
              href={`https://wa.me/${lead.phone.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1"
              title="WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={e => handleReschedule(lead, e)}
              className="px-2.5 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg text-xs font-medium cursor-pointer"
            >
              Reschedule
            </button>
            <button
              onClick={e => handleMarkFollowedUp(lead, e)}
              className="px-3 py-1.5 bg-[#10243A] hover:bg-[#1A3755] text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Mark Done
            </button>
          </div>
        </div>
      </div>
    );
  };

  const currentList =
    activeTab === 'today' ? (reminders?.todayFollowUps || []) :
    activeTab === 'overdue' ? (reminders?.overdueFollowUps || []) :
    activeTab === 'cold' ? (reminders?.coldLeads || []) :
    (reminders?.upcomingFollowUps || []);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#10243A] to-[#1A3755] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#C5A46D]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A46D]/20 text-[#DFCA9B] border border-[#C5A46D]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Customer Retention Engine</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
            Reconnect with Customers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Intelligent cold-lead alerts and timely follow-up reminders based on your {reminders?.thresholdDays || 14}-day contact threshold.
          </p>
        </div>

        <button
          onClick={loadReminders}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Reminders</span>
        </button>
      </div>

      {/* Categorized Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'today'
              ? 'bg-[#10243A] text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Today's Follow-ups</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-200">
            {reminders?.todayCount || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overdue'
              ? 'bg-rose-900 text-white shadow'
              : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Overdue Follow-ups</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-200 text-rose-800">
            {reminders?.overdueCount || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cold')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'cold'
              ? 'bg-blue-900 text-white shadow'
              : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
          }`}
        >
          <span>Cold Leads Needing Attention</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800">
            {reminders?.coldCount || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-slate-800 text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Upcoming Schedule</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700">
            {reminders?.upcomingFollowUps?.length || 0}
          </span>
        </button>
      </div>

      {/* Grid of Reminder Cards */}
      {currentList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h4 className="font-bold text-base text-[#10243A] mb-1">
            All clear in this category!
          </h4>
          <p className="text-xs text-slate-500">
            No customers require follow-up under the selected filter right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentList.map(lead => renderLeadCard(lead, activeTab))}
        </div>
      )}

    </div>
  );
};
