'use client';

import React, { useState } from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import { Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'Popular',
    question: 'What is a travel eSIM and how does it work?',
    answer: 'An eSIM (embedded SIM) is a digital SIM built directly into your smartphone software. Instead of physically inserting a plastic SIM card, you simply scan a QR code to download cellular profile details and access local high-speed data networks worldwide.',
  },
  {
    category: 'Popular',
    question: 'How do I know if my smartphone is compatible with eSIM?',
    answer: 'Most modern smartphones released from 2018 onwards support eSIM technology. This includes iPhone XS, 11, 12, 13, 14, 15, 16 series, Google Pixel 3 and newer, Samsung Galaxy S20 series and newer, as well as many newer iPad and Android models.',
  },
  {
    category: 'Europe',
    question: 'How does a regional Europe eSIM work across multiple countries?',
    answer: 'Our Europe eSIM automatically connects to top local telecom providers (e.g., Vodafone, Orange, Deutsche Telekom) as soon as you cross borders within the EU, UK, and Switzerland — no need to change SIM cards or settings.',
  },
  {
    category: 'Asia',
    question: 'Does the Asia eSIM cover high-speed 5G in Japan and South Korea?',
    answer: 'Yes! Our Asia regional pass includes high-speed 4G/5G data networks in Japan, South Korea, Singapore, Thailand, Vietnam, and over 15 other Asian destinations.',
  },
  {
    category: 'North America',
    question: 'Can I use hotspot sharing with a USA or Canada eSIM?',
    answer: 'Yes, personal hotspot and data tethering are fully supported across all USA, Canada, and Mexico data plans at no extra charge.',
  },
  {
    category: 'South America',
    question: 'When should I activate my South America eSIM plan?',
    answer: 'We recommend installing your eSIM on home Wi-Fi right before departure. Turn on Data Roaming when you arrive in Brazil, Argentina, Chile, or Colombia to instantly connect.',
  },
  {
    category: 'Caribbean',
    question: 'Which islands are included in the Caribbean eSIM pass?',
    answer: 'The Caribbean eSIM pass covers popular destinations including Jamaica, Bahamas, Barbados, Dominican Republic, Puerto Rico, and over 20 other Caribbean territories.',
  },
  {
    category: 'Africa',
    question: 'Are data speeds throttled on Africa regional eSIMs?',
    answer: 'No, we provide unthrottled high-speed 4G LTE data on premium tier-1 mobile carriers in South Africa, Egypt, Morocco, Kenya, and more.',
  },
  {
    category: 'Middle East',
    question: 'Will my eSIM work immediately upon landing in Dubai or Qatar?',
    answer: 'Yes! Simply toggle Data Roaming to "On" once your plane lands in the UAE, Qatar, Saudi Arabia, or Jordan for immediate 5G connectivity.',
  },
  {
    category: 'Oceania',
    question: 'Can I top up my Australia and New Zealand eSIM if I need more data?',
    answer: 'Yes, you can easily top up your data plan anytime directly from your customer dashboard or account page without installing a new QR code.',
  },
];

