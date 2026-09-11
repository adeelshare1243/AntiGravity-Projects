'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerCustomer, loginCustomer } from '@/actions/customer-auth';
import { createClient } from '@/lib/supabase/client';

interface SignUpProps {
  initialError?: string;
  initialTab?: 'signup' | 'login';
}

export const SignUp: React.FC<SignUpProps> = ({ initialError, initialTab = 'signup' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>(initialTab);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [promoChecked, setPromoChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);

  const redirectTo = searchParams?.get('redirectTo') || searchParams?.get('next') || '/dashboard';
  const referralCode = searchParams?.get('ref') || '';

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (authError) {
        setError(authError.message);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'OAuth sign-in failed.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === 'signup') {
        const res = await registerCustomer(fullName, email, password, promoChecked, referralCode);
        if (!res.success) {
          setError(typeof res.error === 'string' ? res.error : 'Registration failed. Please try again.');
          setIsLoading(false);
          return;
        }
      } else {
        const res = await loginCustomer(email, password);
        if (!res.success) {
          setError(typeof res.error === 'string' ? res.error : 'Invalid email or password.');
          setIsLoading(false);
          return;
        }
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === 'string'
          ? err
          : 'Authentication failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col font-sans antialiased text-[#000000]">
      {/* 1. SEPARATE CUSTOM HEADER (Figma Node #24496:39799) */}
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

      {/* 2. SIGNUP CARD CONTAINER (Figma Node #24496:39813 & Error Node #24496:39950) */}
      <main className="flex-1 flex items-center justify-center p-4 py-[40px] md:py-[73px]">
        <div className="w-full max-w-[520px] bg-[#FFFFFF] rounded-[24px] p-6 md:p-[40px] shadow-[0px_8px_24px_0px_rgba(29,22,29,0.05)] flex flex-col gap-[24px]">
          
          {/* Tab Switcher */}
          <div className="w-full bg-[#F7F7F7] rounded-[12px] p-[4px] flex gap-[4px]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError(null);
              }}
              className={`flex-1 py-[10px] text-center rounded-[10px] text-[16px] font-[600] transition-colors cursor-pointer ${
                activeTab === 'login'
                  ? 'text-[#000000] bg-[#FFFFFF] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)]'
                  : 'text-[#4B5675] hover:text-[#000000]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setError(null);
              }}
              className={`flex-1 py-[10px] text-center rounded-[10px] text-[16px] font-[600] transition-colors cursor-pointer ${
                activeTab === 'signup'
                  ? 'text-[#000000] bg-[#FFFFFF] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.05)]'
                  : 'text-[#4B5675] hover:text-[#000000]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Title & Subtitle Header */}
          <div className="flex flex-col items-center gap-[6px] text-center">
            <h1 className="text-[28px] font-[700] text-[#000000] leading-[1.2em]">
              {activeTab === 'signup' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-[16px] font-[400] text-[#4B5675] leading-[1.4em]">
              {activeTab === 'signup'
                ? 'Join us and get connected worldwide'
                : 'Manage your active eSIM data plans & top-ups'}
            </p>
          </div>

          {/* Social Action Buttons */}
          <div className="flex flex-col gap-[12px] w-full">
            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              className="w-full bg-[#000000] hover:bg-gray-900 text-[#FFFFFF] rounded-[10px] py-[13px] px-[16px] flex items-center justify-center gap-[12px] transition-colors cursor-pointer"
            >
              <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.01 10.04.01 12c0 1.96.46 3.8 1.28 5.42l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span className="text-[14px] font-[500] leading-[1.4em]">Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignIn('apple')}
              className="w-full bg-[#000000] hover:bg-gray-900 text-[#FFFFFF] rounded-[10px] py-[13px] px-[16px] flex items-center justify-center gap-[12px] transition-colors cursor-pointer"
            >
              <svg className="w-[24px] h-[24px] fill-current text-white" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.03 1.92-14.58-6.15-3.04-2.64-6.93-7.26-11.67-13.86-5.87-8.17-10.47-17.15-13.8-26.96-3.33-9.8-5-19.16-5-28.08 0-13.06 3.23-24.08 9.7-33.06 6.46-8.98 14.77-13.57 24.91-13.78 4.48 0 9.47 1.15 14.97 3.44 5.5 2.3 9.29 3.45 11.37 3.45 1.83 0 5.72-1.2 11.67-3.6 5.95-2.4 10.87-3.52 14.76-3.35 11.03.49 19.82 4.67 26.37 12.54-9.76 5.88-14.5 13.97-14.23 24.28.27 7.95 3.28 14.65 9.03 20.1 5.76 5.45 12.7 8.44 20.83 8.97-2.45 7.18-5.77 14.37-9.97 21.57zm-26.68-101.44c0 6.09-2.22 11.95-6.66 17.58-5.18 6.44-11.45 10.05-18.8 10.83-.27-1.08-.41-2.18-.41-3.3 0-6.19 2.4-12.33 7.21-18.42 4.8-6.09 11.12-9.77 18.96-11.04.14.78.2 1.58.2 2.35z"/>
              </svg>
              <span className="text-[14px] font-[500] leading-[1.4em]">Continue with Apple</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-[12px] w-full">
            <div className="h-[1px] bg-[#EBEBEB] flex-1" />
            <span className="text-[12px] font-[500] text-[#4B5675]">OR</span>
            <div className="h-[1px] bg-[#EBEBEB] flex-1" />
          </div>

          {/* EXACT FIGMA ERROR ALERT BANNER (Figma Node #24496:39988) */}
          {error && (
            <div className="w-full bg-[#FDF2F2] border border-[#F8D7DA] rounded-[10px] p-[14px] flex items-center gap-[10px] animate-fadeIn">
              <div className="shrink-0 pt-0.5">
                <svg className="w-[18px] h-[18px] text-[#DE350B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="text-[14px] font-[500] text-[#DE350B] leading-[1.4em]">
                {error}
              </p>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[16px] w-full">
            {/* Hidden Referral Code */}
            {referralCode && (
              <input type="hidden" name="referredBy" value={referralCode} />
            )}

            {/* Full Name (rendered only on Sign Up tab) */}
            {activeTab === 'signup' && (
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-[600] text-[#000000]">Full name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F7F7F7] rounded-[12px] px-[16px] py-[14px] text-[14px] font-[400] text-[#000000] placeholder:text-[#4B5675] border border-transparent focus:border-[#000000]/20 focus:bg-white focus:outline-none transition-all"
                />
              </div>
            )}

            {/* Email Address */}
            <div className="flex flex-col gap-[8px]">
              <label className="text-[14px] font-[600] text-[#000000]">Email address</label>
              <input
                type="email"
                required
                placeholder="Enter your email adress"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-[12px] px-[16px] py-[14px] text-[14px] font-[400] text-[#000000] placeholder:text-[#4B5675] transition-all ${
                  error
                    ? 'bg-[#F7F7F7] border border-[#DE350B] focus:outline-none'
                    : 'bg-[#F7F7F7] border border-transparent focus:border-[#000000]/20 focus:bg-white focus:outline-none'
                }`}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-[600] text-[#000000]">Password</label>
                {activeTab === 'login' && (
                  <Link href="/forgot-password" className="text-[12px] font-[500] text-[#4B5675] hover:text-[#000000] hover:underline">
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="w-full bg-[#F7F7F7] rounded-[12px] px-[16px] py-[12px] flex items-center justify-between border border-transparent focus-within:border-[#000000]/20 focus-within:bg-white transition-all h-[48px]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-[14px] font-[400] text-[#000000] placeholder:text-[#4B5675] focus:outline-none border-none pr-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#4B5675] hover:text-[#000000] transition-colors p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#000000] hover:bg-gray-900 text-[#FFFFFF] font-[500] text-[16px] py-[16px] px-[24px] rounded-[10px] transition-colors shadow-sm cursor-pointer mt-2 disabled:opacity-50"
            >
              {isLoading
                ? activeTab === 'signup' ? 'Creating account...' : 'Logging in...'
                : activeTab === 'signup' ? 'Create Account' : 'Log In'}
            </button>
          </form>

          {activeTab === 'signup' && (
            <>
              {/* Promo Checkbox */}
              <label className="flex items-start gap-[10px] cursor-pointer group">
                <input
                  type="checkbox"
                  checked={promoChecked}
                  onChange={(e) => setPromoChecked(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-[18px] h-[18px] rounded-[4px] border-2 transition-all flex items-center justify-center shrink-0 mt-0.5 ${
                  promoChecked ? 'bg-[#000000] border-[#000000]' : 'bg-white border-[#EFECE5] group-hover:border-[#000000]/40'
                }`}>
                  {promoChecked && (
                    <svg className="w-[12px] h-[12px] text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 6L5 9L10 3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[14px] font-[400] text-[#4B5675] leading-[1.4em]">
                  I&apos;d like to receive exclusive offers and promotions (max once a month)
                </span>
              </label>

              {/* Terms & Privacy Subtext */}
              <p className="text-[12px] font-[400] text-[#4B5675] text-center leading-[1.4em]">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-[#000000] font-[500] underline hover:opacity-80">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#000000] font-[500] underline hover:opacity-80">
                  Privacy Policy
                </Link>
                .
              </p>
            </>
          )}

          {/* Footer Switch Text */}
          <div className="flex items-center justify-center gap-[4px] text-[14px]">
            <span className="font-[400] text-[#4B5675]">
              {activeTab === 'signup' ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveTab(activeTab === 'signup' ? 'login' : 'signup');
                setError(null);
              }}
              className="font-[600] text-[#000000] hover:underline cursor-pointer"
            >
              {activeTab === 'signup' ? 'Log in' : 'Create Account'}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default SignUp;
