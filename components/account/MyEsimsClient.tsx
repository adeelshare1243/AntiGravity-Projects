'use client';

import React, { useState } from 'react';
import {
  Gift,
  Copy,
  Share2,
  Check,
} from 'lucide-react';
import WalletInfoCard from '@/components/account/WalletInfoCard';
import EsimList from '@/components/account/EsimList';

export interface MyEsimsClientProps {
  referralCode?: string;
  walletBalance?: number;
  esims?: any[];
}

export default function MyEsimsClient({
  referralCode = 'DAN19',
  walletBalance = 0,
  esims = [],
}: MyEsimsClientProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const getReferralUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/signup?ref=${referralCode}`;
    }
    return `https://soovia.com/signup?ref=${referralCode}`;
  };

  const handleCopyLink = async () => {
    const link = getReferralUrl();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const input = document.createElement('input');
        input.value = link;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedCode(true);
      showToast('Link copied!');
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      showToast('Link copied!');
    }
  };

  const handleShare = async () => {
    const link = getReferralUrl();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Join Soovia',
          text: 'Get $1.00 off your first eSIM!',
          url: link,
        });
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
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

      {/* 2. ESIM LIST (Tabs, Dynamic Cards Grid & Empty State) */}
      <EsimList esims={esims} />

      {/* REWARDS / UTILITY CARDS SECTION */}
      <section className="max-w-4xl mx-auto flex flex-col gap-6 px-4 pb-20">
        {/* CARD 1: SOOVIAMONEY BALANCE */}
        <WalletInfoCard balance={walletBalance} />

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
              onClick={handleShare}
              className="bg-[#FD521B] hover:bg-[#e04412] text-white h-[48px] rounded-[10px] font-medium flex items-center justify-center gap-2 hover:shadow-md transition-all cursor-pointer text-sm shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </section>

      {/* SUCCESS TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0C0C0D] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-[#17B21F]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
