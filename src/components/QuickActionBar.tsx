/**
 * Mobile-First Floating Quick Action Bar
 * Ensures visitors can reach Sarla Hooda anytime with one tap.
 */

import React from 'react';
import { Phone, MessageCircle, Download, QrCode } from 'lucide-react';
import { Language, WebsiteContent } from '../types';
import { getTranslation } from '../lib/translations';
import { downloadVCard } from '../lib/vcard';
import { api } from '../services/api';

interface QuickActionBarProps {
  language: Language;
  content: WebsiteContent;
  onOpenQr: () => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({
  language,
  content,
  onOpenQr
}) => {
  const handleCall = () => {
    api.trackEvent('call_click', { source: 'quick_bar' }, 'quick_bar', language);
    window.location.href = `tel:${content.advisor.phone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = () => {
    api.trackEvent('whatsapp_click', { source: 'quick_bar' }, 'quick_bar', language);
    const cleanPhone = content.advisor.whatsapp.replace(/[^\d]/g, '');
    const msg = language === 'hi'
      ? 'नमस्ते सरला जी, मुझे बीमा परामर्श के लिए आपसे मार्गदर्शन चाहिए।'
      : 'Hello Sarla ji, I would like to get insurance guidance from you.';
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSaveContact = () => {
    api.trackEvent('vcf_download', { source: 'quick_bar' }, 'quick_bar', language);
    downloadVCard({
      name: content.advisor.name,
      phone: content.advisor.phone,
      title: content.advisor.profession,
      organization: 'Life Insurance Corporation of India (LIC)',
      url: window.location.href
    });
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 md:hidden animate-slide-up">
      <div className="bg-[#10243A]/95 backdrop-blur-md border border-[#C5A46D]/40 rounded-2xl shadow-2xl p-2.5 flex items-center justify-between gap-2 text-white">
        
        {/* Call */}
        <button
          onClick={handleCall}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 bg-gradient-to-r from-[#DFCA9B] to-[#C5A46D] text-[#10243A] rounded-xl font-bold text-xs shadow cursor-pointer"
        >
          <Phone className="w-4 h-4 fill-current mb-0.5" />
          <span>{getTranslation(language, 'callNow')}</span>
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-white mb-0.5" />
          <span>WhatsApp</span>
        </button>

        {/* Save Contact */}
        <button
          onClick={handleSaveContact}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl font-medium text-xs border border-white/10 cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#DFCA9B] mb-0.5" />
          <span>Save .vcf</span>
        </button>

        {/* QR Code */}
        <button
          onClick={onOpenQr}
          className="p-2 text-slate-300 hover:text-white bg-white/5 rounded-xl border border-white/10 cursor-pointer"
          title="QR & NFC"
        >
          <QrCode className="w-5 h-5 text-[#DFCA9B]" />
        </button>

      </div>
    </div>
  );
};
