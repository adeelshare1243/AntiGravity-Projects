'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, ChevronRight } from 'lucide-react';

const PATH_TITLES: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/admin/orders': 'Orders',
  '/admin/esims': 'eSIM Management',
  '/admin/destinations': 'Destinations & Packages',
  '/admin/customers': 'Customers',
  '/admin/promo-codes': 'Promo Codes',
  '/admin/referrals': 'Referrals',
  '/admin/blog': 'Blog',
  '/admin/help-center': 'Help Center',
  '/admin/integrations': 'Payment & APIs',
  '/admin/team-roles': 'Team & Roles',
  '/admin/scripts': 'Analytics & Scripts',
  '/admin/settings': 'Settings',
  '/admin/profile': 'Admin Profile',
  '/admin/pricing': 'Pricing',
  '/admin/providers': 'Providers',
  '/admin/restrictions': 'Restrictions',
  '/admin/sales': 'Sales Analytics',
  '/admin/users': 'Users',
};

export const AdminHeader: React.FC = () => {
  const pathname = usePathname();

  // Strip locale prefix if present (e.g., /en/admin/orders -> /admin/orders)
  const normalized = pathname ? pathname.replace(/^\/[a-z]{2}(\/|$)/, '$1') : '';
  const cleanPath = normalized.startsWith('/') ? normalized : `/${normalized}`;

  // Determine current page title
  const currentTitle =
    PATH_TITLES[cleanPath] ||
    cleanPath
      .split('/')
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) ||
    'Dashboard';

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left Section: Breadcrumb / Title */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors">
          Admin
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
        <h1 className="text-sm font-bold text-gray-900 tracking-tight">
          {currentTitle}
        </h1>
      </div>

      {/* Right Section: Search & Notification Bell */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden sm:block">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search orders, eSIMs..."
            className="w-48 md:w-64 bg-[#F7F7F7] border border-transparent rounded-lg pl-8 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all"
          />
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative text-gray-500 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F88B35] ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
