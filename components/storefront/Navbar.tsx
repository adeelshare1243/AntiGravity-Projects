'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useESim } from '@/context/ESimContext';
import { Language } from '@/types';
import { Search, Menu, X, Globe, TrendingUp, ChevronRight, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logoutCustomer } from '@/actions/customer-auth';

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

interface LanguageItem {
  code: Language;
  native: string;
  english: string;
  flagUrl: string;
  flag?: string;
}

const LANGUAGES: LanguageItem[] = [
  { code: 'en', native: 'English', english: 'English', flagUrl: '/assets/flags/gb.svg', flag: '🇬🇧' },
  { code: 'tr', native: 'Türkçe', english: 'Turkish', flagUrl: '/assets/flags/tr.svg', flag: '🇹🇷' },
  { code: 'es', native: 'Español', english: 'Spanish', flagUrl: '/assets/flags/es.svg', flag: '🇪🇸' },
  { code: 'ar', native: 'العربية', english: 'Arabic', flagUrl: '/assets/flags/ar.svg', flag: '🇸🇦' },
  { code: 'de', native: 'Deutsch', english: 'German', flagUrl: '/assets/flags/de.svg', flag: '🇩🇪' },
  { code: 'fr', native: 'Français', english: 'French', flagUrl: '/assets/flags/fr.svg', flag: '🇫🇷' },
];

interface DestinationSearchResult {
  id: string;
  name: string;
  slug: string;
  isoCode: string;
  flagUrl: string;
  planCount: number;
  startingPrice: string | null;
}

// Curated slugs shown when the search box is empty
const POPULAR_SLUGS = ['thailand', 'saudi-arabia', 'canada', 'united-arab-emirates', 'united-kingdom', 'united-states'];

export interface NavbarUser {
  id: string;
  email?: string;
  name?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    [key: string]: any;
  };
}

export interface NavbarProps {
  user?: NavbarUser | null;
}

function parseUserData(rawUser?: NavbarUser | null): { id: string; email?: string; name?: string } | null {
  if (!rawUser) return null;
  return {
    id: rawUser.id,
    email: rawUser.email,
    name:
      rawUser.name ||
      rawUser.user_metadata?.full_name ||
      rawUser.user_metadata?.name ||
      rawUser.email?.split('@')[0],
  };
}

