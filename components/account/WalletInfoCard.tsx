'use client';

import React, { useState } from 'react';
import { Wallet, Zap, Info, X } from 'lucide-react';

interface WalletInfoCardProps {
  balance?: number;
}

export default function WalletInfoCard({ balance = 0 }: WalletInfoCardProps) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  return (
    <>
      {/* CARD 1: SOOVIAMONEY BALANCE */}
      <div className="bg-[#F8F9FA] border border-[#E8E5DD] rounded-[16px] p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[#FD521B]" />
            <span className="text-[12px] font-medium text-[#0C0C0D]">SooviaMoney Balance</span>
          </div>
          <div className="text-[24px] font-bold text-[#0C0C0D] mt-2 tracking-tight">
            ${balance.toFixed(2)} SM
          </div>
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
                type="button"
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
              type="button"
              onClick={() => setIsInfoModalOpen(false)}
              className="w-full h-[54px] bg-[#F7F7F7] rounded-[12px] flex items-center justify-center text-[16px] font-bold text-[#111111] hover:bg-[#EAEAEA] transition-colors mt-2 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
