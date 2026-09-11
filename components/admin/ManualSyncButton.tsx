'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ManualSyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync/esim-go', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('eSIM catalog sync completed with updated margin!', 'success');
        router.refresh();
      } else {
        showToast(data.error || 'Failed to complete catalog sync', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error during manual sync', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleSync}
        disabled={isSyncing}
        title="Trigger on-demand background sync from providers"
        className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
      >
        <RefreshCw className={`w-4 h-4 text-gray-500 ${isSyncing ? 'animate-spin text-orange-500' : ''}`} />
        <span>{isSyncing ? 'Syncing...' : 'Manual API Sync'}</span>
      </button>

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
