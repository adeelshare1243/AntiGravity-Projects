'use client';

import React, { useState, useTransition } from 'react';
import { updateProfitMargin } from '@/actions/admin';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  initialMargin: number;
}

export default function ProfitMarginInput({ initialMargin }: Props) {
  const [margin, setMargin] = useState<string | number>(initialMargin);
  const [savedMargin, setSavedMargin] = useState<number>(initialMargin);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (overrideValue?: string | number) => {
    const rawVal = overrideValue !== undefined ? overrideValue : margin;
    const numVal = parseFloat(String(rawVal));

    if (isNaN(numVal) || numVal < 0) {
      showToast('Please enter a valid margin percentage', 'error');
      return;
    }

    if (numVal === savedMargin) {
      return;
    }

    startTransition(async () => {
      try {
        const res = await updateProfitMargin(numVal);
        if (res.success) {
          setSavedMargin(numVal);
          showToast(`Margin updated to ${numVal}% successfully`, 'success');
        } else {
          showToast(res.error || 'Failed to save profit margin', 'error');
        }
      } catch (err: any) {
        showToast(err?.message || 'Error updating profit margin', 'error');
      }
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          Margin (%)
        </label>
        <div className="relative">
          <input
            type="number"
            step="any"
            min="0"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            onBlur={() => handleSave()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
            disabled={isPending}
            className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50"
          />
          {isPending && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
            </div>
          )}
        </div>
      </div>

      {/* Success Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition-all duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-emerald-500/10'
              : 'bg-rose-50 text-rose-900 border-rose-200 shadow-rose-500/10'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}
