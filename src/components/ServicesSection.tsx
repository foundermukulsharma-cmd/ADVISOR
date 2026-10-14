/**
 * Thoughtfully Structured Insurance Solutions (Services Section)
 */

import React from 'react';
import {
  ShieldCheck,
  GraduationCap,
  Coins,
  PiggyBank,
  FileHeart,
  ArrowRight,
  Check,
  Info
} from 'lucide-react';
import { Language, WebsiteContent, InsuranceServiceItem } from '../types';
import { getTranslation } from '../lib/translations';

interface ServicesSectionProps {
  language: Language;
  content: WebsiteContent;
  onSelectService: (serviceName: string) => void;
}

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case 'ShieldCheck': return ShieldCheck;
    case 'GraduationCap': return GraduationCap;
    case 'Coins': return Coins;
    case 'PiggyBank': return PiggyBank;
    case 'FileHeart': return FileHeart;
    default: return ShieldCheck;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  language,
  content,
  onSelectService
}) => {
  return (
    <section id="services" className="py-16 md:py-24 bg-white text-[#10243A] scroll-mt-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A46D]/15 text-[#9F7E47] mb-3">
            <span>Official Plan Categories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10243A] tracking-tight mb-4">
            {getTranslation(language, 'servicesTitle')}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {getTranslation(language, 'servicesSubtitle')}
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.services.map((item: InsuranceServiceItem) => {
            const IconComp = getServiceIcon(item.icon);
            const title = language === 'hi' ? item.titleHi : item.titleEn;
            const tagline = language === 'hi' ? item.taglineHi : item.taglineEn;
            const desc = language === 'hi' ? item.descHi : item.descEn;
            const highlights = language === 'hi' ? item.keyHighlightsHi : item.keyHighlightsEn;

            return (
              <div
                key={item.id}
                className="bg-[#F7F6F2] hover:bg-slate-50 border border-slate-200/90 rounded-3xl p-7 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div>
                  {/* Top Header & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-13 h-13 rounded-2xl bg-[#10243A] text-[#DFCA9B] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      <IconComp className="w-6 h-6" />
                    </div>
                    {item.badge && (
                      <span className="px-2.5 py-0.5 text-xs font-bold bg-[#C5A46D]/20 text-[#9F7E47] rounded-full border border-[#C5A46D]/30">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-[#10243A] mb-1.5 group-hover:text-blue-950 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs font-semibold text-[#9F7E47] mb-3">
                    {tagline}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {desc}
                  </p>

                  {/* Representative LIC Categories */}
                  <div className="mb-5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Key LIC Plans
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.licCategories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-xs font-medium bg-white text-slate-700 rounded-lg border border-slate-200"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Highlights Bullet points */}
                  <div className="space-y-2 mb-6">
                    {highlights.map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="pt-4 border-t border-slate-200">
                  <button
                    onClick={() => onSelectService(title)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-[#10243A] text-[#10243A] hover:text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-300 hover:border-[#10243A] shadow-sm transition-all cursor-pointer group-hover:bg-[#10243A] group-hover:text-white"
                  >
                    <span>{getTranslation(language, 'exploreService')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Regulatory Note below services */}
        <div className="mt-12 text-center text-xs text-slate-500 max-w-2xl mx-auto flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Plans and bonuses are subject to official LIC terms and conditions. Sarla Hooda provides independent assessment and guidance.
          </span>
        </div>

      </div>
    </section>
  );
};
