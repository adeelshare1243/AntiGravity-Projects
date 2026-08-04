'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Smartphone, User, LogOut } from 'lucide-react';
import Footer from '@/components/storefront/Footer';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAccountActive = pathname === '/account';
  const isMyEsimsActive = pathname === '/my-esims';

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans antialiased bg-[#FAFAFA]">
      <div>
        {/* Custom Top Navigation Header */}
        <header className="bg-white w-full border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto h-20 px-4 flex justify-between items-center">
            {/* Left: Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="text-[#FF7150] flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Globe className="w-8 h-8 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-black text-[#111111] tracking-tight">
                logo
              </span>
            </Link>

            {/* Center: Navigation Links */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/my-esims"
                className={`flex items-center gap-2 px-4 py-2 rounded-[10px] font-medium text-sm transition-all ${
                  isMyEsimsActive
                    ? 'bg-[#FD521B] text-white shadow-xs'
                    : 'text-slate-500 hover:text-darkScale-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>My eSIMs</span>
              </Link>

              <Link
                href="/account"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-[10px] font-medium text-sm transition-all ${
                  isAccountActive
                    ? 'bg-[#FD521B] text-white shadow-xs'
                    : 'text-slate-500 hover:text-darkScale-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Account</span>
              </Link>
            </div>

            {/* Right: Log Out */}
            <Link
              href="/login"
              className="flex items-center gap-2 text-darkScale-900 font-medium text-sm hover:opacity-70 transition-opacity"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              <span>Log Out</span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="bg-[#FAFAFA] min-h-[calc(100vh-80px)] pt-8 pb-16">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}
