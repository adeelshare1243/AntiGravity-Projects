'use client';

import React, { useState } from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import { Search, Globe, ChevronRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function DestinationsPage() {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const CATEGORIES = [
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

  const COUNTRIES = [
    { name: 'United Kingdom', flag: '🇬🇧', price: '$1.50', plans: 10, code: 'gb' },
    { name: 'Germany', flag: '🇩🇪', price: '$1.50', plans: 10, code: 'de' },
    { name: 'Switzerland', flag: '🇨🇭', price: '$1.50', plans: 10, code: 'ch' },
    { name: 'Japan', flag: '🇯🇵', price: '$1.50', plans: 10, code: 'jp' },
    { name: 'Thailand', flag: '🇹🇭', price: '$1.50', plans: 10, code: 'th' },
    { name: 'United States', flag: '🇺🇸', price: '$1.50', plans: 10, code: 'us' },
    { name: 'France', flag: '🇫🇷', price: '$1.50', plans: 10, code: 'fr' },
    { name: 'Italy', flag: '🇮🇹', price: '$1.50', plans: 10, code: 'it' },
    { name: 'Spain', flag: '🇪🇸', price: '$1.50', plans: 10, code: 'es' },
    { name: 'Turkey', flag: '🇹🇷', price: '$1.50', plans: 10, code: 'tr' },
    { name: 'United Arab Emirates', flag: '🇦🇪', price: '$1.50', plans: 10, code: 'ae' },
    { name: 'Australia', flag: '🇦🇺', price: '$1.50', plans: 10, code: 'au' },
  ];

  const REGIONAL_BUNDLES = [
    { name: 'Europe eSIM Bundle', price: '$1.50', plans: 10 },
    { name: 'Asia eSIM Bundle', price: '$1.50', plans: 10 },
    { name: 'North America eSIM Bundle', price: '$1.50', plans: 10 },
    { name: 'South America eSIM Bundle', price: '$1.50', plans: 10 },
    { name: 'Caribbean eSIM Bundle', price: '$1.50', plans: 10 },
    { name: 'Middle East eSIM Bundle', price: '$1.50', plans: 10 },
  ];

  const DESTINATION_FAQS = [
    {
      question: 'Which countries and regions are covered?',
      answer:
        'We offer eSIM data plans in over 190 countries and territories worldwide. You can choose a single-country plan for a specific destination, a regional plan covering multiple countries in Europe, Asia, the Americas or other regions, or a global plan that works across 100+ countries. Browse the full list above to find your destination and see available plans.',
    },
    {
      question: 'What is the difference between country, regional, and global plans?',
      answer:
        'Single-country plans provide local data within one specific country, regional plans cover multiple neighboring countries under a single pass, and global plans keep you connected across 100+ countries worldwide.',
    },
    {
      question: 'How do I choose the right data plan for my trip?',
      answer:
        'Consider the length of your trip, expected data usage (navigation, video, social media), and whether you will be visiting one country or traveling through multiple countries in a region.',
    },
    {
      question: 'Do prices vary between countries?',
      answer:
        'Yes, prices depend on local carrier rates, regional data packages, and validity periods. Our plans start from as low as $1.50 for popular travel destinations.',
    },
    {
      question: 'Can I use an eSIM before I travel?',
      answer:
        'You can install the eSIM QR code prior to your trip using your home Wi-Fi, but the validity period only begins once your eSIM connects to a supported local network at your destination.',
    },
  ];

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-white text-[#252F4A] flex flex-col justify-between font-sans antialiased">
      <div>
        <Navbar />

        {/* 1. HERO SEARCH BANNER */}
        <section className="px-4 md:px-8">
          <div className="rounded-[32px] max-w-6xl mx-auto mt-8 p-8 md:p-16 text-center bg-gradient-to-r from-[#FF5A36] to-[#FF8A00] shadow-xl relative overflow-hidden">
            <h1 className="text-[36px] md:text-[48px] font-[800] text-white tracking-tight mb-4">
              eSIM for Every Destination
            </h1>
            <p className="text-white/90 max-w-2xl mx-auto mb-8 text-[16px] leading-relaxed">
              Browse eSIM data plans for 200+ countries and regions. Find the perfect plan and get connected within minutes.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white rounded-xl pl-12 pr-6 py-4 w-full shadow-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all text-base"
              />
            </div>
          </div>
        </section>

        {/* 2. CATEGORY FILTER TABS */}
        <section className="px-4 md:px-8">
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 w-full max-w-5xl mx-auto mt-8 mb-8">
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#FF5A36] text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'Global' && <Globe className="w-4 h-4" />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. COUNTRIES GRID SECTION */}
        <section className="px-4 md:px-8 mt-6">
          {/* Header Row */}
          <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
            <span className="text-sm text-slate-500 font-medium">
              Showing {filteredCountries.length} of 190 destinations
            </span>
            <div className="relative hidden sm:block w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F8F9FA] border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5A36]"
              />
            </div>
          </div>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {filteredCountries.map((country, idx) => (
              <Link
                key={idx}
                href={`/destinations/${country.code}`}
                className="bg-[#F8F9FA] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md hover:bg-white border border-transparent hover:border-slate-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-100 shadow-xs border border-slate-100">
                    <img
                      src={`https://flagcdn.com/w40/${country.code}.png`}
                      alt={`${country.name} flag`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#252F4A] group-hover:text-[#FF5A36] transition-colors text-base">
                      {country.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      From {country.price} - {country.plans} plans
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#FF5A36] transition-all" />
              </Link>
            ))}
          </div>

          <button className="text-[#FF5A36] font-semibold mt-8 text-center block w-full hover:underline cursor-pointer">
            Load More
          </button>
        </section>

        {/* 4. REGIONAL ESIM BUNDLES SECTION */}
        <section className="px-4 md:px-8">
          <h2 className="text-center text-[32px] font-bold text-[#252F4A] mt-24 mb-10 tracking-tight">
            Regional eSIM Bundles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {REGIONAL_BUNDLES.map((bundle, idx) => (
              <Link
                key={idx}
                href="/destinations/region"
                className="bg-[#F8F9FA] rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-md hover:bg-white border border-transparent hover:border-slate-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#252F4A] group-hover:text-[#FF5A36] transition-colors text-base">
                      {bundle.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      From {bundle.price} - {bundle.plans} plans
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#FF5A36] transition-all" />
              </Link>
            ))}
          </div>

          <button className="text-[#FF5A36] font-semibold mt-8 text-center block w-full hover:underline cursor-pointer">
            Load More
          </button>
        </section>

        {/* 5. DESTINATIONS FAQ SECTION */}
        <section className="px-4 md:px-8">
          <h2 className="text-center text-[32px] font-bold text-[#252F4A] mt-24 mb-10 tracking-tight">
            Destinations faq
          </h2>

          <div className="max-w-3xl mx-auto mb-20 space-y-3">
            {DESTINATION_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-100 rounded-xl overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-[#252F4A] text-base sm:text-lg hover:bg-slate-50/50 transition-colors"
                  >
                    <span className="pr-4 leading-snug">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#252F4A]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="bg-slate-50 text-slate-500 p-5 rounded-b-xl border-t border-slate-100 text-sm sm:text-base leading-relaxed animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
