'use client';

import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Share2, Flag, Bell, Search, Menu } from 'lucide-react';

interface Review {
  name: string;
  initials: string;
  location: string;
  date: string;
  title: string;
  text: string;
  experienceDate: string;
  tag: string;
}

const REVIEWS: Review[] = [
  {
    name: 'Laura Nemtala',
    initials: 'LN',
    location: 'US • 1 review',
    date: 'Dec 24, 2025',
    title: 'Reliable and easy!',
    text: 'Super easy to install on my iPhone before leaving for Istanbul. Data worked the moment we touched down!',
    experienceDate: 'December 16, 2025',
    tag: 'Verified Customer',
  },
  {
    name: 'Marcus Weber',
    initials: 'MW',
    location: 'DE • 3 reviews',
    date: 'Jan 12, 2026',
    title: 'Flawless 5G connection in Antalya',
    text: 'Had lightning fast 5G everywhere from Antalya to Cappadocia. Hotspot worked flawlessly with my laptop for remote work.',
    experienceDate: 'January 5, 2026',
    tag: 'Verified Customer',
  },
  {
    name: 'Sophie Dubois',
    initials: 'SD',
    location: 'FR • 2 reviews',
    date: 'Feb 03, 2026',
    title: 'Never buying physical SIM cards again',
    text: 'Saved me at least an hour waiting in line at Istanbul airport. Activated instantly via QR code. Highly recommended!',
    experienceDate: 'January 28, 2026',
    tag: 'Verified Customer',
  },
];

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % REVIEWS.length);
        setIsFading(false);
      }, 300);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectReview = (idx: number) => {
    if (idx === currentIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setIsFading(false);
    }, 200);
  };

  const currentReview = REVIEWS[currentIndex];

  return (
    <div className="w-full bg-[#F7F7F7] rounded-[24px] p-6 sm:p-10 lg:p-14 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
      {/* Dynamic Keyframes for Filling Progress Bar */}
      <style>{`
        @keyframes fillProgress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>

      {/* Left Column: Trustpilot Review Card */}
      <div className="w-full max-w-[420px] shrink-0 flex flex-col items-center gap-4">
        <div className="w-full bg-white rounded-[20px] border border-gray-200/80 shadow-[0px_8px_24px_0px_rgba(29,22,29,0.08)] overflow-hidden">
          {/* Dark Header */}
          <div className="bg-[#1A1A1A] p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#00B67A] rounded-[2px] flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                </div>
                <span className="text-base font-bold text-white tracking-tight">
                  Trustpilot
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                <Bell className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                <Search className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                <Menu className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <span>•••</span>
              <span className="text-[#00B67A]">&gt;</span>
              <span>Telecommunications Service</span>
              <span className="text-[#00B67A]">&gt;</span>
              <span>Soovia</span>
            </div>
          </div>

          {/* Review Card Body with smooth fade animation */}
          <div className="p-4 sm:p-5 flex flex-col gap-3.5 min-h-[260px] justify-between">
            <div
              className={`flex flex-col gap-3.5 transition-opacity duration-300 ease-in-out ${
                isFading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
              }`}
            >
              {/* Reviewer Meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1E2330] text-white flex items-center justify-center text-xs font-semibold shadow-2xs">
                    {currentReview.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 leading-tight">
                      {currentReview.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {currentReview.location}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{currentReview.date}</span>
              </div>

              {/* Stars Row */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 bg-[#00B67A] rounded-[3px] flex items-center justify-center shadow-2xs"
                  >
                    <Star className="w-3.5 h-3.5 fill-white text-white" />
                  </div>
                ))}
              </div>

              {/* Content Text */}
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-gray-900">
                  {currentReview.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed min-h-[36px]">
                  {currentReview.text}
                </p>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-[6px] text-[11px] font-medium bg-gray-100 border border-gray-200 text-gray-700">
                  {currentReview.experienceDate}
                </span>
                <span className="px-2.5 py-1 rounded-[6px] text-[11px] font-medium bg-[#E8F8F0] border border-[#00B67A]/30 text-[#00875A]">
                  {currentReview.tag}
                </span>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div>
              <div className="w-full h-px bg-gray-200 mb-3" />
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <button
                  type="button"
                  className="flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Useful</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
                <button
                  type="button"
                  className="hover:text-gray-900 transition-colors cursor-pointer ml-auto"
                  aria-label="Flag review"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Carousel Indicators with Filling Progress Bar */}
        <div className="flex items-center gap-2">
          {REVIEWS.map((_, idx) => {
            const isActive = idx === currentIndex;

            return isActive ? (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectReview(idx)}
                aria-label={`Current review ${idx + 1}`}
                className="relative w-8 h-1.5 bg-gray-200 rounded-full overflow-hidden cursor-pointer shrink-0"
              >
                <div
                  key={currentIndex}
                  className="absolute top-0 left-0 h-full bg-[#00B67A] rounded-full"
                  style={{ animation: 'fillProgress 4s linear forwards' }}
                />
              </button>
            ) : (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectReview(idx)}
                aria-label={`Go to review ${idx + 1}`}
                className="w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400 rounded-full transition-colors cursor-pointer shrink-0"
              />
            );
          })}
        </div>
      </div>

      {/* Right Column: Heading & Text */}
      <div className="flex flex-col gap-3 max-w-[560px]">
        <span className="text-xs font-semibold text-[#F88B35] uppercase tracking-wider">
          Customer Trust
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#111827] tracking-tight leading-tight">
          We&apos;re obsessed with customer experience
        </h2>
        <p className="text-base sm:text-lg font-normal text-[#4B5675] leading-relaxed mt-1">
          Okay, maybe a little too obsessed. That&apos;s why over 98% of our customers rate their connectivity experience 5 stars.
        </p>
      </div>
    </div>
  );
};

export default Testimonials;
