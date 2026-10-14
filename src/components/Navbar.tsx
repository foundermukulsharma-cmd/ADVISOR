/**
 * Premium Bilingual Navigation Header
 */

import React, { useState } from 'react';
import { Phone, MessageCircle, Globe, Shield, Menu, X, Lock } from 'lucide-react';
import { Language, WebsiteContent } from '../types';
import { getTranslation } from '../lib/translations';
import { api } from '../services/api';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  content: WebsiteContent;
  onOpenAdmin: () => void;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  content,
  onOpenAdmin,
  onOpenConsultation
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCall = () => {
    api.trackEvent('call_click', { source: 'navbar' }, 'navbar', language);
    window.location.href = `tel:${content.advisor.phone.replace(/\s+/g, '')}`;
  };

  const handleWhatsApp = () => {
    api.trackEvent('whatsapp_click', { source: 'navbar' }, 'navbar', language);
    const cleanPhone = content.advisor.whatsapp.replace(/[^\d]/g, '');
    const msg = language === 'hi' 
      ? 'नमस्ते सरला जी, मुझे एलआईसी बीमा परामर्श के संबंध में जानकारी चाहिए।'
      : 'Hello Sarla ji, I would like to consult with you regarding LIC insurance plans.';
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#10243A]/95 backdrop-blur-md border-b border-[#C5A46D]/20 text-white transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#C5A46D] shadow group-hover:scale-105 transition-transform">
                  <img
                    src={content.advisor.photoUrl}
                    alt={content.advisor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#C5A46D] text-[#10243A] p-0.5 rounded-full">
                  <Shield className="w-3 h-3 fill-current" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-white tracking-tight group-hover:text-[#DFCA9B] transition-colors">
                    {content.advisor.name}
                  </span>
                  <span className="hidden md:inline-flex px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-[#C5A46D]/20 text-[#DFCA9B] border border-[#C5A46D]/40 rounded-full">
                    {content.advisor.achievement}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  {content.advisor.profession} • {content.advisor.clientBase}
                </p>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-200">
            <a href="#about" className="hover:text-[#DFCA9B] transition-colors">
              {getTranslation(language, 'navAbout')}
            </a>
            <a href="#services" className="hover:text-[#DFCA9B] transition-colors">
              {getTranslation(language, 'navServices')}
            </a>
            <a href="#quiz" className="hover:text-[#DFCA9B] transition-colors">
              {getTranslation(language, 'navQuiz')}
            </a>
            <a href="#reviews" className="hover:text-[#DFCA9B] transition-colors">
              {getTranslation(language, 'navReviews')}
            </a>
            <a href="#faqs" className="hover:text-[#DFCA9B] transition-colors">
              {getTranslation(language, 'navFaq')}
            </a>
            <a href="#contact" className="hover:text-[#DFCA9B] transition-colors">
              {getTranslation(language, 'navContact')}
            </a>
          </nav>

          {/* Action Tools & Switchers */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-white/10 rounded-full p-1 border border-white/15">
              <Globe className="w-3.5 h-3.5 ml-2 text-[#DFCA9B]" />
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-[#C5A46D] text-[#10243A] shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  language === 'hi'
                    ? 'bg-[#C5A46D] text-[#10243A] shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Direct WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span className="hidden xl:inline">{getTranslation(language, 'whatsapp')}</span>
            </button>

            {/* Direct Call */}
            <button
              onClick={handleCall}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#DFCA9B] to-[#C5A46D] text-[#10243A] hover:brightness-105 rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>{getTranslation(language, 'callNow')}</span>
            </button>

            {/* Advisor Admin Portal Access */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-slate-300 hover:text-[#DFCA9B] hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-[#C5A46D]/30"
              title="Secure CRM & Advisor Dashboard"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden 2xl:inline">{getTranslation(language, 'adminLogin')}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 bg-white/10 rounded-full text-xs font-semibold text-[#DFCA9B] border border-white/15"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0A1726] border-b border-[#C5A46D]/30 px-4 pt-3 pb-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#DFCA9B]">{content.advisor.achievement}</span>
              <span className="text-xs text-slate-400">• {content.advisor.clientBase}</span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-[#DFCA9B]"
            >
              <Lock className="w-3 h-3" />
              <span>{getTranslation(language, 'adminLogin')}</span>
            </button>
          </div>

          <div className="flex flex-col space-y-3 text-sm font-medium">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-200 hover:text-[#DFCA9B]"
            >
              {getTranslation(language, 'navAbout')}
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-200 hover:text-[#DFCA9B]"
            >
              {getTranslation(language, 'navServices')}
            </a>
            <a
              href="#quiz"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-200 hover:text-[#DFCA9B]"
            >
              {getTranslation(language, 'navQuiz')}
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-200 hover:text-[#DFCA9B]"
            >
              {getTranslation(language, 'navReviews')}
            </a>
            <a
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-200 hover:text-[#DFCA9B]"
            >
              {getTranslation(language, 'navFaq')}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-200 hover:text-[#DFCA9B]"
            >
              {getTranslation(language, 'navContact')}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#DFCA9B] to-[#C5A46D] text-[#10243A] font-bold rounded-lg text-xs"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>{getTranslation(language, 'callNow')}</span>
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white font-bold rounded-lg text-xs"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{getTranslation(language, 'whatsapp')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
