'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const DESTINATION_FAQS = [
  {
    question: 'Which countries and regions are covered?',
    answer:
      'We offer eSIM data plans in over 190 countries and territories worldwide. You can choose a single-country plan for a specific destination, a regional plan covering multiple countries in Europe, Asia, the Americas or other regions, or a global plan that works across 100+ countries. Browse the full list above to find your destination and see available plans.',
  },
  {
    question: 'What is the difference between country, regional, and global plans?',
    answer:
      'Single-country plans provide local data within one specific country, regional plans cover multiple neighboring countries under a single pass, and global plans keep you connected across 100+ countries worldwide.',
  },
  {
    question: 'How do I choose the right data plan for my trip?',
    answer:
      'Consider the length of your trip, expected data usage (navigation, video, social media), and whether you will be visiting one country or traveling through multiple countries in a region.',
  },
  {
    question: 'Do prices vary between countries?',
    answer:
      'Yes, prices depend on local carrier rates, regional data packages, and validity periods. Our plans start from as low as $1.50 for popular travel destinations.',
  },
  {
    question: 'Can I use an eSIM before I travel?',
    answer:
      'You can install the eSIM QR code prior to your trip using your home Wi-Fi, but the validity period only begins once your eSIM connects to a supported local network at your destination.',
  },
];

export default function DestinationsFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-4">
      <h2 className="text-center text-[32px] font-bold text-[#252F4A] mt-24 mb-10 tracking-tight">
        Destinations FAQ
      </h2>

      <div className="w-full max-w-[1140px] mx-auto mb-20 space-y-3">
        {DESTINATION_FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="w-full bg-white border border-slate-100 rounded-xl overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-[#252F4A] text-base sm:text-lg hover:bg-slate-50/50 transition-colors cursor-pointer"
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
        })}
      </div>
    </section>
  );
}
