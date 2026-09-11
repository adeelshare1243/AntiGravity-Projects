'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Barcode,
  Globe,
  Database,
  Calendar,
  TrendingUp,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export interface EsimListProps {
  esims?: any[];
}

export default function EsimList({ esims = [] }: EsimListProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'expired'>('current');
  const [copiedIccid, setCopiedIccid] = useState<string | null>(null);

  const handleCopyIccid = (iccid: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(iccid);
    }
    setCopiedIccid(iccid);
    setTimeout(() => setCopiedIccid(null), 2500);
  };

  const filteredEsims = (esims || []).filter((esim) => {
    const isExpired = esim.status?.toLowerCase() === 'expired';
    if (activeTab === 'current') {
      return !isExpired;
    }
    return isExpired;
  });

  return (
    <div className="w-full">
      {/* 1. TABS (Current / Expired) */}
      <div className="flex gap-3 mb-6 max-w-4xl mx-auto px-4">
        <button
          type="button"
          onClick={() => setActiveTab('current')}
          className={`px-6 py-2 rounded-[10px] text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'current'
              ? 'bg-[#0C0C0D] text-white shadow-xs'
              : 'bg-white border border-[#E8E5DD] text-[#4B5675] hover:bg-slate-50'
          }`}
        >
          Current
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('expired')}
          className={`px-6 py-2 rounded-[10px] text-sm font-medium transition-colors cursor-pointer ${
            activeTab === 'expired'
              ? 'bg-[#0C0C0D] text-white shadow-xs'
              : 'bg-white border border-[#E8E5DD] text-[#4B5675] hover:bg-slate-50'
          }`}
        >
          Expired
        </button>
      </div>

      {/* 2. CONDITIONAL EMPTY STATE OR CARDS GRID */}
      {filteredEsims.length === 0 ? (
        <div className="bg-[#F8F9FA] border border-[#E8E5DD] rounded-[24px] py-14 px-6 flex flex-col items-center justify-center text-center max-w-4xl mx-auto mb-12 shadow-xs">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 border border-[#E8E5DD] text-slate-400 shadow-2xs">
            <Globe className="w-6 h-6 text-[#FD521B]" />
          </div>
          <h3 className="text-[18px] font-bold text-[#0C0C0D] mb-2">
            No eSIMs found in this category
          </h3>
          <p className="text-[14px] text-slate-500 max-w-sm mb-6 leading-relaxed">
            You don&apos;t have any {activeTab} eSIMs at the moment. Browse our global destinations to get connected.
          </p>
          <Link
            href="/destinations"
            className="bg-[#F15A24] hover:bg-orange-600 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors inline-flex items-center justify-center cursor-pointer shadow-xs"
          >
            Browse Destinations
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12 px-4">
            {filteredEsims.map((esim) => {
              const country =
                esim.package?.destination?.name ||
                esim.package?.destinationName ||
                esim.country ||
                'Global eSIM';
              const isoCode = (
                esim.package?.destination?.isoCode ||
                esim.flagCode ||
                'us'
              ).toLowerCase();
              const flagUrl =
                esim.package?.destination?.flagUrl ||
                `https://flagcdn.com/w40/${isoCode}.png`;
              const iccid = esim.iccid || 'Unknown';
              const dataAmount =
                esim.package?.dataAmount ||
                esim.dataTotal ||
                (esim.package?.dataAmountMB
                  ? `${Math.round(esim.package.dataAmountMB / 1024)} GB`
                  : '10 GB');
              const validity =
                esim.package?.validityDays
                  ? `${esim.package.validityDays} Days`
                  : esim.validity || '30 Days';
              const coverage =
                esim.coverage ||
                esim.package?.destination?.name ||
                country;

              const totalData =
                Number(esim.totalData) ||
                (esim.package?.dataAmountMB
                  ? Math.round(esim.package.dataAmountMB / 1024)
                  : parseFloat(dataAmount) || 10);
              const remainingData =
                esim.remainingData !== undefined
                  ? Number(esim.remainingData)
                  : totalData;
              const usedData =
                esim.usedData !== undefined
                  ? Number(esim.usedData)
                  : Math.max(0, totalData - remainingData);
              const percentage =
                totalData > 0
                  ? Math.min(100, Math.max(0, Math.round((remainingData / totalData) * 100)))
                  : 0;
              const isExpired =
                esim.status?.toLowerCase() === 'expired' || percentage <= 0;

              return (
                <div
                  key={esim.id}
                  className="bg-white border border-[#E8E5DD] rounded-[24px] p-6 flex flex-col gap-5 shadow-xs hover:shadow-md transition-all"
                >
                  {/* Header Row */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-100 flex items-center justify-center">
                        <img
                          src={flagUrl}
                          alt={country}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-bold text-[#0C0C0D] text-[16px]">
                        {country}
                      </span>
                      <span
                        className={`text-[12px] font-bold px-2 py-1 rounded-full flex items-center gap-1.5 ml-1 ${
                          isExpired
                            ? 'bg-slate-100 text-slate-500'
                            : 'bg-[#E6F8E8] text-[#17B21F]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isExpired ? 'bg-slate-400' : 'bg-[#17B21F]'
                          }`}
                        />{' '}
                        {isExpired ? 'Expired' : 'Active'}
                      </span>
                    </div>

                    <Link
                      href={`/esims/${esim.id}`}
                      className="border border-[#E8E5DD] text-[#0C0C0D] px-4 py-1.5 rounded-[10px] text-sm font-medium hover:bg-[#FD521B] hover:text-white hover:border-[#FD521B] transition-colors cursor-pointer"
                    >
                      View Details
                    </Link>
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
                        type="button"
                        onClick={() => handleCopyIccid(iccid)}
                        className="font-mono font-bold text-xs text-[#0C0C0D] flex items-center gap-1.5 hover:text-[#FD521B] cursor-pointer transition-colors"
                        title="Click to copy ICCID"
                      >
                        <span>{iccid}</span>
                        {copiedIccid === iccid ? (
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
                      <span className="font-bold text-xs text-[#0C0C0D]">
                        {coverage}
                      </span>
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
                        {dataAmount}
                      </span>
                    </div>

                    <div className="bg-[#F8F9FA] rounded-[12px] p-3 flex flex-col border border-slate-100">
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Validity</span>
                      </div>
                      <span className="text-[15px] font-bold text-[#0C0C0D] mt-1">
                        {validity}
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
                        {remainingData} / {totalData} GB
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-white/30 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="text-[12px] text-center mt-2 font-medium opacity-90">
                      {percentage}% Left
                    </div>
                  </div>

                  <Link
                    href={`/esims/${esim.id}`}
                    className="bg-[#F8F9FA] text-[#0C0C0D] w-full h-[48px] flex items-center justify-center rounded-[10px] font-bold mt-1 hover:bg-[#FD521B] hover:text-white transition-colors cursor-pointer text-sm"
                  >
                    See Details
                  </Link>
                </div>
              );
            })}
          </div>

          {/* 3. PAGINATION */}
          {filteredEsims.length > 2 && (
            <div className="max-w-4xl mx-auto px-4 pb-16">
              <div className="flex justify-center items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  className="text-[#4B5675] font-medium text-sm flex items-center gap-1 cursor-pointer hover:text-[#0C0C0D]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  className="bg-[#FD521B] text-white w-8 h-8 flex items-center justify-center rounded-[10px] font-bold shadow-xs"
                >
                  1
                </button>

                <button
                  type="button"
                  className="text-[#FD521B] font-medium text-sm flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
