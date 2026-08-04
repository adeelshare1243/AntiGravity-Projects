'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Wallet,
  Zap,
  Info,
  Gift,
  Copy,
  Share2,
  Plus,
  Check,
  X,
  Globe,
  Barcode,
  Database,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function MyEsimsPage() {
  const [esims, setEsims] = useState<any[]>([
    {
      id: 'esim-1',
      country: 'United Kingdom',
      flagCode: 'gb',
      iccid: '8948010010067975883',
      coverage: 'United Kingdom',
      dataTotal: '10 GB',
      validity: '30 Days',
      dataUsed: '4.2',
      dataMax: '10',
      percentLeft: '42%',
      progressWidth: 'w-[42%]',
    },
    {
      id: 'esim-2',
      country: 'France',
      flagCode: 'fr',
      iccid: '8948010010067975994',
      coverage: 'France',
      dataTotal: '5 GB',
      validity: '15 Days',
      dataUsed: '2.1',
      dataMax: '5',
      percentLeft: '42%',
      progressWidth: 'w-[42%]',
    },
    {
      id: 'esim-3',
      country: 'Germany',
      flagCode: 'de',
      iccid: '8948010010067976001',
      coverage: 'Germany & Europe',
      dataTotal: '10 GB',
      validity: '30 Days',
      dataUsed: '6.8',
      dataMax: '10',
      percentLeft: '68%',
      progressWidth: 'w-[68%]',
    },
    {
      id: 'esim-4',
      country: 'Japan',
      flagCode: 'jp',
      iccid: '8948010010067977112',
      coverage: 'Japan',
      dataTotal: '20 GB',
      validity: '30 Days',
      dataUsed: '8.4',
      dataMax: '20',
      percentLeft: '42%',
      progressWidth: 'w-[42%]',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'Current' | 'Expired'>('Current');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedIccid, setCopiedIccid] = useState<string | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const referralCode = 'DAN19';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://soovia.com/ref/${referralCode}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyIccid = (iccid: string) => {
    navigator.clipboard.writeText(iccid);
    setCopiedIccid(iccid);
    setTimeout(() => setCopiedIccid(null), 2500);
  };

  return (
    <div className="w-full relative">
      {/* 1. PAGE HEADER (Hero Banner) */}
      <section className="bg-[#F4F4F5] rounded-[24px] py-12 px-6 flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-8 shadow-xs border border-slate-200/50">
        <h1 className="text-[32px] font-bold text-[#0C0C0D] mb-3 tracking-tight">My eSIMs</h1>
        <p className="text-[14px] text-slate-500 max-w-md leading-relaxed">
          Here, you can find and manage all your eSIMs in one place.
        </p>
      </section>

      {/* CONDITIONAL RENDER: EMPTY vs POPULATED STATE */}
      {esims.length === 0 ? (
        /* EMPTY STATE SECTION */
        <section className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-16 px-4">
          <Image
            src="/empty-esims.svg"
            alt="No eSIMs found"
            width={194}
            height={206}
            className="mb-6 object-contain"
          />
          <h2 className="text-[20px] font-bold text-[#0C0C0D] mb-2">No eSIMs yet</h2>
          <p className="text-[14px] text-slate-500 mb-6">
            Purchase an eSIM plan to get started.
          </p>
          <Link
            href="/destinations"
            className="bg-[#FD521B] hover:bg-[#e04412] text-white px-6 py-3 rounded-[10px] font-medium transition-all shadow-xs hover:shadow-md cursor-pointer inline-flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Browse Plans</span>
          </Link>
        </section>
      ) : (
        /* POPULATED STATE SECTION */
        <div className="w-full">
          {/* 2. POPULATED STATE TABS */}
          <div className="flex gap-3 mb-6 max-w-4xl mx-auto px-4">
            <button
              onClick={() => setActiveTab('Current')}
              className={`px-6 py-2 rounded-[10px] text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'Current'
                  ? 'bg-[#0C0C0D] text-white shadow-xs'
                  : 'bg-white border border-[#E8E5DD] text-[#4B5675] hover:bg-slate-50'
              }`}
            >
              Current
            </button>
            <button
              onClick={() => setActiveTab('Expired')}
              className={`px-6 py-2 rounded-[10px] text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'Expired'
                  ? 'bg-[#0C0C0D] text-white shadow-xs'
                  : 'bg-white border border-[#E8E5DD] text-[#4B5675] hover:bg-slate-50'
              }`}
            >
              Expired
            </button>
          </div>

          {/* 3 & 4. ESIM CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12 px-4">
            {esims.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E8E5DD] rounded-[24px] p-6 flex flex-col gap-5 shadow-xs hover:shadow-md transition-all"
              >
                {/* Header Row */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-100 flex items-center justify-center">
                      <img
                        src={`https://flagcdn.com/w40/${item.flagCode}.png`}
                        alt={item.country}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-bold text-[#0C0C0D] text-[16px]">{item.country}</span>
                    <span className="bg-[#E6F8E8] text-[#17B21F] text-[12px] font-bold px-2 py-1 rounded-full flex items-center gap-1.5 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#17B21F]" /> Active
                    </span>
                  </div>

                  <button className="border border-[#E8E5DD] text-[#0C0C0D] px-4 py-1.5 rounded-[10px] text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer">
                    Top Up
                  </button>
                </div>

                {/* Details Row 1 (ICCID & Coverage) */}
                <div className="flex flex-col gap-2.5 text-sm pt-1">
                  {/* ICCID */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Barcode className="w-4 h-4 text-slate-400" />
                      <span>ICCID</span>
                    </div>
                    <button
                      onClick={() => handleCopyIccid(item.iccid)}
                      className="font-mono font-bold text-xs text-[#0C0C0D] flex items-center gap-1.5 hover:text-[#FD521B] cursor-pointer transition-colors"
                      title="Click to copy ICCID"
                    >
                      <span>{item.iccid}</span>
                      {copiedIccid === item.iccid ? (
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  </div>

                  {/* Coverage */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span>Coverage</span>
                    </div>
                    <span className="font-bold text-xs text-[#0C0C0D]">{item.coverage}</span>
                  </div>
                </div>

                {/* Details Row 2 (Data & Validity Boxes) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#F8F9FA] rounded-[12px] p-3 flex flex-col border border-slate-100">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-slate-400" />
                      <span>Data</span>
                    </div>
                    <span className="text-[15px] font-bold text-[#0C0C0D] mt-1">
                      {item.dataTotal}
                    </span>
                  </div>

                  <div className="bg-[#F8F9FA] rounded-[12px] p-3 flex flex-col border border-slate-100">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Validity</span>
                    </div>
                    <span className="text-[15px] font-bold text-[#0C0C0D] mt-1">
                      {item.validity}
                    </span>
                  </div>
                </div>

                {/* Remaining Data Section (Orange Block) */}
                <div className="bg-[#FD521B] rounded-[16px] p-4 text-white shadow-xs">
                  <div className="text-sm font-medium flex items-center gap-1.5 opacity-95">
                    <TrendingUp className="w-4 h-4" />
                    <span>Remaining Data</span>
                  </div>

                  <div className="font-bold flex justify-between items-center mt-2 text-sm">
                    <span className="opacity-90 font-normal">You have</span>
                    <span>
                      {item.dataUsed} / {item.dataMax} GB
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-white/30 rounded-full mt-3 overflow-hidden">
                    <div className={`h-full bg-white rounded-full ${item.progressWidth}`} />
                  </div>

                  <div className="text-[12px] text-center mt-2 font-medium opacity-90">
                    {item.percentLeft} Left
                  </div>
                </div>

                {/* Footer Button */}
                <button className="bg-[#F8F9FA] text-[#0C0C0D] w-full h-[48px] flex items-center justify-center rounded-[10px] font-bold mt-1 hover:bg-slate-200 transition-colors cursor-pointer text-sm">
                  See Details
                </button>
              </div>
            ))}
          </div>

          {/* 5. PAGINATION */}
          <div className="max-w-4xl mx-auto px-4 pb-16">
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
          </div>
        </div>
      )}

      {/* REWARDS / UTILITY CARDS SECTION */}
      <section className="max-w-4xl mx-auto flex flex-col gap-6 px-4 pb-20">
        {/* CARD 1: SOOVIAMONEY BALANCE */}
        <div className="bg-[#F8F9FA] border border-[#E8E5DD] rounded-[16px] p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#FD521B]" />
              <span className="text-[12px] font-medium text-[#0C0C0D]">SooviaMoney Balance</span>
            </div>
            <div className="text-[24px] font-bold text-[#0C0C0D] mt-2 tracking-tight">$0.00 SM</div>
          </div>

          <div className="bg-white rounded-[10px] p-4 mt-5 flex justify-between items-center border border-slate-200/60 shadow-2xs">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FD521B] fill-[#FD521B]" />
              <span className="text-[14px] font-bold text-[#0C0C0D]">Earn with every purchase</span>
            </div>
            <button
              type="button"
              onClick={() => setIsInfoModalOpen(true)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors p-1"
              title="Learn about SooviaMoney"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CARD 2: REFERRAL PROGRAM */}
        <div className="bg-[#F8F9FA] border border-[#E8E5DD] rounded-[16px] p-6 shadow-xs">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#FD521B]" />
            <span className="text-[16px] font-bold text-[#0C0C0D]">
              Invite a friend — you get $2.00, they get $1.00
            </span>
          </div>

          <div>
            <label className="text-[12px] font-medium text-slate-500 mb-2 mt-6 block">
              Your referral link
            </label>
            <div className="bg-white h-[48px] rounded-[10px] border border-slate-200/80 flex items-center px-4 font-bold text-[#0C0C0D] w-full text-[14px]">
              {referralCode}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <button
              onClick={handleCopyLink}
              className="bg-white border border-slate-200 text-[#0C0C0D] h-[48px] rounded-[10px] font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer text-sm shadow-xs"
            >
              {copiedCode ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copiedCode ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="bg-[#FD521B] hover:bg-[#e04412] text-white h-[48px] rounded-[10px] font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all cursor-pointer text-sm shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </section>

      {/* SOOVIAMONEY INFO MODAL */}
      {isInfoModalOpen && (
        <div
          onClick={() => setIsInfoModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-[520px] rounded-[24px] p-8 flex flex-col gap-6 shadow-[0px_16px_32px_rgba(0,0,0,0.12)] relative border border-slate-100"
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#F7F7F7] rounded-[8px] flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5 text-[#8BE362]" />
                </div>
                <h3 className="text-[18px] font-[800] text-[#111111] font-sans">
                  What is SooviaMoney?
                </h3>
              </div>
              <button
                onClick={() => setIsInfoModalOpen(false)}
                className="text-[#666660] cursor-pointer hover:opacity-70 transition-opacity p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[14px] leading-[140%] text-[#4B5675]">
              You earn SooviaMoney with every eSIM purchase and top-up. Use your balance on future orders for instant discounts. The more you buy, the more you save!
            </p>

            <div className="flex flex-col gap-3 w-full">
              <div className="bg-[#F9FAFC] rounded-[12px] p-4 flex items-center gap-4 border border-slate-100">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#7B2CBF] text-white font-bold text-[14px] shrink-0">
                  1
                </div>
                <div className="flex flex-col gap-[2px]">
                  <h4 className="text-[16px] font-bold text-[#111111]">Buy an eSIM</h4>
                  <p className="text-[14px] text-[#4B5675]">
                    Earn SooviaMoney points automatically with every eSIM purchase
                  </p>
                </div>
              </div>

              <div className="bg-[#F9FAFC] rounded-[12px] p-4 flex items-center gap-4 border border-slate-100">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#0099FF] text-white font-bold text-[14px] shrink-0">
                  2
                </div>
                <div className="flex flex-col gap-[2px]">
                  <h4 className="text-[16px] font-bold text-[#111111]">Top up your eSIM</h4>
                  <p className="text-[14px] text-[#4B5675]">
                    Earn even more points when you add data to your existing eSIM
                  </p>
                </div>
              </div>

              <div className="bg-[#F9FAFC] rounded-[12px] p-4 flex items-center gap-4 border border-slate-100">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F88B35] text-white font-bold text-[14px] shrink-0">
                  3
                </div>
                <div className="flex flex-col gap-[2px]">
                  <h4 className="text-[16px] font-bold text-[#111111]">Use at checkout</h4>
                  <p className="text-[14px] text-[#4B5675]">
                    Apply your SooviaMoney balance for instant discounts on future orders
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsInfoModalOpen(false)}
              className="w-full h-[54px] bg-[#F7F7F7] rounded-[12px] flex items-center justify-center text-[16px] font-bold text-[#111111] hover:bg-[#EAEAEA] transition-colors mt-2 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
