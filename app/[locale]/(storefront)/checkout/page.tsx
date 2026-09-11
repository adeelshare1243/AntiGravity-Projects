'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import {
  ChevronLeft,
  Globe,
  FileText,
  Database,
  Calendar,
  Info,
  Tag,
  ChevronRight,
  ArrowRight,
  Lock,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { processCheckout } from '@/actions/checkout';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const pkgId = searchParams.get('pkgId');
  const destSlug = searchParams.get('destSlug');
  const daysParam = searchParams.get('days');
  const priceParam = searchParams.get('price');

  const [destination, setDestination] = useState<any>(null);
  const [pkg, setPkg] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Mock state for interactive elements
  const [isPromoOpen, setIsPromoOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState('');

  const handleProceedToPayment = async () => {
    if (isProcessing) return;
    setCheckoutError(null);
    setIsProcessing(true);

    try {
      const res = await processCheckout({
        packageId: pkgId || pkg?.id,
        destinationName: destination?.name,
        packageName: pkg?.dataAmount,
        amount: Number(totalPrice) || 0,
        currency: 'USD',
        locale,
        origin: typeof window !== 'undefined' ? window.location.origin : '',
      });

      if (!res.success || !res.url) {
        setCheckoutError(res.error || 'Failed to initialize payment gateway.');
        setIsProcessing(false);
        return;
      }

      // Securely redirect user to the Stripe or PayPal hosted checkout page
      window.location.href = res.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError(err?.message || 'An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!pkgId && !destSlug) {
      router.replace('/');
      return;
    }

    let isMounted = true;
    const fetchCheckoutData = async () => {
      try {
        setIsLoading(true);
        const query = new URLSearchParams();
        if (pkgId) query.set('pkgId', pkgId);
        if (destSlug) query.set('destSlug', destSlug);
        if (daysParam) query.set('days', daysParam);
        if (priceParam) query.set('price', priceParam);

        const res = await fetch(`/api/checkout/package?${query.toString()}`);
        if (!res.ok) {
          router.replace('/');
          return;
        }

        const data = await res.json();
        if (isMounted) {
          setDestination(data.destination);
          setPkg(data.package);
          if (data.package?.price !== undefined) {
            setTotalPrice(Number(data.package.price).toFixed(2));
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching checkout data:', err);
        if (isMounted) {
          router.replace('/');
        }
      }
    };

    fetchCheckoutData();

    return () => {
      isMounted = false;
    };
  }, [pkgId, destSlug, daysParam, priceParam, router]);

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    setAppliedPromo(promoInput.trim().toUpperCase());
    const base = pkg?.price ? Number(pkg.price) : Number(totalPrice || '0');
    setTotalPrice((base * 0.9).toFixed(2));
    setIsPromoOpen(false);
  };

  if (isLoading) {
    return (
      <div className="bg-[#F7F7F7] min-h-screen flex items-center justify-center">
        <div className="text-sm font-medium text-gray-500">Loading checkout...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F7F7] min-h-screen flex flex-col">
      {/* 1. Top Minimal Header */}
      <header className="w-full bg-transparent">
        <div className="h-[76px] w-full max-w-[1080px] mx-auto px-4 flex items-center justify-between">
          {/* Left: Back Button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold text-gray-900 cursor-pointer flex items-center gap-1.5 hover:text-[#F88B35] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Back</span>
          </button>

          {/* Center: Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-[#F88B35] flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Globe className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-2xl font-black text-[#111111] tracking-tight">
              logo
            </span>
          </Link>

          {/* Right: Empty Div for Flexbox Balance */}
          <div className="w-16" />
        </div>
      </header>

      {/* 2. Main Checkout Card Container */}
      <main className="w-full max-w-[640px] mx-auto px-4 py-8 md:py-12 flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-[24px] p-6 sm:p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Checkout
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review your order and proceed to payment.
            </p>
          </div>

          {/* Order Number Box */}
          <div className="bg-gray-50 rounded-[12px] p-4 flex items-center gap-3 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4 text-gray-500 shrink-0" />
            <span>
              Order No:{' '}
              <span className="font-bold text-gray-900">ORD-A530C6B1</span>
            </span>
          </div>

          {/* Order Summary Box */}
          <div className="border border-gray-200 rounded-[16px] p-5 flex flex-col gap-4">
            {/* Top Row: Flag & Order Label */}
            <div className="flex items-center gap-3.5">
              <img
                src={destination?.flagUrl || '/assets/flags/gb.svg'}
                alt={`${destination?.name || 'Destination'} flag`}
                className="w-10 h-10 rounded-full object-cover shadow-2xs shrink-0 bg-gray-100"
              />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                  ORDER SUMMARY
                </span>
                <span className="text-base font-bold text-gray-900 leading-tight mt-0.5">
                  {destination?.name} eSIM — {pkg?.dataAmount}
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Details Rows */}
            <div className="flex flex-col gap-3">
              {/* Data Row */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Database className="w-4 h-4 text-gray-400" />
                  <span>Data</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {pkg?.dataAmount}
                </span>
              </div>

              {/* Validity Row */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2.5 text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Validity</span>
                </div>
                <span className="font-semibold text-gray-900">{pkg?.validityDays} Days</span>
              </div>
            </div>

            {/* FUP Note */}
            <div className="text-xs text-gray-400 flex items-start gap-2 pt-2 border-t border-gray-100/80 leading-relaxed">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <span>
                2GB/Day high-speed per day · Unlimited at reduced speed after limit · Resets every 24h
              </span>
            </div>
          </div>

          {/* Promo Code Box */}
          <div className="flex flex-col gap-2">
            <div
              onClick={() => setIsPromoOpen(!isPromoOpen)}
              className="border border-gray-200 rounded-[12px] p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors select-none"
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-800">
                  {appliedPromo ? `Promo Applied: ${appliedPromo}` : 'Add promo code'}
                </span>
              </div>
              <ChevronRight
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isPromoOpen ? 'rotate-90' : ''
                }`}
              />
            </div>

            {isPromoOpen && (
              <div className="flex gap-2 p-1">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 focus:border-[#F88B35] focus:bg-white rounded-[10px] px-3.5 py-2 text-sm text-gray-800 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-[10px] text-sm font-semibold transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Total Box */}
          <div className="bg-[#F7F7F7] rounded-[12px] p-4 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-900">Total</span>
            <span className="text-2xl font-black text-gray-900">${totalPrice}</span>
          </div>

          {/* Action Section */}
          <div className="flex flex-col gap-3">
            {/* Store Credit Note */}
            <div className="text-xs font-medium text-gray-500 bg-gray-50 rounded-lg p-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-400 shrink-0" />
              <span>You&apos;ll earn SooviaMoney with this purchase!</span>
            </div>

            {/* Error Message */}
            {checkoutError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg p-3.5 flex items-start gap-2">
                <span className="font-semibold shrink-0">Payment Error:</span>
                <span>{checkoutError}</span>
              </div>
            )}

            {/* Payment Button */}
            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={isProcessing}
              className="w-full bg-[#F88B35] hover:bg-[#e07a2f] disabled:opacity-70 text-white py-4 rounded-[12px] font-bold text-lg flex justify-center items-center gap-2 transition-colors shadow-sm cursor-pointer active:scale-[0.99]"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting to Gateway...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Payment ${totalPrice}</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>

          {/* Footer Trust Badges */}
          <div className="flex flex-col items-center gap-3 pt-2">
            {/* Payment Methods Badges */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="bg-white border border-gray-200 text-[10px] font-bold text-gray-600 px-2.5 py-1 rounded shadow-2xs tracking-wide">
                VISA
              </span>
              <span className="bg-white border border-gray-200 text-[10px] font-bold text-gray-600 px-2.5 py-1 rounded shadow-2xs tracking-wide">
                MC
              </span>
              <span className="bg-white border border-gray-200 text-[10px] font-bold text-gray-600 px-2.5 py-1 rounded shadow-2xs tracking-wide">
                Apple Pay
              </span>
              <span className="bg-white border border-gray-200 text-[10px] font-bold text-gray-600 px-2.5 py-1 rounded shadow-2xs tracking-wide">
                Google Pay
              </span>
            </div>

            {/* Security Line */}
            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-gray-500 mt-0.5">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                SSL Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                Powered by Stripe
              </span>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-gray-400 text-center max-w-sm mx-auto leading-relaxed mt-0.5">
              You&apos;ll be redirected to Stripe&apos;s secure payment page to complete your purchase. We never store or handle your sensitive card data directly.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F7F7F7] min-h-screen flex items-center justify-center">
          <div className="text-sm font-medium text-gray-500">Loading checkout...</div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
