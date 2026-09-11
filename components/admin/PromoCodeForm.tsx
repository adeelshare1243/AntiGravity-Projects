'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Sparkles, Loader2, Tag, Percent, DollarSign, Calendar, Hash } from 'lucide-react';
import { createPromoCode, updatePromoCode, deletePromoCode } from '@/actions/promo-code';
import { DiscountType } from '@prisma/client';

export interface PromoCodeInitialData {
  id?: string;
  code?: string;
  type?: DiscountType;
  discountValue?: number;
  maxUses?: number | null;
  startDate?: string | Date;
  endDate?: string | Date | null;
  isActive?: boolean;
}

interface PromoCodeFormProps {
  initialData?: PromoCodeInitialData;
}

export default function PromoCodeForm({ initialData }: PromoCodeFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const isEditing = Boolean(initialData?.id);

  // Form State
  const [code, setCode] = useState(initialData?.code || '');
  const [type, setType] = useState<DiscountType>(initialData?.type || DiscountType.PERCENTAGE);
  const [discountValue, setDiscountValue] = useState<string>(
    initialData?.discountValue !== undefined ? String(initialData.discountValue) : ''
  );
  const [maxUses, setMaxUses] = useState<string>(
    initialData?.maxUses !== null && initialData?.maxUses !== undefined ? String(initialData.maxUses) : ''
  );
  const [endDate, setEndDate] = useState<string>(
    initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : ''
  );
  const [isActive, setIsActive] = useState<boolean>(
    initialData?.isActive !== undefined ? initialData.isActive : true
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate Promo Code helper
  const handleAutoGenerate = () => {
    const prefixes = ['SAVE', 'SUMMER', 'TRAVEL', 'DISCOUNT', 'WANDER', 'FLY'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = Math.floor(10 + Math.random() * 90);
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    setCode(`${randomPrefix}${randomSuffix}-${randomChars}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload = {
        code: code.trim().toUpperCase(),
        type,
        discountValue: parseFloat(discountValue),
        maxUses: maxUses.trim() ? parseInt(maxUses, 10) : null,
        endDate: endDate ? new Date(endDate) : null,
        isActive,
      };

      let res;
      if (isEditing && initialData?.id) {
        res = await updatePromoCode(initialData.id, payload);
      } else {
        res = await createPromoCode(payload);
      }

      if (!res.success) {
        setError(res.error || 'Failed to save promo code.');
        setIsLoading(false);
        return;
      }

      router.push(`/${locale}/admin/promo-codes`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    if (!window.confirm(`Are you sure you want to permanently delete promo code "${initialData.code}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deletePromoCode(initialData.id);
      if (!res.success) {
        setError(res.error || 'Failed to delete promo code.');
        setIsDeleting(false);
        return;
      }

      router.push(`/${locale}/admin/promo-codes`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred while deleting.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto pb-12">
      {/* Back Button & Title Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}/admin/promo-codes`}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            {isEditing ? `Edit Promo Code: ${initialData?.code}` : 'Create New Promo Code'}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure discount rules, redemption limits, and validity windows for campaigns.
          </p>
        </div>
      </div>

      {/* Main Form White Card Container */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6 w-full">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3.5 flex items-start gap-2">
            <span className="font-semibold">Error:</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code Input with Auto-Generate Button */}
          <div className="w-full">
            <label
              htmlFor="code"
              className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
            >
              Promo Code <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                  placeholder="e.g. SUMMER20"
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm font-mono font-bold tracking-wider text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all"
                />
              </div>
              <button
                type="button"
                onClick={handleAutoGenerate}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 border border-gray-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F88B35]" />
                <span>Auto-generate</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">
              Uppercase letters and numbers only. Spaces are automatically removed.
            </p>
          </div>

          {/* Discount Type Selection Cards */}
          <div className="w-full">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Discount Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setType(DiscountType.PERCENTAGE)}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  type === DiscountType.PERCENTAGE
                    ? 'border-[#F88B35] bg-[#FFF9F5] shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="discountType"
                  value={DiscountType.PERCENTAGE}
                  checked={type === DiscountType.PERCENTAGE}
                  onChange={() => setType(DiscountType.PERCENTAGE)}
                  className="accent-[#F88B35] w-4 h-4"
                />
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F88B35] flex items-center justify-center font-bold">
                    <Percent className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 text-sm block">Percentage (%)</span>
                    <span className="text-xs text-gray-500 block">Deducts a percentage from the total order</span>
                  </div>
                </div>
              </label>

              <label
                onClick={() => setType(DiscountType.FIXED_AMOUNT)}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  type === DiscountType.FIXED_AMOUNT
                    ? 'border-[#F88B35] bg-[#FFF9F5] shadow-xs'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="discountType"
                  value={DiscountType.FIXED_AMOUNT}
                  checked={type === DiscountType.FIXED_AMOUNT}
                  onChange={() => setType(DiscountType.FIXED_AMOUNT)}
                  className="accent-[#F88B35] w-4 h-4"
                />
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 text-sm block">Fixed Amount ($)</span>
                    <span className="text-xs text-gray-500 block">Deducts a flat dollar amount from total</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Discount Value & Max Uses Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="discountValue"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
              >
                {type === DiscountType.PERCENTAGE ? 'Discount Percentage (%)' : 'Discount Amount ($)'}{' '}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                {type === DiscountType.PERCENTAGE ? (
                  <Percent className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                ) : (
                  <DollarSign className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
                <input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  step={type === DiscountType.PERCENTAGE ? '1' : '0.01'}
                  min="0.01"
                  max={type === DiscountType.PERCENTAGE ? '100' : '9999'}
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={type === DiscountType.PERCENTAGE ? 'e.g. 20' : 'e.g. 5.00'}
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="maxUses"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
              >
                Max Uses (Redemption Limit)
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="maxUses"
                  name="maxUses"
                  type="number"
                  min="1"
                  step="1"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Leave blank for unlimited"
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Leave empty if this code has no usage limit.</p>
            </div>
          </div>

          {/* Expiration Date & Active Toggle Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label
                htmlFor="endDate"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
              >
                Expiration Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Leave empty for a code that never expires.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Status
              </label>
              <label className="flex items-center gap-3 p-3 bg-[#F8F9FA] border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#F88B35] accent-[#F88B35] rounded"
                />
                <span className="text-sm font-semibold text-gray-800">
                  {isActive ? 'Active (Ready for redemption)' : 'Disabled / Inactive'}
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isLoading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Promo Code'}
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Link
                href={`/${locale}/admin/promo-codes`}
                className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors w-full sm:w-auto text-center cursor-pointer"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading || isDeleting}
                className="bg-[#F88B35] hover:bg-[#e07a2f] text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isEditing ? 'Save Changes' : 'Create Promo Code'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
