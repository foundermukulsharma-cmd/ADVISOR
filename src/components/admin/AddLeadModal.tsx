/**
 * Add New Customer Lead Modal for Admin CRM
 */

import React, { useState } from 'react';
import { X, UserPlus, Save, Loader2 } from 'lucide-react';
import { CustomerLead, LeadStatus, DealStatus } from '../../types';
import { api } from '../../services/api';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadAdded: () => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onLeadAdded
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    villageCity: '',
    insuranceInterest: 'Term & Pure Life Protection',
    leadStatus: 'New Lead' as LeadStatus,
    dealStatus: 'Open' as DealStatus,
    nextFollowUpDate: new Date().toISOString().slice(0, 10),
    internalNotes: '',
    source: 'Direct Phone / Referral'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg('Please enter customer full name.');
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      setErrorMsg('Please enter customer mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.submitLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        villageCity: formData.villageCity.trim() || 'Rohtak, Haryana',
        insuranceInterest: formData.insuranceInterest,
        leadStatus: formData.leadStatus,
        dealStatus: formData.dealStatus,
        nextFollowUpDate: formData.nextFollowUpDate,
        internalNotes: formData.internalNotes.trim() || 'Customer added manually by Sarla Hooda.',
        source: formData.source,
        preferredLanguage: 'en',
        preferredContactMethod: 'Either',
        consentStatus: true
      });

      onLeadAdded();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save customer lead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#C5A46D]/15 text-[#9F7E47] flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#10243A]">Add New Customer Record</h3>
            <p className="text-xs text-slate-500">Record a walk-in, phone call, or referral lead into the CRM.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Suresh Hooda"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98123 00000"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Village / City</label>
              <input
                type="text"
                value={formData.villageCity}
                onChange={e => setFormData({ ...formData, villageCity: e.target.value })}
                placeholder="e.g. Rohtak, Sampla"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Source</label>
              <select
                value={formData.source}
                onChange={e => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#C5A46D]"
              >
                <option value="Direct Phone Call">Direct Phone Call</option>
                <option value="WhatsApp Direct">WhatsApp Direct</option>
                <option value="Client Referral">Client Referral</option>
                <option value="In-Person Branch Visit">In-Person Branch Visit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Insurance Requirement</label>
              <select
                value={formData.insuranceInterest}
                onChange={e => setFormData({ ...formData, insuranceInterest: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#C5A46D]"
              >
                <option value="Term & Pure Life Protection">Term & Pure Life Protection</option>
                <option value="Child Future & Higher Education">Child Future & Higher Education</option>
                <option value="Retirement & Guaranteed Lifelong Pension">Retirement & Guaranteed Lifelong Pension</option>
                <option value="Savings & Wealth Accumulation">Savings & Wealth Accumulation</option>
                <option value="Policy Servicing & Claim Help">Policy Servicing & Claim Help</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Next Follow-up Date</label>
              <input
                type="date"
                value={formData.nextFollowUpDate}
                onChange={e => setFormData({ ...formData, nextFollowUpDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#C5A46D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Initial Notes</label>
            <textarea
              rows={3}
              value={formData.internalNotes}
              onChange={e => setFormData({ ...formData, internalNotes: e.target.value })}
              placeholder="Record initial client details, family dependants, or requested policy..."
              className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#C5A46D]"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#10243A] hover:bg-[#1A3755] text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Customer</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
