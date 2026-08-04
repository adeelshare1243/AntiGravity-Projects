'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import UsageMeter from '@/components/storefront/UsageMeter';
import TopUpModal from '@/components/storefront/TopUpModal';
import { Smartphone, QrCode, Zap, Plus, ArrowRight, ShieldCheck, History, Settings, RefreshCw, CreditCard } from 'lucide-react';

export default function UserDashboardPage() {
  const [selectedESim, setSelectedESim] = useState<any>(null);

  const activeESims = [
    {
      id: 'esim-jp-001',
      country: 'Japan',
      flag: '🇯🇵',
      planName: 'Japan Unlimited 7 Days',
      dataUsedGB: 4.2,
      dataTotalGB: 10,
      status: 'Active',
      expiresIn: '5 days left',
      iccid: '89810012345678901234',
    },
    {
      id: 'esim-eu-002',
      country: 'Europe 30+ Countries',
      flag: '🇪🇺',
      planName: 'Europe Regional 20 GB',
      dataUsedGB: 18.5,
      dataTotalGB: 20,
      status: 'Active',
      expiresIn: '2 days left',
      iccid: '89810098765432109876',
    },
  ];

  return (
    <main className="min-h-screen bg-surface-cream text-dark-900 flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Dashboard Header */}
        <section className="bg-[#0D0E25] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5A36]/20 text-[#FF5A36] text-xs font-bold uppercase tracking-wider mb-3">
                <Smartphone className="w-3.5 h-3.5" /> Welcome Back, John
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">eSIM Control Dashboard</h1>
              <p className="text-grey-300 text-xs sm:text-sm mt-1">2 Active Plans • Real-time Data Meters & Instant QR Codes</p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/my-esims"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 transition-all border border-white/10"
              >
                <span>All My eSIMs</span>
              </Link>
              <Link
                href="/destinations"
                className="bg-[#FF5A36] hover:bg-[#E04822] text-white font-bold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md shadow-[#FF5A36]/20"
              >
                <Plus className="w-4 h-4" />
                <span>Buy New Plan</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Main Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          {/* Active eSIM Cards */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-[#0D0E25]">Active Travel Data Plans</h2>
              <Link href="/my-esims" className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1">
                <span>Manage all lines</span> <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeESims.map((esim) => (
                <div key={esim.id} className="bg-white rounded-3xl p-6 border border-grey-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{esim.flag}</span>
                        <div>
                          <h3 className="font-bold text-[#0D0E25] text-base">{esim.country}</h3>
                          <p className="text-[11px] text-grey-500 font-semibold">{esim.planName}</p>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                        {esim.status}
                      </span>
                    </div>

                    <div className="mb-6">
                      <UsageMeter usedGB={esim.dataUsedGB} totalGB={esim.dataTotalGB} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-grey-100 flex gap-2">
                    <Link
                      href={`/my-esims/${esim.id}`}
                      className="flex-1 py-2.5 bg-grey-100 hover:bg-grey-200 text-dark-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5 text-[#FF5A36]" />
                      <span>QR Code & APN</span>
                    </Link>
                    <button
                      onClick={() => setSelectedESim(esim)}
                      className="py-2.5 px-4 bg-[#FF5A36] hover:bg-[#E04822] text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Top Up</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/my-esims"
              className="bg-white p-6 rounded-3xl border border-grey-200 hover:border-[#FF5A36] hover:shadow-md transition-all group"
            >
              <Smartphone className="w-8 h-8 text-[#FF5A36] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-[#0D0E25] text-base mb-1">My eSIM Lines</h3>
              <p className="text-xs text-grey-500">View active & past eSIM activation profiles.</p>
            </Link>

            <Link
              href="/account"
              className="bg-white p-6 rounded-3xl border border-grey-200 hover:border-[#FF5A36] hover:shadow-md transition-all group"
            >
              <Settings className="w-8 h-8 text-[#FF5A36] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-[#0D0E25] text-base mb-1">Account Settings</h3>
              <p className="text-xs text-grey-500">Update email, security, and password.</p>
            </Link>

            <Link
              href="/faq"
              className="bg-white p-6 rounded-3xl border border-grey-200 hover:border-[#FF5A36] hover:shadow-md transition-all group"
            >
              <ShieldCheck className="w-8 h-8 text-[#FF5A36] mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-[#0D0E25] text-base mb-1">Installation FAQ</h3>
              <p className="text-xs text-grey-500">Step-by-step setup guides for iOS & Android.</p>
            </Link>
          </div>
        </section>

        {selectedESim && <TopUpModal esim={selectedESim} onClose={() => setSelectedESim(null)} />}
      </div>

      <Footer />
    </main>
  );
}
