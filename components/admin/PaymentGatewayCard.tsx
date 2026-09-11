'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, Shield } from 'lucide-react';
import { PaymentGatewayData, updateGatewaySettings } from '@/actions/payment-gateway';

interface Props {
  initialData: PaymentGatewayData;
  title: string;
  subtitle: string;
  publicKeyLabel: string;
  publicKeyPlaceholder: string;
  secretKeyLabel: string;
  secretKeyPlaceholder: string;
  webhookSecretPlaceholder: string;
  badgeIcon?: React.ReactNode;
  accentColor?: string;
}

export default function PaymentGatewayCard({
  initialData,
  title,
  subtitle,
  publicKeyLabel,
  publicKeyPlaceholder,
  secretKeyLabel,
  secretKeyPlaceholder,
  webhookSecretPlaceholder,
  badgeIcon,
  accentColor = '#F88B35',
}: Props) {
  const [publicKey, setPublicKey] = useState(initialData.publicKey || '');
  const [secretKey, setSecretKey] = useState(initialData.secretKey || '');
  const [webhookSecret, setWebhookSecret] = useState(initialData.webhookSecret || '');
  const [isActive, setIsActive] = useState(initialData.isActive);
  const [environment, setEnvironment] = useState(initialData.environment || 'sandbox');

  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    const res = await updateGatewaySettings({
      id: initialData.id,
      provider: initialData.provider,
      publicKey,
      secretKey,
      webhookSecret,
      isActive,
      environment,
    });

    setIsLoading(false);

    if (res.success) {
      setStatusMessage({ type: 'success', text: `${title} updated successfully!` });
      setTimeout(() => setStatusMessage(null), 4000);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to update settings.' });
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        {/* Header with Title & Active Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {badgeIcon}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {isActive ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 select-none">
            <span className="text-xs font-semibold text-gray-700">Gateway Status:</span>
            <button
              type="button"
              role="switch"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#F88B35] focus:ring-offset-2 ${
                isActive ? 'bg-[#F88B35]' : 'bg-gray-200'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${isActive ? 'text-[#F88B35]' : 'text-gray-400'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-lg text-sm flex items-start gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <span className="font-medium">{statusMessage.text}</span>
          </div>
        )}

        {/* Environment Selection */}
        <div className="w-full">
          <label
            htmlFor={`${initialData.provider}-environment`}
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
          >
            Environment Mode <span className="text-red-500">*</span>
          </label>
          <select
            id={`${initialData.provider}-environment`}
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all cursor-pointer"
          >
            <option value="sandbox">Sandbox (Testing / Development)</option>
            <option value="live">Live (Production Transactions)</option>
          </select>
          <p className="text-[11px] text-gray-500 mt-1">
            Choose whether to charge test credit cards or live real customer payment methods.
          </p>
        </div>

        {/* Public Key / Client ID */}
        <div className="w-full">
          <label
            htmlFor={`${initialData.provider}-publicKey`}
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
          >
            {publicKeyLabel}
          </label>
          <input
            id={`${initialData.provider}-publicKey`}
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder={publicKeyPlaceholder}
            className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all font-mono text-xs"
          />
        </div>

        {/* Secret Key / Secret */}
        <div className="w-full">
          <label
            htmlFor={`${initialData.provider}-secretKey`}
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
          >
            {secretKeyLabel}
          </label>
          <div className="relative">
            <input
              id={`${initialData.provider}-secretKey`}
              type={showSecretKey ? 'text' : 'password'}
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder={secretKeyPlaceholder}
              className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg px-3.5 py-2.5 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all font-mono text-xs"
            />
            <button
              type="button"
              onClick={() => setShowSecretKey(!showSecretKey)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label={showSecretKey ? 'Hide secret key' : 'Show secret key'}
            >
              {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Webhook Secret */}
        <div className="w-full">
          <label
            htmlFor={`${initialData.provider}-webhookSecret`}
            className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
          >
            Webhook Signing Secret
          </label>
          <div className="relative">
            <input
              id={`${initialData.provider}-webhookSecret`}
              type={showWebhookSecret ? 'text' : 'password'}
              value={webhookSecret}
              onChange={(e) => setWebhookSecret(e.target.value)}
              placeholder={webhookSecretPlaceholder}
              className="w-full bg-[#F8F9FA] border border-gray-200 rounded-lg px-3.5 py-2.5 pr-11 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all font-mono text-xs"
            />
            <button
              type="button"
              onClick={() => setShowWebhookSecret(!showWebhookSecret)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label={showWebhookSecret ? 'Hide webhook secret' : 'Show webhook secret'}
            >
              {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            Used to securely verify incoming automated payment events and order completion signals.
          </p>
        </div>

        {/* Save Button */}
        <div className="w-full flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-[#F88B35] hover:bg-[#e07a2f] disabled:opacity-70 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isLoading ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
