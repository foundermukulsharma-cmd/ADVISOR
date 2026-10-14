/**
 * Deal Won / Deal Lost & Cold Lead Message Assistant
 * Generates personalized, respectful WhatsApp & SMS templates in English & Hindi.
 */

import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Copy,
  Check,
  Send,
  Languages,
  Smile,
  AlertCircle,
  FileText,
  UserCheck,
  UserX,
  History,
  Sparkles
} from 'lucide-react';
import { CustomerLead, MessageTemplate, Language } from '../../types';
import { api } from '../../services/api';

interface MessageAssistantProps {
  lead?: CustomerLead;
  templates: MessageTemplate[];
  onActivityLogged?: () => void;
}

export const MessageAssistant: React.FC<MessageAssistantProps> = ({
  lead,
  templates,
  onActivityLogged
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '');
  const [msgLang, setMsgLang] = useState<Language>(lead?.preferredLanguage || 'hi');
  const [editedContent, setEditedContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loggedStatus, setLoggedStatus] = useState<string | null>(null);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  // Populate template with lead variables
  useEffect(() => {
    if (selectedTemplate) {
      const rawText = msgLang === 'hi' ? selectedTemplate.contentHi : selectedTemplate.contentEn;
      const customerName = lead?.name || 'Customer';
      const interest = lead?.insuranceInterest || 'LIC Insurance Plan';
      const village = lead?.villageCity || 'your area';

      const personalized = rawText
        .replace(/\[Customer Name\]/g, customerName)
        .replace(/\[Insurance Interest\]/g, interest)
        .replace(/\[Village\/City\]/g, village);

      setEditedContent(personalized);
    }
  }, [selectedTemplateId, msgLang, lead]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = async () => {
    if (!lead || !lead.phone) {
      alert('No customer phone number available.');
      return;
    }

    const cleanPhone = lead.phone.replace(/[^\d]/g, '');
    const encoded = encodeURIComponent(editedContent);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;

    // Open WhatsApp chat
    window.open(waUrl, '_blank');

    // Promptly log the activity in CRM with verified disclaimer
    try {
      await api.logLeadActivity(lead.id, {
        type: 'WHATSAPP',
        description: `Opened WhatsApp chat with template: '${selectedTemplate?.titleEn || 'Message'}'. Content: "${editedContent.slice(0, 100)}..."`,
        updateLastContactDate: true
      });
      setLoggedStatus('WhatsApp chat initiated and interaction logged in CRM.');
      if (onActivityLogged) onActivityLogged();
      setTimeout(() => setLoggedStatus(null), 4000);
    } catch (err) {
      console.error('Error logging WhatsApp activity:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5A46D]/15 text-[#9F7E47] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Follow-up Assistant</span>
          </div>
          <h3 className="text-lg font-bold text-[#10243A]">
            Message Assistant for {lead ? lead.name : 'Customer'}
          </h3>
          {lead && (
            <p className="text-xs text-slate-500">
              Phone: {lead.phone} • Status: <span className="font-semibold text-slate-700">{lead.leadStatus}</span>
            </p>
          )}
        </div>

        {/* Language Switcher for Message */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setMsgLang('en')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              msgLang === 'en' ? 'bg-white text-[#10243A] shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setMsgLang('hi')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              msgLang === 'hi' ? 'bg-[#C5A46D] text-[#10243A] shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Template Category Selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Select Template
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {templates.map(t => {
            const isSelected = t.id === selectedTemplateId;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTemplateId(t.id)}
                className={`text-left p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#C5A46D] bg-[#C5A46D]/10 text-[#10243A] font-bold shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span>{msgLang === 'hi' ? t.titleHi : t.titleEn}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {t.category.replace('_', ' ')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Editable Message Preview Box */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Preview & Edit Message Before Sending
          </label>
          <span className="text-[11px] text-slate-400">
            Variables like [Customer Name] are pre-filled
          </span>
        </div>

        <textarea
          rows={6}
          value={editedContent}
          onChange={e => setEditedContent(e.target.value)}
          className="w-full p-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent text-sm text-slate-800 leading-relaxed font-sans bg-slate-50/50"
        />
      </div>

      {/* Status Notice */}
      {loggedStatus && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{loggedStatus}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleOpenWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-all cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Open in WhatsApp (+91 {lead?.phone || 'Customer'})</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied' : 'Copy Text'}</span>
        </button>
      </div>

      {/* Verification Notice */}
      <p className="text-[11px] text-slate-400 text-center leading-relaxed">
        * Respects privacy and anti-spam rules. Clicking "Open in WhatsApp" opens WhatsApp Web/App; an interaction is logged in the CRM history.
      </p>

    </div>
  );
};
