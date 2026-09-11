'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Globe } from 'lucide-react';

export interface DestinationCardData {
  id: string;
  name: string;
  slug: string;
  region: string;
  flagUrl: string;
  planCount: number;
  startingPrice: string;
}

export interface RegionalBundleData {
  id: string;
  name: string;
  slug: string;
  startingPrice: string;
  planCount: number;
}

interface DestinationsGridProps {
  initialData: DestinationCardData[];
  regionalData?: RegionalBundleData[];
}

const REGIONS = [
  'All',
  'Europe',
  'Asia',
  'North America',
  'South America',
  'Caribbean',
  'Africa',
  'Middle East',
  'Oceania',
  'Global',
];

const DEFAULT_REGIONAL_BUNDLES: RegionalBundleData[] = [
  { id: 'reg-europe', name: 'Europe eSIM Bundle', slug: 'europe', startingPrice: '1.50', planCount: 16 },
  { id: 'reg-asia', name: 'Asia eSIM Bundle', slug: 'asia', startingPrice: '1.50', planCount: 16 },
  { id: 'reg-caribbean', name: 'Caribbean eSIM Bundle', slug: 'caribbean', startingPrice: '1.50', planCount: 16 },
  { id: 'reg-south-america', name: 'South America eSIM Bundle', slug: 'south-america', startingPrice: '1.50', planCount: 16 },
  { id: 'reg-central-asia', name: 'Central Asia eSIM Bundle', slug: 'central-asia', startingPrice: '1.50', planCount: 16 },
  { id: 'reg-north-america', name: 'North America eSIM Bundle', slug: 'north-america', startingPrice: '1.50', planCount: 16 },
  { id: 'reg-middle-east', name: 'Middle East eSIM Bundle', slug: 'middle-east', startingPrice: '1.50', planCount: 16 },
  { id: 'reg-africa', name: 'Africa eSIM Bundle', slug: 'africa', startingPrice: '1.50', planCount: 16 },
  { id: 'reg-central-america', name: 'Central America eSIM Bundle', slug: 'central-america', startingPrice: '1.50', planCount: 16 },
  { id: 'reg-oceania', name: 'Oceania eSIM Bundle', slug: 'oceania', startingPrice: '1.50', planCount: 16 },
  { id: 'reg-southeast-asia', name: 'Southeast Asia eSIM Bundle', slug: 'asia', startingPrice: '1.50', planCount: 16 },
  { id: 'reg-global', name: 'Global eSIM Bundle', slug: 'global', startingPrice: '1.50', planCount: 16 },
];

