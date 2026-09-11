'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useESim } from '@/context/ESimContext';
import { useLocale } from 'next-intl';
import { formatPrice, getCurrencySymbol } from '@/lib/currency';
import { ChevronRight, ArrowRight } from 'lucide-react';

export interface DestinationItem {
  id: string;
  name: string;
  slug: string;
  flagUrl: string;
  region: string;
  startingPrice: number;
}

interface PopularDestinationsProps {
  destinations?: DestinationItem[];
}

const POPULAR_DESTINATIONS = [
  { id: 'uk', country_name: 'United Kingdom', slug: 'united-kingdom', code: 'gb', flag: 'https://hatscripts.github.io/circle-flags/flags/gb.svg', region: 'Europe', starting_price_usd: 2.3 },
  { id: 'germany', country_name: 'Germany', slug: 'germany', code: 'de', flag: 'https://hatscripts.github.io/circle-flags/flags/de.svg', region: 'Europe', starting_price_usd: 3.3 },
  { id: 'switzerland', country_name: 'Switzerland', slug: 'switzerland', code: 'ch', flag: 'https://hatscripts.github.io/circle-flags/flags/ch.svg', region: 'Europe', starting_price_usd: 3.3 },
  { id: 'japan', country_name: 'Japan', slug: 'japan', code: 'jp', flag: 'https://hatscripts.github.io/circle-flags/flags/jp.svg', region: 'Asia', starting_price_usd: 3.3 },
  { id: 'thailand', country_name: 'Thailand', slug: 'thailand', code: 'th', flag: 'https://hatscripts.github.io/circle-flags/flags/th.svg', region: 'Asia', starting_price_usd: 3.3 },
  { id: 'usa', country_name: 'United States', slug: 'united-states', code: 'us', flag: 'https://hatscripts.github.io/circle-flags/flags/us.svg', region: 'North America', starting_price_usd: 3.3 },
  { id: 'canada', country_name: 'Canada', slug: 'canada', code: 'ca', flag: 'https://hatscripts.github.io/circle-flags/flags/ca.svg', region: 'North America', starting_price_usd: 3.3 },
  { id: 'uae', country_name: 'United Arab Emirates', slug: 'united-arab-emirates', code: 'ae', flag: 'https://hatscripts.github.io/circle-flags/flags/ae.svg', region: 'Middle East', starting_price_usd: 3.3 },
  { id: 'saudi', country_name: 'Saudi Arabia', slug: 'saudi-arabia', code: 'sa', flag: 'https://hatscripts.github.io/circle-flags/flags/sa.svg', region: 'Middle East', starting_price_usd: 3.3 },
];

const TELCO_LOGOS = ['AT&T', 'T-Mobile', 'vodafone', 'verizon', 'orange', 'docomo', 'TIM'];

const REGION_TABS = [
  'Popular',
  'Europe',
  'Asia',
  'North America',
  'South America',
  'Caribbean',
  'Africa',
  'Middle East',
  'Oceania',
];

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({ destinations = [] }) => {
  const { currency } = useESim();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState('Popular');

  const sourceDestinations: DestinationItem[] =
    destinations.length > 0
      ? destinations
      : POPULAR_DESTINATIONS.map((d) => ({
          id: d.id,
          name: d.country_name,
          slug: d.slug,
          flagUrl: d.flag,
          region: d.region,
          startingPrice: d.starting_price_usd,
        }));

  const filteredDestinations =
    activeTab === 'Popular'
      ? sourceDestinations.slice(0, 9)
      : sourceDestinations.filter(
          (d) => d.region.toLowerCase() === activeTab.toLowerCase(),
        );

  return (
    <section className="py-[32px] bg-[#F7F7F7]">
      <div className="mx-auto max-w-[1062px] px-4 sm:px-6 lg:px-8 flex flex-col gap-[44px]">
        <div className="flex flex-col gap-[32px] items-center pt-5">
          <h2 className="text-[36px] font-[700] text-[#000000] tracking-tight text-center">
            Connect in 190+ countries
          </h2>

          {/* Infinite-scrolling telecom marquee with edge-masking */}
          <div
            className="group relative flex overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] py-2"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
          >
            <div className="flex shrink-0 items-center justify-around min-w-full animate-marquee group-hover:[animation-play-state:paused] gap-12">
              {TELCO_LOGOS.map((name, index) => (
                <span
                  key={index}
                  className="shrink-0 text-[20px] font-[700] text-[#4B5675] grayscale opacity-60 transition-all duration-300 cursor-pointer hover:grayscale-0 hover:opacity-100 hover:scale-110"
                >
                  {name}
                </span>
              ))}
            </div>
            <div
              className="flex shrink-0 items-center justify-around min-w-full animate-marquee group-hover:[animation-play-state:paused] gap-12"
              aria-hidden="true"
            >
              {TELCO_LOGOS.map((name, index) => (
                <span
                  key={`dup-${index}`}
                  className="shrink-0 text-[20px] font-[700] text-[#4B5675] grayscale opacity-60 transition-all duration-300 cursor-pointer hover:grayscale-0 hover:opacity-100 hover:scale-110"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[32px] items-center">
          <div className="flex items-center justify-between w-full gap-2 overflow-x-auto pb-2 scrollbar-none">
            {REGION_TABS.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`h-[46px] px-[20px] py-[13px] text-[14px] font-[500] rounded-[10px] transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[#FD521B] text-[#FFF9F5]'
                      : 'bg-[#FFFFFF] text-[#4B5675] hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3.5 gap-x-4 sm:gap-x-5 w-full">
            {filteredDestinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/${locale}/destinations/${dest.slug}`}
                className="bg-white rounded-2xl border border-gray-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 py-3.5 px-4 sm:px-5 flex items-center justify-between group"
              >
                <div className="flex items-center min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 mr-3.5">
                    <img 
                      src={dest.flagUrl}
                      alt={`${dest.name} flag`}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-[15px] font-semibold text-gray-950 leading-snug truncate">
                      {dest.name}
                    </h3>
                    <div className="mt-0.5 flex items-baseline gap-1">
                      <span className="text-xs font-normal text-gray-400">
                        From
                      </span>
                      <span className="text-xs font-semibold text-gray-900">
                        ${dest.startingPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-600 shrink-0 stroke-[2] ml-2" />
              </Link>
            ))}
          </div>

          <Link
            href={`/${locale}/destinations`}
            className="mt-8 text-sm font-semibold text-gray-900 flex items-center justify-center gap-1.5 hover:text-orange-500 transition-colors group"
          >
            <span>View All Countries</span>
            <ArrowRight className="w-4 h-4 text-gray-900 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
