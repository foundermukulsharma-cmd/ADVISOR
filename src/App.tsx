/**
 * Sarla Hooda LIC Insurance Consultant Website & Smart CRM
 * Production Application Root Component
 */

import React, { useState, useEffect } from 'react';
import { Language, WebsiteContent, QuizAnswers } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ContactPopup } from './components/ContactPopup';
import { QuickActionBar } from './components/QuickActionBar';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { QuizSection } from './components/QuizSection';
import { ConsultationForm } from './components/ConsultationForm';
import { TrustSection } from './components/TrustSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { QrCodeModal } from './components/QrCodeModal';
import { LegalModal } from './components/LegalModals';
import { AdminPortal } from './components/admin/AdminPortal';
import { api } from './services/api';

// Instant initial fallback content
const defaultContent: WebsiteContent = {
  advisor: {
    name: 'Sarla Hooda',
    profession: 'LIC Insurance Advisor',
    achievement: 'MDRT Qualified',
    clientBase: '700+ clients',
    phone: '+91 93503 04831',
    whatsapp: '+91 93503 04831',
    emailPlaceholder: 'sarla.licadvisor@example.com',
    officeAddressPlaceholder: 'Serving Rohtak, Jhajjar, Delhi NCR & Nationwide Clients',
    photoUrl: '/src/assets/images/sarla_hooda_portrait_1791952882178.jpg',
    heroHeadlineEn: "Your Family’s Future Deserves Thoughtful Protection.",
    heroHeadlineHi: "आपके परिवार का भविष्य सही सुरक्षा का हकदार है।",
    heroSubtitleEn: "Personalized life insurance, retirement pension security, and children's higher education corpus advised by MDRT Qualified LIC Consultant Sarla Hooda.",
    heroSubtitleHi: "एमडीआरटी योग्य एलआईसी सलाहकार सरला हुड्डा द्वारा आपके परिवार की जीवन सुरक्षा, सेवानिवृत्ति और बच्चों की उच्च शिक्षा के लिए सोच-समझकर बनाई गई योजनाएँ।",
    aboutTextEn: "Sarla Hooda is an MDRT (Million Dollar Round Table) qualified Life Insurance Corporation of India (LIC) advisor with a dedicated portfolio of over 700 protected families.",
    aboutTextHi: "सरला हुड्डा भारतीय जीवन बीमा निगम (एलआईसी) की एमडीआरटी क्वालिफाइड सलाहकार हैं, जिनके मार्गदर्शन में 700 से अधिक परिवार वित्तीय रूप से सुरक्षित हैं।",
    coldLeadDaysThreshold: 14,
    publicUrl: window.location.href
  },
  services: [
    {
      id: 'srv_1',
      titleEn: 'Term & Pure Life Protection',
      titleHi: 'टर्म व पूर्ण जीवन सुरक्षा योजना',
      taglineEn: 'Maximum financial shield for your dependents',
      taglineHi: 'आपके आश्रितों के लिए सबसे बड़ा सुरक्षा कवच',
      descEn: 'Affordable high-coverage life insurance ensuring your family’s lifestyle, home loan clearance, and dignity remain intact in unforeseen events.',
      descHi: 'किफायती प्रीमियम में बड़ा लाइफ कवर ताकि किसी भी अनहोनी की स्थिति में परिवार की आर्थिक स्थिति, बच्चों की परवरिश और घर का खर्च सुरक्षित रहे।',
      licCategories: ['LIC Tech Term', 'LIC Yuva Term', 'LIC Jeevan Amar'],
      keyHighlightsEn: ['High sum assured at optimal premium', 'Accidental death & disability riders available', 'Smoker/non-smoker differentiated rates'],
      keyHighlightsHi: ['किफायती दर पर उच्च सुरक्षा राशि', 'दुर्घटना लाभ एवं डिसेबिलिटी राइडर उपलब्ध', 'महिला प्रस्तावकों के लिए विशेष रियायती दरें'],
      icon: 'ShieldCheck',
      badge: 'High Priority'
    },
    {
      id: 'srv_2',
      titleEn: "Child Future & Higher Education",
      titleHi: "बच्चों का भविष्य व उच्च शिक्षा कोष",
      taglineEn: "Guaranteed milestones for university and career",
      taglineHi: "कॉलेज, विदेश पढ़ाई और करियर के लिए समय पर फंड",
      descEn: 'Disciplined savings with Premium Waiver Benefit (PWB) ensuring your child’s educational fund matures as planned even if the parent is not around.',
      descHi: 'प्रीमियम वेवर बेनिफिट (PWB) के साथ अनुशासित योजना, जिससे माता-पिता के न रहने पर भी बच्चे की शिक्षा और भविष्य का फंड समय पर मिलता है।',
      licCategories: ['LIC Amritbaal', 'LIC Jeevan Tarun', 'LIC SIIP'],
      keyHighlightsEn: ['Premium waiver benefit if guardian passes away', 'Guaranteed maturity additions', 'Flexible payout options tailored to college years'],
      keyHighlightsHi: ['अभिभावक के न रहने पर भविष्य के सभी प्रीमियम माफ', 'सुनिश्चित बोनस व मैच्योरिटी लाभ', 'उच्च शिक्षा के वर्षों के अनुसार किस्तों में भुगतान'],
      icon: 'GraduationCap',
      badge: 'Popular'
    },
    {
      id: 'srv_3',
      titleEn: 'Retirement & Guaranteed Lifelong Pension',
      titleHi: 'सेवानिवृत्ति व आजीवन निश्चित पेंशन',
      taglineEn: 'Dignified monthly income with zero market risk',
      taglineHi: 'बिना किसी बाजार जोखिम के हर महीने सम्मानजनक पेंशन',
      descEn: 'Lock in guaranteed lifelong annuities with return of purchase price to nominees, protecting your independence throughout retired life.',
      descHi: 'सेवानिवृत्ति के बाद हर महीने निश्चित पेंशन ताकि आपको कभी किसी के आगे हाथ न फैलाना पड़े, साथ ही नॉमिनी को मूलधन वापसी की सुविधा।',
      licCategories: ['LIC Saral Pension', 'LIC Jeevan Shanti', 'LIC Jeevan Utsav'],
      keyHighlightsEn: ['Guaranteed annuity rates locked for life', 'Single premium or regular savings options', 'Joint life annuity with spouse coverage'],
      keyHighlightsHi: ['आजीवन एक समान निश्चित पेंशन दर', 'एकमुश्त या नियमित किस्तों में निवेश की सुविधा', 'पति-पत्नी के लिए संयुक्त पेंशन विकल्प'],
      icon: 'Coins',
      badge: 'Recommended'
    },
    {
      id: 'srv_4',
      titleEn: 'Guaranteed Savings & Endowment',
      titleHi: 'सुरक्षित बचत व एंडोमेंट योजनाएँ',
      taglineEn: 'Wealth accumulation with safe sovereign backing',
      taglineHi: 'संप्रभु गारंटी के साथ सुरक्षित धन वृद्धि',
      descEn: 'Traditional endowment plans combining safe capital growth, annual declared bonuses, and long-term liquidity for family milestones.',
      descHi: 'सुरक्षित पूंजी वृद्धि, वार्षिक बोनस और आपातकालीन जरूरतों के लिए लोन सुविधा के साथ विश्वसनीय पारंपरिक योजनाएँ।',
      licCategories: ['LIC Jeevan Labh', 'LIC Jeevan Umang', 'LIC Bima Jyoti'],
      keyHighlightsEn: ['Limited premium payment options', 'Government sovereign guarantee on sum assured', 'Policy loan facility available after 2 years'],
      keyHighlightsHi: ['सीमित वर्षों तक ही प्रीमियम भरने की सुविधा', 'पॉलिसी पर भारत सरकार की संप्रभु गारंटी', '2 वर्ष बाद आसान पॉलिसी लोन सुविधा'],
      icon: 'PiggyBank'
    },
    {
      id: 'srv_5',
      titleEn: 'Policy Servicing & Claims Assistance',
      titleHi: 'पॉलिसी सर्विसिंग व क्लेम सहायता',
      taglineEn: 'End-to-end guidance for existing and old policies',
      taglineHi: 'पुरानी पॉलिसियों के लिए संपूर्ण सहायता',
      descEn: 'Assistance with revival of lapsed policies, nominee updates, NEFT registration, maturity settlements, and seamless death claim documentation.',
      descHi: 'बंद पड़ी पॉलिसी को दोबारा चालू करना, नॉमिनी का नाम बदलना, बैंक खाता (NEFT) जोड़ना, मैच्योरिटी और क्लेम दस्तावेजों में पूर्ण सहायता।',
      licCategories: ['Maturity Claim', 'Nominee Death Claim', 'Policy Revival', 'NEFT Setup'],
      keyHighlightsEn: ['Doorstep document collection where feasible', 'Status verification on official portal', 'Zero hassle claim resolution'],
      keyHighlightsHi: ['घर बैठे दस्तावेजों की जांच व मार्गदर्शन', 'पोर्टल पर तुरंत पॉलिसी स्टेटस जांच', 'क्लेम के समय परिजनों को व्यक्तिगत सहयोग'],
      icon: 'FileHeart'
    }
  ],
  faqs: [
    {
      id: 'faq_1',
      category: 'General',
      questionEn: 'How can Sarla Hooda help me choose the right LIC policy?',
      questionHi: 'सरला हुड्डा मुझे सही एलआईसी पॉलिसी चुनने में कैसे मदद करती हैं?',
      answerEn: 'As an MDRT-qualified consultant, Sarla conducts a thorough financial need analysis based on your age, dependents, cash flow, and timeline. She recommends specific categories without pushy sales tactics or unrealistic return promises.',
      answerHi: 'एक एमडीआरटी क्वालिफाइड सलाहकार के रूप में, सरला जी आपकी उम्र, परिवार की जिम्मेदारी, आय और समय सीमा का विश्लेषण करती हैं। वह बिना किसी दबाव या झूठे वादों के आपकी जरूरत के अनुसार सही योजना सुझाती हैं।'
    },
    {
      id: 'faq_2',
      category: 'Servicing',
      questionEn: 'Can Sarla Hooda assist me with an existing LIC policy bought elsewhere?',
      questionHi: 'क्या सरला जी मेरी पहले से चल रही पुरानी एलआईसी पॉलिसी में मदद कर सकती हैं?',
      answerEn: 'Yes! Sarla regularly helps policyholders with revival of lapsed policies, change of address, nominee registration, loan against policy, and maturity claim processing regardless of where you originally purchased it.',
      answerHi: 'जी हाँ! यदि आपकी कोई पुरानी पॉलिसी बंद हो गई है, पता बदलना है, नॉमिनी का नाम जोड़ना है, पॉलिसी पर लोन लेना है या मैच्योरिटी क्लेम लेना है, तो सरला जी आपकी पूरी सहायता करेंगी।'
    },
    {
      id: 'faq_3',
      category: 'Claims',
      questionEn: 'What happens during a claim settlement? Does the advisor assist in person?',
      questionHi: 'क्लेम के समय क्या होता है? क्या सलाहकार व्यक्तिगत सहायता प्रदान करती हैं?',
      answerEn: 'Claim assistance is the hallmark of Sarla Hooda’s service. In the unfortunate event of a claim or upon policy maturity, she personally guides the family with document verification, submission to the branch, and follow-up until the settlement is credited directly to the nominee’s bank account.',
      answerHi: 'क्लेम के समय परिवार की मदद करना सरला हुड्डा की सबसे बड़ी प्राथमिकता है। किसी भी अनहोनी या मैच्योरिटी के समय वह आवश्यक दस्तावेज तैयार करवाने से लेकर बैंक खाते में राशि आने तक पूरा मार्गदर्शन करती हैं।'
    },
    {
      id: 'faq_4',
      category: 'Returns',
      questionEn: 'Are returns and benefits guaranteed in LIC policies?',
      questionHi: 'क्या एलआईसी पॉलिसियों में मिलने वाला लाभ सुनिश्चित होता है?',
      answerEn: 'Benefits depend on the specific plan chosen. Non-participating plans (like term plans, fixed annuity pension, or guaranteed addition plans) have exact guaranteed payouts stated in the policy bond. Participating plans include bonuses declared annually by LIC.',
      answerHi: 'लाभ योजना के प्रकार पर निर्भर करता है। गारंटीड योजनाओं (जैसे सरल पेंशन, टर्म प्लान या जीवन उत्सव) में नियम पॉलिसी बॉन्ड में पहले से तय होते हैं। पारंपरिक योजनाओं में एलआईसी द्वारा घोषित वार्षिक बोनस जुड़ता है।'
    }
  ],
  testimonials: [
    {
      id: 'tst_1',
      clientName: 'Sunil Verma',
      location: 'Rohtak, Haryana',
      serviceCategory: 'Child Higher Education Plan',
      policySince: '2019',
      commentEn: 'Sarla ji explained the child education plan with complete transparency. She never pressured us into a higher premium than we could afford. Her service during premium renewals is flawless.',
      commentHi: 'सरला जी ने हमारे बच्चे की उच्च शिक्षा की योजना को बहुत ही स्पष्टता से समझाया। उन्होंने कभी भी हमारी क्षमता से अधिक प्रीमियम का दबाव नहीं बनाया। उनकी सर्विस बहुत ही विश्वसनीय है।',
      consentConfirmed: true,
      rating: 5
    },
    {
      id: 'tst_2',
      clientName: 'Rajesh K. Malik',
      location: 'Jhajjar, Haryana',
      serviceCategory: 'Maturity Claim & Term Cover',
      policySince: '2015',
      commentEn: 'When my father’s old policy matured, we faced document issues with the branch. Sarla Hooda stepped in and got our claim settled within 10 days. Truly an MDRT professional.',
      commentHi: 'जब मेरे पिताजी की पुरानी पॉलिसी मैच्योर हुई तो बैंक शाखा में कुछ तकनीकी दिक्कत थी। सरला जी ने व्यक्तिगत रुचि लेकर केवल 10 दिनों में क्लेम दिलवाया।',
      consentConfirmed: true,
      rating: 5
    },
    {
      id: 'tst_3',
      clientName: 'Meenakshi Sharma',
      location: 'Delhi NCR',
      serviceCategory: 'Guaranteed Pension Plan',
      policySince: '2021',
      commentEn: 'We took a joint life pension plan after my husband retired. The monthly pension credits directly to our account without fail. Highly recommend her consultation.',
      commentHi: 'मेरे पति के रिटायरमेंट के बाद हमने संयुक्त पेंशन योजना ली। हर महीने निश्चित समय पर पेंशन खाते में आ जाती है। सरला जी का व्यवहार बहुत ही शालीन और मददगार है।',
      consentConfirmed: true,
      rating: 5
    }
  ],
  disclaimerEn: "Sarla Hooda is an independent licensed Insurance Advisor registered with the Life Insurance Corporation of India (LIC). This website is an independent client advisory and educational platform and does not constitute LIC's corporate web portal. Insurance is a subject matter of solicitation. Please read the official sales brochure carefully before concluding a sale.",
  disclaimerHi: "सरला हुड्डा भारतीय जीवन बीमा निगम (LIC) की एक स्वतंत्र अधिकृत बीमा सलाहकार हैं। यह वेबसाइट केवल स्वतंत्र ग्राहक परामर्श और मार्गदर्शन के लिए है, यह एलआईसी की मुख्य कॉर्पोरेट वेबसाइट नहीं है। बीमा आग्रह की विषय वस्तु है। कृपया किसी भी पॉलिसी को लेने से पहले आधिकारिक विवरणिका को ध्यानपूर्वक पढ़ें।",
  privacyNoticeEn: "We strictly respect your privacy. Personal information collected through enquiry forms is used solely to provide your requested insurance consultation and will never be sold, rented, or shared with unauthorized third parties.",
  privacyNoticeHi: "हम आपकी गोपनीयता का पूर्ण सम्मान करते हैं। परामर्श फॉर्म के माध्यम से एकत्र की गई जानकारी का उपयोग केवल आपकी बीमा सलाह के लिए किया जाता है और इसे किसी अन्य व्यक्ति या संस्था को नहीं दिया जाता।"
};

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      return (localStorage.getItem('sarla_hooda_lang') as Language) || 'en';
    } catch {
      return 'en';
    }
  });

  const [content, setContent] = useState<WebsiteContent>(defaultContent);
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);

  // Form handoff states
  const [selectedInterestForForm, setSelectedInterestForForm] = useState<string | undefined>(undefined);
  const [quizAnswersForForm, setQuizAnswersForForm] = useState<QuizAnswers | undefined>(undefined);
  const [quizSummaryForForm, setQuizSummaryForForm] = useState<string | undefined>(undefined);

  // Fetch updated content from server on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const remoteContent = await api.getContent();
        if (remoteContent && remoteContent.advisor) {
          setContent(remoteContent);
        }
      } catch (e) {
        // Fallback remains
      }
    };
    fetchContent();

    // Track real page visit
    api.trackEvent('page_view', { path: window.location.pathname }, 'browser', language);

    // Check if user navigated to /admin in URL hash or query
    if (window.location.hash === '#admin' || window.location.pathname.startsWith('/admin')) {
      setViewMode('admin');
    }
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('sarla_hooda_lang', newLang);
    } catch {}
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuizComplete = (answers: QuizAnswers, summaryText: string) => {
    setQuizAnswersForForm(answers);
    setQuizSummaryForForm(summaryText);
    if (answers.primaryRequirement) {
      setSelectedInterestForForm(answers.primaryRequirement);
    }
    scrollToSection('contact');
  };

  const handleSelectService = (serviceTitle: string) => {
    setSelectedInterestForForm(serviceTitle);
    scrollToSection('contact');
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#10243A]">
      {viewMode === 'admin' ? (
        <AdminPortal
          onBackToSite={() => setViewMode('public')}
          language={language}
          onLanguageChange={handleLanguageChange}
          content={content}
          onContentUpdated={newContent => setContent(newContent)}
        />
      ) : (
        <div className="relative">
          {/* Opening Contact Popup */}
          <ContactPopup language={language} content={content} />

          {/* Navigation Bar */}
          <Navbar
            language={language}
            onLanguageChange={handleLanguageChange}
            content={content}
            onOpenAdmin={() => setViewMode('admin')}
            onOpenConsultation={() => scrollToSection('contact')}
          />

          {/* Hero Section */}
          <Hero
            language={language}
            content={content}
            onOpenConsultation={() => scrollToSection('contact')}
            onExplorePlans={() => scrollToSection('services')}
            onOpenQr={() => setIsQrModalOpen(true)}
          />

          {/* About Section */}
          <AboutSection
            language={language}
            content={content}
            onOpenConsultation={() => scrollToSection('contact')}
          />

          {/* Services Section */}
          <ServicesSection
            language={language}
            content={content}
            onSelectService={handleSelectService}
          />

          {/* Interactive Consultation Quiz */}
          <QuizSection
            language={language}
            onCompleteQuiz={handleQuizComplete}
          />

          {/* Customer Enquiry Form */}
          <ConsultationForm
            language={language}
            content={content}
            initialInterest={selectedInterestForForm}
            initialQuizSummary={quizSummaryForForm}
            initialQuizAnswers={quizAnswersForForm}
          />

          {/* Authentic Client Trust Section */}
          <TrustSection language={language} content={content} />

          {/* FAQ Accordion */}
          <FaqSection language={language} content={content} />

          {/* Footer with Legal & Admin Links */}
          <Footer
            language={language}
            content={content}
            onOpenLegal={type => setLegalModalType(type)}
            onOpenAdmin={() => setViewMode('admin')}
          />

          {/* Mobile Bottom Quick Action Floating Bar */}
          <QuickActionBar
            language={language}
            content={content}
            onOpenQr={() => setIsQrModalOpen(true)}
          />

          {/* QR Code & NFC Modal */}
          <QrCodeModal
            isOpen={isQrModalOpen}
            onClose={() => setIsQrModalOpen(false)}
            content={content}
          />

          {/* Legal Modals (Privacy, Terms, Disclaimers) */}
          <LegalModal
            type={legalModalType}
            onClose={() => setLegalModalType(null)}
            language={language}
            content={content}
          />
        </div>
      )}
    </div>
  );
}
