'use client';

import React, { useState } from 'react';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { loginAdmin } from '@/actions/admin-auth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await loginAdmin(email, password);
      const errorMsg =
        typeof result === 'string'
          ? result
          : !result?.success
          ? result?.error || 'Invalid login credentials'
          : null;

      if (errorMsg) {
        setError(errorMsg);
        setIsLoading(false);
        return;
      }

      router.push(locale && locale !== 'en' ? `/${locale}/admin` : '/admin');
      router.refresh();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || 'Failed to sign in. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0A0A0A] font-sans selection:bg-[#F88B35] selection:text-white">
      {/* 2. Left Panel (Branding & Visuals) */}
      <div className="hidden lg:flex w-1/2 bg-[#F88B35] relative overflow-hidden flex-col justify-between p-12 text-white select-none">
        {/* Background Pattern: Concentric Circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <svg
            className="absolute -left-1/4 top-1/2 -translate-y-1/2 w-[160%] h-[160%] stroke-white opacity-20"
            viewBox="0 0 1000 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="350" cy="500" r="140" strokeWidth="1.5" />
            <circle cx="350" cy="500" r="260" strokeWidth="1.5" />
            <circle cx="350" cy="500" r="390" strokeWidth="1.5" />
            <circle cx="350" cy="500" r="540" strokeWidth="1.5" />
            <circle cx="350" cy="500" r="720" strokeWidth="1.5" />
            <circle cx="350" cy="500" r="920" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Top Left Branding */}
        <div className="relative z-10 font-bold flex items-center gap-2.5 text-white tracking-wide">
          <Shield className="w-5 h-5 stroke-[2.2]" />
          <span className="text-base font-semibold">Admin Panel</span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-4 text-white leading-tight">
            Administration Panel
          </h1>
          <p className="text-white/80 text-lg font-normal">
            Sign in to your account
          </p>
        </div>

        {/* Bottom Left Copyright */}
        <div className="relative z-10 text-sm text-white/60">
          © 2026
        </div>
      </div>

      {/* 3. Right Panel (Login Form) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative">
        {/* Mobile Header indicator */}
        <div className="lg:hidden flex items-center gap-2 text-[#F88B35] font-bold mb-10 self-start">
          <Shield className="w-5 h-5" />
          <span>Admin Panel</span>
        </div>

        <div className="w-full max-w-[400px] flex flex-col gap-8">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Sign In
            </h2>
            <p className="text-gray-400 text-sm">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-[10px] p-3">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1.5 block"
              >
                EMAIL
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#141414] border border-[#2A2A2A] text-white rounded-[10px] px-4 py-3.5 text-sm placeholder-gray-600 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1.5 block"
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#141414] border border-[#2A2A2A] text-white rounded-[10px] px-4 py-3.5 pr-12 text-sm placeholder-gray-600 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F88B35] hover:bg-[#e07a2f] disabled:opacity-70 text-white font-bold py-3.5 rounded-[10px] flex items-center justify-center gap-2 transition-colors mt-2 cursor-pointer shadow-sm"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
