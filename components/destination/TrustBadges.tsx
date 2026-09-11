'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col items-center gap-10 md:gap-14 w-full">
        {/* 1. Secure Payment Logos Row */}
        <div className="flex flex-col items-center gap-5 w-full">
          <h3 className="text-lg md:text-xl font-semibold text-[#252F4A]">
            Secure Payment
          </h3>

          <div className="flex items-center justify-center gap-8 md:gap-10 flex-wrap">
            <img
              src="/assets/destination/google-pay.svg"
              alt="Google Pay"
              className="h-7 md:h-8 object-contain"
            />
            <img
              src="/assets/destination/apple-pay.svg"
              alt="Apple Pay"
              className="h-7 md:h-8 object-contain"
            />
            <img
              src="/assets/destination/mastercard.svg"
              alt="Mastercard"
              className="h-6 md:h-7 object-contain"
            />
          </div>
        </div>

        {/* 2. Three Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
          {/* Money-Back Guarantee */}
          <div className="bg-[#F7F7F7] rounded-[16px] p-5 flex items-center gap-3.5 w-full">
            <img
              src="/assets/destination/wallet-guarantee.svg"
              alt="Money-Back Guarantee"
              className="w-7 h-7 shrink-0"
            />
            <div className="flex flex-col justify-between flex-1 gap-0.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#252F4A]">
                  Money-Back Guarantee
                </span>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  aria-label="Money Back Guarantee info"
                  className="cursor-pointer hover:opacity-70 transition-opacity p-0.5"
                >
                  <Info className="w-4 h-4 text-[#9CA3AF]" />
                </button>
              </div>
              <span className="text-xs font-normal text-[#4B5675]">
                Full refund if unused
              </span>
            </div>
          </div>

          {/* Secure Payment */}
          <div className="bg-[#F7F7F7] rounded-[16px] p-5 flex items-center gap-3.5 w-full">
            <img
              src="/assets/destination/badge-secure.svg"
              alt="Secure Payment"
              className="w-7 h-7 shrink-0"
            />
            <div className="flex flex-col justify-between flex-1 gap-0.5">
              <span className="text-sm font-bold text-[#252F4A]">
                Secure Payment
              </span>
              <span className="text-xs font-normal text-[#4B5675]">
                256-bit SSL · Powered by Stripe
              </span>
            </div>
          </div>

          {/* Instant Delivery */}
          <div className="bg-[#F7F7F7] rounded-[16px] p-5 flex items-center gap-3.5 w-full">
            <img
              src="/assets/destination/award-instant.svg"
              alt="Instant Delivery"
              className="w-7 h-7 shrink-0"
            />
            <div className="flex flex-col justify-between flex-1 gap-0.5">
              <span className="text-sm font-bold text-[#252F4A]">
                Instant Delivery
              </span>
              <span className="text-xs font-normal text-[#4B5675]">
                Connect in Minutes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Money-Back Guarantee Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[420px] bg-white rounded-[20px] p-6 shadow-2xl"
          >
            {/* Close Button (X) */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-5 right-5 cursor-pointer text-gray-500 hover:text-black transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Modal Title */}
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-3 pr-8">
              Money Back Guarantee
            </h3>

            {/* Modal Body Text */}
            <p className="text-[15px] text-gray-800 leading-relaxed">
              If your eSIM hasn&apos;t been installed or activated, you can request a full refund within 30 days of purchase. No questions asked.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TrustBadges;
