'use client';

import React from 'react';
import Image from 'next/image';

const FEATURES = [
  {
    icon: '/assets/icons/zap.svg',
    title: 'Instant Connectivity Anywhere',
    description:
      'Stay connected the moment you land. Activate your digital eSIM instantly with zero physical SIM cards needed.',
  },
  {
    icon: '/assets/icons/globe.svg',
    title: 'Coverage in 200+ Countries',
    description:
      'Enjoy high-speed, reliable data across the globe with partnerships spanning top local tier-1 network providers.',
  },
  {
    icon: '/assets/icons/credit-card.svg',
    title: 'Affordable & Transparent',
    description:
      'Clear upfront pricing with absolutely no hidden fees, unexpected roaming charges, or surprise bills.',
  },
  {
    icon: '/assets/icons/phone.svg',
    title: '24/7 Live Customer Support',
    description:
      'Travel with peace of mind. Our dedicated support team is always online to help you, wherever you are in the world.',
  },
];

export const FeaturesGrid: React.FC = () => {
  return (
    <section className="py-[60px] bg-[#F7F7F7]">
      <div className="mx-auto max-w-[1062px] px-4 sm:px-6 lg:px-8 flex flex-col gap-[56px]">
        <div className="flex flex-col gap-[12px] items-center text-center max-w-[800px] mx-auto">
          <div className="bg-[#FFFFFF] px-[12px] py-[6px] rounded-[100px]">
            <span className="text-[12px] font-[600] uppercase text-[#FD521B] tracking-wider">WHY BRAND</span>
          </div>
          <h2 className="text-[32px] font-[700] text-[#000000] tracking-tight">
            Travel Connected, Without the Brand
          </h2>
          <p className="text-[14px] font-[400] text-[#4B5675] leading-[1.4em]">
            Say goodbye to physical SIM cards, expensive roaming fees, and long airport lines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
          {FEATURES.map((item, idx) => {
            const iconSrc = [
              '/assets/icon_zap.svg',
              '/assets/globe.svg',
              '/assets/icon_credit_card.svg',
              '/assets/globe.svg'
            ][idx];

            return (
              <div
                key={item.title}
                className="bg-transparent flex flex-col items-center text-center gap-[24px]"
              >
                <div className="bg-[#FFF9F5] border-[8px] border-[rgba(248,139,53,0.2)] rounded-[24px] w-[48px] h-[48px] flex items-center justify-center shrink-0">
                  <img src={iconSrc} alt="" className="w-[24px] h-[24px]" />
                </div>
                <div className="flex flex-col gap-[8px]">
                  <h3 className="text-[16px] font-[600] text-[#000000] leading-[1.4em]">{item.title}</h3>
                  <p className="text-[14px] font-[400] text-[#4B5675] leading-[1.4em]">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
