'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Globe } from 'lucide-react';

interface NearbyCardItem {
  name: string;
  slug: string;
  flagUrl?: string;
  isBundle?: boolean;
  subtitle: React.ReactNode;
}

const NEARBY_CARDS: NearbyCardItem[] = [
  {
    name: 'United Kingdom',
    slug: 'united-kingdom',
    flagUrl: 'https://hatscripts.github.io/circle-flags/flags/gb.svg',
    subtitle: (
      <>
        From <span className="font-bold text-black">$2.30</span>
      </>
    ),
  },
  {
    name: 'Germany',
    slug: 'germany',
    flagUrl: 'https://hatscripts.github.io/circle-flags/flags/de.svg',
    subtitle: (
      <>
        From <span className="font-bold text-black">$3.30</span>
      </>
    ),
  },
  {
    name: 'Switzerland',
    slug: 'switzerland',
    flagUrl: 'https://hatscripts.github.io/circle-flags/flags/ch.svg',
    subtitle: (
      <>
        From <span className="font-bold text-black">$3.30</span>
      </>
    ),
  },
  {
    name: 'Europe eSIM Bundle',
    slug: 'europe',
    isBundle: true,
    flagUrl: 'https://hatscripts.github.io/circle-flags/flags/eu.svg',
    subtitle: (
      <>
        From <span className="font-semibold text-black">$1.50/day</span> · 16 plans
      </>
    ),
  },
  {
    name: 'Asia eSIM Bundle',
    slug: 'asia',
    isBundle: true,
    subtitle: 'Best for multiple countries',
  },
  {
    name: 'Caribbean eSIM Bundle',
    slug: 'caribbean',
    isBundle: true,
    subtitle: (
      <>
        From <span className="font-semibold text-black">$1.50/day</span> · 16 plans
      </>
    ),
  },
];

interface NearbyDestinationsProps {
  destinationName?: string;
  currentCountry?: string; // alias
}

export const NearbyDestinations: React.FC<NearbyDestinationsProps> = ({
  destinationName,
  currentCountry,
}) => {
  const name = destinationName || currentCountry || 'Turkey';

  return (
    <div className="w-full bg-[#F7F7F7] py-16 flex flex-col items-center rounded-[24px]">
      {/* Inner Container */}
      <div className="max-w-[1062px] w-full px-4 flex flex-col items-center">
        {/* Header Text */}
        <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3 tracking-tight text-center">
          Nearby Destinations
        </h2>
        <p className="text-base sm:text-lg text-gray-800 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
          Traveling around {name}? Explore eSIM plans for neighboring destinations.
        </p>

        {/* 3x2 Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {NEARBY_CARDS.map((card) => (
            <Link
              key={card.slug}
              href={`/destinations/${card.slug}`}
              className="bg-white rounded-[16px] p-4 flex flex-row items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                {/* Flag Wrapper */}
                <div className="w-10 h-10 bg-[#F7F7F7] rounded-[10px] flex items-center justify-center shrink-0">
                  {card.flagUrl ? (
                    <img
                      src={card.flagUrl}
                      alt={`${card.name} flag`}
                      className="w-6 h-6 rounded-full object-cover shadow-2xs"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#E5E7EB] flex items-center justify-center text-[#4B5675]">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Text Wrapper */}
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="text-[15px] font-bold text-black leading-tight">
                    {card.name}
                  </span>
                  <span className="text-[13px] text-[#4B5675]">
                    {card.subtitle}
                  </span>
                </div>
              </div>

              {/* Right Side Chevron */}
              <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            </Link>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/destinations"
            className="text-sm font-semibold text-black flex items-center gap-2 hover:underline cursor-pointer group"
          >
            <span>View All Countries</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NearbyDestinations;
