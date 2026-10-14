/**
 * Client Trust & Verified Policyholder Experiences
 */

import React from 'react';
import { Star, ShieldCheck, CheckCircle, HeartHandshake } from 'lucide-react';
import { Language, WebsiteContent, TestimonialItem } from '../types';
import { getTranslation } from '../lib/translations';

interface TrustSectionProps {
  language: Language;
  content: WebsiteContent;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ language, content }) => {
  return (
    <section id="reviews" className="py-16 md:py-24 bg-white text-[#10243A] scroll-mt-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A46D]/15 text-[#9F7E47] mb-3">
            <HeartHandshake className="w-4 h-4" />
            <span>{content.advisor.clientBase}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10243A] tracking-tight mb-3">
            {getTranslation(language, 'trustTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {getTranslation(language, 'trustSubtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.testimonials.map((t: TestimonialItem) => {
            const comment = language === 'hi' ? t.commentHi : t.commentEn;

            return (
              <div
                key={t.id}
                className="bg-[#F7F6F2] rounded-3xl p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <blockquote className="text-sm text-slate-700 leading-relaxed mb-6 italic">
                    "{comment}"
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#10243A] leading-tight">
                      {t.clientName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {t.location} • Since {t.policySince}
                    </p>
                  </div>

                  {t.consentConfirmed && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{getTranslation(language, 'consentBadge')}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ethical Verification Disclaimer */}
        <div className="mt-10 text-center text-xs text-slate-400">
          * Feedback displayed with policyholder consent. Individual needs and policy benefits may vary based on chosen plan terms.
        </div>

      </div>
    </section>
  );
};
