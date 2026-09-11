'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Copy,
  Settings,
  Smartphone,
  ChevronRight,
  Signal,
  Database,
  ShoppingBag,
  Check,
  QrCode,
  X,
  Clock,
  HardDrive,
  AlertTriangle,
  PenLine,
} from 'lucide-react';

// Custom SimCard SVG Icon to match exact design requirements
const SimCardIcon = ({ className = 'w-5 h-5 text-[#4B5675]' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-4-4Z" />
    <path d="M14 2v6h6" />
    <rect x="8" y="12" width="4" height="4" rx="1" />
  </svg>
);

interface TopUpPackage {
  id: string;
  data: string;
  validity: string;
  originalPrice: string;
  price: string;
}

const TOP_UP_PACKAGES: TopUpPackage[] = [
  {
    id: 'pkg-1',
    data: '1 GB',
    validity: '7 Days',
    originalPrice: '$2.99',
    price: '$2.49 USD',
  },
  {
    id: 'pkg-2',
    data: '2 GB',
    validity: '7 Days',
    originalPrice: '$2.99',
    price: '$4.69 USD',
  },
  {
    id: 'pkg-3',
    data: '3 GB',
    validity: '15 Days',
    originalPrice: '$7.99',
    price: '$6.99 USD',
  },
  {
    id: 'pkg-4',
    data: '5 GB',
    validity: '30 Days',
    originalPrice: '$11.99',
    price: '$9.99 USD',
  },
  {
    id: 'pkg-5',
    data: '10 GB',
    validity: '30 Days',
    originalPrice: '$19.99',
    price: '$16.99 USD',
  },
  {
    id: 'pkg-6',
    data: '20 GB',
    validity: '30 Days',
    originalPrice: '$34.99',
    price: '$29.99 USD',
  },
];

export default function EsimDetailPage() {
  const [copiedIccid, setCopiedIccid] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isIosModalOpen, setIsIosModalOpen] = useState(false);

  // Android Modal States
  const [activeTab, setActiveTab] = useState<'qr' | 'manual'>('qr');
  const [selectedBrand, setSelectedBrand] = useState<'Google Pixel' | 'Samsung'>('Google Pixel');
  const [accessDataEnabled, setAccessDataEnabled] = useState(true);

  // iOS Modal States
  const [iosActiveTab, setIosActiveTab] = useState<'qr' | 'manual'>('qr');
  const [selectedIosVersion, setSelectedIosVersion] = useState<'iOS 17+' | 'iOS 16' | 'iOS 15-'>('iOS 17+');
  const [iosAccessDataEnabled, setIosAccessDataEnabled] = useState(true);

  const [selectedTopUp, setSelectedTopUp] = useState<TopUpPackage | null>(null);
  const [purchasedSuccess, setPurchasedSuccess] = useState(false);

  const iccidNumber = '8948010010067975883';
  const smDpAddress = 'rsp.globalesim.com';
  const activationCode = 'GB-8948010010067975883-E2';
  const manualCodeString = 'LPA:1$smdp.io$K2-33CWB1-6X2NGU';

  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedManualCode, setCopiedManualCode] = useState(false);
  const [copiedIosManualCode, setCopiedIosManualCode] = useState(false);

  const handleCopyIccid = () => {
    navigator.clipboard.writeText(iccidNumber);
    setCopiedIccid(true);
    setTimeout(() => setCopiedIccid(false), 2500);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(smDpAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyManualCode = () => {
    navigator.clipboard.writeText(manualCodeString);
    setCopiedManualCode(true);
    setTimeout(() => setCopiedManualCode(false), 2500);
  };

  const handleCopyIosManualCode = () => {
    navigator.clipboard.writeText(manualCodeString);
    setCopiedIosManualCode(true);
    setTimeout(() => setCopiedIosManualCode(false), 2500);
  };

  const handleBuyPackage = (pkg: TopUpPackage) => {
    setSelectedTopUp(pkg);
  };

  const handleConfirmPurchase = () => {
    setPurchasedSuccess(true);
    setTimeout(() => {
      setPurchasedSuccess(false);
      setSelectedTopUp(null);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 mt-8 flex flex-col gap-8">
      {/* 2. Hero Section (Dark Card) */}
      <div className="bg-[#1A1D27] rounded-[24px] p-8 flex flex-col md:flex-row justify-between gap-8 w-full overflow-hidden relative shadow-xl">
        {/* Left Column (Text) */}
        <div className="flex flex-col justify-between z-10">
          <div>
            {/* Breadcrumb */}
            <div className="text-slate-400 text-[14px] mb-6 flex items-center gap-2 font-medium">
              <Link href="/my-esims" className="hover:text-white transition-colors">
                My eSIMs
              </Link>
              <span>/</span>
              <span className="text-white">United Kingdom</span>
            </div>

            {/* Title Row */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <img
                src="https://hatscripts.github.io/circle-flags/flags/gb.svg"
                alt="United Kingdom Flag"
                className="w-8 h-8 rounded-full shadow-md object-cover"
              />
              <h1 className="text-[32px] font-bold text-white tracking-tight">
                eSIM for United Kingdom
              </h1>
              <span className="bg-[#E6F8E8] text-[#17B21F] px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#17B21F] animate-pulse" />
                Active
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-white font-medium text-[16px] mb-2">
              Europe (32 Countries) 4G / LTE / 5G Ready
            </p>

            {/* Description */}
            <p className="text-slate-400 text-[14px] max-w-md leading-relaxed">
              Your active digital SIM card. Instant connection across European networks with zero hassle.
            </p>
          </div>
        </div>

        {/* Right Column (Image) */}
        <div className="relative shrink-0 flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800"
            alt="Destination Landscape"
            className="w-full md:w-[320px] h-[180px] rounded-[16px] object-cover shadow-lg border border-white/10"
          />
        </div>
      </div>

      {/* 3. Details Container */}
      <div className="bg-white border border-[#E8E5DD] rounded-[24px] p-6 lg:p-8 flex flex-col gap-8 shadow-xs">
        {/* 4. Info Pills (ICCID & Expiry) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Box 1 (ICCID) */}
          <div className="bg-[#F4F4F5] rounded-[12px] p-4 flex gap-3 items-center group transition-colors hover:bg-slate-100">
            <div className="bg-white p-2.5 rounded-[8px] shadow-xs">
              <SimCardIcon className="w-5 h-5 text-[#4B5675]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-slate-500 font-medium">ICCID</span>
              <span className="font-bold text-[#0C0C0D] text-[14px] tracking-wide">
                {iccidNumber}
              </span>
            </div>
            <button
              onClick={handleCopyIccid}
              title="Copy ICCID"
              className="ml-auto p-2 rounded-lg hover:bg-white text-slate-400 hover:text-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {copiedIccid ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold text-emerald-600">Copied!</span>
                </>
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Box 2 (Expiry) */}
          <div className="bg-[#F4F4F5] rounded-[12px] p-4 flex gap-3 items-center transition-colors hover:bg-slate-100">
            <div className="bg-white p-2.5 rounded-[8px] shadow-xs">
              <CalendarDays className="w-5 h-5 text-[#4B5675]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] text-slate-500 font-medium">Expiry Date</span>
              <span className="font-bold text-[#0C0C0D] text-[14px]">07 August 2026</span>
            </div>
          </div>
        </div>

        {/* 5. eSIM Installation Section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="text-[#FD521B] w-5 h-5" />
            <h2 className="font-bold text-[18px] text-[#0C0C0D]">eSIM Installation</h2>
          </div>

          <div className="flex flex-col gap-3">
            {/* Row 1: Android Device */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsAndroidModalOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsAndroidModalOpen(true);
                }
              }}
              className="border border-[#E8E5DD] rounded-[12px] p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 hover:border-[#FD521B]/50 hover:shadow-xs transition-all group select-none"
            >
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 group-hover:bg-[#FD521B]/10 p-2 rounded-lg transition-colors">
                  <Smartphone className="w-5 h-5 text-slate-600 group-hover:text-[#FD521B] transition-colors" />
                </div>
                <span className="font-medium text-[#0C0C0D] text-[15px]">Android Device</span>
              </div>
              <ChevronRight className="text-slate-400 group-hover:translate-x-1 group-hover:text-[#FD521B] transition-all w-5 h-5" />
            </div>

            {/* Row 2: iOS Device */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsIosModalOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsIosModalOpen(true);
                }
              }}
              className="border border-[#E8E5DD] rounded-[12px] p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 hover:border-[#FD521B]/50 hover:shadow-xs transition-all group select-none"
            >
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 group-hover:bg-[#FD521B]/10 p-2 rounded-lg transition-colors">
                  <Smartphone className="w-5 h-5 text-slate-600 group-hover:text-[#FD521B] transition-colors" />
                </div>
                <span className="font-medium text-[#0C0C0D] text-[15px]">iOS Device</span>
              </div>
              <ChevronRight className="text-slate-400 group-hover:translate-x-1 group-hover:text-[#FD521B] transition-all w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 6. eSIM Usage Section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Signal className="text-[#FD521B] w-5 h-5" />
            <h2 className="font-bold text-[18px] text-[#0C0C0D]">eSIM Usage</h2>
          </div>

          <div className="bg-[#FD521B] rounded-[16px] p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Row */}
            <div className="flex items-center gap-2 text-sm font-medium text-white/90">
              <Database className="w-4 h-4" />
              <span>Remaining Data</span>
            </div>

            {/* Middle Row */}
            <div className="flex justify-between items-end mt-4 mb-3">
              <span className="text-[14px] opacity-90 font-medium">You have active plan</span>
              <span className="font-bold text-[20px] tracking-tight">4.2 / 10 GB</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
              <div className="w-[42%] h-full bg-white rounded-full transition-all duration-500" />
            </div>

            {/* Bottom Text */}
            <span className="text-[12px] text-center mt-3 font-medium opacity-90 block">
              %42 Left
            </span>
          </div>
        </div>

        {/* 7. Buy Top-Up Packages Section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-6 mt-4">
            <ShoppingBag className="text-[#FD521B] w-5 h-5" />
            <h2 className="font-bold text-[18px] text-[#0C0C0D]">Buy Top-Up Packages</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOP_UP_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white border border-[#E8E5DD] rounded-[16px] p-5 flex flex-col hover:border-[#FD521B]/40 hover:shadow-md transition-all group"
              >
                {/* Row 1 (Data) */}
                <div className="flex justify-between items-center mb-3">
                  <div className="text-slate-500 text-sm flex gap-2 items-center">
                    <HardDrive className="w-4 h-4 text-slate-400 group-hover:text-[#FD521B] transition-colors" />
                    <span>Data</span>
                  </div>
                  <span className="font-bold text-[#0C0C0D] text-[15px]">{pkg.data}</span>
                </div>

                {/* Row 2 (Validity) */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-slate-500 text-sm flex gap-2 items-center">
                    <Clock className="w-4 h-4 text-slate-400 group-hover:text-[#FD521B] transition-colors" />
                    <span>Validity</span>
                  </div>
                  <span className="font-bold text-[#0C0C0D] text-[15px]">{pkg.validity}</span>
                </div>

                {/* Footer Row */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[12px] line-through font-medium">
                      {pkg.originalPrice}
                    </span>
                    <span className="text-[#FD521B] font-bold text-[16px]">
                      {pkg.price}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuyPackage(pkg)}
                    className="bg-[#FD521B] text-white px-5 py-2 rounded-[8px] text-[14px] font-bold hover:bg-[#e04513] hover:shadow-md transition-all cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Android Device Installation Modal */}
      {isAndroidModalOpen && (
        <div
          onClick={() => setIsAndroidModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[580px] bg-white rounded-[24px] flex flex-col relative shadow-2xl animate-in fade-in zoom-in duration-200"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 pb-3">
              <h3 className="text-[20px] font-bold text-[#1D1D1B]">Android Device</h3>
              <X
                onClick={() => setIsAndroidModalOpen(false)}
                className="w-6 h-6 text-[#1D1D1B] cursor-pointer hover:opacity-70 transition-opacity"
              />
            </div>

            {/* Scrollable Content Body */}
            <div className="flex flex-col gap-6 p-6 overflow-y-auto max-h-[75vh]">
              {/* Tabs (QR Code / Manual) */}
              <div className="flex justify-center w-full">
                <div className="flex items-center bg-[#F1F1F4] rounded-full p-1 w-full max-w-[360px]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('qr')}
                    className={`flex-1 flex justify-center items-center py-2 text-[14px] font-semibold rounded-full transition-all cursor-pointer ${
                      activeTab === 'qr'
                        ? 'bg-[#F88B35] text-white shadow-sm'
                        : 'bg-transparent text-[#78829D] hover:text-[#1D1D1B]'
                    }`}
                  >
                    QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('manual')}
                    className={`flex-1 flex justify-center items-center py-2 text-[14px] font-semibold rounded-full transition-all cursor-pointer ${
                      activeTab === 'manual'
                        ? 'bg-[#F88B35] text-white shadow-sm'
                        : 'bg-transparent text-[#78829D] hover:text-[#1D1D1B]'
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>

              {/* Warning Banner */}
              <div className="flex items-start gap-3 bg-[#FFF9F5] border border-[#F88B35] rounded-[12px] p-4">
                <AlertTriangle className="w-5 h-5 text-[#F88B35] mt-0.5 shrink-0" />
                <p className="text-[#F88B35] text-[12px] font-medium leading-[15px]">
                  WARNING! Many eSIMs are typically designed for a one-time installation. If you uninstall your eSIM, reinstalling it may not be possible.
                </p>
              </div>

              {/* Select Android Version */}
              <div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#78829D]" />
                  <span className="text-[14px] font-semibold text-[#1D1D1B]">Select Android Version</span>
                </div>
                <span className="text-[12px] text-[#78829D] mt-2 mb-3 block">
                  Choose your device brand to view the provided eSIM installation guidelines for the selected brand.
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedBrand('Google Pixel')}
                    className={`text-[12px] font-medium px-4 py-2 rounded-[8px] cursor-pointer transition-all ${
                      selectedBrand === 'Google Pixel'
                        ? 'bg-[#FFF9F5] border border-[#F88B35] text-[#F88B35]'
                        : 'bg-white border border-[#99A1B7] text-[#78829D] hover:border-slate-400'
                    }`}
                  >
                    Google Pixel
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBrand('Samsung')}
                    className={`text-[12px] font-medium px-4 py-2 rounded-[8px] cursor-pointer transition-all ${
                      selectedBrand === 'Samsung'
                        ? 'bg-[#FFF9F5] border border-[#F88B35] text-[#F88B35]'
                        : 'bg-white border border-[#99A1B7] text-[#78829D] hover:border-slate-400'
                    }`}
                  >
                    Samsung
                  </button>
                </div>
              </div>

              {/* Install eSIM: QR Code Tab */}
              {activeTab === 'qr' && (
                <div>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#78829D]" />
                    <span className="text-[14px] font-semibold text-[#1D1D1B]">Install eSIM</span>
                  </div>
                  <span className="text-[12px] text-[#78829D] mt-2 mb-4 block">
                    Scan the QR code on another device to install your eSIM. Ensure a stable internet connection on your device before proceeding.
                  </span>

                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    {/* QR Box (Left) */}
                    <div className="w-[174px] h-[174px] p-3 border border-[#99A1B7] rounded-[12px] bg-white shrink-0 flex items-center justify-center shadow-xs">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=LPA:1$rsp.globalesim.com$8948010010067975883"
                        alt="eSIM QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Steps List (Right) */}
                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] text-[#78829D] leading-[15px]">
                        1. Navigate to &apos;Settings,&apos; click on &apos;Network &amp; internet,&apos; and then tap &apos;(+)&apos; next to the SIMs section.
                      </p>
                      <p className="text-[12px] text-[#78829D] leading-[15px]">
                        2. Choose &apos;Download a SIM instead?&apos; and proceed by clicking &apos;Next.&apos;
                      </p>
                      <p className="text-[12px] text-[#78829D] leading-[15px]">
                        3. Scan the QR code provided here.
                      </p>
                      <p className="text-[12px] text-[#78829D] leading-[15px]">
                        4. Tap &apos;Settings/Done&apos; once you see the Download Finished screen.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Install eSIM: Manual Tab */}
              {activeTab === 'manual' && (
                <div>
                  <div className="flex items-center gap-2">
                    <PenLine className="w-4 h-4 text-[#78829D]" />
                    <span className="text-[14px] font-semibold text-[#1D1D1B]">Manual eSIM Installation</span>
                  </div>
                  <span className="text-[12px] text-[#78829D] mt-2 mb-4 block">
                    If your device does not support QR scanning, copy and enter the details below into your system settings manually.
                  </span>

                  {/* Parameters Card */}
                  <div className="bg-[#F1F1F4] rounded-[12px] p-4 mb-4 flex flex-col gap-2">
                    <span className="text-[12px] font-medium text-[#78829D]">
                      SM-DP+ Address &amp; Activation Code
                    </span>
                    <div className="bg-white border border-[#DBDFE9] rounded-[8px] p-2 pl-3 flex justify-between items-center gap-2">
                      <span className="text-[12px] font-medium text-[#1D1D1B] font-mono truncate">
                        {manualCodeString}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyManualCode}
                        className="bg-[#FFF9F5] border border-[#F88B35] text-[#F88B35] text-[12px] font-medium px-3 py-1.5 rounded-[6px] hover:bg-[#FFEFE5] transition-colors cursor-pointer shrink-0"
                      >
                        {copiedManualCode ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                  </div>

                  {/* Steps List */}
                  <div className="flex flex-col gap-2">
                    <p className="text-[12px] text-[#78829D] leading-[15px]">
                      1. Under Network &amp; internet settings, tap &apos;eSIM setup manually&apos;.
                    </p>
                    <p className="text-[12px] text-[#78829D] leading-[15px]">
                      2. Enter the SM-DP+ Address copy-pasted above.
                    </p>
                    <p className="text-[12px] text-[#78829D] leading-[15px]">
                      3. Follow prompts to finalize and confirm the plan activation.
                    </p>
                  </div>
                </div>
              )}

              {/* Access Data Toggle */}
              <div className="flex justify-between items-center bg-[#F1F1F4] rounded-[12px] p-4">
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-[#1D1D1B]">Access Data</span>
                  <span className="text-[12px] text-[#78829D]">Turn on this option to allow mobile data usage.</span>
                </div>
                <div
                  onClick={() => setAccessDataEnabled(!accessDataEnabled)}
                  className={`w-11 h-6 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${
                    accessDataEnabled ? 'bg-[#F88B35] justify-end' : 'bg-[#99A1B7] justify-start'
                  }`}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              {/* Confirm Installation Button */}
              <div className="w-full mt-2">
                <button
                  type="button"
                  onClick={() => setIsAndroidModalOpen(false)}
                  className="w-full bg-[#F88B35] text-white text-[14px] font-bold py-3.5 rounded-[12px] flex justify-center items-center hover:shadow-md transition-all cursor-pointer"
                >
                  Confirm Installation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS Device Installation Modal */}
      {isIosModalOpen && (
        <div
          onClick={() => setIsIosModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[580px] bg-white rounded-[24px] flex flex-col relative shadow-2xl animate-in fade-in zoom-in duration-200"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 pb-3">
              <h3 className="text-[20px] font-bold text-[#1D1D1B]">iOS Device</h3>
              <X
                onClick={() => setIsIosModalOpen(false)}
                className="w-6 h-6 text-[#1D1D1B] cursor-pointer hover:opacity-70 transition-opacity"
              />
            </div>

            {/* Scrollable Content Body */}
            <div className="flex flex-col gap-6 p-6 overflow-y-auto max-h-[75vh]">
              {/* Tabs (QR Code / Manual) */}
              <div className="flex justify-center w-full">
                <div className="flex items-center bg-[#F1F1F4] rounded-full p-1 w-full max-w-[360px]">
                  <button
                    type="button"
                    onClick={() => setIosActiveTab('qr')}
                    className={`flex-1 flex justify-center items-center py-2 text-[14px] font-semibold rounded-full transition-all cursor-pointer ${
                      iosActiveTab === 'qr'
                        ? 'bg-[#F88B35] text-white shadow-sm'
                        : 'bg-transparent text-[#78829D] hover:text-[#1D1D1B]'
                    }`}
                  >
                    QR Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setIosActiveTab('manual')}
                    className={`flex-1 flex justify-center items-center py-2 text-[14px] font-semibold rounded-full transition-all cursor-pointer ${
                      iosActiveTab === 'manual'
                        ? 'bg-[#F88B35] text-white shadow-sm'
                        : 'bg-transparent text-[#78829D] hover:text-[#1D1D1B]'
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>

              {/* Warning Banner (Always Visible) */}
              <div className="flex items-start gap-3 bg-[#FFF9F5] border border-[#F88B35] rounded-[12px] p-4">
                <AlertTriangle className="w-5 h-5 text-[#F88B35] mt-0.5 shrink-0" />
                <p className="text-[#F88B35] text-[12px] font-medium leading-[15px]">
                  WARNING! Many eSIMs are typically designed for a one-time installation. If you uninstall your eSIM, reinstalling it may not be possible.
                </p>
              </div>

              {/* Select iOS Version (Always Visible) */}
              <div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#78829D]" />
                  <span className="text-[14px] font-semibold text-[#1D1D1B]">Select iOS Version</span>
                </div>
                <span className="text-[12px] text-[#78829D] mt-2 mb-3 block">
                  Choose your device brand to view the provided eSIM installation guidelines for the selected brand.
                </span>

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setSelectedIosVersion('iOS 17+')}
                    className={`text-[12px] font-medium px-4 py-2 rounded-[8px] cursor-pointer transition-all ${
                      selectedIosVersion === 'iOS 17+'
                        ? 'bg-[#FFF9F5] border border-[#F88B35] text-[#F88B35]'
                        : 'bg-white border border-[#99A1B7] text-[#78829D] hover:border-slate-400'
                    }`}
                  >
                    iOS 17+
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIosVersion('iOS 16')}
                    className={`text-[12px] font-medium px-4 py-2 rounded-[8px] cursor-pointer transition-all ${
                      selectedIosVersion === 'iOS 16'
                        ? 'bg-[#FFF9F5] border border-[#F88B35] text-[#F88B35]'
                        : 'bg-white border border-[#99A1B7] text-[#78829D] hover:border-slate-400'
                    }`}
                  >
                    iOS 16
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIosVersion('iOS 15-')}
                    className={`text-[12px] font-medium px-4 py-2 rounded-[8px] cursor-pointer transition-all ${
                      selectedIosVersion === 'iOS 15-'
                        ? 'bg-[#FFF9F5] border border-[#F88B35] text-[#F88B35]'
                        : 'bg-white border border-[#99A1B7] text-[#78829D] hover:border-slate-400'
                    }`}
                  >
                    iOS 15-
                  </button>
                </div>
              </div>

              {/* Install eSIM: QR Code View */}
              {iosActiveTab === 'qr' && (
                <div>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#78829D]" />
                    <span className="text-[14px] font-semibold text-[#1D1D1B]">Install eSIM</span>
                  </div>
                  <span className="text-[12px] text-[#78829D] mt-2 mb-4 block">
                    Scan the QR code on another device to install your eSIM. Ensure a stable internet connection on your iPhone before proceeding.
                  </span>

                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    {/* QR Box (Left) */}
                    <div className="w-[174px] h-[174px] p-3 border border-[#99A1B7] rounded-[12px] bg-white shrink-0 flex items-center justify-center shadow-xs">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=LPA:1$rsp.globalesim.com$8948010010067975883"
                        alt="eSIM QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Steps List (Right) */}
                    <div className="flex flex-col gap-2">
                      <p className="text-[12px] text-[#78829D] leading-[15px]">
                        1. Navigate to Settings &gt; Cellular / Mobile Data &gt; Add eSIM.
                      </p>
                      <p className="text-[12px] text-[#78829D] leading-[15px]">
                        2. Scan the QR code or use the Photo library to import.
                      </p>
                      <p className="text-[12px] text-[#78829D] leading-[15px]">
                        3. Label your newly active eSIM and set cellular usage preferences.
                      </p>
                      <p className="text-[12px] text-[#78829D] leading-[15px]">
                        4. Tap &apos;Done&apos; and toggled on Cellular Data roaming.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Install eSIM: Manual View */}
              {iosActiveTab === 'manual' && (
                <div>
                  <div className="flex items-center gap-2">
                    <PenLine className="w-4 h-4 text-[#78829D]" />
                    <span className="text-[14px] font-semibold text-[#1D1D1B]">Manual eSIM Installation</span>
                  </div>
                  <span className="text-[12px] text-[#78829D] mt-2 mb-4 block">
                    If your device does not support QR scanning, copy and enter the details below into your iOS settings manually.
                  </span>

                  {/* Parameters Card */}
                  <div className="bg-[#F1F1F4] rounded-[12px] p-4 mb-4 flex flex-col gap-2">
                    <span className="text-[12px] font-medium text-[#78829D]">
                      SM-DP+ Address &amp; Activation Code
                    </span>
                    <div className="bg-white border border-[#DBDFE9] rounded-[8px] p-2 pl-3 flex justify-between items-center gap-2">
                      <span className="text-[12px] font-medium text-[#1D1D1B] font-mono truncate">
                        {manualCodeString}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyIosManualCode}
                        className="bg-[#FFF9F5] border border-[#F88B35] text-[#F88B35] text-[12px] font-medium px-3 py-1.5 rounded-[6px] hover:bg-[#FFEFE5] transition-colors cursor-pointer shrink-0"
                      >
                        {copiedIosManualCode ? 'Copied!' : 'Copy Code'}
                      </button>
                    </div>
                  </div>

                  {/* Steps List */}
                  <div className="flex flex-col gap-2">
                    <p className="text-[12px] text-[#78829D] leading-[15px]">
                      1. Go to Settings &gt; Cellular &gt; Add eSIM &gt; Use QR Code.
                    </p>
                    <p className="text-[12px] text-[#78829D] leading-[15px]">
                      2. Tap &apos;Enter Details Manually&apos; at the bottom of the screen.
                    </p>
                    <p className="text-[12px] text-[#78829D] leading-[15px]">
                      3. Enter the SM-DP+ Address and Activation Code copy-pasted above.
                    </p>
                  </div>
                </div>
              )}

              {/* Access Data Toggle (Always Visible) */}
              <div className="flex justify-between items-center bg-[#F1F1F4] rounded-[12px] p-4">
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-[#1D1D1B]">Access Data</span>
                  <span className="text-[12px] text-[#78829D]">Turn on this option to allow mobile data usage.</span>
                </div>
                <div
                  onClick={() => setIosAccessDataEnabled(!iosAccessDataEnabled)}
                  className={`w-11 h-6 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${
                    iosAccessDataEnabled ? 'bg-[#F88B35] justify-end' : 'bg-[#99A1B7] justify-start'
                  }`}
                >
                  <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                </div>
              </div>

              {/* Confirm Installation Button (Always Visible) */}
              <div className="w-full mt-2">
                <button
                  type="button"
                  onClick={() => setIsIosModalOpen(false)}
                  className="w-full bg-[#F88B35] text-white text-[14px] font-bold py-3.5 rounded-[12px] flex justify-center items-center hover:shadow-md transition-all cursor-pointer"
                >
                  Confirm Installation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top-Up Purchase Confirmation Modal */}
      {selectedTopUp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            {purchasedSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-bold text-[#0C0C0D]">Top-Up Successful!</h3>
                <p className="text-sm text-slate-500">
                  Added <span className="font-bold text-[#0C0C0D]">{selectedTopUp.data}</span> to your United Kingdom eSIM.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="text-[#FD521B] w-5 h-5" />
                    <h3 className="font-bold text-[18px] text-[#0C0C0D]">Confirm Top-Up</h3>
                  </div>
                  <button
                    onClick={() => setSelectedTopUp(null)}
                    className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-[#FFF9F5] border border-[#FD521B]/20 rounded-xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Package Data</span>
                    <span className="font-bold text-[#0C0C0D]">{selectedTopUp.data}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Validity</span>
                    <span className="font-bold text-[#0C0C0D]">{selectedTopUp.validity}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-[#FD521B]/15 pt-3">
                    <span className="font-bold text-[#0C0C0D]">Total Price</span>
                    <span className="font-bold text-[#FD521B] text-base">{selectedTopUp.price}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTopUp(null)}
                    className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmPurchase}
                    className="flex-1 bg-[#FD521B] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#e04513] transition-colors cursor-pointer shadow-md"
                  >
                    Confirm &amp; Pay
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
