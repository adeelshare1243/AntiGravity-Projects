import React from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import {
  Search,
  BookOpen,
  AlertCircle,
  Smartphone,
  HelpCircle,
  Wifi,
  Settings,
  Shield,
  CreditCard,
  Mail,
  MessageSquare,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Help Center | Soovia eSIM',
  description:
    'How can we help you? Browse support categories, eSIM installation guides, troubleshooting, and 24/7 customer support.',
};

const ICON_MAP: Record<string, LucideIcon> = {
  book: BookOpen,
  'book-open': BookOpen,
  BookOpen: BookOpen,
  smartphone: Smartphone,
  Smartphone: Smartphone,
  phone: Smartphone,
  alert: AlertCircle,
  'alert-circle': AlertCircle,
  AlertCircle: AlertCircle,
  help: HelpCircle,
  'help-circle': HelpCircle,
  HelpCircle: HelpCircle,
  wifi: Wifi,
  Wifi: Wifi,
  settings: Settings,
  Settings: Settings,
  shield: Shield,
  Shield: Shield,
  card: CreditCard,
  'credit-card': CreditCard,
  CreditCard: CreditCard,
};

function getCategoryIcon(iconName?: string | null): LucideIcon {
  if (!iconName) return BookOpen;
  const normalized = iconName.toLowerCase().trim();
  return ICON_MAP[normalized] || ICON_MAP[iconName] || BookOpen;
}

export default async function HelpCenterPage() {
  const categories = await prisma.helpCategory.findMany({
    include: {
      _count: {
        select: {
          articles: { where: { status: 'PUBLISHED' } },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <main className="min-h-screen bg-white text-[#252F4A] flex flex-col justify-between font-sans antialiased">
      <div>
        <Navbar />

        {/* 1. TOP SECTION (Pure White Background) */}
        <section className="bg-white py-16 md:py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-[36px] md:text-[44px] font-[800] text-[#252F4A] tracking-tight">
              Help Center
            </h1>
            <p className="text-[16px] text-slate-500 mt-4 max-w-xl mx-auto leading-relaxed">
              How can we help you? Browse categories or search for answers.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mt-8">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Describe your issue..."
                className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-xl text-[#252F4A] placeholder-slate-400 focus:outline-none focus:border-[#FF5A36] focus:ring-1 focus:ring-[#FF5A36] transition-all text-base shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* 2. MAIN CONTENT SECTION (Light Gray Background) */}
        <section className="bg-slate-50 py-16 px-4 md:px-8 w-full border-t border-slate-100">
          <div className="max-w-5xl mx-auto">
            {/* 3. CATEGORY CARDS GRID (2 Columns) */}
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category.icon);
                  const articleCount = category._count.articles;

                  return (
                    <Link
                      key={category.id}
                      href={`/help-center/${category.slug}`}
                      className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-slate-200 transition-all hover:-translate-y-1 duration-200 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="bg-orange-50 text-[#FF5A36] w-12 h-12 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#FF5A36] group-hover:text-white transition-colors">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#FF5A36] transition-colors">
                          {category.title}
                        </h2>
                        {category.subtitle && (
                          <p className="text-slate-500 mb-6 text-sm md:text-base leading-relaxed">
                            {category.subtitle}
                          </p>
                        )}
                      </div>
                      <div className="inline-flex items-center gap-2 font-bold text-sm text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                        <span>
                          {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-[24px] p-12 text-center border border-slate-100 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  No support categories yet
                </h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  Help categories will appear here once published from the admin center.
                </p>
              </div>
            )}

            {/* 4. CONTACT / SUPPORT BLOCK */}
            <div className="mt-6 bg-white rounded-[24px] p-8 md:p-10 shadow-sm border border-slate-100 text-center">
              <h2 className="text-2xl font-bold text-slate-900">
                Can&apos;t find what you need?
              </h2>
              <p className="text-slate-500 mt-2 mb-8 text-sm md:text-base">
                Our support team is here to help you 24/7.
              </p>

              {/* Inner Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Card 1: Email Support */}
                <a
                  href="mailto:support@soovia.com"
                  className="bg-slate-50 rounded-xl p-6 flex items-center text-left gap-4 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-white text-[#FF5A36] flex items-center justify-center border border-orange-100 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#FF5A36] transition-colors">
                      Email Support
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      We&apos;ll respond within 24 hours
                    </p>
                  </div>
                </a>

                {/* Contact Card 2: Live Chat */}
                <Link
                  href="/support"
                  className="bg-slate-50 rounded-xl p-6 flex items-center text-left gap-4 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-white text-[#FF5A36] flex items-center justify-center border border-orange-100 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#FF5A36] transition-colors">
                      Live Chat
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Available 24/7
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
