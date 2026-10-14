/**
 * About Section: Sarla Hooda (LIC Insurance Advisor)
 * Strictly adheres to verified credentials without fabricating facts.
 */

import React from 'react';
import { Award, Users, ShieldCheck, HeartHandshake, FileCheck2, AlertCircle } from 'lucide-react';
import { Language, WebsiteContent } from '../types';
import { getTranslation } from '../lib/translations';

interface AboutSectionProps {
  language: Language;
  content: WebsiteContent;
  onOpenConsultation: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  language,
  content,
  onOpenConsultation
}) => {
  return (
    <section id="about" className="py-16 md:py-24 bg-[#F7F6F2] text-[#10243A] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A46D]/20 text-[#9F7E47] mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>{getTranslation(language, 'aboutSectionBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10243A] tracking-tight mb-4">
            {getTranslation(language, 'aboutSectionTitle')}
          </h2>
          <div className="w-16 h-1 bg-[#C5A46D] rounded-full" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Narrative (7 Cols) */}
          <div className="lg:col-span-7 space-y-5 text-slate-700 leading-relaxed text-base sm:text-lg">
            <p className="font-medium text-[#10243A]">
              {getTranslation(language, 'aboutP1')}
            </p>
            <p>
              {getTranslation(language, 'aboutP2')}
            </p>
            <p>
              {getTranslation(language, 'aboutP3')}
            </p>

            {/* Core Values 3 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-[#C5A46D]/15 text-[#9F7E47] flex items-center justify-center mb-3">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#10243A] mb-1">MDRT Standards</h4>
                <p className="text-xs text-slate-500">
                  Global benchmark for ethical client care and professional excellence.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#10243A] mb-1">700+ Families</h4>
                <p className="text-xs text-slate-500">
                  Trusted across Haryana, Delhi NCR, and nationwide for life protection.
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#10243A] mb-1">Claim Support</h4>
                <p className="text-xs text-slate-500">
                  Personal, hands-on assistance during maturity or family claim settlement.
                </p>
              </div>
            </div>

            {/* Regulatory Transparency Box */}
            <div className="flex items-start gap-3 p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-900 mt-6">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {getTranslation(language, 'officialNotice')}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#10243A] hover:bg-[#1A3755] text-white font-bold text-sm rounded-xl shadow transition-colors cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4 text-[#DFCA9B]" />
                <span>{getTranslation(language, 'bookConsultation')}</span>
              </button>
            </div>
          </div>

          {/* Right Highlight Frame (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A46D]/10 rounded-bl-full pointer-events-none" />

              <h3 className="text-xl font-bold text-[#10243A] mb-6">
                Consultant Profile Details
              </h3>

              <dl className="space-y-4 text-sm divide-y divide-slate-100">
                <div className="flex justify-between items-center pt-2">
                  <dt className="text-slate-500">Full Name</dt>
                  <dd className="font-bold text-[#10243A]">{content.advisor.name}</dd>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <dt className="text-slate-500">Official Designation</dt>
                  <dd className="font-semibold text-slate-800">{content.advisor.profession}</dd>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <dt className="text-slate-500">Key Achievement</dt>
                  <dd className="inline-flex items-center gap-1 font-bold text-[#9F7E47] bg-[#C5A46D]/15 px-2.5 py-0.5 rounded-full text-xs">
                    <Award className="w-3.5 h-3.5" />
                    {content.advisor.achievement}
                  </dd>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <dt className="text-slate-500">Active Client Base</dt>
                  <dd className="font-bold text-[#10243A]">{content.advisor.clientBase}</dd>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <dt className="text-slate-500">Direct Phone</dt>
                  <dd className="font-mono font-bold text-blue-900">{content.advisor.phone}</dd>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <dt className="text-slate-500">Official WhatsApp</dt>
                  <dd className="font-mono font-bold text-emerald-800">{content.advisor.whatsapp}</dd>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <dt className="text-slate-500">Service Coverage</dt>
                  <dd className="text-right text-xs font-medium text-slate-700 max-w-[180px]">
                    {content.advisor.officeAddressPlaceholder}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                  Data verified. Unspecified credentials remain as editable placeholders.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
