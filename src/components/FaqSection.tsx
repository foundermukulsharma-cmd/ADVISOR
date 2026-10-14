/**
 * Frequently Asked Questions (FAQ Section)
 */

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldQuestion } from 'lucide-react';
import { Language, WebsiteContent, FAQItem } from '../types';
import { getTranslation } from '../lib/translations';

interface FaqSectionProps {
  language: Language;
  content: WebsiteContent;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ language, content }) => {
  const [openId, setOpenId] = useState<string | null>(content.faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faqs" className="py-16 md:py-24 bg-[#F7F6F2] text-[#10243A] scroll-mt-20 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A46D]/20 text-[#9F7E47] mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Base</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10243A] tracking-tight mb-3">
            {getTranslation(language, 'faqTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {getTranslation(language, 'faqSubtitle')}
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {content.faqs.map((faq: FAQItem) => {
            const isOpen = openId === faq.id;
            const q = language === 'hi' ? faq.questionHi : faq.questionEn;
            const a = language === 'hi' ? faq.answerHi : faq.answerEn;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full py-4.5 px-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-[#10243A] leading-snug">
                    {q}
                  </span>
                  <div className={`p-1.5 rounded-full bg-slate-100 text-slate-600 shrink-0 transform transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-[#C5A46D]/20 text-[#9F7E47]' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
