'use client';

import React from 'react';
import { useESim } from '@/context/ESimContext';
import { eSIMPackage } from '@/types';
import { Signal, Calendar, ShoppingBag, CheckCircle, Zap } from 'lucide-react';

interface ESimPackageCardProps {
  pkg: eSIMPackage;
}

export const ESimPackageCard: React.FC<ESimPackageCardProps> = ({ pkg }) => {
  const { currency, addToCart } = useESim();

  // Currency multiplier helper for demonstration
  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : '$';
  const currencyRate = currency === 'EUR' ? 0.92 : currency === 'GBP' ? 0.79 : currency === 'JPY' ? 155 : 1;
  const formattedPrice = (pkg.price_usd * currencyRate).toFixed(currency === 'JPY' ? 0 : 2);

  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-3xl p-6 border border-grey-200 shadow-sm hover:shadow-card-hover hover:border-brand-300 transition-all duration-200">
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl leading-none">{pkg.flag_url || '🌐'}</span>
            <div>
              <h4 className="text-base font-bold text-dark-900 group-hover:text-brand-500 transition-colors">
                {pkg.title}
              </h4>
              <p className="text-xs text-dark-400">{pkg.country_name}</p>
            </div>
          </div>
          {pkg.is_unlimited && (
            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
              <Zap className="w-3 h-3 text-brand-500 fill-brand-500" />
              Unlimited
            </span>
          )}
        </div>

        {/* Data & Duration Main Display */}
        <div className="my-5 p-4 rounded-2xl bg-grey-50 border border-grey-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-dark-400 uppercase tracking-wider block">Data Allowance</span>
            <span className="text-2xl font-extrabold text-dark-900">
              {pkg.data_gb === 'unlimited' ? 'Unlimited Data' : `${pkg.data_gb} GB`}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-dark-400 uppercase tracking-wider block">Validity</span>
            <span className="text-sm font-bold text-dark-800 flex items-center gap-1 justify-end">
              <Calendar className="w-3.5 h-3.5 text-brand-500" />
              {pkg.duration_days} Days
            </span>
          </div>
        </div>

        {/* Features list */}
        <div className="space-y-2 mb-6 text-xs text-dark-500">
          <div className="flex items-center gap-2">
            <Signal className="w-3.5 h-3.5 text-status-success" />
            <span>High-Speed <strong>{pkg.speed_type}</strong> Networks</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-brand-500" />
            <span>Networks: {pkg.supported_networks.join(', ')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-brand-500" />
            <span>Instant QR Code Email Delivery</span>
          </div>
        </div>
      </div>

      {/* Footer Price & CTA */}
      <div className="pt-4 border-t border-grey-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-semibold uppercase text-dark-300 block">Total Price</span>
          <span className="text-xl font-extrabold text-dark-900">
            {currencySymbol}{formattedPrice}
          </span>
        </div>

        <button
          onClick={() => addToCart(pkg)}
          className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-brand-500/20 active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};

export default ESimPackageCard;
