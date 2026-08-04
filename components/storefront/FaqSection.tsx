'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'What is an eSIM?',
    answer:
      'An eSIM (embedded SIM) is a digital SIM card built into your phone\'s hardware. It lets you activate a cellular data plan from a provider without having to use a physical SIM card. You can install an eSIM by scanning a QR code, and be connected to local networks in seconds.',
  },
  {
    question: 'How do I install an eSIM?',
    answer:
      'Installing an eSIM takes under 2 minutes. After purchasing, open your phone settings, go to Cellular/Mobile Data > Add eSIM, and scan the QR code received in your email.',
  },
  {
    question: 'Can I use eSIM and my regular SIM at the same time?',
    answer:
      'Yes! Dual SIM technology lets you keep your primary physical SIM active for calls & SMS while using your travel eSIM for affordable data.',
  },
  {
    question: 'Is my phone compatible with eSIM?',
    answer:
      'Most modern smartphones released since 2018 (including iPhone XS and newer, Samsung Galaxy S20+, Google Pixel 3+) support eSIM technology.',
  },
  {
    question: 'Can I make phone calls with an eSIM?',
    answer:
      'Our eSIM travel passes focus on high-speed data. You can make crystal-clear calls and messages using WhatsApp, FaceTime, Skype, or Telegram.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-[60px] bg-[#FFFFFF]">
      <div className="mx-auto max-w-[1062px] px-4 sm:px-6 lg:px-8 space-y-[44px]">
        {/* Section Heading */}
        <div className="text-center">
          <h2 className="text-[36px] font-[700] text-[#000000] tracking-tight">
            Travel eSIM FAQ
          </h2>
        </div>

        {/* Accordion Cards */}
        <div className="space-y-[12px]">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-[#F7F7F7] rounded-[16px] border border-[#F7F7F7] p-[20px] transition-all flex flex-col gap-[12px]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left font-[700] text-[16px] text-[#000000] hover:text-[#FD521B] transition-colors"
                >
                  <span>{item.question}</span>
                  <img
                    src="/assets/chevron_down.svg"
                    alt=""
                    className={`w-[16px] h-[16px] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="text-[14px] font-[400] text-[#4B5675] leading-[1.4em] pt-[4px]">
                    {item.answer}
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

export default FaqSection;
