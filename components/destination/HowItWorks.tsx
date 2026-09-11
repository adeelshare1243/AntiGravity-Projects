'use client';

import React from 'react';
import Link from 'next/link';

export const HowItWorks: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-8 md:gap-11 w-full">
      {/* Title */}
      <h2 className="text-2xl md:text-[36px] font-bold text-[#000000] tracking-tight leading-tight text-center">
        How eSIM Works
      </h2>

      {/* 3-Column Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 w-full">
        {/* Card 1 */}
        <div className="bg-[#F7F7F7] border border-[#E8E5DD] rounded-[24px] overflow-hidden flex flex-col">
          {/* Top Blue Image Section */}
          <div className="bg-[#5774CD] h-[200px] w-full flex justify-center items-start pt-[32px] overflow-hidden relative">
            <img
              src="/assets/destination/step-phone.png"
              alt="Choose Your Plan Mockup"
              className="w-[228px] max-w-none shrink-0 drop-shadow-xl select-none pointer-events-none"
            />
          </div>

          {/* Bottom Text Section */}
          <div className="p-[24px] flex flex-col gap-[8px] flex-1">
            <span className="text-sm font-bold text-[#F88B35] uppercase tracking-wider">
              STEP 1
            </span>
            <h3 className="text-xl font-semibold text-black tracking-tight">
              Choose Your Plan
            </h3>
            <p className="text-base font-medium text-gray-800 leading-[1.4em]">
              Browse 190+ countries and pick the perfect data plan — from daily passes to unlimited packages.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#F7F7F7] border border-[#E8E5DD] rounded-[24px] overflow-hidden flex flex-col">
          {/* Top Blue Image Section */}
          <div className="bg-[#5774CD] h-[200px] w-full flex justify-center items-start pt-[32px] overflow-hidden relative">
            <img
              src="/assets/destination/step-phone.png"
              alt="Scan & Install Mockup"
              className="w-[228px] max-w-none shrink-0 drop-shadow-xl select-none pointer-events-none"
            />
          </div>

          {/* Bottom Text Section */}
          <div className="p-[24px] flex flex-col gap-[8px] flex-1">
            <span className="text-sm font-bold text-[#F88B35] uppercase tracking-wider">
              STEP 2
            </span>
            <h3 className="text-xl font-semibold text-black tracking-tight">
              Scan & Install
            </h3>
            <p className="text-base font-medium text-gray-800 leading-[1.4em]">
              Get your QR code instantly after purchase. Scan it with your phone camera and activate in seconds.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#F7F7F7] border border-[#E8E5DD] rounded-[24px] overflow-hidden flex flex-col">
          {/* Top Blue Image Section */}
          <div className="bg-[#5774CD] h-[200px] w-full flex justify-center items-start pt-[32px] overflow-hidden relative">
            <img
              src="/assets/destination/step-phone.png"
              alt="Connect & Enjoy Mockup"
              className="w-[228px] max-w-none shrink-0 drop-shadow-xl select-none pointer-events-none"
            />
          </div>

          {/* Bottom Text Section */}
          <div className="p-[24px] flex flex-col gap-[8px] flex-1">
            <div className="flex justify-between w-full items-center">
              <span className="text-sm font-bold text-[#F88B35] uppercase tracking-wider">
                STEP 3
              </span>
              <Link
                href="/how-it-works"
                className="text-sm font-semibold text-black underline uppercase hover:opacity-80 transition-opacity"
              >
                LEARN MORE
              </Link>
            </div>
            <h3 className="text-xl font-semibold text-black tracking-tight">
              Connect & Enjoy
            </h3>
            <p className="text-base font-medium text-gray-800 leading-[1.4em]">
              Land at your destination and you&apos;re instantly online. High-speed 4G/5G, no surprise roaming charges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
