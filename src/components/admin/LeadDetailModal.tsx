/**
 * Comprehensive Lead Detail & Customer Profile Modal
 * Shows details, past notes, last interaction, next follow-up, and activity history.
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Save,
  Trash2,
  History,
  Send,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { CustomerLead, LeadStatus, DealStatus, LeadActivity, MessageTemplate } from '../../types';
import { MessageAssistant } from './MessageAssistant';
import { api } from '../../services/api';

interface LeadDetailModalProps {
  leadId: string;
  onClose: () => void;
  onLeadUpdated: () => void;
  templates: MessageTemplate[];
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  leadId,
  onClose,
  onLeadUpdated,
  templates
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'messaging' | 'history'>('profile');
  const [lead, setLead] = useState<CustomerLead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable fields
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('New Lead');
  const [dealStatus, setDealStatus] = useState<DealStatus>('Open');
  const [internalNotes, setInternalNotes] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  const fetchLeadData = async () => {
    try {
      setIsLoading(true);
      const data = await api.getLead(leadId);
      setLead(data.lead);
      setActivities(data.activities || []);
      setLeadStatus(data.lead.leadStatus);
      setDealStatus(data.lead.dealStatus);
      setInternalNotes(data.lead.internalNotes || '');
      setNextFollowUpDate(data.lead.nextFollowUpDate || '');
      setPriority(data.lead.followUpPriority || 'Medium');
    } catch (err) {
      console.error('Failed to load lead:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, [leadId]);

  const handleSaveChanges = async () => {
    if (!lead) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await api.updateLead(lead.id, {
        leadStatus,
        dealStatus,
        internalNotes,
        nextFollowUpDate: nextFollowUpDate || undefined,
        followUpPriority: priority
      });

      // If a new quick note was typed, add as an activity
      if (newNote.trim()) {
        await api.logLeadActivity(lead.id, {
          type: 'NOTE',
          description: newNote.trim()
        });
        setNewNote('');
      }

      setSaveSuccess(true);
      await fetchLeadData();
      onLeadUpdated();
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      alert('Failed to save customer updates.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteLead = async () => {
    if (!lead) return;
    if (confirm(`Are you sure you want to permanently delete the customer record for ${lead.name} (${lead.phone})?`)) {
      try {
        await api.deleteLead(lead.id);
        onLeadUpdated();
        onClose();
      } catch (err) {
        alert('Could not delete lead. Only Super Admins are permitted.');
      }
    }
  };

  if (!lead && isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-2xl text-slate-700">Loading Customer Profile...</div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#10243A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#C5A46D]/20 text-[#DFCA9B] border border-[#C5A46D]/40 flex items-center justify-center font-bold text-lg">
              {lead.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold leading-tight">{lead.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  lead.dealStatus === 'Won' ? 'bg-emerald-500/20 text-emerald-300' :
                  lead.dealStatus === 'Lost' ? 'bg-rose-500/20 text-rose-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}>
                  Deal {lead.dealStatus}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {lead.villageCity} • {lead.insuranceInterest} • Enquired on {new Date(lead.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#10243A] text-[#10243A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Customer Overview & Notes
          </button>
          <button
            onClick={() => setActiveTab('messaging')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'messaging'
                ? 'border-[#10243A] text-[#10243A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Message Assistant</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-[#10243A] text-[#10243A]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Activity Log ({activities.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Top Contact Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Mobile Phone</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-sm text-[#10243A] font-mono">{lead.phone}</span>
                    <a
                      href={`tel:${lead.phone}`}
                      className="p-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="Call directly"
                    >
                      <Phone className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Village / City</span>
                  <p className="font-semibold text-sm text-slate-800 mt-0.5">
                    {lead.villageCity}
                    {lead.locationSharedVoluntarily && (
                      <span className="ml-1 text-[10px] text-emerald-600 font-normal">(GPS verified)</span>
                    )}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Language & Method</span>
                  <p className="font-semibold text-sm text-slate-800 mt-0.5">
                    {lead.preferredLanguage === 'hi' ? 'हिन्दी' : 'English'} • {lead.preferredContactMethod}
                  </p>
                </div>
              </div>

              {/* Quiz Summary Box if exists */}
              {lead.quizSummary && (
                <div className="p-4 bg-[#C5A46D]/15 border border-[#C5A46D]/40 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#9F7E47] mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Insurance Direction Quiz Assessment:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {lead.quizSummary}
                  </p>
                  {lead.quizAnswers && (
                    <div className="mt-2 pt-2 border-t border-[#C5A46D]/20 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600">
                      <div><span className="font-medium text-slate-500">Budget:</span> {lead.quizAnswers.approxBudget || 'N/A'}</div>
                      <div><span className="font-medium text-slate-500">Term:</span> {lead.quizAnswers.planningTerm || 'N/A'}</div>
                      <div><span className="font-medium text-slate-500">For:</span> {lead.quizAnswers.intendedFor || 'N/A'}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Status and Follow-up Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Lead Status
                  </label>
                  <select
                    value={leadStatus}
                    onChange={e => setLeadStatus(e.target.value as LeadStatus)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
                  >
                    <option value="New Lead">New Lead</option>
                    <option value="Cold Lead">Cold Lead</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Interested">Interested</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Consultation Scheduled">Consultation Scheduled</option>
                    <option value="Deal Won">Deal Won</option>
                    <option value="Deal Lost">Deal Lost</option>
                    <option value="Not Interested">Not Interested</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Deal Status
                  </label>
                  <select
                    value={dealStatus}
                    onChange={e => setDealStatus(e.target.value as DealStatus)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
                  >
                    <option value="Open">Open</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={e => setNextFollowUpDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#C5A46D]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Internal Notes & Quick Update */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Internal Advisor Notes
                </label>
                <textarea
                  rows={4}
                  value={internalNotes}
                  onChange={e => setInternalNotes(e.target.value)}
                  placeholder="Record policy requirements, client family situation, discussions, or preferred plans..."
                  className="w-full p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C5A46D] text-sm text-slate-800 bg-slate-50/50"
                />
              </div>

              {/* Add New Interaction Note */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Add Quick Interaction Note
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="e.g. Spoke on phone, client requested Jeevan Labh brochure..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#C5A46D]"
                  />
                </div>
              </div>

            </div>
          )}

          {activeTab === 'messaging' && (
            <MessageAssistant
              lead={lead}
              templates={templates}
              onActivityLogged={fetchLeadData}
            />
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Customer Interaction Timeline
              </h4>

              {activities.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No interactions recorded yet.
                </p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {activities.map(act => (
                    <div key={act.id} className="py-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        {act.type === 'WHATSAPP' ? <MessageCircle className="w-4 h-4 text-emerald-600" /> :
                         act.type === 'CALL' ? <Phone className="w-4 h-4 text-blue-600" /> :
                         act.type === 'STATUS_CHANGE' ? <FileText className="w-4 h-4 text-amber-600" /> :
                         <Clock className="w-4 h-4 text-slate-500" />}
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-bold text-slate-800">{act.type.replace('_', ' ')}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(act.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-600">{act.description}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">By {act.performedBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={handleDeleteLead}
            className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:text-rose-700 text-xs font-semibold hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Record</span>
          </button>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved Permanently!</span>
              </span>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer"
            >
              Close
            </button>

            {activeTab === 'profile' && (
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#10243A] hover:bg-[#1A3755] text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
