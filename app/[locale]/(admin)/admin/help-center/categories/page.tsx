'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  Pencil,
  Trash2,
  BookOpen,
  AlertCircle,
  HelpCircle,
  CreditCard,
  Smartphone,
  Plus,
  ChevronRight,
} from 'lucide-react';

interface HelpCategory {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  articleCount: number;
  iconName: string;
}

const INITIAL_HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'hc-cat-1',
    title: 'Troubleshooting',
    subtitle: 'Fix internet connection, APN, and roaming issues',
    slug: 'troubleshooting',
    articleCount: 6,
    iconName: 'AlertCircle',
  },
  {
    id: 'hc-cat-2',
    title: 'eSIM Installation',
    subtitle: 'Step-by-step guides to install eSIM profiles on iOS & Android',
    slug: 'installation',
    articleCount: 8,
    iconName: 'BookOpen',
  },
  {
    id: 'hc-cat-3',
    title: 'Getting Started',
    subtitle: 'Everything you need to know about purchasing and activating eSIMs',
    slug: 'getting-started',
    articleCount: 4,
    iconName: 'HelpCircle',
  },
  {
    id: 'hc-cat-4',
    title: 'Device Compatibility',
    subtitle: 'Verify if your smartphone or tablet supports virtual eSIM cards',
    slug: 'device-compatibility',
    articleCount: 3,
    iconName: 'Smartphone',
  },
  {
    id: 'hc-cat-5',
    title: 'Billing & Top-ups',
    subtitle: 'Payment methods, receipts, data top-up and refund policies',
    slug: 'billing',
    articleCount: 5,
    iconName: 'CreditCard',
  },
];

export default function HelpCenterCategoriesPage() {
  const [categories, setCategories] = useState<HelpCategory[]>(INITIAL_HELP_CATEGORIES);

  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');

  // Handle title input change and auto-slugify
  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCat: HelpCategory = {
      id: `hc-cat-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Browse help articles and guides',
      slug:
        slug.trim() ||
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
      articleCount: 0,
      iconName: 'HelpCircle',
    };

    setCategories((prev) => [...prev, newCat]);
    setTitle('');
    setSubtitle('');
    setSlug('');
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this help category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'AlertCircle':
        return <AlertCircle className="w-5 h-5 text-[#F88B35]" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[#F88B35]" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-[#F88B35]" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-[#F88B35]" />;
      default:
        return <HelpCircle className="w-5 h-5 text-[#F88B35]" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mb-1"
          >
            <Link
              href="/admin"
              className="hover:text-gray-900 transition-colors"
            >
              Admin
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link
              href="/admin/help-center"
              className="hover:text-gray-900 transition-colors"
            >
              Help Center
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-gray-900 font-semibold">Categories</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Help Center Categories
          </h1>
        </div>

        <Link
          href="/admin/help-center/create"
          className="bg-[#F88B35] hover:bg-[#e07a2f] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors inline-flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      {/* 2. Main Layout (Split Screen) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 items-start">
        {/* Left Column (Add Category - col-span-1) */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 h-max shadow-sm col-span-1">
          <h2 className="font-bold text-gray-900 text-base mb-4">
            Create Category
          </h2>

          <form onSubmit={handleAddCategory}>
            {/* Title */}
            <div>
              <label
                htmlFor="cat-title"
                className="text-xs font-semibold text-gray-600 mb-1.5 block"
              >
                Title
              </label>
              <input
                id="cat-title"
                type="text"
                required
                placeholder="e.g. Troubleshooting"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 w-full text-sm mb-4 outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Short Description / Subtitle */}
            <div>
              <label
                htmlFor="cat-subtitle"
                className="text-xs font-semibold text-gray-600 mb-1.5 block"
              >
                Short Description / Subtitle
              </label>
              <input
                id="cat-subtitle"
                type="text"
                placeholder="e.g. Fix internet and connection issues"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 w-full text-sm mb-4 outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="cat-slug"
                className="text-xs font-semibold text-gray-600 mb-1.5 block"
              >
                Slug
              </label>
              <input
                id="cat-slug"
                type="text"
                required
                placeholder="e.g. troubleshooting"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 w-full text-sm mb-4 outline-none transition-all font-mono text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Icon Upload / Select Zone */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                Category Icon
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-[#F88B35] hover:bg-[#FFF9F5] transition-colors group">
                <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[#F88B35] mx-auto mb-1.5 transition-colors" />
                <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 block transition-colors">
                  Upload SVG Icon
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  SVG line art recommended (24x24)
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#F88B35] hover:bg-[#e07a2f] text-white font-bold py-2.5 rounded-lg text-sm shadow-sm transition-colors cursor-pointer mt-2"
            >
              Add Category
            </button>
          </form>
        </div>

        {/* Right Column (Category List - col-span-2) */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm col-span-1 lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Category Info
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Articles
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    {/* Category Info: Icon + Title + Subtitle */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF9F5] border border-[#F88B35]/20 flex items-center justify-center shrink-0">
                          {renderIcon(cat.iconName)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-gray-900 text-sm">
                            {cat.title}
                          </span>
                          <span className="text-xs text-gray-500 line-clamp-1 max-w-[280px]">
                            {cat.subtitle}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">
                      /{cat.slug}
                    </td>

                    {/* Articles Count */}
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold inline-block">
                        {cat.articleCount} Articles
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          title="Edit category"
                          className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          title="Delete category"
                          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
