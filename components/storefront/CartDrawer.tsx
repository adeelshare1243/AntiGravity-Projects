'use client';

import React from 'react';
import Link from 'next/link';
import { useESim } from '@/context/ESimContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, currency, isCartOpen, setIsCartOpen, removeFromCart, clearCart } = useESim();

  if (!isCartOpen) return null;

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : '$';
  const currencyRate = currency === 'EUR' ? 0.92 : currency === 'GBP' ? 0.79 : currency === 'JPY' ? 155 : 1;

  const totalUsd = cart.reduce((total, item) => total + item.package.price_usd * item.quantity, 0);
  const formattedTotal = (totalUsd * currencyRate).toFixed(currency === 'JPY' ? 0 : 2);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-dark-900/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-grey-100 flex items-center justify-between bg-brand-50/50">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-sm">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-dark-900">Your Travel Cart</h3>
                <p className="text-xs text-dark-400">
                  {cart.length === 0 ? 'Cart is empty' : `${cart.length} item(s) selected`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-dark-300 hover:text-dark-800 hover:bg-grey-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-grey-100 text-dark-300 mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-dark-800">Your cart is empty</h4>
                  <p className="text-xs text-dark-400 mt-1">Explore our destinations and pick an eSIM data plan.</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-brand-500/20"
                >
                  Explore Destinations
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemTotal = (item.package.price_usd * item.quantity * currencyRate).toFixed(
                  currency === 'JPY' ? 0 : 2
                );

                return (
                  <div
                    key={item.package.id}
                    className="p-4 bg-grey-50 rounded-2xl border border-grey-200 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.package.flag_url || '🌐'}</span>
                      <div>
                        <h4 className="text-sm font-bold text-dark-900">{item.package.title}</h4>
                        <div className="text-xs text-dark-400 mt-0.5">
                          {item.package.data_gb === 'unlimited' ? 'Unlimited' : `${item.package.data_gb}GB`} • {item.package.duration_days} Days
                        </div>
                        <div className="text-xs font-semibold text-brand-600 mt-1">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="text-base font-extrabold text-dark-900">
                        {currencySymbol}{itemTotal}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.package.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-grey-100 bg-white space-y-4">
              <div className="space-y-2 text-xs text-dark-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-dark-800">{currencySymbol}{formattedTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Activation & Delivery Fee</span>
                  <span className="font-semibold text-status-success">FREE ($0.00)</span>
                </div>
                <div className="pt-2 border-t border-grey-100 flex justify-between text-base font-extrabold text-dark-900">
                  <span>Total</span>
                  <span>{currencySymbol}{formattedTotal}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-dark-400 bg-brand-50/70 p-2.5 rounded-xl border border-brand-100">
                <ShieldCheck className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span>Instant QR code email delivery after successful payment.</span>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/20 active:scale-95 transition-all text-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
