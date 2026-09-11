'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  Database,
  Infinity as InfinityIcon,
  Info,
  Calendar,
  Zap,
  Layers,
  RotateCw,
  Signal,
  Globe2,
  MapPin,
  X,
  Search,
} from 'lucide-react';

interface PackageItem {
  id: string;
  dataAmount: string;
  validity: string;
  price: string;
  networks: string[];
  isPopular?: boolean;
}

const STATIC_PACKAGES: PackageItem[] = [
  {
    id: 'pkg-500mb',
    dataAmount: '500 MB',
    validity: '7 Days',
    price: '$2.30',
    networks: ['4G/LTE', '5G'],
  },
  {
    id: 'pkg-1gb',
    dataAmount: '1GB',
    validity: '7 Days',
    price: '$4.30',
    networks: ['4G/LTE', '5G'],
  },
  {
    id: 'pkg-3gb',
    dataAmount: '3GB',
    validity: '30 Days',
    price: '$9.80',
    networks: ['4G/LTE', '5G'],
  },
  {
    id: 'pkg-10gb',
    dataAmount: '10GB',
    validity: '30 Days',
    price: '$18.50',
    networks: ['4G/LTE', '5G'],
    isPopular: true,
  },
];

const EUROPE_COVERED_COUNTRIES = [
  { name: 'France', flagUrl: '/assets/flags/fr.svg' },
  { name: 'Germany', flagUrl: '/assets/flags/de.svg' },
  { name: 'Italy', flagUrl: '/assets/flags/it.svg' },
  { name: 'Spain', flagUrl: '/assets/flags/es.svg' },
  { name: 'United Kingdom', flagUrl: '/assets/flags/gb.svg' },
  { name: 'Netherlands', flagUrl: '/assets/flags/nl.svg' },
  { name: 'Switzerland', flagUrl: '/assets/flags/ch.svg' },
  { name: 'Sweden', flagUrl: '/assets/flags/se.svg' },
  { name: 'Poland', flagUrl: '/assets/flags/pl.svg' },
  { name: 'Portugal', flagUrl: '/assets/flags/pt.svg' },
  { name: 'Greece', flagUrl: '/assets/flags/gr.svg' },
  { name: 'Ireland', flagUrl: '/assets/flags/ie.svg' },
  { name: 'Türkiye', flagUrl: '/assets/flags/tr.svg' },
  { name: 'Austria', flagUrl: '/assets/flags/de.svg' },
  { name: 'Belgium', flagUrl: '/assets/flags/fr.svg' },
  { name: 'Bulgaria', flagUrl: '/assets/flags/pl.svg' },
  { name: 'Croatia', flagUrl: '/assets/flags/nl.svg' },
  { name: 'Cyprus', flagUrl: '/assets/flags/gr.svg' },
  { name: 'Czech Republic', flagUrl: '/assets/flags/pl.svg' },
  { name: 'Denmark', flagUrl: '/assets/flags/se.svg' },
  { name: 'Estonia', flagUrl: '/assets/flags/se.svg' },
  { name: 'Finland', flagUrl: '/assets/flags/se.svg' },
  { name: 'Hungary', flagUrl: '/assets/flags/it.svg' },
  { name: 'Iceland', flagUrl: '/assets/flags/se.svg' },
  { name: 'Latvia', flagUrl: '/assets/flags/pl.svg' },
  { name: 'Liechtenstein', flagUrl: '/assets/flags/ch.svg' },
  { name: 'Lithuania', flagUrl: '/assets/flags/pl.svg' },
  { name: 'Luxembourg', flagUrl: '/assets/flags/nl.svg' },
  { name: 'Malta', flagUrl: '/assets/flags/it.svg' },
  { name: 'Monaco', flagUrl: '/assets/flags/fr.svg' },
  { name: 'Norway', flagUrl: '/assets/flags/se.svg' },
  { name: 'Romania', flagUrl: '/assets/flags/it.svg' },
  { name: 'Slovakia', flagUrl: '/assets/flags/pl.svg' },
  { name: 'Slovenia', flagUrl: '/assets/flags/pl.svg' },
  { name: 'Albania', flagUrl: '/assets/flags/it.svg' },
  { name: 'Andorra', flagUrl: '/assets/flags/es.svg' },
  { name: 'Bosnia & Herzegovina', flagUrl: '/assets/flags/it.svg' },
  { name: 'Georgia', flagUrl: '/assets/flags/gb.svg' },
  { name: 'Gibraltar', flagUrl: '/assets/flags/gb.svg' },
  { name: 'Montenegro', flagUrl: '/assets/flags/it.svg' },
  { name: 'North Macedonia', flagUrl: '/assets/flags/gr.svg' },
  { name: 'San Marino', flagUrl: '/assets/flags/it.svg' },
  { name: 'Serbia', flagUrl: '/assets/flags/pl.svg' },
  { name: 'Vatican City', flagUrl: '/assets/flags/it.svg' },
];

