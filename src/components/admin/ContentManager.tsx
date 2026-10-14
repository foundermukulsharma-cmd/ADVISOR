/**
 * Website Content and Advisor Configuration Editor
 * Allows live editing of hero headlines, bio, contact numbers, and thresholds.
 */

import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Phone,
  MessageCircle,
  FileText,
  UserCheck,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { WebsiteContent } from '../../types';
import { api } from '../../services/api';

interface ContentManagerProps {
  content: WebsiteContent;
  onContentUpdated: (newContent: WebsiteContent) => void;
}

export const ContentManager: React.FC<ContentManagerProps> = ({
  content,
  onContentUpdated
}) => {
  const [advisorData, setAdvisorData] = useState({ ...content.advisor });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMsg(null);

    try {
      const res = await api.updateContent({
        ...content,
        advisor: advisorData
      });
      if (res.success && res.content) {
        onContentUpdated(res.content);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update content.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5A46D]/15 text-[#9F7E47] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Portal Settings</span>
          </div>
          <h2 className="text-xl font-bold text-[#10243A]">
            Website Content & Advisor Profile Manager
          </h2>
          <p className="text-xs text-slate-500">
            Updates to headlines, contact numbers, and bios sync across the public website and contact cards.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Changes Published Successfully!</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold my-4">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 pt-6">
        
        {/* Verified Business Details */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Verified Advisor Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Advisor Name</label>
              <input
                type="text"
                required
                value={advisorData.name}
                onChange={e => setAdvisorData({ ...advisorData, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Profession</label>
              <input
                type="text"
                required
                value={advisorData.profession}
                onChange={e => setAdvisorData({ ...advisorData, profession: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Key Achievement</label>
              <input
                type="text"
                required
                value={advisorData.achievement}
                onChange={e => setAdvisorData({ ...advisorData, achievement: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Client Base</label>
              <input
                type="text"
                required
                value={advisorData.clientBase}
                onChange={e => setAdvisorData({ ...advisorData, clientBase: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Call link)</label>
              <input
                type="text"
                required
                value={advisorData.phone}
                onChange={e => setAdvisorData({ ...advisorData, phone: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label>
              <input
                type="text"
                required
                value={advisorData.whatsapp}
                onChange={e => setAdvisorData({ ...advisorData, whatsapp: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>
          </div>
        </div>

        {/* Cold Lead Threshold & Service Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cold Lead Reminder Threshold (Days without contact)
            </label>
            <input
              type="number"
              min="3"
              max="90"
              value={advisorData.coldLeadDaysThreshold || 14}
              onChange={e => setAdvisorData({ ...advisorData, coldLeadDaysThreshold: parseInt(e.target.value, 10) || 14 })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Leads uncontacted for this many days automatically trigger the "Reconnect with Customers" prompt.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Service Area / Office Coverage Placeholder
            </label>
            <input
              type="text"
              value={advisorData.officeAddressPlaceholder}
              onChange={e => setAdvisorData({ ...advisorData, officeAddressPlaceholder: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
            />
          </div>
        </div>

        {/* Hero Headlines Bilingual */}
        <div className="pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Hero Headlines (Bilingual)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">English Headline</label>
              <textarea
                rows={2}
                value={advisorData.heroHeadlineEn}
                onChange={e => setAdvisorData({ ...advisorData, heroHeadlineEn: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hindi Headline (हिंदी)</label>
              <textarea
                rows={2}
                value={advisorData.heroHeadlineHi}
                onChange={e => setAdvisorData({ ...advisorData, heroHeadlineHi: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>
          </div>
        </div>

        {/* Hero Subtitles Bilingual */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">English Subtitle</label>
              <textarea
                rows={3}
                value={advisorData.heroSubtitleEn}
                onChange={e => setAdvisorData({ ...advisorData, heroSubtitleEn: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hindi Subtitle (हिंदी)</label>
              <textarea
                rows={3}
                value={advisorData.heroSubtitleHi}
                onChange={e => setAdvisorData({ ...advisorData, heroSubtitleHi: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-[#10243A] hover:bg-[#1A3755] text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#DFCA9B]" />
            <span>{isSaving ? 'Publishing Changes...' : 'Save & Publish to Live Website'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
