'use client';

import React, { useState } from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import { Search, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES = ['All', 'Guides', 'Travel'];

  const FEATURED_POSTS = [
    {
      slug: 'best-esim-for-international-travel-2026',
      title: 'Best eSIM for International Travel (2026): Providers, Plans and Comparison',
      excerpt:
        'Discover the best eSIM for international travel. Compare top providers, pricing, and performance to choose the right plan for your trip.',
      category: 'Travel',
      readTime: '8 min read',
      bgColor: 'bg-[#A6C495]',
    },
    {
      slug: 'ultimate-guide-to-using-esim-in-europe',
      title: 'Ultimate Guide to Using an eSIM in Europe across 30+ Countries',
      excerpt:
        'Learn how to set up a single regional eSIM pass to enjoy high-speed data while traveling across European borders hassle-free.',
      category: 'Guides',
      readTime: '6 min read',
      bgColor: 'bg-[#95B8C4]',
    },
  ];

  const COMPACT_POSTS = [
    {
      slug: 'esim-for-germany-travel-connectivity-guide',
      title: 'Best eSIM for Germany (2026): Provider Comparisons & Speeds',
      excerpt:
        'An eSIM for Germany is the difference between seamless connectivity and getting stranded without map access in Berlin.',
      category: 'Travel',
      readTime: '8 min read',
    },
    {
      slug: 'how-to-keep-your-original-phone-number-while-using-esim',
      title: 'How to Keep Your Original Number Active While Using a Travel eSIM',
      excerpt:
        'Configure Dual SIM settings on iOS and Android to receive bank 2FA SMS while using cheap travel data.',
      category: 'Guides',
      readTime: '5 min read',
    },
    {
      slug: 'japan-esim-installation-and-tokyo-coverage',
      title: 'Japan eSIM Setup: Best Data Networks in Tokyo & Kyoto',
      excerpt:
        'Detailed breakdown of SoftBank and NTT Docomo speeds for tourists visiting Tokyo, Osaka, and Kyoto.',
      category: 'Travel',
      readTime: '7 min read',
    },
    {
      slug: 'top-10-mistakes-first-time-esim-users-make',
      title: 'Top 10 Common Mistakes First-Time eSIM Travelers Make',
      excerpt:
        'Avoid deleting your eSIM profile prematurely or enabling data roaming on your home carrier SIM card.',
      category: 'Guides',
      readTime: '4 min read',
    },
    {
      slug: 'is-esim-cheaper-than-local-physical-sim',
      title: 'Is an eSIM Cheaper Than Buying Local Airport SIM Cards?',
      excerpt:
        'Price comparison between airport kiosk SIM cards and instant digital eSIM downloads before departure.',
      category: 'Travel',
      readTime: '6 min read',
    },
    {
      slug: 'how-to-check-if-your-smartphone-supports-esim',
      title: 'How to Check if Your Smartphone Is Unlocked and eSIM Compatible',
      excerpt:
        'Quick dial code and settings menu checks to verify eSIM compatibility for iPhone, Samsung Galaxy, and Pixel.',
      category: 'Guides',
      readTime: '3 min read',
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#0C0C0D] flex flex-col justify-between font-sans antialiased">
      <div>
        <Navbar />

        {/* 1. HERO SECTION (Centered) */}
        <section className="bg-white pt-16 pb-12 px-4 max-w-3xl mx-auto text-center">
          <h1 className="text-[36px] md:text-[48px] font-bold text-[#0C0C0D] mb-4">Blog</h1>
          <p className="text-[16px] leading-[24px] text-slate-500 max-w-2xl mx-auto mb-8">
            Discover destination insights, connectivity tips, and everything you need to know about staying connected while traveling.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative border border-slate-200 rounded-[10px] px-5 py-3 flex items-center shadow-xs bg-white">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0 pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[#0C0C0D] placeholder-slate-400 focus:outline-none text-base"
            />
          </div>
        </section>

        {/* 2. CATEGORY TABS (Left-Aligned to Grid) */}
        <section className="max-w-5xl mx-auto px-4 mb-8 flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-[10px] text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0C0C0D] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#4B5675] hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </section>

        {/* 3. BLOG GRID SECTION */}
        <section className="max-w-5xl mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 4. CARD STYLE A: FEATURED CARDS (2 Posts) */}
            {FEATURED_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-[#F8F9FA] rounded-[24px] overflow-hidden flex flex-col border border-transparent hover:border-slate-200 hover:shadow-md transition-all group"
              >
                {/* Image Block Placeholder */}
                <div className={`w-full aspect-video ${post.bgColor} opacity-75 shrink-0`} />

                {/* Content Padding */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                  <div>
                    {/* Metadata Row */}
                    <div className="flex items-center text-sm mb-2">
                      <span className="text-[#FD521B] font-semibold">{post.category}</span>
                      <span className="text-slate-500 flex items-center gap-1.5 ml-4">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-[20px] leading-[28px] font-bold text-[#0C0C0D] mt-3 mb-2 line-clamp-2 group-hover:text-[#FD521B] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[14px] text-slate-500 line-clamp-2 mb-6 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="font-bold text-sm text-[#0C0C0D] flex items-center gap-1.5 group-hover:text-[#FD521B] transition-colors pt-2">
                    <span>Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}

            {/* 5. CARD STYLE B: COMPACT TEXT CARDS (6 Posts) */}
            {COMPACT_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-[#F8F9FA] rounded-[24px] p-6 md:p-7 flex flex-col justify-between border border-transparent hover:border-slate-200 hover:shadow-md transition-all group min-h-[170px]"
              >
                {/* Top Row Flexbox */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center text-sm">
                    <span className="text-[#FD521B] font-semibold">{post.category}</span>
                    <span className="text-slate-500 text-sm flex items-center gap-1 ml-3">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {post.readTime}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-[#0C0C0D] group-hover:text-[#FD521B] flex items-center gap-1 transition-colors">
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div>
                  <h4 className="text-[16px] leading-[24px] font-bold text-[#0C0C0D] mb-1 truncate group-hover:text-[#FD521B] transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-[14px] text-slate-500 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. PAGINATION (Bottom Center) */}
        <section className="max-w-5xl mx-auto px-4 pb-20">
          <div className="flex justify-center items-center gap-3 sm:gap-4">
            <button className="text-[#4B5675] font-medium text-sm flex items-center gap-1 cursor-pointer hover:text-[#0C0C0D]">
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button className="bg-[#FD521B] text-white w-8 h-8 flex items-center justify-center rounded-[10px] font-bold shadow-xs">
              1
            </button>
            <button className="text-[#4B5675] font-medium w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-[10px] transition-colors cursor-pointer">
              2
            </button>
            <button className="text-[#4B5675] font-medium w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-[10px] transition-colors cursor-pointer">
              3
            </button>

            <button className="text-[#FD521B] font-medium text-sm flex items-center gap-1 cursor-pointer hover:underline">
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
