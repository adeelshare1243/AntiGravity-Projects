'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useESim } from '@/context/ESimContext';
import { formatPrice, getCurrencySymbol } from '@/lib/currency';

interface Destination {
  id: string;
  country_name: string;
  slug: string;
  code: string;
  flag: string;
  region: string;
  starting_price_usd: number;
}

const POPULAR_DESTINATIONS: Destination[] = [
  { id: 'uk', country_name: 'United Kingdom', slug: 'united-kingdom', code: 'gb', flag: '/assets/flags/uk.svg', region: 'Europe', starting_price_usd: 2.3 },
  { id: 'germany', country_name: 'Germany', slug: 'germany', code: 'de', flag: '/assets/flags/germany.svg', region: 'Europe', starting_price_usd: 3.3 },
  { id: 'switzerland', country_name: 'Switzerland', slug: 'switzerland', code: 'ch', flag: '/assets/flags/switzerland.svg', region: 'Europe', starting_price_usd: 3.3 },
  { id: 'japan', country_name: 'Japan', slug: 'japan', code: 'jp', flag: '/assets/flags/japan.svg', region: 'Asia', starting_price_usd: 3.3 },
  { id: 'thailand', country_name: 'Thailand', slug: 'thailand', code: 'th', flag: '/assets/flags/thailand.svg', region: 'Asia', starting_price_usd: 3.3 },
  { id: 'usa', country_name: 'United States', slug: 'united-states', code: 'us', flag: '/assets/flags/usa.svg', region: 'North America', starting_price_usd: 3.3 },
  { id: 'canada', country_name: 'Canada', slug: 'canada', code: 'ca', flag: '/assets/flags/canada.svg', region: 'North America', starting_price_usd: 3.3 },
  { id: 'uae', country_name: 'United Arab Emirates', slug: 'united-arab-emirates', code: 'ae', flag: '/assets/flags/uae.svg', region: 'Middle East', starting_price_usd: 3.3 },
  { id: 'saudi', country_name: 'Saudi Arabia', slug: 'saudi-arabia', code: 'sa', flag: '/assets/flags/saudi-arabia.svg', region: 'Middle East', starting_price_usd: 3.3 },
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

export const PopularDestinations: React.FC = () => {
  const { currency } = useESim();
  const [activeTab, setActiveTab] = useState('Popular');

  const filteredDestinations = POPULAR_DESTINATIONS.filter((d) => {
    if (activeTab === 'Popular') return true;
    return d.region === activeTab;
  });

  return (
    <section className="py-[32px] bg-[#F7F7F7]">
      <div className="mx-auto max-w-[1062px] px-4 sm:px-6 lg:px-8 flex flex-col gap-[44px]">
        <div className="flex flex-col gap-[32px] items-center pt-5">
          <h2 className="text-[36px] font-[700] text-[#000000] tracking-tight text-center">
            Connect in 190+ countries
          </h2>

          <div className="flex flex-wrap items-center justify-between w-full max-w-[1062px] opacity-60 text-[20px] font-[700] text-[#4B5675] gap-4 px-2">
            {TELCO_LOGOS.map((name) => (
              <span key={name} className="shrink-0">{name}</span>
            ))}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] w-full">
            {filteredDestinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="flex items-center justify-between p-[16px] bg-[#FFFFFF] rounded-[16px] hover:shadow-md transition-all group border border-[#F7F7F7]"
              >
                <div className="flex items-center gap-[12px]">
                  <img 
                    src={`https://hatscripts.github.io/circle-flags/flags/${dest.code}.svg`}
                    alt={`${dest.country_name} flag`}
                    className="w-8 h-8 rounded-full shadow-sm shrink-0"
                  />
                  <div className="flex flex-col gap-[2px]">
                    <h3 className="text-[14px] font-[700] text-[#000000] group-hover:text-[#FD521B] transition-colors">
                      {dest.country_name}
                    </h3>
                    <p className="text-[12px] font-[400] text-[#4B5675]">
                      From{' '}
                      <span className="text-[#000000] font-[700]">
                        {getCurrencySymbol(currency)}{formatPrice(dest.starting_price_usd, currency)}
                      </span>
                    </p>
                  </div>
                </div>

                <img
                  src="/assets/chevron_down.svg"
                  alt=""
                  className="w-[16px] h-[16px] shrink-0 -rotate-90 opacity-60 group-hover:opacity-100 transition-opacity"
                />
              </Link>
            ))}
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-[5px] h-[42px] px-[12px] py-[11px] text-[14px] font-[500] text-[#000000] hover:text-[#FD521B] transition-colors rounded-[10px] bg-transparent"
          >
            <span>View All Countries</span>
            <img src="/assets/chevron_down.svg" alt="" className="w-[18px] h-[18px] -rotate-90" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
