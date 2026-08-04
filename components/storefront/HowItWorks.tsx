'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const STEPS = [
  {
    step: 'STEP 1',
    title: 'Choose Your Plan',
    description:
      'Browse 190+ countries and pick the perfect data plan — from daily passes to unlimited packages.',
    hasLearnMore: false,
  },
  {
    step: 'STEP 2',
    title: 'Scan & Install',
    description:
      'Get your QR code instantly after purchase. Scan it with your phone camera and activate in seconds.',
    hasLearnMore: false,
  },
  {
    step: 'STEP 3',
    title: 'Connect & Enjoy',
    description:
      "Land at your destination and you're instantly online. High-speed 4G/5G, no surprise roaming charges.",
    hasLearnMore: true,
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 lg:py-[100px] bg-[#FFFFFF]">
      <div className="mx-auto max-w-[1062px] px-4 sm:px-6 lg:px-8 flex flex-col gap-[44px]">
        <h2 className="text-[36px] font-[700] text-[#000000] tracking-tight text-center">
          How eSIM Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="bg-[#F7F7F7] border border-[#E8E5DD] rounded-[24px] overflow-hidden flex flex-col"
            >
              <div className="bg-[#5774CD] h-[200px] relative flex items-start justify-center overflow-hidden py-[32px] rounded-t-[16px]">
                <img
                  src="/assets/iphone_mockup.png"
                  alt={`${item.title} illustration`}
                  className="w-[228px] h-[466px] object-cover object-top"
                />
              </div>

              <div className="p-[24px] flex flex-col gap-[8px]">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-[600] text-[#252F4A]">{item.step}</span>
                  {item.hasLearnMore && (
                    <Link
                      href="/how-it-works"
                      className="text-[14px] font-[600] text-[#000000] underline hover:text-[#FD521B] transition-colors"
                    >
                      LEARN MORE
                    </Link>
                  )}
                </div>
                <h3 className="text-[20px] font-[600] text-[#000000] leading-[1.4em]">{item.title}</h3>
                <p className="text-[16px] font-[500] text-[#000000] leading-[1.4em]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
