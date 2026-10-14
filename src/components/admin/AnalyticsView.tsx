/**
 * Real Website and Enquiry Analytics Dashboard
 * Tracks actual user actions: vcf downloads, call clicks, whatsapp clicks, quiz starts, and form submissions.
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Phone,
  MessageCircle,
  Compass,
  FileCheck2,
  TrendingUp,
  RefreshCw,
  Activity,
  Calendar
} from 'lucide-react';
import { AnalyticsSummary } from '../../types';
import { api } from '../../services/api';

export const AnalyticsView: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await api.getAnalyticsSummary();
      setSummary(res);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading && !summary) {
    return <div className="p-8 text-center text-slate-500">Loading verified analytics...</div>;
  }

  if (!summary) return null;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200">
        <div>
          <h3 className="text-xl font-bold text-[#10243A]">Real-Time Traffic & Engagement</h3>
          <p className="text-xs text-slate-500">
            Real tracked events logged by user interactions on the public site and advisor portal.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        
        {/* Page Views */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Page Views</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-[#10243A]">
            {summary.totalPageViews}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Unique session hits</p>
        </div>

        {/* Contact Downloads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">vCard Downloads</span>
            <Download className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <div className="text-2xl font-extrabold text-[#9F7E47]">
            {summary.totalVcfDownloads}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Direct .vcf file saves</p>
        </div>

        {/* Call Clicks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Call Clicks</span>
            <Phone className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-700">
            {summary.totalCallClicks}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Direct phone calls</p>
        </div>

        {/* WhatsApp Clicks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">WhatsApp Clicks</span>
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {summary.totalWhatsAppClicks}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Direct chat launches</p>
        </div>

        {/* Quiz Starts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Quiz Starts</span>
            <Compass className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700">
            {summary.totalQuizStarts}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Step 1 interacted</p>
        </div>

        {/* Quiz Completions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Quiz Completions</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {summary.totalQuizCompletions}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Full 7 questions completed</p>
        </div>

        {/* Form Submissions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Enquiry Forms</span>
            <FileCheck2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700">
            {summary.totalFormSubmissions}
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Qualified leads saved</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">Win Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            {summary.conversionRate}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{summary.leadsWon} deals won</p>
        </div>

      </div>

      {/* Recent Raw Event Feed */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h4 className="text-sm font-bold text-[#10243A] uppercase tracking-wider mb-4">
          Recent Real Event Activity
        </h4>

        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {summary.recentEvents.map(evt => (
            <div key={evt.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800">
                  {evt.eventType.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-400">
                  via {evt.source || 'web'} ({evt.language || 'en'})
                </span>
              </div>
              <span className="text-slate-400 text-[11px] font-mono">
                {new Date(evt.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