const CATEGORIES = [
  'Popular',
  'Europe',
  'Asia',
  'North America',
  'South America',
  'Caribbean',
  'Africa',
  'Middle East',
  'Oceania',
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('Popular');
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'Popular' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-white text-[#252F4A] flex flex-col justify-between font-sans antialiased">
      <div>
        <Navbar />

        {/* 1. HERO SECTION (Clean White Theme) */}
        <section className="pt-12 md:pt-16 pb-6 px-4 md:px-8 max-w-4xl mx-auto text-center">
          <h1 className="text-[36px] sm:text-[44px] font-[800] text-[#252F4A] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-[16px] text-slate-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Find answers to common questions about eSIM, installation, payments, and more.
          </p>

          {/* 2. CLEAN SEARCH BAR */}
          <div className="relative max-w-2xl mx-auto mt-8">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-xl text-[#252F4A] placeholder-slate-400 focus:outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36] transition-all text-base shadow-xs"
            />
          </div>
        </section>

        {/* 3. APP DOWNLOAD BANNER SECTION */}
        <section className="px-4 md:px-8 mt-6 mb-12">
          <div className="w-full max-w-[1062px] mx-auto rounded-[32px] overflow-hidden bg-gradient-to-r from-[#FF5A00] via-[#F79E1B] to-[#FF5A00] shadow-[0px_16px_32px_rgba(3,10,62,0.12549)] p-8 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content Column (50%) */}
              <div className="flex flex-col items-start gap-6 text-left z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-[40px] lg:leading-[48px] font-[800] tracking-[-1px] text-white">
                  Download Our App for an Easy eSIM Experience
                </h2>
                <p className="text-sm sm:text-base lg:text-[16px] leading-[140%] font-[400] text-white/95">
                  Get the Soovia app and stay connected wherever you go — buy, manage, and activate your eSIM plans on the go.
                </p>

                {/* Store Buttons Container */}
                <div className="flex flex-row flex-wrap items-center gap-[12px] pt-2">
                  {/* Google Play Store Button */}
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-row items-center gap-[8px] px-[16px] py-[11px] h-[44px] bg-white rounded-[12px] hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <svg className="w-[24px] h-[24px] shrink-0" viewBox="0 0 512 512">
                      <path fill="#41A5EE" d="M382.9 240.5l-275-161.4C90.3 68.9 76 77.2 76 96v320c0 18.8 14.3 27.1 31.9 16.9l275-161.4c16.1-9.5 16.1-21.5 0-31z"/>
                      <path fill="#00E676" d="M307.9 256l-195-195c-7-7-16.9-8.6-25-4.1l220 220 22-20.9z"/>
                      <path fill="#FF3D00" d="M307.9 256l-220 220c8.1 4.5 18 2.9 25-4.1l195-195-22-20.9z"/>
                      <path fill="#FFC107" d="M382.9 240.5l-75 44.1 22 20.9 53-53c16.1-9.5 16.1-21.5 0-32z"/>
                    </svg>
                    <span className="text-[14px] font-[600] leading-[140%] text-[#252F4A] whitespace-nowrap">Play Store</span>
                  </a>

                  {/* Apple App Store Button */}
                  <a
                    href="https://apple.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-row items-center gap-[8px] px-[16px] py-[11px] h-[44px] bg-white rounded-[12px] hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <svg className="w-[24px] h-[24px] shrink-0 fill-current text-[#000000]" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.03 1.92-14.58-6.15-3.04-2.64-6.93-7.26-11.67-13.86-5.87-8.17-10.47-17.15-13.8-26.96-3.33-9.8-5-19.16-5-28.08 0-13.06 3.23-24.08 9.7-33.06 6.46-8.98 14.77-13.57 24.91-13.78 4.48 0 9.47 1.15 14.97 3.44 5.5 2.3 9.29 3.45 11.37 3.45 1.83 0 5.72-1.2 11.67-3.6 5.95-2.4 10.87-3.52 14.76-3.35 11.03.49 19.82 4.67 26.37 12.54-9.76 5.88-14.5 13.97-14.23 24.28.27 7.95 3.28 14.65 9.03 20.1 5.76 5.45 12.7 8.44 20.83 8.97-2.45 7.18-5.77 14.37-9.97 21.57zm-26.68-101.44c0 6.09-2.22 11.95-6.66 17.58-5.18 6.44-11.45 10.05-18.8 10.83-.27-1.08-.41-2.18-.41-3.3 0-6.19 2.4-12.33 7.21-18.42 4.8-6.09 11.12-9.77 18.96-11.04.14.78.2 1.58.2 2.35z"/>
                    </svg>
                    <span className="text-[14px] font-[600] leading-[140%] text-[#252F4A] whitespace-nowrap">App Store</span>
                  </a>
                </div>
              </div>

              {/* Right Image Column (50%) */}
              <div className="flex items-center justify-center lg:justify-end w-full">
                <img
                  src="/assets/right-mockups-container.png"
                  alt="App Banner Mockups"
                  className="w-full max-w-[480px] h-auto object-contain drop-shadow-2xl pointer-events-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4. CATEGORY TABS / REGIONAL FILTERS */}
        <section className="w-full">
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 w-full max-w-5xl mx-auto px-4 mt-8 mb-12">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenIndex(0);
                  }}
                  className={`whitespace-nowrap flex-shrink-0 px-4 py-2 rounded-lg text-sm md:text-base transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#252F4A] text-white shadow-xs font-semibold'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 font-medium'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. ACCORDION SECTION (Clean & Minimal) */}
        <section className="px-4 md:px-8 max-w-4xl mx-auto mb-12">
          <div className="space-y-3">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-white border border-slate-100 rounded-xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left font-semibold text-[#252F4A] text-base sm:text-lg hover:bg-slate-50/50 transition-colors"
                    >
                      <span className="pr-4 leading-snug">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#252F4A]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="bg-slate-50 text-slate-500 p-5 rounded-b-xl border-t border-slate-100 text-sm sm:text-base leading-relaxed animate-in fade-in duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                <p className="text-slate-500 font-medium mb-2">No questions found matching "{searchQuery}"</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('Popular');
                  }}
                  className="text-sm text-[#FF5A36] font-semibold underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* 6. BOTTOM "STILL HAVE A QUESTION?" SECTION */}
          <div className="flex flex-col items-center justify-center text-center mt-12 mb-16 gap-3">
            <h3 className="text-xl sm:text-2xl font-bold text-[#252F4A]">
              Still have a question?
            </h3>
            <p className="text-slate-500 text-sm sm:text-base max-w-md mb-2">
              Can't find the answer you're looking for? Reach out to our support team or explore our help articles.
            </p>

            {/* 2 Buttons in a Single Row */}
            <div className="flex flex-row items-center justify-center gap-4">
              {/* Main button: Visit Help Center */}
              <Link
                href="/help"
                className="px-6 py-3 bg-[#FF5A36] hover:bg-[#E04822] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap"
              >
                Visit Help Center
              </Link>

              {/* Second button: Contact Us */}
              <Link
                href="/support"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-[#252F4A] border border-slate-200 font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
