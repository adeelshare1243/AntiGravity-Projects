'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import DeviceCheckerModal from '@/components/storefront/DeviceCheckerModal';
import { Smartphone, Globe2, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#FFFFFF] text-[#0C0B29] flex flex-col justify-between font-sans antialiased">
      <div>
        <Navbar />

        {/* 1. HEADER HERO TEXT */}
        <section className="pt-12 md:pt-16 pb-10 px-4 md:px-8 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0C0B29] tracking-tight">
            How it Works
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-center mt-3 text-base md:text-lg leading-relaxed">
            Three steps to instant connectivity. Choose your plan, scan the QR code, and you&apos;re online — wherever you land.
          </p>
        </section>

        {/* 2. TOP ORANGE APP DOWNLOAD BANNER (Figma Node #24496:40203) */}
        <section className="px-4 md:px-8 mb-16">
          <div className="w-full max-w-[1062px] mx-auto rounded-[32px] overflow-hidden bg-gradient-to-r from-[#FF5A00] via-[#F79E1B] to-[#FF5A00] shadow-[0px_16px_32px_rgba(3,10,62,0.12549)] p-8 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content Column (50%) */}
              <div className="flex flex-col items-start gap-6 text-left z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-[40px] lg:leading-[48px] font-[800] tracking-[-1px] text-white">
                  Download Our App for an Easy eSIM Experience
                </h2>
                <p className="text-sm sm:text-base lg:text-[16px] leading-[140%] font-[400] text-white/95">
                  Get the Soovia app and stay connected wherever you go — buy, manage, and activate your eSIM plans on the go.
                </p>

                {/* Store Buttons Container */}
                <div className="flex flex-row flex-wrap items-center gap-[12px] pt-2">
                  {/* Google Play Store Button */}
                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-row items-center gap-[8px] px-[16px] py-[11px] h-[44px] bg-white rounded-[12px] hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <svg className="w-[24px] h-[24px] shrink-0" viewBox="0 0 512 512">
                      <path fill="#41A5EE" d="M382.9 240.5l-275-161.4C90.3 68.9 76 77.2 76 96v320c0 18.8 14.3 27.1 31.9 16.9l275-161.4c16.1-9.5 16.1-21.5 0-31z"/>
                      <path fill="#00E676" d="M307.9 256l-195-195c-7-7-16.9-8.6-25-4.1l220 220 22-20.9z"/>
                      <path fill="#FF3D00" d="M307.9 256l-220 220c8.1 4.5 18 2.9 25-4.1l195-195-22-20.9z"/>
                      <path fill="#FFC107" d="M382.9 240.5l-75 44.1 22 20.9 53-53c16.1-9.5 16.1-21.5 0-32z"/>
                    </svg>
                    <span className="text-[14px] font-[600] leading-[140%] text-[#252F4A] whitespace-nowrap">Play Store</span>
                  </a>

                  {/* Apple App Store Button */}
                  <a
                    href="https://apple.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-row items-center gap-[8px] px-[16px] py-[11px] h-[44px] bg-white rounded-[12px] hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <svg className="w-[24px] h-[24px] shrink-0 fill-current text-[#000000]" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.03 1.92-14.58-6.15-3.04-2.64-6.93-7.26-11.67-13.86-5.87-8.17-10.47-17.15-13.8-26.96-3.33-9.8-5-19.16-5-28.08 0-13.06 3.23-24.08 9.7-33.06 6.46-8.98 14.77-13.57 24.91-13.78 4.48 0 9.47 1.15 14.97 3.44 5.5 2.3 9.29 3.45 11.37 3.45 1.83 0 5.72-1.2 11.67-3.6 5.95-2.4 10.87-3.52 14.76-3.35 11.03.49 19.82 4.67 26.37 12.54-9.76 5.88-14.5 13.97-14.23 24.28.27 7.95 3.28 14.65 9.03 20.1 5.76 5.45 12.7 8.44 20.83 8.97-2.45 7.18-5.77 14.37-9.97 21.57zm-26.68-101.44c0 6.09-2.22 11.95-6.66 17.58-5.18 6.44-11.45 10.05-18.8 10.83-.27-1.08-.41-2.18-.41-3.3 0-6.19 2.4-12.33 7.21-18.42 4.8-6.09 11.12-9.77 18.96-11.04.14.78.2 1.58.2 2.35z"/>
                    </svg>
                    <span className="text-[14px] font-[600] leading-[140%] text-[#252F4A] whitespace-nowrap">App Store</span>
                  </a>
                </div>
              </div>

              {/* Right Image Column (50%) */}
              <div className="flex items-center justify-center lg:justify-end w-full">
                <img
                  src="/assets/right-mockups-container.png"
                  alt="App Banner Mockups"
                  className="w-full max-w-[480px] h-auto object-contain drop-shadow-2xl pointer-events-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. ALTERNATING 3-STEP PROCESS (ZIG-ZAG GRID) */}
        <section className="px-4 md:px-8 mb-20 space-y-16">
          {/* STEP 01 */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Card Visual */}
            <div className="bg-[#5774CD] rounded-3xl p-8 flex justify-center items-center overflow-hidden h-[360px] md:h-[400px] shadow-md relative group">
              <img
                src="/assets/iphone_mockup.png"
                alt="Step 01 - Choose Your Plan"
                className="w-[200px] md:w-[230px] h-auto drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* Right Text Content */}
            <div className="flex flex-col items-start gap-3">
              <span className="px-3.5 py-1 bg-[#FF5A36]/10 text-[#FF5A36] font-bold text-xs uppercase tracking-wider rounded-full">
                STEP 01
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Choose Your Plan
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                Select your destination country or region, choose the data amount and duration that fits your trip, and complete your purchase in seconds.
              </p>
              {/* Bulleted Checkmark List */}
              <ul className="space-y-2.5">
                {[
                  '190+ countries covered',
                  'Plans from 1 day to 180 days',
                  'From 1 GB to unlimited data',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm md:text-base text-slate-800 font-medium">
                    <div className="w-5 h-5 rounded-full bg-[#FF5A36]/15 flex items-center justify-center text-[#FF5A36] shrink-0">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2.5 6 5 8.5 9.5 3.5" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* STEP 02 (Reversed Grid on Desktop) */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Text Content (Left on desktop) */}
            <div className="flex flex-col items-start gap-3 order-2 md:order-1">
              <span className="px-3.5 py-1 bg-[#FF5A36]/10 text-[#FF5A36] font-bold text-xs uppercase tracking-wider rounded-full">
                STEP 02
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Scan &amp; Install
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                Receive your QR code instantly via email or in the app. Open your phone camera or settings, scan the QR code, and follow the simple 1-tap activation prompt.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Instant QR code delivery',
                  'One-tap installation',
                  'Works with dual SIM devices',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm md:text-base text-slate-800 font-medium">
                    <div className="w-5 h-5 rounded-full bg-[#FF5A36]/15 flex items-center justify-center text-[#FF5A36] shrink-0">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2.5 6 5 8.5 9.5 3.5" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Card Visual (Right on desktop) */}
            <div className="bg-[#5774CD] rounded-3xl p-8 flex justify-center items-center overflow-hidden h-[360px] md:h-[400px] shadow-md relative group order-1 md:order-2">
              <img
                src="/assets/iphone_mockup.png"
                alt="Step 02 - Scan & Install"
                className="w-[200px] md:w-[230px] h-auto drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>

          {/* STEP 03 */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Card Visual */}
            <div className="bg-[#5774CD] rounded-3xl p-8 flex justify-center items-center overflow-hidden h-[360px] md:h-[400px] shadow-md relative group">
              <img
                src="/assets/iphone_mockup.png"
                alt="Step 03 - Connect & Enjoy"
                className="w-[200px] md:w-[230px] h-auto drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            {/* Right Text Content */}
            <div className="flex flex-col items-start gap-3">
              <span className="px-3.5 py-1 bg-[#FF5A36]/10 text-[#FF5A36] font-bold text-xs uppercase tracking-wider rounded-full">
                STEP 03
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Connect &amp; Enjoy
              </h3>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                Turn on Data Roaming when you arrive at your destination. Your phone will automatically connect to the local high-speed network for instant internet access.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Automatic network connection',
                  'High-speed 4G/5G networks',
                  'No roaming or surprise charges',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm md:text-base text-slate-800 font-medium">
                    <div className="w-5 h-5 rounded-full bg-[#FF5A36]/15 flex items-center justify-center text-[#FF5A36] shrink-0">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2.5 6 5 8.5 9.5 3.5" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 4. READY TO GET STARTED BOTTOM ACTION BLOCK */}
        <section className="px-4 md:px-8 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-slate-600 text-sm md:text-base mt-2">
              Check device compatibility or browse data plans for your next trip.
            </p>

            {/* 2-Column Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Card 1: Check Compatibility */}
              <div
                onClick={() => setIsCheckerOpen(true)}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl p-6 flex items-center justify-between cursor-pointer transition-all hover:shadow-md group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#FF5A36] shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                      Check Compatibility
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      200+ supported phones &amp; devices
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#FF5A36] group-hover:translate-x-1 transition-all" />
              </div>

              {/* Card 2: Browse eSIM Plans */}
              <Link
                href="/destinations"
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl p-6 flex items-center justify-between cursor-pointer transition-all hover:shadow-md group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#FF5A36] shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                    <Globe2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                      Browse eSIM Plans
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      190+ countries, instant activation
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-[#FF5A36] group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </section>

        {/* Compatibility Checker Modal */}
        <DeviceCheckerModal
          isOpen={isCheckerOpen}
          onClose={() => setIsCheckerOpen(false)}
        />
      </div>

      <Footer />
    </main>
  );
}

