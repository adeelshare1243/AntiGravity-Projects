'use client';

import React, { useState } from 'react';
import ESimPackageCard from './ESimPackageCard';
import { eSIMPackage } from '@/types';
import { Sparkles, Globe, MapPin, Zap } from 'lucide-react';

const MOCK_PACKAGES: eSIMPackage[] = [
  // Local Packages
  { id: 'pkg-usa-10gb', title: 'USA eSIM 10GB', country_code: 'us', country_name: 'United States', region: 'Local', flag_url: '🇺🇸', data_gb: 10, duration_days: 30, price_usd: 14.90, provider_id: 'p-1', is_unlimited: false, speed_type: '5G', supported_networks: ['AT&T', 'T-Mobile'] },
  { id: 'pkg-japan-unlimited', title: 'Japan Unlimited 5G', country_code: 'jp', country_name: 'Japan', region: 'Local', flag_url: '🇯🇵', data_gb: 'unlimited', duration_days: 15, price_usd: 24.50, provider_id: 'p-2', is_unlimited: true, speed_type: '5G', supported_networks: ['Docomo', 'SoftBank'] },
  { id: 'pkg-uk-5gb', title: 'UK eSIM 5GB', country_code: 'gb', country_name: 'United Kingdom', region: 'Local', flag_url: '🇬🇧', data_gb: 5, duration_days: 14, price_usd: 8.50, provider_id: 'p-3', is_unlimited: false, speed_type: '5G', supported_networks: ['Vodafone', 'O2'] },
  { id: 'pkg-turkey-10gb', title: 'Turkey Travel 10GB', country_code: 'tr', country_name: 'Turkey', region: 'Local', flag_url: '🇹🇷', data_gb: 10, duration_days: 30, price_usd: 11.90, provider_id: 'p-4', is_unlimited: false, speed_type: '4G/LTE', supported_networks: ['Turkcell', 'Vodafone'] },

  // Regional Packages
  { id: 'pkg-europe-regional', title: 'Europe Regional 33 Countries', country_code: 'eu', country_name: '33 European Countries', region: 'Regional', flag_url: '🇪🇺', data_gb: 10, duration_days: 30, price_usd: 19.90, provider_id: 'p-5', is_unlimited: false, speed_type: '5G', supported_networks: ['Orange', 'Vodafone', 'Telekom'] },
  { id: 'pkg-asia-regional', title: 'Asia Pass 18 Countries', country_code: 'asia', country_name: '18 Asian Countries', region: 'Regional', flag_url: '🌏', data_gb: 8, duration_days: 15, price_usd: 18.50, provider_id: 'p-6', is_unlimited: false, speed_type: '5G', supported_networks: ['Docomo', 'AIS', 'Singtel'] },
  { id: 'pkg-latam-regional', title: 'Latin America 14 Countries', country_code: 'latam', country_name: '14 LatAm Countries', region: 'Regional', flag_url: '🌎', data_gb: 5, duration_days: 30, price_usd: 22.00, provider_id: 'p-7', is_unlimited: false, speed_type: '4G/LTE', supported_networks: ['Claro', 'Telefonica'] },

  // Global Packages
  { id: 'pkg-global-130', title: 'Global Passport 130+ Countries', country_code: 'global', country_name: '130+ Worldwide Countries', region: 'Global', flag_url: '🌐', data_gb: 5, duration_days: 30, price_usd: 35.00, provider_id: 'p-8', is_unlimited: false, speed_type: '5G', supported_networks: ['Global Tier-1 Operators'] },
  { id: 'pkg-global-unlimited', title: 'Global Unlimited VIP', country_code: 'global-vip', country_name: '130+ Worldwide Countries', region: 'Global', flag_url: '👑', data_gb: 'unlimited', duration_days: 30, price_usd: 59.00, provider_id: 'p-9', is_unlimited: true, speed_type: '5G', supported_networks: ['Global Tier-1 Operators'] },
];

export const FeaturedPackages: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'Local' | 'Regional' | 'Global'>('Local');

  const filteredPackages = MOCK_PACKAGES.filter((p) => p.region === selectedTab);

  return (
    <section className="py-16 lg:py-24 bg-surface-cream border-b border-grey-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-bold uppercase tracking-wider text-brand-600">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Best Value Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-dark-900 tracking-tight">
            Featured eSIM Data Packages
          </h2>
          <p className="text-sm sm:text-base text-dark-400">
            Select local country plans, regional bundles for multi-stop trips, or global coverage passes with 5G speed.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-white rounded-2xl border border-grey-200 shadow-sm gap-1">
            <button
              onClick={() => setSelectedTab('Local')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                selectedTab === 'Local'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-dark-400 hover:text-dark-800 hover:bg-grey-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Country / Local</span>
            </button>
            <button
              onClick={() => setSelectedTab('Regional')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                selectedTab === 'Regional'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-dark-400 hover:text-dark-800 hover:bg-grey-100'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Regional Bundles</span>
            </button>
            <button
              onClick={() => setSelectedTab('Global')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                selectedTab === 'Global'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-dark-400 hover:text-dark-800 hover:bg-grey-100'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Global Passes</span>
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <ESimPackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
