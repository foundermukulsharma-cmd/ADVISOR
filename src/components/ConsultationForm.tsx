/**
 * Customer Information Form with Consent and Privacy-Preserving Geolocation
 * Stores readable village/city and explicit consultation consent.
 */

import React, { useState, useEffect } from 'react';
import {
  Send,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  HelpCircle,
  Loader2,
  Lock,
  Sparkles
} from 'lucide-react';
import { Language, QuizAnswers, WebsiteContent } from '../types';
import { getTranslation } from '../lib/translations';
import { detectReadableLocation } from '../lib/location';
import { api } from '../services/api';

interface ConsultationFormProps {
  language: Language;
  content: WebsiteContent;
  initialInterest?: string;
  initialQuizSummary?: string;
  initialQuizAnswers?: QuizAnswers;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  language,
  content,
  initialInterest,
  initialQuizSummary,
  initialQuizAnswers
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    villageCity: '',
    address: '',
    preferredLanguage: language,
    insuranceInterest: initialInterest || 'Term & Pure Life Protection',
    preferredContactMethod: 'Either' as 'WhatsApp' | 'Phone Call' | 'Either',
    consentStatus: false,
    locationSharedVoluntarily: false
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialInterest) {
      setFormData(prev => ({ ...prev, insuranceInterest: initialInterest }));
    }
  }, [initialInterest]);

  // Handle GPS detection on explicit button click only
  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    setLocationNotice(null);
    try {
      const result = await detectReadableLocation();
      if (result.success && result.city) {
        setFormData(prev => ({
          ...prev,
          villageCity: result.city || '',
          locationSharedVoluntarily: true
        }));
        setLocationNotice(getTranslation(language, 'locationDetected', { city: result.city }));
      } else {
        setLocationNotice(result.errorMessage || getTranslation(language, 'locationDenied'));
      }
    } catch (err) {
      setLocationNotice(getTranslation(language, 'locationDenied'));
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना पूरा नाम लिखें।' : 'Please enter your full name.');
      return;
    }

    const cleanPhone = formData.phone.replace(/[^\d+]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage(language === 'hi' ? 'कृपया एक मान्य 10-अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.consentStatus) {
      setErrorMessage(language === 'hi' ? 'परामर्श के लिए कृपया सहमति बॉक्स को चेक करें।' : 'Please accept the consent terms to submit your request.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        villageCity: formData.villageCity.trim() || 'Unspecified',
        address: formData.address.trim() || undefined,
        preferredLanguage: formData.preferredLanguage,
        insuranceInterest: formData.insuranceInterest,
        preferredContactMethod: formData.preferredContactMethod,
        consentStatus: true,
        locationSharedVoluntarily: formData.locationSharedVoluntarily,
        quizSummary: initialQuizSummary || undefined,
        quizAnswers: initialQuizAnswers || undefined,
        source: initialQuizSummary ? 'Insurance Quiz' : 'Website Form'
      };

      const resp = await api.submitLead(payload);
      if (resp.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(resp.message || 'Submission failed. Please try calling directly.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not connect to the server. Please try again or call directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#F7F6F2] text-[#10243A] scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A46D]/20 text-[#9F7E47] mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>Confidential & Secure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10243A] tracking-tight mb-3">
            {getTranslation(language, 'formTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {getTranslation(language, 'formSubtitle')}
          </p>
        </div>

        {/* Card Frame */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl">
          
          {isSuccess ? (
            /* Success Confirmation */
            <div className="text-center py-8 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#10243A] mb-2">
                  {getTranslation(language, 'formSuccessTitle')}
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {getTranslation(language, 'formSuccessMsg')}
                </p>
              </div>

              {/* Direct Call Shortcut if urgent */}
              <div className="pt-4 border-t border-slate-100 max-w-md mx-auto">
                <p className="text-xs text-slate-500 mb-3">
                  {getTranslation(language, 'formSuccessCallAction')}
                </p>
                <a
                  href={`tel:${content.advisor.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#DFCA9B] to-[#C5A46D] text-[#10243A] font-bold text-sm rounded-xl shadow hover:brightness-105 transition-all"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Call {content.advisor.name} ({content.advisor.phone})</span>
                </a>
              </div>
            </div>
          ) : (
            /* Active Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* If Quiz Was Completed, show summary banner */}
              {initialQuizSummary && (
                <div className="p-4 bg-[#C5A46D]/15 border border-[#C5A46D]/40 rounded-2xl flex items-start gap-3 text-xs text-[#9F7E47]">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Your Quiz Direction Attached: </span>
                    <span>{initialQuizSummary}</span>
                  </div>
                </div>
              )}

              {/* Error banner */}
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {getTranslation(language, 'fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder={getTranslation(language, 'fullNamePlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent text-sm bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {getTranslation(language, 'mobileNumber')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={getTranslation(language, 'mobilePlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent text-sm bg-slate-50/50 font-mono"
                  />
                </div>
              </div>

              {/* Email & Village/City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {getTranslation(language, 'emailAddress')}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder={getTranslation(language, 'emailPlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent text-sm bg-slate-50/50"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {getTranslation(language, 'villageCity')}
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isDetectingLocation}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9F7E47] hover:text-[#7A5F32] cursor-pointer"
                    >
                      {isDetectingLocation ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Detecting...</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3" />
                          <span>{getTranslation(language, 'detectLocationBtn')}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.villageCity}
                    onChange={e => setFormData({ ...formData, villageCity: e.target.value })}
                    placeholder={getTranslation(language, 'villageCityPlaceholder')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent text-sm bg-slate-50/50"
                  />
                  {locationNotice && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      {locationNotice}
                    </p>
                  )}
                </div>
              </div>

              {/* Address (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {getTranslation(language, 'addressField')}
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder={getTranslation(language, 'addressPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent text-sm bg-slate-50/50"
                />
              </div>

              {/* Requirements & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {getTranslation(language, 'insuranceRequirement')}
                  </label>
                  <select
                    value={formData.insuranceInterest}
                    onChange={e => setFormData({ ...formData, insuranceInterest: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C5A46D] focus:border-transparent text-sm bg-slate-50/50"
                  >
                    <option value="Term & Pure Life Protection">Term & Pure Life Protection</option>
                    <option value="Child Future & Higher Education">Child Future & Higher Education</option>
                    <option value="Retirement & Guaranteed Lifelong Pension">Retirement & Guaranteed Lifelong Pension</option>
                    <option value="Savings & Wealth Accumulation">Savings & Wealth Accumulation</option>
                    <option value="Policy Servicing & Claim Help">Policy Servicing & Claim Help</option>
                    <option value="General Insurance Advice">General Insurance Advice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {getTranslation(language, 'preferredContactMethod')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['WhatsApp', 'Phone Call', 'Either'] as const).map(method => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setFormData({ ...formData, preferredContactMethod: method })}
                        className={`py-3 px-2 rounded-xl text-xs font-semibold border text-center transition-colors cursor-pointer ${
                          formData.preferredContactMethod === method
                            ? 'bg-[#10243A] text-white border-[#10243A]'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {method === 'WhatsApp' ? getTranslation(language, 'methodWhatsApp') :
                         method === 'Phone Call' ? getTranslation(language, 'methodCall') :
                         getTranslation(language, 'methodEither')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location Privacy Guarantee */}
              <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 inline mr-1" />
                {getTranslation(language, 'locationHelp')}
              </p>

              {/* Mandatory Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consentStatus}
                    onChange={e => setFormData({ ...formData, consentStatus: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-[#C5A46D] focus:ring-[#C5A46D]"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-800">
                    {getTranslation(language, 'consentText')}
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-[#DFCA9B] via-[#C5A46D] to-[#9F7E47] text-[#10243A] font-extrabold text-sm sm:text-base rounded-xl shadow-lg hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{getTranslation(language, 'submitting')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{getTranslation(language, 'submitEnquiry')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Privacy Notice */}
              <div className="text-center">
                <p className="text-[11px] text-slate-400">
                  {getTranslation(language, 'privacyAssurance')}
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
