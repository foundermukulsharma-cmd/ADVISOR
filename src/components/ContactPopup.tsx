/**
 * Website-Opening Contact Popup
 * Non-intrusive, consent-respecting digital contact save popup.
 */

import React, { useEffect, useState } from 'react';
import { Download, X, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Language, WebsiteContent } from '../types';
import { getTranslation } from '../lib/translations';
import { downloadVCard } from '../lib/vcard';
import { api } from '../services/api';

interface ContactPopupProps {
  language: Language;
  content: WebsiteContent;
}

const STORAGE_KEY = 'sarla_hooda_contact_popup_dismissed_v1';

export const ContactPopup: React.FC<ContactPopupProps> = ({ language, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    // Check if dismissed previously
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      // Show politely after 2.5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const handleDownload = () => {
    const success = downloadVCard({
      name: content.advisor.name,
      phone: content.advisor.phone,
      title: content.advisor.profession,
      organization: 'Life Insurance Corporation of India (LIC)',
      url: window.location.href,
      note: 'MDRT Qualified LIC Insurance Consultant serving 700+ families. Call for personalized life, retirement, and child education planning.'
    });

    if (success) {
      setIsDownloaded(true);
      api.trackEvent('vcf_download', { source: 'opening_popup' }, 'popup', language);
      localStorage.setItem(STORAGE_KEY, 'true');
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#10243A] text-white rounded-2xl shadow-2xl border border-[#C5A46D]/30 p-6 md:p-8 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
      >
        {/* Subtle Gold Accent Background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C5A46D]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge & Avatar */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <img
              src={content.advisor.photoUrl}
              alt={content.advisor.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#C5A46D] shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#C5A46D] text-[#10243A] p-1 rounded-full shadow">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#C5A46D]/20 text-[#DFCA9B] border border-[#C5A46D]/30 mb-1">
              <span>{content.advisor.achievement}</span>
              <span>•</span>
              <span>{content.advisor.clientBase}</span>
            </div>
            <h4 className="text-lg font-bold text-white leading-snug">{content.advisor.name}</h4>
            <p className="text-xs text-slate-300">{content.advisor.profession}</p>
          </div>
        </div>

        {/* Title & Body */}
        <h3 id="popup-title" className="text-xl font-bold text-white mb-2 leading-tight">
          {getTranslation(language, 'popupTitle')}
        </h3>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          {getTranslation(language, 'popupSubtitle')}
        </p>

        {/* Status or Actions */}
        {isDownloaded ? (
          <div className="flex items-center gap-3 p-4 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-200 text-sm mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold">Contact file downloaded (.vcf)</p>
              <p className="text-xs text-emerald-300/80">Tap the downloaded file on your device to save to contacts.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 bg-gradient-to-r from-[#DFCA9B] via-[#C5A46D] to-[#9F7E47] text-[#10243A] font-bold rounded-xl shadow-lg hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>{getTranslation(language, 'popupSaveBtn')}</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-xl border border-white/10 transition-colors cursor-pointer"
              >
                {getTranslation(language, 'popupContinueBtn')}
              </button>
              <button
                onClick={handleDismiss}
                className="py-2.5 px-4 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors cursor-pointer"
              >
                {getTranslation(language, 'popupLaterBtn')}
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#C5A46D]" />
            {content.advisor.phone}
          </span>
          <span className="text-[11px] text-slate-500">
            {getTranslation(language, 'popupNote')}
          </span>
        </div>
      </div>
    </div>
  );
};
