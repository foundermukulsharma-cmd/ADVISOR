/**
 * Hero Section: Sarla Hooda LIC Insurance Advisory
 * Features verified credentials (MDRT Qualified, 700+ Clients),
 * portrait profile card, primary action buttons, and bilingual headlines.
 */

import React from 'react';
import {
  Phone,
  MessageCircle,
  Download,
  Calendar,
  Compass,
  ShieldCheck,
  Award,
  Users,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Language, WebsiteContent } from '../types';
import { getTranslation } from '../lib/translations';
import { downloadVCard } from '../lib/vcard';
import { api } from '../services/api';

interface HeroProps {
  language: Language;
  content: WebsiteContent;
  onOpenConsultation: () => void;
  onExplorePlans: () => void;
  onOpenQr: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  content,
  onOpenConsultation,
  onExplorePlans,
  onOpenQr
}) => {
  const handleCall = () => {
    api.trackEvent('call_click', { source: 'hero' }, 'hero', language);
    window.location.href = `tel:${content.advisor.phone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = () => {
    api.trackEvent('whatsapp_click', { source: 'hero' }, 'hero', language);
    const cleanPhone = content.advisor.whatsapp.replace(/[^\d]/g, '');
    const msg = language === 'hi'
      ? 'नमस्ते सरला जी, मैंने आपकी वेबसाइट देखी और मैं बीमा सलाह के लिए आपसे जुड़ना चाहता/चाहती हूँ।'
      : 'Hello Sarla ji, I saw your consulting website and would like to connect for insurance guidance.';
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSaveContact = () => {
    api.trackEvent('vcf_download', { source: 'hero_btn' }, 'hero', language);
    downloadVCard({
      name: content.advisor.name,
      phone: content.advisor.phone,
      title: content.advisor.profession,
      organization: 'Life Insurance Corporation of India (LIC)',
      url: window.location.href,
      note: 'MDRT Qualified LIC Consultant. 700+ families advised.'
    });
  };

  const headline = language === 'hi'
    ? (content.advisor.heroHeadlineHi || "आपके परिवार का भविष्य सही सुरक्षा का हकदार है।")
    : (content.advisor.heroHeadlineEn || "Your Family’s Future Deserves Thoughtful Protection.");

  const subtitle = language === 'hi'
    ? (content.advisor.heroSubtitleHi || "700 से अधिक परिवारों के भरोसे के साथ समर्पित एलआईसी बीमा परामर्श।")
    : (content.advisor.heroSubtitleEn || "Personalized life insurance, retirement pension security, and children's higher education corpus advised by MDRT Qualified LIC Consultant Sarla Hooda.");

  return (
    <section className="relative bg-[#10243A] text-white overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#C5A46D]/20">
      {/* Background Subtle Ambience & Radial Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A46D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Action Buttons (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Verified Credentials Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A46D]/15 text-[#DFCA9B] border border-[#C5A46D]/40 shadow-sm">
                <Award className="w-4 h-4 text-[#C5A46D]" />
                <span>{content.advisor.achievement}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/15 shadow-sm">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>{content.advisor.clientBase}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/60 text-blue-200 border border-blue-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>LIC Authorized Advisor</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.9rem] font-extrabold text-white leading-[1.18] tracking-tight">
              {headline}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {subtitle}
            </p>

            {/* Trust Highlights Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 pb-1 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#C5A46D] shrink-0" />
                <span>Ethical Need-Based Plans</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#C5A46D] shrink-0" />
                <span>Doorstep Claim Support</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle className="w-4 h-4 text-[#C5A46D] shrink-0" />
                <span>Zero Pushy Sales</span>
              </div>
            </div>

            {/* Primary Action Buttons (Prompt Requirement: Save Contact, Call Now, WhatsApp, Explore Options, Book Consultation) */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                {/* Book Consultation */}
                <button
                  onClick={onOpenConsultation}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#DFCA9B] via-[#C5A46D] to-[#9F7E47] text-[#10243A] font-bold text-sm sm:text-base rounded-xl shadow-lg hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{getTranslation(language, 'bookConsultation')}</span>
                </button>

                {/* Explore Insurance Options */}
                <button
                  onClick={onExplorePlans}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base rounded-xl border border-white/20 transition-all cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#DFCA9B]" />
                  <span>{getTranslation(language, 'exploreOptions')}</span>
                </button>
              </div>

              {/* Direct Quick Contact Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {/* Call Now */}
                <button
                  onClick={handleCall}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/80 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-lg border border-blue-400/30 transition-all shadow-sm cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>{getTranslation(language, 'callNow')} ({content.advisor.phone})</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-lg border border-emerald-400/30 transition-all shadow-sm cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>{getTranslation(language, 'whatsapp')}</span>
                </button>

                {/* Save Contact */}
                <button
                  onClick={handleSaveContact}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs sm:text-sm font-medium rounded-lg border border-white/15 transition-all cursor-pointer"
                  title="Download .vcf vCard file"
                >
                  <Download className="w-3.5 h-3.5 text-[#DFCA9B]" />
                  <span>{getTranslation(language, 'saveContact')}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Premium Profile Photo Card (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Decorative Frame Elements */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#C5A46D] to-blue-500 rounded-3xl opacity-30 blur-lg group-hover:opacity-60 transition duration-1000" />
              
              <div className="relative bg-[#0A1726] border border-[#C5A46D]/40 rounded-3xl p-5 sm:p-6 shadow-2xl overflow-hidden">
                
                {/* Top Header in Card */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                      Active Consultant
                    </span>
                  </div>
                  <button
                    onClick={onOpenQr}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/15 text-[11px] text-slate-300 hover:text-white rounded-md border border-white/10 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-[#DFCA9B]" />
                    <span>Digital Card / QR</span>
                  </button>
                </div>

                {/* Portrait Image */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-[#C5A46D]/60 shadow-xl mb-4 group">
                  <img
                    src={content.advisor.photoUrl}
                    alt={content.advisor.name}
                    className="w-full h-full object-cover object-top transform group-hover:scale-102 transition-transform duration-500"
                  />
                  
                  {/* Subtle Gradient Overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1726]/90 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Overlay Name & Title */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xl font-bold tracking-tight text-white drop-shadow">
                      {content.advisor.name}
                    </p>
                    <p className="text-xs text-[#DFCA9B] font-medium drop-shadow">
                      {content.advisor.profession}
                    </p>
                  </div>
                </div>

                {/* Profile Stats & Credentials Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                    <p className="text-lg font-extrabold text-[#DFCA9B] leading-none mb-1">
                      {content.advisor.achievement}
                    </p>
                    <p className="text-[11px] text-slate-300 font-medium">Global Standard</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-center">
                    <p className="text-lg font-extrabold text-white leading-none mb-1">
                      {content.advisor.clientBase}
                    </p>
                    <p className="text-[11px] text-slate-300 font-medium">Families Protected</p>
                  </div>
                </div>

                {/* Direct Contact Snippet */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span className="font-mono">{content.advisor.phone}</span>
                  <span className="text-[#DFCA9B] font-medium">Haryana & Pan-India</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
