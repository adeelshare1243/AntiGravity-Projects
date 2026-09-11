'use client';

import React, { useState } from 'react';
import { Settings2, DollarSign, CheckCircle, Loader2, Gift, Users } from 'lucide-react';
import { updateReferralSettings } from '@/actions/referral';

interface Props {
  initialSettings: {
    referralRewardAmount: number;
    referralDiscountAmount: number;
    isReferralProgramActive: boolean;
  };
}

export default function ReferralSettingsCard({ initialSettings }: Props) {
  const [rewardAmount, setRewardAmount] = useState<string>(
    String(initialSettings.referralRewardAmount ?? 5.0)
  );
  const [discountAmount, setDiscountAmount] = useState<string>(
    String(initialSettings.referralDiscountAmount ?? 10.0)
  );
  const [isActive, setIsActive] = useState<boolean>(
    initialSettings.isReferralProgramActive ?? true
  );

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await updateReferralSettings({
        referralRewardAmount: parseFloat(rewardAmount),
        referralDiscountAmount: parseFloat(discountAmount),
        isReferralProgramActive: isActive,
      });

      if (!res.success) {
        setError(res.error || 'Failed to update referral configuration.');
        setIsLoading(false);
        return;
      }

      setSuccessMessage('Referral program settings successfully saved.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* Header & Program Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFF9F5] border border-[#F88B35]/30 text-[#F88B35] flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Referral Program Settings</h2>
            <p className="text-xs text-gray-500">
              Configure monetary bonuses for referring advocates and introductory credits for invited users.
            </p>
          </div>
        </div>

        {/* Master Toggle Status Badge */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <span className="text-xs font-semibold text-gray-600">
            Program is {isActive ? 'Live' : 'Paused'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F88B35]"></div>
          </label>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg p-3">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Horizontal Configuration Form */}
      <form onSubmit={handleSave} className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Input 1: Reward for Referrer */}
          <div>
            <label
              htmlFor="referralReward"
              className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
            >
              Reward for Referrer ($) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="referralReward"
                name="referralReward"
                type="number"
                step="0.5"
                min="0"
                required
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                placeholder="5.00"
                className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Paid out upon referred user’s first completed purchase.</p>
          </div>

          {/* Input 2: Discount for New User */}
          <div>
            <label
              htmlFor="referralDiscount"
              className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
            >
              Discount for New User ($) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="referralDiscount"
                name="referralDiscount"
                type="number"
                step="0.5"
                min="0"
                required
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                placeholder="10.00"
                className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Applied as an instant checkout voucher for new sign-ups.</p>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F88B35] hover:bg-[#e07a2f] text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Settings2 className="w-4 h-4" />
              )}
              <span>Save Config</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
