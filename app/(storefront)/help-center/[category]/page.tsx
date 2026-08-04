import React from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ category: string }>;
}

const CATEGORY_MAP: Record<string, { title: string; subtitle: string; articles: Array<{ title: string; excerpt: string; slug: string }> }> = {
  troubleshooting: {
    title: 'Troubleshooting',
    subtitle: 'Solutions for common eSIM issues — connectivity problems, APN settings, and more.',
    articles: [
      {
        slug: 'apn-settings-iphone',
        title: 'How to Configure APN Settings on iPhone',
        excerpt: "Can't connect to the internet even though you have signal? Learn how to configure APN settings manually on your iOS device...",
      },
      {
        slug: 'apn-settings-android',
        title: 'How to Configure APN Settings on Android',
        excerpt: 'Quick guide to configure APN settings on Android. Fix internet connection issues in 2 minutes easily...',
      },
    ],
  },
  installation: {
    title: 'eSIM Installation',
    subtitle: 'Step-by-step guides to install and activate your eSIM on any compatible device.',
    articles: [
      {
        slug: 'iphone-installation-guide',
        title: 'How to Install an eSIM on iPhone (iOS 17 & 18)',
        excerpt: 'Scan your QR code or use direct 1-tap activation to install your eSIM on iPhone in under 2 minutes...',
      },
      {
        slug: 'android-installation-guide',
        title: 'How to Install an eSIM on Samsung & Google Pixel',
        excerpt: 'Complete guide for adding an eSIM line on Android devices via Settings > Connections > SIM Manager...',
      },
    ],
  },
};

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const data = CATEGORY_MAP[category.toLowerCase()] || { title: category };
  return {
    title: `${data.title} | Help Center | Soovia eSIM`,
    description: data.subtitle || `Browse articles for ${data.title} in the Soovia Help Center.`,
  };
}

export default async function HelpCenterCategoryPage({ params }: Props) {
  const { category } = await params;
  const categoryKey = category.toLowerCase();
  const categoryData = CATEGORY_MAP[categoryKey] || {
    title: category.charAt(0).toUpperCase() + category.slice(1),
    subtitle: `Browse help articles and tutorials for ${category}.`,
    articles: [
      {
        slug: 'getting-started',
        title: `Getting Started with ${category}`,
        excerpt: `Everything you need to know about ${category} and managing your eSIM connection...`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#252F4A] flex flex-col justify-between font-sans antialiased">
      <div>
        <Navbar />

        {/* 1. MAIN CONTAINER */}
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          {/* 2. BREADCRUMBS NAVIGATION */}
          <nav className="flex items-center gap-2 text-sm mb-8 text-slate-500">
            <Link href="/help-center" className="hover:text-slate-900 transition-colors">
              Help Center
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-semibold text-slate-900">{categoryData.title}</span>
          </nav>

          {/* 3. HEADER SECTION (Left-Aligned) */}
          <header className="mb-10">
            <h1 className="text-[36px] md:text-[44px] font-[800] text-black tracking-tight mb-3">
              {categoryData.title}
            </h1>
            <p className="text-[16px] text-black max-w-2xl leading-relaxed">
              {categoryData.subtitle}
            </p>
          </header>

          {/* 4. ARTICLE CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoryData.articles.map((article, idx) => (
              <Link
                key={idx}
                href={`/help-center/${categoryKey}/${article.slug}`}
                className="bg-white rounded-[20px] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between group"
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#FF5A36] transition-colors leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-slate-500 mb-6 text-sm md:text-base leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5 group-hover:text-[#FF5A36] transition-colors">
                  <span>Read more</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* 5. ORANGE CTA BANNER ("Still have a question?") */}
          <div className="mt-12 bg-[#FF5A36] rounded-[24px] p-10 md:p-12 text-center text-white shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Still have a question?
            </h2>
            <p className="text-white/90 text-sm sm:text-base mb-8 max-w-md mx-auto">
              Our support team is here to help you 24/7.
            </p>
            <div className="flex flex-row flex-wrap justify-center items-center gap-4">
              {/* Button 1: FAQ */}
              <Link
                href="/faq"
                className="bg-white text-slate-900 font-semibold px-8 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm text-sm sm:text-base"
              >
                FAQ
              </Link>
              {/* Button 2: Contact Us */}
              <Link
                href="/support"
                className="text-white border border-white/40 font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm sm:text-base"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
