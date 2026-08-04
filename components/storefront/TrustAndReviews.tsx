'use client';

import React from 'react';
import Image from 'next/image';

const REVIEWS = [
  {
    name: 'Sarah M.',
    role: 'Verified Traveler',
    comment:
      "Setting up was incredibly easy and the customer service was top-notch. I'd recommend it to anyone traveling abroad.",
    initial: 'S',
    avatarBg: 'bg-[#E8F5E9] text-[#2E7D32]',
    stars: 5,
  },
  {
    name: 'James T.',
    role: 'Verified Traveler',
    comment:
      'Traveling with an eSIM has been so much more relaxed. Reliable internet everywhere I went, the service was fantastic.',
    initial: 'J',
    avatarBg: 'bg-[#E3F2FD] text-[#1565C0]',
    stars: 5,
  },
  {
    name: 'Emily R.',
    role: 'Verified Traveler',
    comment: 'The app is super intuitive and connecting was a breeze. Really helped during my trips abroad.',
    initial: 'E',
    avatarBg: 'bg-[#FFF3E0] text-[#EF6C00]',
    stars: 4,
  },
  {
    name: 'David K.',
    role: 'Verified Traveler',
    comment: 'Affordable and the customer support is outstanding. Great value.',
    initial: 'D',
    avatarBg: 'bg-[#F3E5F5] text-[#6A1B9A]',
    stars: 5,
  },
  {
    name: 'Lisa W.',
    role: 'Verified Traveler',
    comment: 'Fast and reliable internet connection everywhere.',
    initial: 'L',
    avatarBg: 'bg-[#E0F2F1] text-[#00695C]',
    stars: 4,
  },
  {
    name: 'Tom H.',
    role: 'Verified Traveler',
    comment: "I've been using eSIM for all my trips now. Very satisfied.",
    initial: 'T',
    avatarBg: 'bg-[#EFEBE9] text-[#4E342E]',
    stars: 5,
  },
];

const PAYMENT_METHODS = [
  { name: 'Stripe', label: 'stripe' },
  { name: 'Apple Pay', label: 'Apple Pay' },
  { name: 'Google Pay', label: 'Google Pay' },
];

function StarRating({ count }: { count: number }) {
  return (
    <span className="text-base font-medium text-status-warning leading-[1.4]">
      {'★'.repeat(count)}
      {'☆'.repeat(5 - count)}
    </span>
  );
}

export const TrustAndReviews: React.FC = () => {
  return (
    <section className="py-16 lg:py-[100px] bg-[#FFFFFF]">
      <div className="mx-auto max-w-[1062px] px-4 sm:px-6 lg:px-8 flex flex-col gap-[44px]">
        <h2 className="text-[36px] font-[700] text-[#000000] tracking-tight text-center">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {REVIEWS.map((rev) => (
            <div
              key={rev.name}
              className="bg-[#FFFFFF] border border-[#EFECE5] rounded-[24px] p-[20px] shadow-[0px_8px_16px_rgba(0,0,0,0.02)] flex flex-col gap-[16px]"
            >
              <div className="flex items-center justify-between">
                <StarRating count={rev.stars} />
              </div>

              <p className="text-[14px] font-[400] text-[#252F4A] leading-[1.4em]">&ldquo;{rev.comment}&rdquo;</p>

              <div className="border-t border-[#F0EDE6] pt-[12px] flex items-center gap-[12px]">
                <div
                  className={`w-[36px] h-[36px] rounded-[18px] flex items-center justify-center text-[14px] font-[400] ${rev.avatarBg}`}
                >
                  {rev.initial}
                </div>
                <div className="flex flex-col gap-[2px]">
                  <h4 className="text-[14px] font-[400] text-[#252F4A] leading-[1.4em]">{rev.name}</h4>
                  <span className="text-[12px] font-[400] text-[#4B5675]">{rev.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          <p className="text-[12px] font-[600] text-[#4B5675] uppercase tracking-wider">Secure payments via</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
            {PAYMENT_METHODS.map((method) => (
              <span key={method.name} className="text-[14px] font-[700] text-[#252F4A]">
                {method.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustAndReviews;
