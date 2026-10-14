/**
 * Smart Insurance Consultation Quiz: "Find the Right Insurance Direction for Your Needs"
 * 7-step guided interactive assessment with personalized summary.
 */

import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Language, QuizAnswers } from '../types';
import { getTranslation } from '../lib/translations';
import { api } from '../services/api';

interface QuizSectionProps {
  language: Language;
  onCompleteQuiz: (answers: QuizAnswers, summaryText: string) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  language,
  onCompleteQuiz
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Track quiz start
  const handleStartInteraction = () => {
    if (currentStep === 0 && !answers.primaryRequirement) {
      api.trackEvent('quiz_start', { step: 1 }, 'quiz', language);
    }
  };

  const questions = [
    {
      id: 'primaryRequirement',
      title: getTranslation(language, 'q1Title'),
      options: [
        { value: 'Family protection & life cover', label: getTranslation(language, 'q1Opt1'), icon: '🛡️' },
        { value: 'Child future & higher education', label: getTranslation(language, 'q1Opt2'), icon: '🎓' },
        { value: 'Retirement & regular pension', label: getTranslation(language, 'q1Opt3'), icon: '🪙' },
        { value: 'Disciplined savings & wealth creation', label: getTranslation(language, 'q1Opt4'), icon: '💰' },
        { value: 'Existing policy assistance / revival', label: getTranslation(language, 'q1Opt5'), icon: '📋' },
        { value: 'Claim assistance or maturity settlement', label: getTranslation(language, 'q1Opt6'), icon: '🤝' },
        { value: 'Other general financial safety', label: getTranslation(language, 'q1Opt7'), icon: '✨' }
      ]
    },
    {
      id: 'approxBudget',
      title: getTranslation(language, 'q2Title'),
      options: [
        { value: '₹1,500 – ₹3,000 monthly', label: getTranslation(language, 'q2Opt1'), icon: '💳' },
        { value: '₹3,000 – ₹7,000 monthly', label: getTranslation(language, 'q2Opt2'), icon: '💳' },
        { value: '₹7,000 – ₹15,000+ monthly', label: getTranslation(language, 'q2Opt3'), icon: '💎' },
        { value: '₹25,000 – ₹50,000+ annual lump-sum', label: getTranslation(language, 'q2Opt4'), icon: '💼' },
        { value: 'Not decided yet / Need guidance', label: getTranslation(language, 'q2Opt5'), icon: '⚖️' }
      ]
    },
    {
      id: 'paymentFrequency',
      title: getTranslation(language, 'q3Title'),
      options: [
        { value: 'Monthly (Automated ECS / NACH)', label: getTranslation(language, 'q3Opt1'), icon: '📅' },
        { value: 'Quarterly', label: getTranslation(language, 'q3Opt2'), icon: '🗓️' },
        { value: 'Half-Yearly', label: getTranslation(language, 'q3Opt3'), icon: '🌓' },
        { value: 'Yearly', label: getTranslation(language, 'q3Opt4'), icon: '🌟' },
        { value: 'Need guidance based on cash flow', label: getTranslation(language, 'q3Opt5'), icon: '💡' }
      ]
    },
    {
      id: 'planningTerm',
      title: getTranslation(language, 'q4Title'),
      options: [
        { value: 'Short-term (5 to 10 years)', label: getTranslation(language, 'q4Opt1'), icon: '⏱️' },
        { value: 'Medium-term (10 to 16 years)', label: getTranslation(language, 'q4Opt2'), icon: '⏳' },
        { value: 'Long-term (16 to 25+ years)', label: getTranslation(language, 'q4Opt3'), icon: '🏔️' },
        { value: 'Whole life coverage (up to age 100)', label: getTranslation(language, 'q4Opt4'), icon: '🌳' },
        { value: 'Need guidance based on age', label: getTranslation(language, 'q4Opt5'), icon: '🔍' }
      ]
    },
    {
      id: 'intendedFor',
      title: getTranslation(language, 'q5Title'),
      options: [
        { value: 'Myself (Primary Breadwinner)', label: getTranslation(language, 'q5Opt1'), icon: '👤' },
        { value: 'My Spouse', label: getTranslation(language, 'q5Opt2'), icon: '👥' },
        { value: 'My Child / Children', label: getTranslation(language, 'q5Opt3'), icon: '👶' },
        { value: 'My Elderly Parents', label: getTranslation(language, 'q5Opt4'), icon: '👵' },
        { value: 'Entire Family Joint Plan', label: getTranslation(language, 'q5Opt5'), icon: '🏡' }
      ]
    },
    {
      id: 'priorityGoal',
      title: getTranslation(language, 'q6Title'),
      options: [
        { value: 'Maximum life protection for minimal premium', label: getTranslation(language, 'q6Opt1'), icon: '🛡️' },
        { value: 'Guaranteed payouts on fixed maturity dates', label: getTranslation(language, 'q6Opt2'), icon: '🎯' },
        { value: 'Lifelong regular pension without market risk', label: getTranslation(language, 'q6Opt3'), icon: '🏖️' },
        { value: 'Education fund waiver if anything happens to me', label: getTranslation(language, 'q6Opt4'), icon: '🎓' },
        { value: 'Understanding or reviving my existing policy', label: getTranslation(language, 'q6Opt5'), icon: '📂' }
      ]
    },
    {
      id: 'callbackPreference',
      title: getTranslation(language, 'q7Title'),
      options: [
        { value: 'Call me for a friendly 10-minute discussion', label: getTranslation(language, 'q7Opt1'), icon: '📞' },
        { value: 'Share policy illustrations on WhatsApp first', label: getTranslation(language, 'q7Opt2'), icon: '💬' },
        { value: 'I will call Sarla Hooda when convenient', label: getTranslation(language, 'q7Opt3'), icon: '📲' }
      ]
    }
  ];

