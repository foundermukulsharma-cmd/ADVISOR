/**
 * Professional Bilingual Footer with Verified Disclaimers & Portal Link
 */

import React from 'react';
import { Phone, MessageCircle, Shield, Lock, Award, Heart, Mail, MapPin } from 'lucide-react';
import { Language, WebsiteContent } from '../types';
import { getTranslation } from '../lib/translations';

interface FooterProps {
  language: Language;
  content: WebsiteContent;
  onOpenLegal: (type: 'privacy' | 'terms' | 'disclaimer') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  content,
  onOpenLegal,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-[#0A1726] text-white pt-16 pb-24 md:pb-12 border-t border-[#C5A46D]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Identity Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C5A46D] shadow">
                <img
                  src={content.advisor.photoUrl}
                  alt={content.advisor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-bold text-lg text-white">
                  {content.advisor.name}
                </span>
                <p className="text-xs text-[#DFCA9B]">
                  {content.advisor.profession}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              {getTranslation(language, 'footerTagline')}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5A46D]/20 text-[#DFCA9B] border border-[#C5A46D]/30">
                <Award className="w-3.5 h-3.5" />
                <span>{content.advisor.achievement}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/10 text-slate-200">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>{content.advisor.clientBase}</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFCA9B]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><a href="#about" className="hover:text-white transition-colors">About Sarla</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">LIC Plans</a></li>
              <li><a href="#quiz" className="hover:text-white transition-colors">Smart Quiz</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Client Trust</a></li>
              <li><a href="#faqs" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Book Consultation</a></li>
            </ul>
          </div>

          {/* Legal & Compliance (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFCA9B]">
              Legal & Privacy
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {getTranslation(language, 'privacyPolicy')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {getTranslation(language, 'termsOfUse')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegal('disclaimer')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {getTranslation(language, 'regulatoryDisclaimer')}
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-xs text-[#DFCA9B] hover:text-white font-semibold cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>{getTranslation(language, 'adminLogin')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Verified Contacts (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFCA9B]">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <a
                href={`tel:${content.advisor.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-2 hover:text-white transition-colors font-mono"
              >
                <Phone className="w-3.5 h-3.5 text-[#DFCA9B]" />
                <span>{content.advisor.phone}</span>
              </a>

              <a
                href={`https://wa.me/${content.advisor.whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors font-mono"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{content.advisor.whatsapp} (WhatsApp)</span>
              </a>

              <div className="flex items-start gap-2 text-slate-400 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#DFCA9B] shrink-0 mt-0.5" />
                <span>{content.advisor.officeAddressPlaceholder}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Regulatory Disclaimer Text */}
        <div className="pt-8 pb-4 text-[11px] text-slate-400 leading-relaxed">
          <p>{getTranslation(language, 'disclaimerText')}</p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>
            © {new Date().getFullYear()} {content.advisor.name}. {getTranslation(language, 'allRightsReserved')}
          </p>
          <p className="text-[11px]">
            Official Consultation Portal • MDRT Qualified Advisor
          </p>
        </div>

      </div>
    </footer>
  );
};
