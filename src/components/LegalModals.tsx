/**
 * Privacy Policy and Terms of Use Modal Views
 */

import React from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';
import { Language, WebsiteContent } from '../types';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'disclaimer' | null;
  onClose: () => void;
  language: Language;
  content: WebsiteContent;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  type,
  onClose,
  language,
  content
}) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'privacy' && (
          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-[#10243A] font-bold text-xl mb-2">
              <Lock className="w-6 h-6 text-[#C5A46D]" />
              <span>Privacy Policy</span>
            </div>
            <p className="text-xs text-slate-400">Effective Date: October 2026</p>

            <h4 className="font-bold text-[#10243A] text-base">1. Information We Collect</h4>
            <p>
              When you voluntarily submit an enquiry or consultation request on this advisory platform, we collect information including your Full Name, Mobile Number, Village/City name, Email Address (optional), and Insurance Preferences.
            </p>

            <h4 className="font-bold text-[#10243A] text-base">2. Purpose of Collection</h4>
            <p>
              Your information is used strictly to provide personalized LIC insurance consultations, calculate preliminary quotes, schedule appointments, and maintain service records by licensed advisor Sarla Hooda. We never sell, rent, or trade your data.
            </p>

            <h4 className="font-bold text-[#10243A] text-base">3. Geolocation & GPS Data</h4>
            <p>
              When you use the "Auto-Detect Village / City" feature, your browser requests location access. We only extract the human-readable locality name (e.g., Rohtak, Jhajjar). Raw GPS coordinates are never permanently logged or stored.
            </p>

            <h4 className="font-bold text-[#10243A] text-base">4. Data Security & Sensitive Data</h4>
            <p>
              We adhere strictly to ethical data practices. We will never ask for bank passwords, OTPs, debit/credit card CVVs, or Aadhaar numbers through this website.
            </p>

            <h4 className="font-bold text-[#10243A] text-base">5. Right to Rectification & Deletion</h4>
            <p>
              You may request access to, correction of, or permanent deletion of your customer record at any time by contacting Sarla Hooda via WhatsApp or phone at +91 93503 04831.
            </p>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-[#10243A] font-bold text-xl mb-2">
              <FileText className="w-6 h-6 text-[#C5A46D]" />
              <span>Terms of Use</span>
            </div>

            <h4 className="font-bold text-[#10243A] text-base">1. Advisory Scope</h4>
            <p>
              This website serves as the independent digital consulting portfolio of Sarla Hooda, an authorized Insurance Advisor affiliated with the Life Insurance Corporation of India (LIC). This portal is not the corporate website of LIC.
            </p>

            <h4 className="font-bold text-[#10243A] text-base">2. Product Information & Disclaimers</h4>
            <p>
              Insurance is a subject matter of solicitation. Plan benefits, bonuses, policy terms, and riders are governed strictly by the official policy contract issued by LIC of India upon proposal acceptance. No guarantees of policy acceptance or fixed investment returns are made without formal underwriting.
            </p>

            <h4 className="font-bold text-[#10243A] text-base">3. Authorized Communication</h4>
            <p>
              Official communications regarding your consultation will occur directly through +91 93503 04831 or authorized branch visits.
            </p>
          </div>
        )}

        {type === 'disclaimer' && (
          <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
            <div className="flex items-center gap-2 text-[#10243A] font-bold text-xl mb-2">
              <ShieldCheck className="w-6 h-6 text-[#C5A46D]" />
              <span>Regulatory Disclaimer</span>
            </div>
            <p className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              {language === 'hi' ? content.disclaimerHi : content.disclaimerEn}
            </p>
            <p className="text-xs text-slate-500">
              MDRT (Million Dollar Round Table) is a registered trademark of the Premier Association of Financial Professionals®.
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#10243A] text-white rounded-xl text-xs font-semibold hover:bg-[#1A3755] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