interface PackageListProps {
  destinationName?: string;
  destinationSlug?: string;
  flagUrl?: string;
  packages?: any[];
  isGlobal?: boolean;
}

export const PackageList: React.FC<PackageListProps> = ({
  destinationName = 'Turkey',
  destinationSlug = '',
  flagUrl: customFlagUrl,
  packages,
  isGlobal = false,
}) => {
  const router = useRouter();
  const locale = useLocale();
  const flagUrl =
    customFlagUrl ||
    (isGlobal
      ? '/assets/destination/icon-globe.svg'
      : '/assets/destination/turkey-flag.svg');
  const [activeTab, setActiveTab] = useState<'standard' | 'unlimited'>('standard');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailsModalPkgId, setDetailsModalPkgId] = useState<string | null>(null);
  const [countrySearch, setCountrySearch] = useState('');

  const closeModal = () => {
    setDetailsModalPkgId(null);
    setCountrySearch('');
  };

  // ─── Derive filteredPackages from real DB packages, fall back to statics ───
  const allPackages = packages && packages.length > 0 ? packages : null;

  // Map real DB packages to the same shape as STATIC_PACKAGES for rendering
  const normalizedPackages: PackageItem[] = allPackages
    ? allPackages.map((pkg: any, idx: number) => ({
        id: pkg.id ?? `pkg-${idx}`,
        dataAmount:
          pkg.isUnlimited || pkg.dataAmountMB === -1
            ? 'Unlimited'
            : pkg.dataAmount ??
              (pkg.dataAmountMB != null
                ? pkg.dataAmountMB >= 1024
                  ? `${(pkg.dataAmountMB / 1024).toFixed(0)} GB`
                  : `${pkg.dataAmountMB} MB`
                : '1 GB'),
        validity:
          pkg.validityDays != null ? `${pkg.validityDays} Days` : (pkg.validity ?? '30 Days'),
        price:
          pkg.price ??
          (pkg.retailPriceUSD != null ? `$${Number(pkg.retailPriceUSD).toFixed(2)}` : '$0.00'),
        networks: pkg.networkTypes ?? ['4G/LTE', '5G'],
        isPopular: pkg.isPopular ?? false,
      }))
    : STATIC_PACKAGES;

  // ─── Unlimited slider: derive sorted packages + available day steps ────────
  const unlimitedPkgs: PackageItem[] = normalizedPackages
    .filter((p) => p.dataAmount === 'Unlimited')
    .sort((a, b) => {
      const dA = parseInt(a.validity, 10) || 0;
      const dB = parseInt(b.validity, 10) || 0;
      return dA - dB;
    });

  // Fallback synthetic day steps when no real unlimited packages exist
  const FALLBACK_DAYS = [1, 3, 7, 14, 21, 30];
  const availableDays: number[] =
    unlimitedPkgs.length > 0
      ? unlimitedPkgs.map((p) => parseInt(p.validity, 10) || 0).filter((d) => d > 0)
      : FALLBACK_DAYS;

  // Default: prefer 7-day slot; otherwise first available
  const defaultDay = availableDays.includes(7) ? 7 : availableDays[0] ?? 7;
  const [unlimitedDays, setUnlimitedDays] = useState<number>(defaultDay);

  // Active package object matching the currently selected day count
  const activeUnlimitedPkg: PackageItem | undefined = unlimitedPkgs.find(
    (p) => parseInt(p.validity, 10) === unlimitedDays,
  );

  // Price: from real DB package, or fallback formula
  const unlimitedPrice: string =
    activeUnlimitedPkg?.price
      ? activeUnlimitedPkg.price.replace(/^\$/, '') // strip leading $ if present
      : (4.5 + (unlimitedDays - 1) * 3.45).toFixed(2);

  // Slider index of the currently selected day
  const selectedDayIndex = availableDays.indexOf(unlimitedDays);
  const sliderMax = Math.max(availableDays.length - 1, 1);
  // Fill percentage for the track/thumb
  const sliderPct =
    sliderMax === 0 ? 0 : (selectedDayIndex / sliderMax) * 100;

  // Split into standard vs unlimited tabs
  const filteredPackages: PackageItem[] =
    activeTab === 'unlimited'
      ? normalizedPackages.filter((p) => p.dataAmount === 'Unlimited')
      : normalizedPackages.filter((p) => p.dataAmount !== 'Unlimited');

  // For the sticky buy bar, match against normalizedPackages
  const selectedPackage = normalizedPackages.find((p) => p.id === selectedId);

  // ─── Checkout navigation helpers ─────────────────────────────────────────
  const handleBuyNowStandard = () => {
    if (!selectedPackage) return;
    router.push(
      `/${locale}/checkout?pkgId=${encodeURIComponent(selectedPackage.id)}&destSlug=${encodeURIComponent(destinationSlug)}`,
    );
  };

  const handleBuyNowUnlimited = () => {
    // Use the matched DB package id; fall back to a synthetic key so the
    // checkout page can still display slider-configured plans.
    const pkgId = activeUnlimitedPkg?.id ?? `unlimited-custom-${unlimitedDays}d`;
    router.push(
      `/${locale}/checkout?pkgId=${encodeURIComponent(pkgId)}&destSlug=${encodeURIComponent(destinationSlug)}&days=${unlimitedDays}&price=${encodeURIComponent(unlimitedPrice)}`,
    );
  };

  // Dynamic modal data handling both standard packages and custom unlimited selection
  let activeModalData: {
    dataAmount: string;
    validityDays: number | string;
    price: string;
    speed: string;
    type: string;
  } | null = null;

  if (detailsModalPkgId === 'unlimited_custom') {
    activeModalData = {
      dataAmount: 'Unlimited',
      validityDays: unlimitedDays,
      price: `$${unlimitedPrice}`,
      speed: '5G/4G',
      type: 'Standard',
    };
  } else if (detailsModalPkgId) {
    const pkg = normalizedPackages.find((p) => p.id === detailsModalPkgId);
    if (pkg) {
      activeModalData = {
        dataAmount: pkg.dataAmount,
        validityDays: pkg.validity.replace(/\s*Days/i, ''),
        price: pkg.price,
        speed: '5G/4G',
        type: 'Standard',
      };
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        {/* Tab Switcher — full-width equal-size pills */}
        <div className="bg-[#F4F5F7] p-1.5 rounded-[14px] flex items-center gap-1 w-full">
          <button
            type="button"
            onClick={() => setActiveTab('standard')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-[10px] text-sm md:text-[15px] font-semibold transition-all duration-200 cursor-pointer select-none ${
              activeTab === 'standard'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Database
              className={`w-4 h-4 transition-colors ${
                activeTab === 'standard' ? 'text-gray-900' : 'text-gray-400'
              }`}
            />
            Standard Data
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('unlimited')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-[10px] text-sm md:text-[15px] font-semibold transition-all duration-200 cursor-pointer select-none ${
              activeTab === 'unlimited'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <InfinityIcon
              className={`w-4 h-4 transition-colors ${
                activeTab === 'unlimited' ? 'text-gray-900' : 'text-gray-400'
              }`}
            />
            Unlimited Data
          </button>
        </div>

        {/* Tab 1: Standard Data Package Rows (Matches Figma) */}
        {activeTab === 'standard' && (
          <div className="flex flex-col gap-3.5 w-full">
            {filteredPackages.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">No standard packages available.</p>
            ) : (
              filteredPackages.map((pkg) => {
                const isSelected = selectedId === pkg.id;

                return (
                  <div
                    key={pkg.id}
                    onClick={() =>
                      setSelectedId((prevId) => (prevId === pkg.id ? null : pkg.id))
                    }
                    className={`flex items-center justify-between rounded-[16px] py-4.5 px-6 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-transparent'
                        : 'bg-[#F8F9FA] hover:bg-[#F2F4F7] border border-transparent'
                    }`}
                  >
                    {/* Left Side: Checkbox + Text Stack */}
                    <div className="flex items-center gap-4">
                      {/* Checkbox (Matches Figma) */}
                      <div
                        className={`w-5 h-5 rounded-[5px] flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'bg-[#F88B35] border-none'
                            : 'bg-white border-2 border-gray-200'
                        }`}
                      >
                        {isSelected && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Text Stack */}
                      <div className="flex flex-col gap-0.5">
                        {/* Top Row: Data Amount & Network Tags */}
                        <div className="flex items-center gap-2">
                          <span className="text-[17px] md:text-[18px] font-black text-gray-900 leading-none">
                            {pkg.dataAmount}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {pkg.networks.map((net) => (
                              <span
                                key={net}
                                className="bg-[#FFF4ED] text-[#F88B35] text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] flex items-center gap-1 uppercase tracking-wider"
                              >
                                <span className="w-1 h-1 rounded-full bg-[#F88B35]"></span>
                                {net}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Row: Validity */}
                        <span className="text-[13px] text-gray-400 font-medium">
                          {pkg.validity}
                        </span>
                      </div>
                    </div>

                    {/* Right Side: Popular Badge + Price + Info Action */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      {pkg.isPopular && (
                        <span className="bg-[#FF5500] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-[6px] uppercase tracking-wide">
                          Popular
                        </span>
                      )}

                      <span className="text-[18px] md:text-[19px] font-black text-gray-900">
                        {pkg.price}
                      </span>

                      {/* Info button with hover tooltip */}
                      <div className="relative group/info">
                        <button
                          type="button"
                          aria-label="View package details"
                          className="p-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailsModalPkgId(pkg.id);
                          }}
                        >
                          <Info className="w-4.5 h-4.5" />
                        </button>
                        {/* Tooltip */}
                        <div className="pointer-events-none absolute bottom-full right-0 mb-2 opacity-0 group-hover/info:opacity-100 transition-opacity duration-150">
                          <div className="bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-[7px] whitespace-nowrap shadow-lg">
                            View details
                            <div className="absolute top-full right-3 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Unlimited Data Interactive Continuous Slider Card */}
        {activeTab === 'unlimited' && (
          <div className="bg-[#F7F7F7] rounded-[24px] p-6 md:p-8 flex flex-col w-full border border-gray-200/50 shadow-2xs">
            {/* Top Header */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <h3 className="text-[22px] font-bold text-black leading-tight">
                  Unlimited Data
                </h3>
                <span className="text-sm text-gray-500 mt-1 font-medium">
                  4G/LTE - 5G
                </span>
              </div>

              {/* Unlimited info button with tooltip */}
              <div className="relative group/unl-info">
                <button
                  type="button"
                  aria-label="View unlimited plan details"
                  onClick={() => setDetailsModalPkgId('unlimited_custom')}
                  className="text-gray-400 hover:text-black transition-colors p-1 cursor-pointer"
                >
                  <Info className="w-5 h-5" />
                </button>
                <div className="pointer-events-none absolute bottom-full right-0 mb-2 opacity-0 group-hover/unl-info:opacity-100 transition-opacity duration-150">
                  <div className="bg-gray-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-[7px] whitespace-nowrap shadow-lg">
                    View details
                    <div className="absolute top-full right-3 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200/60 my-5" />

            {/* Large Number Display */}
            <div className="py-2 md:py-4 flex justify-center items-baseline">
              <span className="text-[64px] leading-none font-black text-gray-900">
                {unlimitedDays}
              </span>
              <span className="text-2xl text-gray-500 ml-3 font-medium">
                Days
              </span>
            </div>

            {/* Custom Continuous Slider Track */}
            <div className="relative w-full h-12 flex items-center my-6 select-none">
              {/* Background Track */}
              <div className="absolute w-full h-1.5 bg-[#EAEBED] rounded-full" />

              {/* Orange Fill Track */}
              <div
                className="absolute h-1.5 bg-[#F88B35] rounded-full pointer-events-none transition-all duration-75"
                style={{ width: `${sliderPct}%` }}
              />

              {/* Interactive Invisible Input */}
              <input
                type="range"
                min={0}
                max={sliderMax}
                step={1}
                value={selectedDayIndex < 0 ? 0 : selectedDayIndex}
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  const day = availableDays[idx] ?? availableDays[0];
                  setUnlimitedDays(day);
                }}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />

              {/* Orange Thumb with Halo */}
              <div
                className="absolute w-5 h-5 bg-[#F88B35] rounded-full shadow-[0_0_0_8px_rgba(248,139,53,0.2)] pointer-events-none z-0 transform -translate-x-1/2 transition-all duration-75"
                style={{ left: `${sliderPct}%` }}
              />
            </div>

            {/* Dynamic Markers Below Slider */}
            <div className="flex justify-between w-full text-xs text-gray-400 font-medium px-1 mb-6">
              {availableDays.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>

            {/* White Price Box */}
            <div className="bg-white rounded-[16px] py-4 flex justify-center items-center mb-3 w-full shadow-xs">
              <span className="text-2xl font-black text-black">
                ${unlimitedPrice}
              </span>
            </div>

            {/* Full-width Buy Now Button */}
            <button
              type="button"
              onClick={handleBuyNowUnlimited}
              className="w-full bg-[#F88B35] hover:bg-[#e07a2f] text-white py-4 rounded-[16px] font-bold text-lg transition-colors shadow-md cursor-pointer active:scale-[0.99]"
            >
              Buy Now — ${unlimitedPrice}
            </button>
          </div>
        )}
      </div>

      {/* Floating Sticky Buy Bar for Standard Data */}
      {activeTab === 'standard' && (
        <div
          className={`fixed bottom-4 left-0 right-0 z-50 px-4 flex justify-center transition-all duration-300 ease-out ${
            selectedPackage
              ? 'translate-y-0 opacity-100 pointer-events-auto'
              : 'translate-y-[150%] opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-full max-w-[1040px] bg-white rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden">
            {selectedPackage && (
              <div className="flex flex-col">
                {/* Top Section */}
                <div className="p-4 md:p-5 flex justify-between items-center border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={flagUrl}
                      alt={`${destinationName} flag`}
                      className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-100 flex-shrink-0 bg-gray-50"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-sm md:text-base leading-tight">
                        {destinationName} eSIM
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        {selectedPackage.dataAmount} • {selectedPackage.validity}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Package Details"
                    onClick={() => setDetailsModalPkgId(selectedId)}
                    className="text-gray-400 hover:text-black transition-colors p-1 cursor-pointer"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </div>

                {/* Bottom Section */}
                <div className="p-4 md:p-5 flex justify-between items-center bg-white/50 backdrop-blur-md">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      TOTAL
                    </span>
                    <span className="text-2xl font-black text-gray-900 leading-tight">
                      {selectedPackage.price}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleBuyNowStandard}
                    className="bg-[#F88B35] hover:bg-[#e07a2f] text-white px-8 md:px-32 py-3.5 rounded-[12px] font-bold text-base md:text-lg transition-colors cursor-pointer shadow-sm active:scale-[0.99]"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plan Details Modal */}
      {detailsModalPkgId && activeModalData && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-[480px] bg-white rounded-[24px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-start">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {activeModalData.dataAmount} • {activeModalData.validityDays} Days
                </h2>
                <span className="text-sm text-gray-400 font-medium mt-0.5">
                  Plan Details
                </span>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close details"
                className="text-gray-400 hover:text-black transition-colors p-1 cursor-pointer rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-1">
              {/* Row 1: Data */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5 text-sm text-gray-500">
                  <Database className="w-4 h-4 text-gray-400" />
                  <span>Data</span>
                </div>
                <span className="font-bold text-black text-sm">
                  {activeModalData.dataAmount}
                </span>
              </div>

              {/* Row 2: Validity */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Validity</span>
                </div>
                <span className="font-bold text-black text-sm">
                  {activeModalData.validityDays} Days
                </span>
              </div>

              {/* Row 3: Speed */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5 text-sm text-gray-500">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <span>Speed</span>
                </div>
                <span className="font-bold text-black text-sm">
                  {activeModalData.speed}
                </span>
              </div>

              {/* Row 4: Type */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5 text-sm text-gray-500">
                  <Layers className="w-4 h-4 text-gray-400" />
                  <span>Type</span>
                </div>
                <span className="font-bold text-black text-sm">
                  {activeModalData.type}
                </span>
              </div>

              {/* Row 5: Topup */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5 text-sm text-gray-500">
                  <RotateCw className="w-4 h-4 text-gray-400" />
                  <span>Topup</span>
                </div>
                <span className="font-bold text-black text-sm">Supported</span>
              </div>

              {/* Row 6: Activation */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5 text-sm text-gray-500">
                  <Signal className="w-4 h-4 text-gray-400" />
                  <span>Activation</span>
                </div>
                <span className="font-bold text-black text-sm text-right">
                  First network connection
                </span>
              </div>

              {/* Row 7: IP Location */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5 text-sm text-gray-500">
                  <Globe2 className="w-4 h-4 text-gray-400" />
                  <span>IP Location</span>
                </div>
                <span className="font-bold text-black text-sm">
                  {destinationName.toLowerCase() === 'europe' ? 'UK/NO' : 'NL'}
                </span>
              </div>

              {/* Row 8: Coverage */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Coverage</span>
                </div>
                <span className="font-bold text-black text-sm">
                  {destinationName.toLowerCase() === 'europe' ? '44 Countries' : destinationName}
                </span>
              </div>

              {/* Non-Europe: Networks Section */}
              {destinationName.toLowerCase() !== 'europe' && (
                <div className="flex flex-col gap-2 mt-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Networks
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                      Vodafone
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                      Turkcell
                    </span>
                  </div>
                </div>
              )}

              {/* Europe: Covered Countries Block */}
              {destinationName.toLowerCase() === 'europe' && (
                <div className="flex flex-col mt-2">
                  <h4 className="text-[13px] font-bold text-gray-900 tracking-wide mb-3 mt-4">
                    Covered Countries (44)
                  </h4>

                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search country..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-[10px] px-10 py-2.5 text-sm text-gray-800 outline-none transition-all"
                    />
                  </div>

                  {/* Grid List */}
                  <div className="grid grid-cols-2 gap-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    {EUROPE_COVERED_COUNTRIES.filter((c) =>
                      c.name.toLowerCase().includes(countrySearch.toLowerCase())
                    ).map((c) => (
                      <div key={c.name} className="flex items-center gap-2.5">
                        <img
                          src={c.flagUrl}
                          alt={c.name}
                          className="w-5 h-5 rounded-full object-cover bg-gray-100 shadow-xs shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="text-[13px] font-medium text-gray-800 truncate">
                          {c.name}
                        </span>
                      </div>
                    ))}
                    {EUROPE_COVERED_COUNTRIES.filter((c) =>
                      c.name.toLowerCase().includes(countrySearch.toLowerCase())
                    ).length === 0 && (
                      <div className="col-span-2 text-center text-xs text-gray-400 py-3">
                        No country matching &ldquo;{countrySearch}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-white rounded-b-[24px]">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  PRICE
                </span>
                <span className="text-2xl font-black text-black">
                  {activeModalData.price}
                </span>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-100 hover:bg-gray-200 text-black px-6 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageList;
