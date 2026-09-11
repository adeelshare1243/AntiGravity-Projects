'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import {
  ChevronRight,
  Check,
  Calendar,
  Clock,
  HelpCircle,
  Signal,
  Wifi,
  ExternalLink,
} from 'lucide-react';

interface TOCItem {
  id: string;
  label: string;
}

const TOC_ITEMS: TOCItem[] = [
  { id: 'saily-overview', label: 'Saily eSIM Overview' },
  { id: 'airalo-overview', label: 'Airalo eSIM Overview' },
  { id: 'holafly-unlimited', label: '1. Holafly Unlimited' },
  { id: 'nomad-plans', label: '2. Nomad Travel Plans' },
  { id: 'yoho-mobile', label: 'Yoho Mobile Review' },
  { id: 'network-coverage', label: 'Dutch Network Coverage' },
  { id: 'activation-faq', label: 'Activation FAQ' },
];

export default function BlogPostPage() {
  const [activeTOC, setActiveTOC] = useState('saily-overview');

  const scrollToSection = (id: string) => {
    setActiveTOC(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      {/* Main Container */}
      <main className="w-full max-w-[1140px] mx-auto px-4 py-8 lg:py-12 flex-1">
        {/* Grid System: 1fr left column + 280px sticky right column */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_280px] gap-12 xl:gap-16 items-start">
          {/* ================= LEFT CONTENT COLUMN ================= */}
          <article className="w-full min-w-0">
            {/* 1. Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-6">
              <Link
                href="/blog"
                className="hover:text-[#F88B35] transition-colors"
              >
                Blog
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-gray-900 font-semibold">Netherlands</span>
            </nav>

            {/* 2. Title */}
            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-black text-gray-900 leading-tight tracking-tight mb-6">
              Best eSIM for Netherlands (2026): 5 Top Providers Compared
            </h1>

            {/* 3. Meta Details */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <span>Updated Jun 15, 2026</span>
              <span>•</span>
              <span>5 min read</span>
            </div>

            {/* 4. Author Block */}
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 rounded-full bg-[#1E2330] text-white flex items-center justify-center text-xs font-bold mr-3 shadow-xs">
                ST
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Written by Soovia Editorial Team
              </span>
            </div>

            {/* 5. Intro Paragraph */}
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Planning a trip to the Netherlands? Whether you are wandering
              through the historic canals of Amsterdam, exploring the modern
              architecture of Rotterdam, or cycling past tulip fields in Lisse,
              having reliable, high-speed mobile data is crucial. This guide
              compares the 5 best eSIM providers for the Netherlands in 2026 to
              help you make the perfect choice.
            </p>

            {/* 6. Hero Image Banner */}
            <div className="w-full aspect-[21/9] bg-[#1E2330] rounded-[24px] overflow-hidden relative my-10 shadow-md group">
              {/* Background Canal Imagery */}
              <img
                src="https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200&q=80"
                alt="Amsterdam Canals"
                className="w-full h-full object-cover opacity-65 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

              {/* Center Overlay: Title & Netherlands Flag */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-md tracking-tight mb-4">
                  Best eSIM for Netherlands
                </h2>
                {/* 3D-styled wavy Netherlands flag card */}
                <div className="w-24 sm:w-28 h-16 sm:h-18 rounded-[14px] overflow-hidden shadow-2xl border border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300 flex flex-col">
                  <div className="flex-1 bg-[#AE1C28]" />
                  <div className="flex-1 bg-white" />
                  <div className="flex-1 bg-[#21468B]" />
                </div>
              </div>
            </div>

            {/* Second Intro Paragraph */}
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Navigating public transit on NS Dutch Railways, summoning an Uber,
              or looking up the best stroopwafel bakeries in Jordaan requires
              instant data from the moment you touchdown at Schiphol Airport.
              Instead of queueing at kiosk counters to swap physical nano-SIMs,
              a prepaid travel eSIM connects seamlessly to Dutch 5G networks
              within seconds.
            </p>

            {/* 7. Quick Answer Callout */}
            <div className="bg-[#F7F7F7] rounded-[20px] p-6 sm:p-8 my-8 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Quick Answer
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                Here is a quick side-by-side look at the top Netherlands eSIM
                providers in 2026. The table compares starting prices, common data
                sizes, and the type of traveler each provider fits best. Holafly
                is listed separately because it offers unlimited-style plans
                instead of fixed 1GB, 3GB, or 10GB data packages.
              </p>

              <div className="divide-y divide-gray-200/80 text-sm">
                <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] py-2.5 items-start">
                  <span className="font-bold text-gray-900">Soovia</span>
                  <span className="text-gray-700">
                    Best overall mix of price, setup, and practical data sizes
                  </span>
                </div>
                <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] py-2.5 items-start">
                  <span className="font-bold text-gray-900">Airalo</span>
                  <span className="text-gray-700">
                    Best for travelers who already use a familiar eSIM
                    marketplace
                  </span>
                </div>
                <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] py-2.5 items-start">
                  <span className="font-bold text-gray-900">Holafly</span>
                  <span className="text-gray-700">
                    Best for a genuinely unlimited data buying experience
                  </span>
                </div>
                <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] py-2.5 items-start">
                  <span className="font-bold text-gray-900">Saily</span>
                  <span className="text-gray-700">
                    Best for a familiar marketplace experience
                  </span>
                </div>
                <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] py-2.5 items-start">
                  <span className="font-bold text-gray-900">Nomad</span>
                  <span className="text-gray-700">
                    Best low-cost fixed-data alternative
                  </span>
                </div>
              </div>
            </div>

            {/* 8. Best eSIM Providers at a Glance */}
            <section id="saily-overview" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
                Best eSIM Providers for Netherlands at a Glance
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                Here is a quick side-by-side look at the top Netherlands eSIM
                providers in 2026. The table compares starting prices, common data
                sizes, and the type of traveler each provider fits best. Holafly
                is listed separately because it offers unlimited-style plans
                instead of fixed 1GB, 3GB, or 10GB data packages.
              </p>

              {/* Data Table */}
              <div className="w-full overflow-x-auto my-8 bg-[#F7F7F7] rounded-[20px] p-6 border border-gray-100">
                <table className="w-full text-left border-collapse text-sm text-gray-800 min-w-[560px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="font-bold pb-4 text-gray-900">Provider</th>
                      <th className="font-bold pb-4 text-gray-900">1 GB</th>
                      <th className="font-bold pb-4 text-gray-900">3 GB</th>
                      <th className="font-bold pb-4 text-gray-900">10 GB</th>
                      <th className="font-bold pb-4 text-gray-900">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/60">
                    <tr>
                      <td className="py-4 font-bold text-gray-900">Saily</td>
                      <td className="py-4 text-gray-600">$4.00 / 7 days</td>
                      <td className="py-4 text-gray-600">$6.90 / 30 days</td>
                      <td className="py-4 text-gray-600">$16.90 / 30 days</td>
                      <td className="py-4 text-gray-700">
                        Best overall balance
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-gray-900">Airalo</td>
                      <td className="py-4 text-gray-600">$4.50 / 7 days</td>
                      <td className="py-4 text-gray-600">$8.00 / 30 days</td>
                      <td className="py-4 text-gray-600">$18.00 / 30 days</td>
                      <td className="py-4 text-gray-700">
                        Familiar marketplace
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-gray-900">Holafly</td>
                      <td className="py-4 text-gray-600">$6.00 / 1 day</td>
                      <td className="py-4 text-gray-600">$19.00 / 5 days</td>
                      <td className="py-4 text-gray-600">$34.00 / 10 days</td>
                      <td className="py-4 text-gray-700">
                        Security focused app
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-gray-900">Nomad</td>
                      <td className="py-4 text-gray-600">$4.00 / 7 days</td>
                      <td className="py-4 text-gray-600">$7.00 / 30 days</td>
                      <td className="py-4 text-gray-600">$15.00 / 30 days</td>
                      <td className="py-4 text-gray-700">
                        Best overall balance
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold text-gray-900">
                        Yoho Mobile
                      </td>
                      <td className="py-4 text-gray-600">$4.00 / 7 days</td>
                      <td className="py-4 text-gray-600">$6.50 / 30 days</td>
                      <td className="py-4 text-gray-600">$14.50 / 30 days</td>
                      <td className="py-4 text-gray-700">
                        Best overall balance
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Note Callout */}
            <div className="bg-[#F7F7F7] rounded-[20px] p-6 my-8 border border-gray-100">
              <h4 className="text-base font-bold text-gray-900 mb-2">Note</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Prices were checked on 20 June 2026. eSIM prices, discounts,
                validity periods, and available packages can change, so always
                confirm the final checkout page before buying.
              </p>
            </div>

            {/* 9. Provider Block: 1. Saily */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                1. Saily: Best Overall Balance
              </h2>

              {/* Logo */}
              <div className="w-16 h-16 rounded-full bg-[#9c7846] text-white flex items-center justify-center font-bold text-xs mb-6 shadow-sm tracking-wider select-none">
                LOGO
              </div>

              {/* Pros & Key Features */}
              <div className="mb-6">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-4">
                  PROS & KEY FEATURES
                </span>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                    <span>
                      Sophisticated security protocols designed by the Nord
                      Security team
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                    <span>
                      Instant single-tap activation directly through the Saily
                      App
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                    <span>
                      Operates on premium KPN network for excellent 5G speeds
                      in urban areas
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                    <span>
                      Flexible low-cost data packages perfect for short stays
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Tier Card */}
              <div className="w-full bg-[#F7F7F7] rounded-[20px] p-6 border border-gray-100 my-6">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200/80 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <span>Plan</span>
                  <span>Price</span>
                </div>
                <div className="divide-y divide-gray-200/60 text-sm text-gray-800">
                  <div className="flex justify-between items-center py-3">
                    <span className="font-medium">1GB / 7 days</span>
                    <span className="font-bold text-gray-900">$4.00</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-medium">3GB / 30 days</span>
                    <span className="font-bold text-gray-900">$6.90</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-medium">5GB / 30 days</span>
                    <span className="font-bold text-gray-900">$11.00</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-medium">10GB / 30 days</span>
                    <span className="font-bold text-gray-900">$16.90</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-medium">20GB / 30 days</span>
                    <span className="font-bold text-gray-900">$26.00</span>
                  </div>
                </div>
              </div>

              {/* Best Choice For */}
              <div className="my-6">
                <h4 className="text-base font-bold text-gray-900 mb-2">
                  Best choice for:
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Travelers who want the safest overall balance of plan sizes,
                  setup, coverage, and support.
                </p>
              </div>

              {/* Action Button */}
              <Link
                href="/destinations/netherlands"
                className="inline-block bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors shadow-xs"
              >
                View Plans
              </Link>
            </section>

            {/* 10. Additional Sections for Full Reference Navigation */}
            <section
              id="airalo-overview"
              className="mt-16 pt-8 border-t border-gray-100 scroll-mt-28"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Airalo eSIM Overview
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                Airalo is one of the pioneer consumer eSIM marketplaces worldwide,
                providing coverage across 200+ countries with its popular &ldquo;Eurolink&rdquo;
                and &ldquo;Breeze&rdquo; Dutch regional profiles on the Vodafone network.
              </p>
            </section>

            <section
              id="holafly-unlimited"
              className="mt-16 pt-8 border-t border-gray-100 scroll-mt-28"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Holafly Unlimited
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                If you stream Netflix, run multiple Zoom video conferences, and upload
                content continually, Holafly provides day-by-day continuous unlimited
                plans across the Netherlands with 24/7 multilingual support.
              </p>
            </section>

            <section
              id="nomad-plans"
              className="mt-16 pt-8 border-t border-gray-100 scroll-mt-28"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Nomad Travel Plans
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                Nomad provides sleek iOS and Android app-based eSIM purchases with
                transparent local carrier routing on KPN and Odido, ensuring low latency
                and instant activation upon landing.
              </p>
            </section>

            <section
              id="yoho-mobile"
              className="mt-16 pt-8 border-t border-gray-100 scroll-mt-28"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Yoho Mobile Review
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                Yoho Mobile stands out with customizable daily allowances and pay-as-you-go
                top-ups, giving budget travelers the flexibility to tailor their Dutch trip
                without paying for unused megabytes.
              </p>
            </section>

            <section
              id="network-coverage"
              className="mt-16 pt-8 border-t border-gray-100 scroll-mt-28"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dutch Network Coverage (KPN, Vodafone &amp; Odido)
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                The Netherlands boasts world-class cellular infrastructure with 99%+ 5G
                landmass coverage. KPN leads nationwide rural coverage, while Vodafone and
                Odido offer blistering 5G peak performance in Amsterdam, Rotterdam, The Hague,
                and Utrecht.
              </p>
            </section>

            <section
              id="activation-faq"
              className="mt-16 pt-8 border-t border-gray-100 scroll-mt-28"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Activation FAQ
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                <strong>Can I keep my WhatsApp number?</strong>
                <br />
                Yes! Installing an eSIM does not alter your WhatsApp account or physical SIM.
                You keep your original chat history, contacts, and phone number intact.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>When should I install my Netherlands eSIM?</strong>
                <br />
                We recommend scanning your QR code 1 day before departure while connected
                to home Wi-Fi. Turn on the line and enable data roaming once you land at Schiphol.
              </p>
            </section>
          </article>

          {/* ================= RIGHT STICKY TOC COLUMN ================= */}
          <aside className="hidden lg:block relative w-full">
            <div className="sticky top-28 bg-[#F7F7F7] rounded-[24px] p-6 border border-gray-100">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-6">
                TABLE OF CONTENT
              </h3>

              <div className="flex flex-col gap-4">
                {TOC_ITEMS.map((item) => {
                  const isActive = activeTOC === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left text-sm font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'text-[#F88B35] font-bold'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
