'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col font-sans antialiased text-[#000000]">
      {/* 1. SEPARATE CUSTOM HEADER */}
      <header className="w-full bg-[#FFFFFF] border-b border-[#EBEBEB] h-[56px] px-4 md:px-8 flex items-center justify-center sticky top-0 z-50">
        <div className="max-w-[780px] w-full flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-[8px] text-[14px] font-[500] text-[#000000] hover:opacity-80 transition-opacity"
            type="button"
          >
            <svg className="w-[8px] h-[14px]" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1L1 7L7 13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>back</span>
          </button>

          {/* Center Brand Logo */}
          <Link href="/" className="flex items-center gap-[8px] group">
            <img src="/assets/globe.svg" alt="logo" className="w-[24px] h-[24px]" />
            <span className="text-[20px] font-[700] text-[#111111] leading-[1.4em]">Soovia</span>
          </Link>

          {/* Spacer */}
          <div className="w-[60px] opacity-0 pointer-events-none" aria-hidden="true" />
        </div>
      </header>

      {/* 2. FORGOT PASSWORD CARD CONTAINER */}
      <main className="flex-1 flex items-center justify-center p-4 py-[40px] md:py-[73px]">
        <div className="w-full max-w-[520px] bg-[#FFFFFF] rounded-[24px] p-6 md:p-[40px] shadow-[0px_8px_24px_0px_rgba(29,22,29,0.05)] flex flex-col gap-[24px] relative">
          
          {/* Top-Left Circular Back Button */}
          <button
            onClick={() => router.back()}
            type="button"
            className="w-[36px] h-[36px] rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-700 absolute left-6 top-6 cursor-pointer"
            aria-label="Go back"
          >
            <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          {/* Top-Center Circular Mail Icon Badge */}
          <div className="flex flex-col items-center gap-[12px] pt-2">
            <div className="w-[48px] h-[48px] rounded-full bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs">
              <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>

            {/* Title & Subtitle Header */}
            <div className="flex flex-col items-center gap-[6px] text-center">
              <h1 className="text-[24px] md:text-[28px] font-bold text-slate-900 leading-tight">
                Reset your password
              </h1>
              <p className="text-[14px] md:text-[16px] text-slate-500 leading-normal">
                Enter your email and we&apos;ll send you a reset link
              </p>
            </div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] w-full">
              {/* Email Address Input */}
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-semibold text-slate-900">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5A36]/20 focus:border-[#FF5A36] transition-all"
                />
              </div>

              {/* Primary CTA Button: Send Mail */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF5A36] hover:bg-[#E04826] text-white font-medium rounded-xl py-3 text-sm md:text-base transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Sending mail...' : 'Send Mail'}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-[16px] text-center py-2">
              <div className="w-[52px] h-[52px] rounded-full bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="flex flex-col gap-[4px]">
                <h3 className="text-[18px] font-bold text-slate-900">Check your email</h3>
                <p className="text-[14px] text-slate-500 leading-normal">
                  We have sent a reset link to <span className="font-semibold text-slate-900">{email}</span>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-[14px] font-semibold text-[#FF5A36] hover:underline mt-1 cursor-pointer"
              >
                Resend email
              </button>
            </div>
          )}

          {/* Bottom Link: Back to Login */}
          <div className="flex items-center justify-center pt-1">
            <Link
              href="/login"
              className="text-[14px] font-medium text-slate-800 hover:text-slate-900 hover:underline transition-colors"
            >
              Back to Login
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
