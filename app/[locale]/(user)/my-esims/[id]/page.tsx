'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import UsageMeter from '@/components/storefront/UsageMeter';
import TopUpModal from '@/components/storefront/TopUpModal';
import { ArrowLeft, QrCode, Copy, Check, Smartphone, ShieldCheck, RefreshCw, Info } from 'lucide-react';

export default function ESimDetailPage() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeOS, setActiveOS] = useState<'iOS' | 'Android'>('iOS');
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const esim = {
    id: 'esim-jp-001',
    country: 'Japan',
    flag: '🇯🇵',
    planName: 'Japan Unlimited 7 Days',
    dataUsedGB: 4.2,
    dataTotalGB: 10,
    status: 'Active',
    expiresIn: '5 days left',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=LPA:1$SM-DP+.ALIPAY.COM$MATCHING_ID_1234567890',
    activationCode: 'LPA:1$SM-DP+.ALIPAY.COM$MATCHING_ID_1234567890',
    smdpAddress: 'SM-DP+.ALIPAY.COM',
    iccid: '89810012345678901234',
    apn: 'globaldata.net',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(esim.activationCode);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <main className="min-h-screen bg-surface-cream text-dark-900 flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <Link
            href="/my-esims"
            className="inline-flex items-center gap-2 text-xs font-bold text-grey-600 hover:text-[#FF5A36] mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My eSIMs
          </Link>

          {/* Header */}
          <div className="bg-white rounded-3xl p-8 border border-grey-200 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{esim.flag}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-extrabold text-[#0D0E25]">{esim.country} eSIM</h1>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {esim.status}
                  </span>
                </div>
                <p className="text-xs text-grey-500 font-semibold">{esim.planName} • ICCID: {esim.iccid}</p>
              </div>
            </div>

            <button
              onClick={() => setIsTopUpOpen(true)}
              className="bg-[#FF5A36] hover:bg-[#E04822] text-white font-bold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md shadow-[#FF5A36]/20 shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Top Up Data</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: QR Code & Manual Details */}
            <div className="lg:col-span-6 space-y-6">
              {/* QR Code Container */}
              <div className="bg-white rounded-3xl p-8 border border-grey-200 text-center shadow-sm">
                <h3 className="font-extrabold text-[#0D0E25] text-lg mb-2">Scan QR Code to Install</h3>
                <p className="text-xs text-grey-500 mb-6">Scan with your phone camera or under Settings &gt; Add eSIM.</p>

                <div className="inline-block p-4 bg-white rounded-2xl border-2 border-grey-200 shadow-xs mb-6">
                  <img src={esim.qrCodeUrl} alt="eSIM QR Activation Code" className="w-48 h-48 mx-auto" />
                </div>

                {/* Manual Code Option */}
                <div className="bg-surface-cream rounded-2xl p-4 text-left border border-grey-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#0D0E25]">Manual Activation Code:</span>
                    <button
                      onClick={handleCopy}
                      className="text-xs font-bold text-[#FF5A36] flex items-center gap-1 hover:underline"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <p className="font-mono text-[11px] text-grey-700 bg-white p-2.5 rounded-xl border border-grey-200 break-all select-all">
                    {esim.activationCode}
                  </p>
                </div>
              </div>

              {/* Usage Meter Card */}
              <div className="bg-white rounded-3xl p-6 border border-grey-200 shadow-sm">
                <h3 className="font-bold text-[#0D0E25] text-base mb-4">Current Plan Usage</h3>
                <UsageMeter usedGB={esim.dataUsedGB} totalGB={esim.dataTotalGB} />
              </div>
            </div>

            {/* Right Column: Installation Tutorial Tabs */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-8 border border-grey-200 shadow-sm">
                <h3 className="font-extrabold text-[#0D0E25] text-lg mb-4">Installation Guide</h3>

                {/* OS Selector */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setActiveOS('iOS')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      activeOS === 'iOS'
                        ? 'bg-[#0D0E25] text-white'
                        : 'bg-grey-100 text-grey-600 hover:bg-grey-200'
                    }`}
                  >
                    🍎 iOS (iPhone)
                  </button>
                  <button
                    onClick={() => setActiveOS('Android')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      activeOS === 'Android'
                        ? 'bg-[#17C653] text-white'
                        : 'bg-grey-100 text-grey-600 hover:bg-grey-200'
                    }`}
                  >
                    🤖 Android
                  </button>
                </div>

                {activeOS === 'iOS' ? (
                  <ol className="space-y-4 text-xs text-grey-700">
                    <li className="p-3.5 rounded-xl bg-surface-cream border border-grey-200">
                      <span className="font-bold text-dark-900">Step 1:</span> Go to <span className="font-semibold text-[#0D0E25]">Settings &gt; Cellular / Mobile Data</span>.
                    </li>
                    <li className="p-3.5 rounded-xl bg-surface-cream border border-grey-200">
                      <span className="font-bold text-dark-900">Step 2:</span> Tap <span className="font-semibold text-[#0D0E25]">Add eSIM</span> or <span className="font-semibold text-[#0D0E25]">Use QR Code</span>.
                    </li>
                    <li className="p-3.5 rounded-xl bg-surface-cream border border-grey-200">
                      <span className="font-bold text-dark-900">Step 3:</span> Scan the QR code above and label line as <span className="font-semibold text-[#0D0E25]">Travel eSIM</span>.
                    </li>
                    <li className="p-3.5 rounded-xl bg-surface-cream border border-grey-200">
                      <span className="font-bold text-dark-900">Step 4:</span> Turn on <span className="font-semibold text-[#FF5A36]">Data Roaming</span> upon landing.
                    </li>
                  </ol>
                ) : (
                  <ol className="space-y-4 text-xs text-grey-700">
                    <li className="p-3.5 rounded-xl bg-surface-cream border border-grey-200">
                      <span className="font-bold text-dark-900">Step 1:</span> Go to <span className="font-semibold text-[#0D0E25]">Settings &gt; Connections &gt; SIM Card Manager</span>.
                    </li>
                    <li className="p-3.5 rounded-xl bg-surface-cream border border-grey-200">
                      <span className="font-bold text-dark-900">Step 2:</span> Tap <span className="font-semibold text-[#0D0E25]">Add Mobile Plan &gt; Scan QR Code</span>.
                    </li>
                    <li className="p-3.5 rounded-xl bg-surface-cream border border-grey-200">
                      <span className="font-bold text-dark-900">Step 3:</span> Confirm download and set APN to <span className="font-semibold text-[#0D0E25] font-mono">{esim.apn}</span>.
                    </li>
                  </ol>
                )}
              </div>
            </div>
          </div>
        </div>

        {isTopUpOpen && <TopUpModal esim={esim} onClose={() => setIsTopUpOpen(false)} />}
      </div>

      <Footer />
    </main>
  );
}