  const currentQ = questions[currentStep];

  const handleSelectOption = (key: keyof QuizAnswers, value: string) => {
    handleStartInteraction();
    const updated = { ...answers, [key]: value };
    setAnswers(updated);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishQuiz(updated);
    }
  };

  const finishQuiz = (finalAnswers: QuizAnswers) => {
    setIsCompleted(true);
    api.trackEvent('quiz_complete', { ...finalAnswers }, 'quiz', language);
  };

  const generateSummaryText = (): string => {
    return `Priority: ${answers.primaryRequirement || 'General Protection'}; Intended For: ${answers.intendedFor || 'Self'}; Horizon: ${answers.planningTerm || 'Medium-term'}; Key Goal: ${answers.priorityGoal || 'Secure Future'}; Budget: ${answers.approxBudget || 'Flexible'}; Frequency: ${answers.paymentFrequency || 'Annual'}`;
  };

  const handleProceedToConsultation = () => {
    const summary = generateSummaryText();
    onCompleteQuiz(answers, summary);
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  return (
    <section id="quiz" className="py-16 md:py-24 bg-[#10243A] text-white scroll-mt-20 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C5A46D]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#C5A46D]/20 text-[#DFCA9B] border border-[#C5A46D]/30 mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>{getTranslation(language, 'quizSectionBadge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
            {getTranslation(language, 'quizTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            {getTranslation(language, 'quizSubtitle')}
          </p>
        </div>

        {/* Quiz Container Box */}
        <div className="bg-[#0A1726]/90 border border-[#C5A46D]/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          
          {!isCompleted ? (
            <div>
              {/* Progress Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                  <span>
                    {getTranslation(language, 'quizQuestionCount', {
                      current: currentStep + 1,
                      total: questions.length
                    })}
                  </span>
                  <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#DFCA9B] to-[#C5A46D] transition-all duration-300 rounded-full"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Heading */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-6 leading-snug">
                {currentQ.title}
              </h3>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = answers[currentQ.id as keyof QuizAnswers] === opt.value;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id as keyof QuizAnswers, opt.value)}
                      className={`text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                        isSelected
                          ? 'bg-[#C5A46D]/20 border-[#C5A46D] text-white shadow-lg'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl group-hover:scale-110 transition-transform">
                          {opt.icon}
                        </span>
                        <span className="text-sm font-semibold leading-snug">
                          {opt.label}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected ? 'border-[#C5A46D] bg-[#C5A46D] text-[#10243A]' : 'border-white/20'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                <button
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                    currentStep === 0
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{getTranslation(language, 'quizPrevious')}</span>
                </button>

                <span className="text-slate-500 hidden sm:inline">
                  Select an option to automatically proceed
                </span>

                {answers[currentQ.id as keyof QuizAnswers] && currentStep < questions.length - 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
                  >
                    <span>{getTranslation(language, 'quizNext')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="text-center py-4 animate-fade-in space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#C5A46D]/20 text-[#DFCA9B] border border-[#C5A46D]/40 flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {getTranslation(language, 'quizResultTitle')}
                </h3>
                <p className="text-sm text-slate-300 max-w-lg mx-auto">
                  {getTranslation(language, 'quizResultSummary', {
                    focus: answers.primaryRequirement || 'Life Planning',
                    term: answers.planningTerm || 'Structured Term'
                  })}
                </p>
              </div>

              {/* Key Highlights of Direction */}
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-left max-w-xl mx-auto space-y-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#DFCA9B] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-white">Suggested Discussion Category:</h5>
                    <p className="text-xs text-slate-300 font-medium">
                      {answers.primaryRequirement || 'Family Life Protection'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Compass className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-white">Tailored Parameters:</h5>
                    <p className="text-xs text-slate-300">
                      Planned Horizon: <span className="text-white font-medium">{answers.planningTerm || 'Flexible'}</span> • Target Budget: <span className="text-white font-medium">{answers.approxBudget || 'Flexible'}</span>
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-white/10">
                  {getTranslation(language, 'quizDisclaimer')}
                </div>
              </div>

              {/* Handoff Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleProceedToConsultation}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#DFCA9B] via-[#C5A46D] to-[#9F7E47] text-[#10243A] font-bold text-sm rounded-xl shadow-lg hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{getTranslation(language, 'requestConsultationBtn')}</span>
                </button>

                <button
                  onClick={handleRetake}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-sm font-medium rounded-xl border border-white/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{getTranslation(language, 'retakeQuiz')}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
