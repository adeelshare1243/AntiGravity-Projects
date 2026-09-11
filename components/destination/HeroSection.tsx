'use client';

import React from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  countryName?: string;
  destinationName?: string;
  flagUrl?: string;
  bannerUrl?: string;
  plansCount?: number;
  isGlobal?: boolean;
  isRegion?: boolean;
  isEurope?: boolean;
  destinationType?: 'country' | 'region' | 'global';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  countryName,
  destinationName,
  flagUrl,
  bannerUrl,
  plansCount = 10,
  isGlobal = false,
  isRegion = false,
  destinationType,
}) => {
  const name = destinationName || countryName || 'Turkey';
  const isEurope = name.toLowerCase() === 'europe';
  const isRegionEffective = isRegion || destinationType === 'region' || isEurope;

  const effectiveFlagUrl =
    flagUrl ||
    (isGlobal
      ? '/assets/destination/icon-globe.svg'
      : isEurope
      ? '/assets/destination/icon-europe.svg'
      : '/assets/destination/turkey-flag.svg');

  const effectiveBannerUrl =
    bannerUrl ||
    (isGlobal
      ? '/assets/destination/global-hero.png'
      : '/assets/destination/turkey-hero.png');

  const title = isGlobal
    ? 'Global eSIM Plans'
    : isRegionEffective
    ? `${name} eSIM Plans`
    : `eSIM for ${name}`;

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full">
      {/* 1. Hero Dark Banner */}
      <div className="bg-[#1E2330] rounded-[24px] p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 min-h-[260px] w-full shadow-sm">
        {/* Left Content */}
        <div className="flex flex-col gap-4 max-w-[620px] flex-1 w-full">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#FFF9F5]">
            <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
              Home
            </Link>
            <span className="opacity-60">/</span>
            <Link href="/destinations" className="opacity-60 hover:opacity-100 transition-opacity">
              Destinations
            </Link>
            <span className="opacity-60">/</span>
            <span className="font-medium text-white">{isGlobal ? 'Global' : name}</span>
          </nav>

          {/* Title & Info */}
          <div className="flex items-start gap-4 mt-1">
            <img
              src={effectiveFlagUrl}
              alt={isGlobal ? 'Global eSIM' : `${name} flag`}
              className="w-12 h-12 rounded-full object-cover shrink-0 mt-1 shadow-sm"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col gap-1.5">
              <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold text-white tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-sm md:text-base font-medium text-[#F7F7F7]">
                {isGlobal
                  ? '140+ Countries · 5G/4G'
                  : isRegionEffective
                  ? `${plansCount} Plans · 5G/4G`
                  : `${plansCount} Plans · 5G/4G`}
              </p>
              <p className="text-sm md:text-base font-normal text-[#F7F7F7]/90 leading-relaxed mt-0.5 max-w-[540px]">
                {isGlobal
                  ? 'Stay connected worldwide with seamless cross-border coverage. Activate before landing, travel freely across 140+ countries.'
                  : isRegionEffective
                  ? `Stay connected across ${name} with high-speed 5G/4G data. Travel seamlessly across borders with zero roaming fees.`
                  : `${name} eSIM ready in seconds. Istanbul, Antalya—activate before landing, use immediately.`}
              </p>
            </div>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="w-full lg:w-[420px] xl:w-[460px] h-[200px] sm:h-[220px] rounded-[16px] overflow-hidden shrink-0 relative bg-gray-800 shadow-md">
          <img
            src={effectiveBannerUrl}
            alt={isGlobal ? 'Global Destination' : `${countryName} Destination`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 2. Three Highlight Feature Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full">
        {/* Support */}
        <div className="bg-[#F7F7F7] rounded-[16px] p-4 md:py-4.5 md:px-5 flex items-center justify-center gap-3.5 w-full shadow-2xs">
          <div className="w-9 h-9 rounded-[10px] bg-[#F88B35] flex items-center justify-center shrink-0 shadow-2xs">
            <img
              src="/assets/destination/support-agent.svg"
              alt="24/7 Support"
              className="w-5 h-5 brightness-0 invert"
            />
          </div>
          <span className="text-sm md:text-base font-semibold text-[#252F4A]">
            24/7 Support
          </span>
        </div>

        {/* Instant Setup */}
        <div className="bg-[#F7F7F7] rounded-[16px] p-4 md:py-4.5 md:px-5 flex items-center justify-center gap-3.5 w-full shadow-2xs">
          <div className="w-9 h-9 rounded-[10px] bg-[#F88B35] flex items-center justify-center shrink-0 shadow-2xs">
            <img
              src="/assets/destination/electric-bolt.svg"
              alt="Instant Setup"
              className="w-5 h-5 brightness-0 invert"
            />
          </div>
          <span className="text-sm md:text-base font-semibold text-[#252F4A]">
            Instant Setup
          </span>
        </div>

        {/* 5G Speed */}
        <div className="bg-[#F7F7F7] rounded-[16px] p-4 md:py-4.5 md:px-5 flex items-center justify-center gap-3.5 w-full shadow-2xs">
          <div className="w-9 h-9 rounded-[10px] bg-[#F88B35] flex items-center justify-center shrink-0 shadow-2xs">
            <img
              src="/assets/destination/speed-5g.svg"
              alt="5G Speed"
              className="w-5 h-5 brightness-0 invert"
            />
          </div>
          <span className="text-sm md:text-base font-semibold text-[#252F4A]">
            5G Speed
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
