'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useESim } from '@/context/ESimContext';
import { Language } from '@/types';
import { Search, ChevronDown, Menu, X, Globe, ShoppingBag, TrendingUp, ChevronRight } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'How it Works', href: '/how-it-works' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Blog', href: '/blog' },
  { label: 'Help Center', href: '/help' },
];

const LANGUAGES: { code: Language; name: string; flagCode: string }[] = [
  { code: 'en', name: 'English', flagCode: 'gb' },
  { code: 'tr', name: 'Türkçe', flagCode: 'tr' },
  { code: 'es', name: 'Español', flagCode: 'es' },
  { code: 'de', name: 'Deutsch', flagCode: 'de' },
  { code: 'fr', name: 'Français', flagCode: 'fr' },
];

const POPULAR_SEARCH_DESTINATIONS = [
  { name: 'Thailand', slug: 'thailand', code: 'th', plansCount: 11, price: '$2.20' },
  { name: 'Saudi Arabia', slug: 'saudi-arabia', code: 'sa', plansCount: 8, price: '$3.30' },
  { name: 'Canada', slug: 'canada', code: 'ca', plansCount: 12, price: '$3.30' },
  { name: 'United Arab Emirates', slug: 'united-arab-emirates', code: 'ae', plansCount: 10, price: '$3.30' },
  { name: 'United Kingdom', slug: 'united-kingdom', code: 'gb', plansCount: 15, price: '$2.20' },
  { name: 'United States', slug: 'united-states', code: 'us', plansCount: 20, price: '$3.30' },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { cart, language, setLanguage, toggleCart } = useESim();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const languageRef = useRef<HTMLDivElement>(null);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-grey-200/60 shadow-xs transition-all duration-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
          {/* Left: Brand Logo (Orange Globe Wireframe + "logo") */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="text-[#FF7150] flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Globe className="w-8 h-8 stroke-[2.2]" />
            </div>
            <span className="text-2xl font-black text-[#111111] tracking-tight">
              logo
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-bold transition-colors ${
                    isActive ? 'text-[#FF7150]' : 'text-[#111111] hover:text-[#FF7150]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-5">
            {/* Search Pill Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-grey-500 bg-[#F1F1F4] hover:bg-grey-200 rounded-2xl cursor-pointer transition-all border border-transparent"
            >
              <Search className="w-4 h-4 text-grey-400" />
              <span className="text-grey-500 font-medium">Search</span>
            </button>

            {/* Language Selector */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-2 text-xs font-bold text-[#111111] hover:text-[#FF7150] transition-colors py-1.5 px-2 cursor-pointer"
              >
                <img
                  src={`https://hatscripts.github.io/circle-flags/flags/${currentLang.flagCode}.svg`}
                  alt="UK Flag"
                  className="w-5 h-5 rounded-full"
                />
                <span>English</span>
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 top-10 w-40 py-1.5 bg-white rounded-2xl shadow-modal border border-grey-200 z-50 animate-in fade-in zoom-in-95">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLanguageOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                        language === lang.code ? 'text-[#FF7150] bg-[#FF7150]/10' : 'text-dark-700 hover:bg-grey-100'
                      }`}
                    >
                      <img
                        src={`https://hatscripts.github.io/circle-flags/flags/${lang.flagCode}.svg`}
                        alt={lang.name}
                        className="w-4 h-4 rounded-full"
                      />
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Icon Trigger */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-[#111111] hover:text-[#FF7150] transition-colors cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF7150] px-1 text-[10px] font-bold text-white shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Log In Link */}
            <Link
              href="/login"
              className="text-xs font-bold text-[#111111] hover:text-[#FF7150] transition-colors px-2 py-1"
            >
              Log In
            </Link>

            {/* Sign Up Primary Button */}
            <Link
              href="/signup"
              className="bg-[#FF7150] hover:bg-[#E04822] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={toggleCart}
              className="relative p-2 text-[#111111] hover:text-[#FF7150]"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF7150] px-1 text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#111111] rounded-xl hover:bg-grey-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-20 z-50 lg:hidden flex flex-col bg-white animate-in slide-in-from-right duration-200 border-t border-grey-200">
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-bold text-[#111111] hover:bg-grey-100"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-6 space-y-3 border-t border-grey-200">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center py-3 text-sm font-bold text-[#111111] bg-grey-100 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center py-3 text-sm font-bold text-white bg-[#FF7150] rounded-xl shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* SEARCH MODAL */}
      {isSearchOpen && (
        <div
          onClick={() => setIsSearchOpen(false)}
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex items-start justify-center pt-[61px] animate-in fade-in duration-150 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[500px] bg-white rounded-[24px] border border-[#F7F7F7] shadow-[0px_4px_23.7px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col relative"
          >
            {/* Header (Search Input) */}
            <div className="h-[64px] border-b border-[#F7F7F7] px-6 flex items-center gap-4">
              <Search className="w-5 h-5 text-[#666660] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by country, city, or region..."
                autoFocus
                className="flex-1 bg-transparent outline-none text-[14px] text-[#0C0C0D] placeholder:text-[#4B5675]"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-black cursor-pointer hover:opacity-70 transition-opacity p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Section Title */}
            <div className="flex items-center gap-2 px-6 py-4">
              <TrendingUp className="w-5 h-5 text-[#FD521B]" />
              <span className="text-[12px] text-black/60 font-medium">Popular Destinations</span>
            </div>

            {/* Destinations List */}
            <div className="flex flex-col gap-1 px-4 pb-6 overflow-y-auto max-h-[472px]">
              {POPULAR_SEARCH_DESTINATIONS.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((country) => (
                <Link
                  key={country.slug}
                  href={`/destinations/${country.slug}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex justify-between items-center p-3 rounded-[16px] hover:bg-[#F7F7F7] cursor-pointer group transition-colors"
                >
                  {/* Left Side */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center shadow-xs border border-slate-100 shrink-0">
                      <img
                        src={`https://hatscripts.github.io/circle-flags/flags/${country.code}.svg`}
                        alt={country.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[16px] font-medium text-black group-hover:text-[#FD521B] transition-colors">
                        {country.name}
                      </span>
                      <span className="text-[12px] text-[#4B5675]">
                        {country.plansCount} plans · {country.price}
                      </span>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-3">
                    <div className="bg-white group-hover:bg-white rounded-[8px] px-3 py-1.5 shadow-2xs border border-slate-100">
                      <span className="text-[12px] text-[#252F4A]">From {country.price}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
