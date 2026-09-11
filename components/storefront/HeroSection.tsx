'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import DeviceCheckerModal from './DeviceCheckerModal';
import { useESim } from '@/context/ESimContext';
import { TrendingUp, ChevronRight } from 'lucide-react';

interface DestinationSearchResult {
  id: string;
  name: string;
  slug: string;
  isoCode: string;
  flagUrl: string;
  planCount: number;
  startingPrice: string | null;
}

// Curated slugs shown when the search box is empty (popular destinations)
const POPULAR_SLUGS = ['thailand', 'saudi-arabia', 'canada', 'united-arab-emirates', 'united-kingdom', 'united-states'];

export const HeroSection: React.FC = () => {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const { currency } = useESim();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isDeviceCheckerOpen, setIsDeviceCheckerOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Live destination data from DB
  const [destinations, setDestinations] = useState<DestinationSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/destinations/search')
      .then((r) => r.json())
      .then((data: DestinationSearchResult[]) => setDestinations(Array.isArray(data) ? data : []))
      .catch(() => setDestinations([]))
      .finally(() => setIsLoading(false));
  }, []);

  // When query is empty show curated popular destinations; otherwise filter by name
  const filteredDestinations: DestinationSearchResult[] =
    query.trim() === ''
      ? destinations
          .filter((d) => POPULAR_SLUGS.includes(d.slug))
          .sort((a, b) => POPULAR_SLUGS.indexOf(a.slug) - POPULAR_SLUGS.indexOf(b.slug))
      : destinations.filter((d) =>
          d.name.toLowerCase().includes(query.toLowerCase()),
        );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <section className="w-full px-4 py-6 md:px-8 lg:px-[54px] bg-[#F7F7F7] relative z-30">
        <div className="mx-auto max-w-[1062px]">
          {/* Main Hero Container (No overflow-hidden so attached dropdown can overlay below sections) */}
          <div className="relative rounded-[24px] min-h-[380px] md:min-h-[500px] flex items-center justify-center z-30">
            {/* Background Banner with Rounded Corners */}
            <div className="absolute inset-0 rounded-[24px] bg-[url('/assets/hero-bg.png')] bg-cover bg-center bg-no-repeat overflow-hidden pointer-events-none z-0">
              {/* Left Skater Vector Illustration */}
              <img
                src="/assets/hero_left_vector.svg"
                alt="Hero Left Vector"
                className="hidden lg:block absolute left-0 bottom-0 w-[217.95px] h-[281.95px] object-contain pointer-events-none z-10"
              />

              {/* Right Traveler Girl Vector Illustration */}
              <img
                src="/assets/hero_right_vector.svg"
                alt="Hero Right Vector"
                className="hidden lg:block absolute right-0 bottom-0 w-[115.75px] h-[278.31px] object-contain pointer-events-none z-10"
              />
            </div>

            <div className="relative z-20 flex flex-col items-center gap-[28px] px-[24px] py-[48px] text-center max-w-[612px]">
              <h1 className="text-[32px] sm:text-[44px] lg:text-[52px] font-[700] leading-[1.2em] text-[#FFFFFF] tracking-tight">
                {t('title')}
              </h1>

              <p className="text-[16px] font-[500] leading-[1.4em] text-[#FFFFFF] max-w-[450px]">
                {t('subtitle')}
              </p>

              {/* 1. SEARCH BAR WRAPPER */}
              <div ref={searchRef} className="relative w-full max-w-[500px] mx-auto z-40">
                <div className="bg-[#F7F7F7] border border-[#F7F7F7] rounded-[10px] h-[48px] flex items-center gap-[6px] px-[14px] shadow-xs">
                  <div className="relative w-[20px] h-[20px] shrink-0 overflow-hidden">
                    <img src="/assets/icon_search.svg" alt="search" className="w-[20px] h-[20px]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Where are you travelling?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="w-full text-[14px] font-[400] text-[#4B5675] placeholder:text-[#4B5675] bg-transparent focus:outline-none"
                  />
                </div>

                {/* 2 & 3. ATTACHED DROPDOWN CONTAINER (SYNCHRONIZED WIDTH & OVERLAY Z-INDEX) */}
                {isFocused && (
                  <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-full max-w-[500px] bg-white rounded-[24px] shadow-[0px_4px_23.7px_rgba(0,0,0,0.2)] border border-[#F7F7F7] overflow-hidden z-[100] flex flex-col text-left animate-in fade-in duration-150">
                    {/* Popular Destinations Header */}
                    <div className="flex items-center gap-2 px-6 py-4 border-b border-[#F7F7F7]">
                      <TrendingUp className="w-5 h-5 text-[#FD521B]" />
                      <span className="text-[12px] text-black/60 font-medium">Popular Destinations</span>
                    </div>

                    {/* Destinations List */}
                    <div className="flex flex-col gap-1 px-4 py-3 overflow-y-auto max-h-[360px]">
                      {filteredDestinations.length === 0 && !isLoading ? (
                        <p className="text-[13px] text-[#4B5675] font-medium px-3 py-4">
                          No destinations found matching &quot;{query}&quot;
                        </p>
                      ) : (
                        filteredDestinations.map((dest) => (
                          <Link
                            key={dest.slug}
                            href={`/${locale}/destinations/${dest.slug}`}
                            onClick={() => setIsFocused(false)}
                            className="flex justify-between items-center p-3 rounded-[16px] hover:bg-[#F7F7F7] cursor-pointer group transition-colors"
                          >
                            {/* Left Side */}
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center shadow-xs border border-slate-100 shrink-0">
                                <img
                                  src={dest.flagUrl}
                                  alt={dest.name}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[16px] font-medium text-[#0C0C0D] group-hover:text-[#FD521B] transition-colors">
                                  {dest.name}
                                </span>
                                <span className="text-[12px] text-[#4B5675]">
                                  {dest.planCount} plans{dest.startingPrice ? ` · ${dest.startingPrice}` : ''}
                                </span>
                              </div>
                            </div>

                            {/* Right Side */}
                            <div className="flex items-center gap-3">
                              {dest.startingPrice && (
                                <div className="bg-white group-hover:bg-white rounded-[8px] px-3 py-1.5 shadow-2xs border border-slate-100">
                                  <span className="text-[12px] text-[#252F4A]">From {dest.startingPrice}</span>
                                </div>
                              )}
                              <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <DeviceCheckerModal isOpen={isDeviceCheckerOpen} onClose={() => setIsDeviceCheckerOpen(false)} />
    </>
  );
};

export default HeroSection;
