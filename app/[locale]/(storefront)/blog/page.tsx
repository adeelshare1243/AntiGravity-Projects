import React from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import { Search, Clock, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'Blog | Soovia eSIM',
  description:
    'Discover destination insights, connectivity tips, and everything you need to know about staying connected while traveling.',
};

interface Props {
  searchParams?: Promise<{ category?: string; search?: string }>;
}

function calculateReadTime(content?: string | null): string {
  if (!content || !content.trim()) return '3 min read';
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

const ACCENT_COLORS = ['bg-[#A6C495]', 'bg-[#95B8C4]', 'bg-[#F2C94C]/40', 'bg-[#FF5A36]/15'];

export default async function BlogPage({ searchParams }: Props) {
  const { category: selectedCategory, search: searchQuery } = (await searchParams) || {};

  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishDate: 'desc' },
      include: { category: true },
    }),
    prisma.blogCategory.findMany({
      orderBy: { title: 'asc' },
    }),
  ]);

  let filteredPosts = posts;
  if (selectedCategory && selectedCategory !== 'All') {
    filteredPosts = filteredPosts.filter(
      (p) => p.category?.title.toLowerCase() === selectedCategory.toLowerCase()
    );
  }
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        (p.metaDesc && p.metaDesc.toLowerCase().includes(query)) ||
        p.content.toLowerCase().includes(query)
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#0C0C0D] flex flex-col justify-between font-sans antialiased">
      <div>
        <Navbar />

        {/* 1. HERO SECTION (Centered) */}
        <section className="bg-white pt-16 pb-12 px-4 max-w-3xl mx-auto text-center">
          <h1 className="text-[36px] md:text-[48px] font-bold text-[#0C0C0D] mb-4">Blog</h1>
          <p className="text-[16px] leading-[24px] text-slate-500 max-w-2xl mx-auto mb-8">
            Discover destination insights, connectivity tips, and everything you need to know about staying connected while traveling.
          </p>

          {/* Search Bar */}
          <form
            method="GET"
            action="/blog"
            className="max-w-xl mx-auto relative border border-slate-200 rounded-[10px] px-5 py-3 flex items-center shadow-xs bg-white"
          >
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0 pointer-events-none" />
            <input
              type="text"
              name="search"
              defaultValue={searchQuery || ''}
              placeholder="Search articles..."
              className="w-full bg-transparent text-[#0C0C0D] placeholder-slate-400 focus:outline-none text-base"
            />
            {selectedCategory && selectedCategory !== 'All' && (
              <input type="hidden" name="category" value={selectedCategory} />
            )}
          </form>
        </section>

        {/* 2. CATEGORY TABS (Left-Aligned to Grid) */}
        <section className="max-w-5xl mx-auto px-4 mb-8 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className={`px-6 py-2 rounded-[10px] text-sm font-medium transition-colors cursor-pointer ${
              !selectedCategory || selectedCategory === 'All'
                ? 'bg-[#0C0C0D] text-white shadow-xs'
                : 'bg-[#F8F9FA] text-[#4B5675] hover:bg-slate-200'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => {
            const isActive = selectedCategory?.toLowerCase() === cat.title.toLowerCase();
            return (
              <Link
                key={cat.id}
                href={`/blog?category=${encodeURIComponent(cat.title)}`}
                className={`px-6 py-2 rounded-[10px] text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#0C0C0D] text-white shadow-xs'
                    : 'bg-[#F8F9FA] text-[#4B5675] hover:bg-slate-200'
                }`}
              >
                {cat.title}
              </Link>
            );
          })}
        </section>

        {/* 3. BLOG GRID SECTION */}
        <section className="max-w-5xl mx-auto px-4 mb-16">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post, idx) => {
                const description =
                  post.metaDesc ||
                  (post.content
                    ? post.content.replace(/<[^>]*>?/gm, '').replace(/#+\s/g, '').trim().substring(0, 120) + '...'
                    : '');
                const readTime = calculateReadTime(post.content);
                const categoryTitle = post.category?.title || 'Uncategorized';
                const accentBg = ACCENT_COLORS[idx % ACCENT_COLORS.length];

                return (
                  <Link
                    key={post.id || post.slug}
                    href={`/blog/${post.slug}`}
                    className="bg-[#F8F9FA] rounded-[24px] overflow-hidden flex flex-col border border-transparent hover:border-slate-200 hover:shadow-md transition-all group"
                  >
                    {/* Featured Image or Visual Placeholder */}
                    {post.featuredImage ? (
                      <div className="w-full aspect-video overflow-hidden shrink-0 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className={`w-full aspect-video ${accentBg} opacity-80 shrink-0 flex items-center justify-center`}>
                        <BookOpen className="w-8 h-8 text-black/20" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                      <div>
                        {/* Metadata Row */}
                        <div className="flex items-center text-sm mb-2 flex-wrap gap-y-1">
                          <span className="text-[#FD521B] font-semibold">{categoryTitle}</span>
                          <span className="text-slate-500 flex items-center gap-1.5 ml-4">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {readTime}
                          </span>
                          {post.publishDate && (
                            <span className="text-slate-400 text-xs ml-auto">
                              {formatDate(post.publishDate)}
                            </span>
                          )}
                        </div>

                        <h2 className="text-[20px] leading-[28px] font-bold text-[#0C0C0D] mt-3 mb-2 line-clamp-2 group-hover:text-[#FD521B] transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-[14px] text-slate-500 line-clamp-3 mb-6 leading-relaxed">
                          {description}
                        </p>
                      </div>

                      <div className="font-bold text-sm text-[#0C0C0D] flex items-center gap-1.5 group-hover:text-[#FD521B] transition-colors pt-2">
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#F8F9FA] rounded-[24px] p-12 text-center border border-slate-100 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-slate-200/60 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No articles found</h3>
              <p className="text-slate-500 text-sm">
                {selectedCategory || searchQuery
                  ? 'Try clearing your search or selecting another category.'
                  : 'Check back soon for new articles and travel insights.'}
              </p>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
