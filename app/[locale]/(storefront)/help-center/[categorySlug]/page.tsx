import React from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import { ChevronRight, ArrowRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { categorySlug } = await params;
  const categoryData = await prisma.helpCategory.findUnique({
    where: { slug: categorySlug },
    select: { title: true, subtitle: true },
  });

  if (!categoryData) {
    return {
      title: 'Category Not Found | Help Center | Soovia eSIM',
    };
  }

  return {
    title: `${categoryData.title} | Help Center | Soovia eSIM`,
    description: categoryData.subtitle || `Browse articles for ${categoryData.title} in the Soovia Help Center.`,
  };
}

export default async function HelpCenterCategoryPage({ params }: Props) {
  const { categorySlug } = await params;

  const categoryData = await prisma.helpCategory.findUnique({
    where: { slug: categorySlug },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishDate: 'desc' },
      },
    },
  });

  if (!categoryData) {
    notFound();
  }

  const getArticleExcerpt = (metaDesc: string | null, content: string) => {
    if (metaDesc && metaDesc.trim().length > 0) {
      return metaDesc;
    }
    const cleanText = content.replace(/<[^>]*>?/gm, '').replace(/#+\s/g, '').trim();
    return cleanText.length > 100 ? `${cleanText.substring(0, 100)}...` : cleanText;
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
            <h1 className="text-4xl font-black text-black tracking-tight mb-3">
              {categoryData.title}
            </h1>
            {categoryData.subtitle && (
              <p className="text-lg text-black max-w-2xl leading-relaxed">
                {categoryData.subtitle}
              </p>
            )}
          </header>

          {/* 4. ARTICLE CARDS GRID */}
          {categoryData.articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryData.articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/help-center/article/${article.slug}`}
                  className="bg-white rounded-[20px] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#FF5A36] transition-colors leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-slate-500 mb-6 text-sm md:text-base leading-relaxed line-clamp-3">
                      {getArticleExcerpt(article.metaDesc, article.content)}
                    </p>
                  </div>
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5 group-hover:text-[#FF5A36] transition-colors">
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[20px] p-12 text-center border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No articles yet</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                There are currently no published articles in this category. Please check back later or contact support.
              </p>
            </div>
          )}

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