export const Navbar: React.FC<NavbarProps> = ({ user: initialUser }) => {
  const currentLocale = useLocale() as Language;
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage } = useESim();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Live destination data
  const [destinations, setDestinations] = useState<DestinationSearchResult[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  // User session state seeded directly from server prop (eliminates FOUS / flash)
  const [user, setUser] = useState<{ id: string; email?: string; name?: string } | null>(() =>
    initialUser ? parseUserData(initialUser) : null
  );
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  // Sync if initialUser prop updates
  useEffect(() => {
    if (initialUser !== undefined) {
      setUser(parseUserData(initialUser));
    }
  }, [initialUser]);

  useEffect(() => {
    const supabase = createClient();

    // Fallback: only fetch client-side if the server did not provide the user prop
    if (initialUser === undefined) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setUser(parseUserData(data.user));
        } else {
          setUser(null);
        }
      });
    }

    // Subscribe to auth state changes (logouts, logins across tabs)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(parseUserData(session.user));
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialUser]);

  const handleSignOut = async () => {
    await logoutCustomer();
    setUser(null);
    setIsAccountMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  useEffect(() => {
    setIsLoadingSearch(true);
    fetch('/api/destinations/search')
      .then((r) => r.json())
      .then((data: DestinationSearchResult[]) => setDestinations(Array.isArray(data) ? data : []))
      .catch(() => setDestinations([]))
      .finally(() => setIsLoadingSearch(false));
  }, []);

  // When query is empty show curated popular; otherwise filter by name
  const filteredDestinations: DestinationSearchResult[] =
    searchQuery.trim() === ''
      ? destinations
          .filter((d) => POPULAR_SLUGS.includes(d.slug))
          .sort((a, b) => POPULAR_SLUGS.indexOf(a.slug) - POPULAR_SLUGS.indexOf(b.slug))
      : destinations.filter((d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  const activeLocale = currentLocale || language || 'en';
  const activeLanguage =
    LANGUAGES.find((l) => l.code === activeLocale) || LANGUAGES[0];
  const currentLang = activeLanguage;

  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsLangModalOpen(false);
    router.replace(pathname, { locale: langCode });
  };

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1080px] mx-auto w-full px-4 h-[76px] flex items-center justify-between">
          {/* Left: Brand Logo (Orange Globe Wireframe + "logo") */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="text-[#F88B35] flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Globe className="w-8 h-8 stroke-[2.2]" />
            </div>
            <span className="text-2xl font-black text-[#111111] tracking-tight">
              logo
            </span>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[15px] font-semibold transition-colors ${
                    isActive
                      ? 'text-[#F88B35]'
                      : 'text-gray-800 hover:text-[#F88B35]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Search Pill Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 bg-[#F7F7F7] hover:bg-gray-100 h-10 px-4 rounded-[12px] text-[14px] text-gray-500 font-medium cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span>Search</span>
            </button>

            {/* Language Selector Modal Trigger */}
            <button
              type="button"
              onClick={() => setIsLangModalOpen(true)}
              className="text-[15px] font-semibold text-gray-800 flex items-center gap-2 hover:text-[#F15A24] transition-colors py-1.5 cursor-pointer"
            >
              <img
                src={activeLanguage.flagUrl}
                alt="flag"
                className="w-5 h-5 rounded-full object-cover shadow-sm"
              />
              <span>{activeLanguage.native}</span>
            </button>

            {/* Auth Actions: Log In & Sign Up OR Authenticated State */}
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-[15px] font-semibold text-gray-800 hover:text-[#F88B35] transition-colors"
                >
                  Log In
                </Link>

                <Link
                  href="/signup"
                  className="bg-[#F88B35] hover:bg-[#e07a2f] text-white h-10 px-6 flex items-center justify-center rounded-[10px] text-[15px] font-bold transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* Step 1: "My eSIMs" Button */}
                <Link
                  href="/my-esims"
                  className="bg-[#F7931E] hover:bg-orange-500 text-white font-medium text-sm px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>My eSIMs</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                {/* Step 2: Restyled User Profile Display */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer py-1 focus:outline-none"
                    aria-label="User menu"
                  >
                    <div className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-950 font-medium text-sm whitespace-nowrap">
                      {user.name || 'Account'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isAccountMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsAccountMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-[16px] shadow-[0px_10px_30px_0px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs text-gray-400">Signed in as</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                        </div>

                        <Link
                          href="/my-esims"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#F7931E] transition-colors"
                        >
                          My eSIMs
                        </Link>

                        <Link
                          href="/account"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#F15A24] transition-colors"
                        >
                          Account Settings
                        </Link>

                        <div className="border-t border-gray-100 my-1" />

                        <button
                          type="button"
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            handleSignOut();
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-semibold text-[#DE350B] hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-800 rounded-xl hover:bg-gray-100"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-800 rounded-xl hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-[76px] z-50 lg:hidden flex flex-col bg-white animate-in slide-in-from-right duration-200 border-t border-gray-200">
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-800 hover:bg-gray-100"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLangModalOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-gray-800 hover:bg-gray-100 cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <img
                      src={activeLanguage.flagUrl}
                      alt="flag"
                      className="w-6 h-6 rounded-full object-cover shadow-sm"
                    />
                    <span>{activeLanguage.native}</span>
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Change</span>
                </button>
              </div>

              <div className="pt-4 space-y-3 border-t border-gray-200">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-center py-3 text-[15px] font-semibold text-gray-800 bg-gray-100 rounded-xl"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-center py-3 text-[15px] font-bold text-white bg-[#F88B35] rounded-xl shadow-sm"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-xs shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name || 'My Account'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>

                    <Link
                      href="/my-esims"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2.5 text-[15px] font-medium text-gray-800 hover:bg-gray-100 rounded-xl"
                    >
                      My eSIMs
                    </Link>

                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2.5 text-[15px] font-medium text-gray-800 hover:bg-gray-100 rounded-xl"
                    >
                      Account Settings
                    </Link>

                    <button
                      type="button"
                      onClick={async () => {
                        setIsMobileMenuOpen(false);
                        await handleSignOut();
                      }}
                      className="w-full text-center py-3 text-[15px] font-bold text-[#DE350B] bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </>
                )}
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
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-black cursor-pointer hover:opacity-70 transition-opacity p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Section Title */}
            <div className="flex items-center gap-2 px-6 py-4">
              <TrendingUp className="w-5 h-5 text-[#F88B35]" />
              <span className="text-[12px] text-black/60 font-medium">Popular Destinations</span>
            </div>

            {/* Destinations List */}
            <div className="flex flex-col gap-1 px-4 pb-6 overflow-y-auto max-h-[472px]">
              {filteredDestinations.length === 0 && !isLoadingSearch ? (
                <p className="text-[13px] text-[#4B5675] font-medium px-3 py-4">
                  No destinations found matching &quot;{searchQuery}&quot;
                </p>
              ) : (
                filteredDestinations.map((dest) => (
                  <Link
                    key={dest.slug}
                    href={`/${activeLocale}/destinations/${dest.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex justify-between items-center p-3 rounded-[16px] hover:bg-[#F7F7F7] cursor-pointer group transition-colors"
                  >
                    {/* Left Side */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center shadow-xs border border-slate-100 shrink-0">
                        <img
                          src={dest.flagUrl}
                          alt={dest.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[16px] font-medium text-black group-hover:text-[#F88B35] transition-colors">
                          {dest.name}
                        </span>
                        <span className="text-[12px] text-[#4B5675]">
                          {dest.planCount} plans{dest.startingPrice ? ` · ${dest.startingPrice}` : ''}
                        </span>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                      {dest.startingPrice && (
                        <div className="bg-white group-hover:bg-white rounded-[8px] px-3 py-1.5 shadow-2xs border border-slate-100">
                          <span className="text-[12px] text-[#252F4A]">From {dest.startingPrice}</span>
                        </div>
                      )}
                      <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHOOSE LANGUAGE MODAL */}
      {isLangModalOpen && (
        <div
          onClick={() => setIsLangModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[480px] bg-white rounded-[20px] p-6 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex flex-col pr-8">
              <h3 className="text-xl font-bold text-gray-900">
                Choose Language
              </h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                Select your preferred language
              </p>
            </div>

            {/* Close Button (X) */}
            <button
              type="button"
              onClick={() => setIsLangModalOpen(false)}
              aria-label="Close modal"
              className="absolute top-6 right-6 text-gray-400 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Language List Items */}
            <div className="flex flex-col">
              {LANGUAGES.map((lang) => {
                const isActive = activeLocale === lang.code;

                return (
                  <div
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-colors mb-2 last:mb-0 ${
                      isActive
                        ? 'bg-[#FFF9F5] border border-[#F88B35]'
                        : 'border border-transparent hover:bg-gray-50'
                    }`}
                  >
                    {/* Content (Left): Flag */}
                    <img
                      src={lang.flagUrl}
                      alt={lang.native}
                      className="w-6 h-6 rounded-full object-cover shadow-sm mr-4"
                    />

                    {/* Flex-col for names */}
                    <div className="flex flex-col">
                      <span
                        className={`text-[15px] font-semibold ${
                          isActive ? 'text-[#F88B35]' : 'text-gray-900'
                        }`}
                      >
                        {lang.native}
                      </span>
                      <span
                        className={`text-[13px] ${
                          isActive ? 'text-[#F88B35]/80' : 'text-gray-500'
                        }`}
                      >
                        {lang.english}
                      </span>
                    </div>

                    {/* Content (Right - Only if Active): A filled orange circle with a white checkmark SVG */}
                    {isActive && (
                      <svg
                        className="text-[#F88B35] w-6 h-6 ml-auto shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <circle cx="12" cy="12" r="12" fill="currentColor" />
                        <path
                          d="M7 12.5L10.5 16L17 8.5"
                          stroke="white"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Navbar as Header };
export default Navbar;
