'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Globe,
  LayoutDashboard,
  ShoppingBag,
  Smartphone,
  Globe2,
  Users,
  Tag,
  Share2,
  FileText,
  HelpCircle,
  CreditCard,
  Settings,
  LogOut,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { logout } from '@/app/[locale]/auth/actions';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

const NAVIGATION_CATEGORIES: NavCategory[] = [
  {
    category: 'OVERVIEW',
    items: [
      { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    category: 'COMMERCE & INVENTORY',
    items: [
      { title: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      { title: 'eSIM Management', href: '/admin/esims', icon: Smartphone },
      { title: 'Destinations & Packages', href: '/admin/destinations', icon: Globe2 },
      { title: 'Customers', href: '/admin/customers', icon: Users },
    ],
  },
  {
    category: 'MARKETING & GROWTH',
    items: [
      { title: 'Promo Codes', href: '/admin/promo-codes', icon: Tag },
      { title: 'Referrals', href: '/admin/referrals', icon: Share2 },
    ],
  },
  {
    category: 'CONTENT (CMS)',
    items: [
      { title: 'Blog', href: '/admin/blog', icon: FileText },
      { title: 'Help Center', href: '/admin/help-center', icon: HelpCircle },
    ],
  },
  {
    category: 'SYSTEM & CONFIGURATION',
    items: [
      { title: 'Payment & APIs', href: '/admin/integrations', icon: CreditCard },
      { title: 'Team & Roles', href: '/admin/team-roles', icon: ShieldCheck },
      { title: 'Analytics & Scripts', href: '/admin/scripts', icon: Code2 },
      { title: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (!pathname) return false;
    // Strip locale prefix if present (e.g., /en/admin -> /admin)
    const normalized = pathname.replace(/^\/[a-z]{2}(\/|$)/, '$1');
    const cleanPath = normalized.startsWith('/') ? normalized : `/${normalized}`;

    if (href === '/admin') {
      return cleanPath === '/admin' || cleanPath === '/admin/dashboard';
    }
    return cleanPath.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      window.location.href = '/admin/login';
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between h-screen sticky top-0 text-gray-600 select-none shrink-0">
      {/* Top Brand Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-3 group">
          <Globe className="w-6 h-6 text-[#F88B35] shrink-0 group-hover:scale-105 transition-transform" />
          <div className="text-xl tracking-tight flex items-center">
            <span className="font-black text-gray-900">Admin</span>
            <span className="font-medium text-gray-400 ml-0.5">Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar" aria-label="Admin Navigation">
        {NAVIGATION_CATEGORIES.map((cat, idx) => (
          <div key={cat.category}>
            <div className={`text-[10px] font-bold text-gray-400 tracking-wider uppercase px-3 mb-2 ${idx === 0 ? 'mt-1' : 'mt-4'}`}>
              {cat.category}
            </div>
            <div className="space-y-1">
              {cat.items.map((item) => {
                const active = isItemActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150 ${
                      active
                        ? 'bg-[#F88B35] text-white font-bold shadow-sm rounded-[10px]'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-medium rounded-[10px] transition-colors'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-current" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom User Block */}
      <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-between">
        {/* User Profile Card */}
        <Link
          href="/admin/profile"
          className="flex items-center gap-3 group min-w-0 hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 object-cover flex items-center justify-center text-xs font-bold text-gray-700 shrink-0">
            AU
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-gray-900 truncate w-24">
              Admin User
            </span>
            <span className="text-[10px] text-gray-500">
              Super Admin
            </span>
          </div>
        </Link>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          type="button"
          aria-label="Logout"
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
