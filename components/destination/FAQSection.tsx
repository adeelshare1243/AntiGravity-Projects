'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  countryName?: string;
  destinationName?: string;
  isGlobal?: boolean;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  countryName,
  destinationName,
  isGlobal = false,
}) => {
  const name = destinationName || countryName || 'Turkey';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const FAQS: FAQItem[] = isGlobal
    ? [
        {
          question: 'What is a Global eSIM and how does it work?',
          answer:
            'An eSIM (embedded SIM) is a digital SIM card built directly into your smartphone hardware. With our Global eSIM, you connect seamlessly to Tier-1 local carrier networks across 140+ countries without swapping physical SIM cards or paying exorbitant roaming fees.',
        },
        {
          question: 'When should I install my Global eSIM?',
          answer:
            'We recommend installing your Global eSIM 1–2 days before your departure while connected to stable Wi-Fi. The validity period begins only when your eSIM connects to a supported local carrier in one of the 140+ destination countries.',
        },
        {
          question: 'Can I travel between countries without resetting my plan?',
          answer:
            'Yes! As you travel across borders, your smartphone automatically switches to the best local partner network without any interruption, plan resets, or manual profile reconfiguration.',
        },
        {
          question: 'Can I keep my WhatsApp and original phone number?',
          answer:
            'Yes! Installing a data eSIM does not alter your WhatsApp account or physical SIM. You will continue to message, call, and receive verification codes on WhatsApp using your existing phone number without interruption.',
        },
        {
          question: 'Is hotspot and personal tethering supported?',
          answer:
            'Yes, personal hotspot and data tethering are fully supported on all our Global eSIM packages. You can freely share your connection with your laptop, tablet, or travel companions.',
        },
        {
          question: 'What should I do if I run out of data?',
          answer:
            'You can top up your existing Global eSIM profile at any time directly through your Soovia account dashboard without needing to scan a new QR code or configure new settings.',
        },
      ]
    : [
        {
          question: `What is an eSIM and how does it work in ${name}?`,
          answer: `An eSIM (embedded SIM) is a digital SIM card built directly into your smartphone hardware. Instead of inserting a physical plastic chip, you simply scan a QR code to download the profile. Once installed, your phone connects directly to local high-speed cellular networks in ${name} for mobile data without roaming charges.`,
        },
        {
          question: `When should I install my ${name} eSIM?`,
          answer: `We recommend installing your eSIM 1–2 days before your departure while you have a stable Wi-Fi connection. Keep the eSIM line turned off until you land in ${name}. Your validity period only begins once the eSIM connects to a supported local cellular network.`,
        },
        {
          question: `Can I keep my WhatsApp and original phone number?`,
          answer: `Yes! Installing a data eSIM does not change your WhatsApp account or physical SIM. You will continue to message, call, and receive verification codes on WhatsApp using your existing phone number without any interruption.`,
        },
        {
          question: `Is hotspot and personal tethering supported?`,
          answer: `Yes, personal hotspot and data tethering are fully supported on all our ${name} eSIM packages. You can share your high-speed connection with your laptop, tablet, or travel companions.`,
        },
        {
          question: `What should I do if I run out of data in ${name}?`,
          answer: `You can top up your existing eSIM profile at any time directly through your Soovia account dashboard without needing to scan a new QR code or configure new settings.`,
        },
      ];

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex flex-col items-center gap-8 md:gap-11 w-full">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-2 max-w-[650px]">
        <h2 className="text-2xl md:text-[36px] font-bold text-[#000000] tracking-tight leading-tight">
          {isGlobal ? 'Global Travel eSIM FAQ' : `${name} Travel eSIM FAQ`}
        </h2>
        <p className="text-sm md:text-base font-medium text-[#4B5675]">
          {isGlobal
            ? 'Everything you need to know about setting up and using your Global eSIM.'
            : `Everything you need to know about setting up and using your eSIM in ${name}.`}
        </p>
      </div>

      {/* Accordion FAQ List */}
      <div className="flex flex-col gap-3.5 w-full">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={faq.question}
              className={`rounded-[16px] transition-all overflow-hidden border ${
                isOpen
                  ? 'bg-[#F7F7F7] border-[#EDEDED] shadow-xs'
                  : 'bg-[#F7F7F7] border-transparent hover:border-[#EDEDED]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer gap-4"
              >
                <span className="text-base font-bold text-[#252F4A]">
                  {faq.question}
                </span>

                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#252F4A] shrink-0 shadow-2xs">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#F88B35]" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-sm text-[#4B5675] leading-relaxed border-t border-[#EDEDED]/60">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQSection;