export default function DestinationsGrid({ initialData, regionalData }: DestinationsGridProps) {
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [visibleRegionalCount, setVisibleRegionalCount] = useState<number>(9);

  const regionalBundles = regionalData || DEFAULT_REGIONAL_BUNDLES;

  // Filtered data based on activeRegion and searchQuery
  const filteredData = useMemo(() => {
    return initialData.filter((destination) => {
      const matchesRegion =
        activeRegion === 'All' ||
        destination.region.toLowerCase() === activeRegion.toLowerCase();
      const matchesSearch = destination.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesRegion && matchesSearch;
    });
  }, [initialData, activeRegion, searchQuery]);

  // Paginated visible destinations
  const displayedData = filteredData.slice(0, visibleCount);
  const displayedRegionalData = regionalBundles.slice(0, visibleRegionalCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  const handleRegionSelect = (region: string) => {
    setActiveRegion(region);
    setVisibleCount(12);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="px-4">
        <div className="w-full max-w-[1140px] mx-auto bg-gradient-to-r from-[#FF7A00] to-[#FF9900] rounded-[32px] py-16 md:py-20 px-4 text-center mt-6 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            eSIM for Every Destination
          </h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
            Browse eSIM data plans for 190+ countries and regions. Find the perfect plan and get connected within minutes.
          </p>

          {/* Search Bar inside Hero */}
          <div className="relative max-w-[480px] mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12);
              }}
              className="w-full bg-white border-transparent focus:ring-4 focus:ring-white/20 rounded-xl py-3.5 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-500 outline-none transition-all shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* 2. UNIFIED SINGLE-ROW CONTINENT & GLOBAL TABS */}
      <div className="w-full max-w-[1140px] mx-auto mt-8 px-4 overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center justify-center gap-2.5 w-max min-w-full">
          {REGIONS.map((region) => {
            const isActive = activeRegion === region;
            const isGlobal = region === 'Global';

            return (
              <button
                key={region}
                type="button"
                onClick={() => handleRegionSelect(region)}
                className={`h-[42px] px-[18px] rounded-[10px] text-[14px] font-medium transition-all duration-150 flex items-center justify-center gap-2 shrink-0 select-none cursor-pointer ${
                  isActive
                    ? 'bg-[#FD521B] text-white font-semibold shadow-xs'
                    : 'bg-[#F4F5F7] text-[#4B5675] hover:bg-[#EAECEF] hover:text-[#111827]'
                }`}
              >
                {isGlobal && (
                  <Globe className="w-4 h-4 shrink-0 text-current" strokeWidth={1.75} />
                )}
                <span>{region}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SEARCH & COUNT HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-[1140px] mx-auto mt-8 mb-6 px-4 gap-4 md:gap-0">
        <div className="text-[15px] text-[#4B5563]">
          Showing <span className="font-semibold text-gray-900">{displayedData.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{filteredData.length}</span> destinations
        </div>
        <div className="relative w-full md:w-[280px]">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search countries, cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4F5F7] text-sm text-gray-900 placeholder-gray-400 rounded-full py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#F88B35]/20 transition-all"
          />
        </div>
      </div>

      {/* 4. DESTINATION COUNTRY GRID */}
      {displayedData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1140px] mx-auto px-4">
          {displayedData.map((dest) => (
            <Link
              key={dest.id || dest.slug}
              href={`/destinations/${dest.slug}`}
              className="bg-[#F4F5F7] rounded-[16px] p-4 flex items-center justify-between hover:bg-[#EBEEF2] cursor-pointer transition-colors border-0"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white shadow-sm overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dest.flagUrl}
                    alt={`${dest.name} flag`}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://hatscripts.github.io/circle-flags/flags/${dest.slug.slice(0, 2).toLowerCase()}.svg`;
                    }}
                  />
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[15px] font-bold text-gray-900 truncate">
                    {dest.name}
                  </span>
                  <span className="text-[13px] text-gray-500 truncate">
                    From <span className="font-bold text-gray-900">${dest.startingPrice}</span> · {dest.planCount} plans
                  </span>
                </div>
              </div>

              <svg
                className="w-4 h-4 text-gray-400 shrink-0 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-[#F4F5F7] rounded-[16px] p-12 text-center max-w-[1140px] mx-auto px-4">
          <p className="text-gray-500 text-sm">
            No destinations found matching &quot;{searchQuery}&quot;
            {activeRegion !== 'All' ? ` in ${activeRegion}` : ''}.
          </p>
        </div>
      )}

      {/* 5. MAIN GRID LOAD MORE BUTTON */}
      {visibleCount < filteredData.length && (
        <div className="text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="text-[#F88B35] text-sm font-bold mt-8 hover:underline cursor-pointer inline-block"
          >
            Load More
          </button>
        </div>
      )}

      {/* 6. REGIONAL ESIM BUNDLES SECTION */}
      <section className="w-full max-w-[1140px] mx-auto mt-20 px-4">
        <h2 className="text-3xl font-black text-center text-gray-900 mb-8">
          Regional eSIM Bundles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedRegionalData.map((bundle) => (
            <Link
              key={bundle.id || bundle.slug}
              href={`/destinations/${bundle.slug}`}
              className="bg-[#F4F5F7] rounded-[16px] p-4 flex items-center justify-between hover:bg-[#EBEEF2] cursor-pointer transition-colors border-0"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white shadow-sm overflow-hidden">
                  <svg
                    className="w-5 h-5 text-gray-700"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[15px] font-bold text-gray-900 truncate">
                    {bundle.name}
                  </span>
                  <span className="text-[13px] text-gray-500 truncate">
                    From <span className="font-bold text-gray-900">${bundle.startingPrice}</span> · {bundle.planCount} plans
                  </span>
                </div>
              </div>

              <svg
                className="w-4 h-4 text-gray-400 shrink-0 ml-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>

        {/* REGIONAL LOAD MORE BUTTON */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setVisibleRegionalCount((prev) => prev + 6)}
            className="text-[#F88B35] text-sm font-bold mt-8 hover:underline cursor-pointer inline-block"
          >
            Load More
          </button>
        </div>
      </section>
    </div>
  );
}
