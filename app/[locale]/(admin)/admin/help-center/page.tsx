'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Smartphone,
  CreditCard,
  UploadCloud,
  Settings,
  Globe,
  Wifi,
  FileText,
  Shield,
  Zap,
} from 'lucide-react';
import {
  getHelpArticles,
  getHelpCategories,
  createHelpCategory,
  deleteHelpArticle,
  deleteHelpCategory,
} from '@/actions/admin';

const libraryIcons = [
  'book',
  'smartphone',
  'credit-card',
  'help-circle',
  'settings',
  'globe',
  'wifi',
  'file-text',
  'shield',
  'zap',
];

const ICON_COMPONENT_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  book: BookOpen,
  smartphone: Smartphone,
  'credit-card': CreditCard,
  'help-circle': HelpCircle,
  settings: Settings,
  globe: Globe,
  wifi: Wifi,
  'file-text': FileText,
  shield: Shield,
  zap: Zap,
  UploadCloud: UploadCloud,
  AlertCircle: AlertCircle,
  BookOpen: BookOpen,
  Smartphone: Smartphone,
  CreditCard: CreditCard,
  HelpCircle: HelpCircle,
};

interface HelpArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'Published' | 'Draft';
  date: string;
}

interface HelpCategory {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  articleCount: number;
  iconName: string;
}

const INITIAL_ARTICLES: HelpArticle[] = [
  {
    id: 'art-1',
    title: 'How to Configure APN Settings on Android',
    slug: 'how-to-configure-apn-settings-android',
    category: 'Troubleshooting',
    status: 'Published',
    date: 'Aug 30, 2026',
  },
  {
    id: 'art-2',
    title: 'How to Install an eSIM on iPhone (iOS 17 & 18)',
    slug: 'how-to-install-esim-iphone',
    category: 'eSIM Installation',
    status: 'Published',
    date: 'Aug 26, 2026',
  },
  {
    id: 'art-3',
    title: 'No Service or Searching After eSIM Installation',
    slug: 'no-service-troubleshooting',
    category: 'Troubleshooting',
    status: 'Published',
    date: 'Aug 22, 2026',
  },
  {
    id: 'art-4',
    title: 'Checking If Your Device Supports eSIM',
    slug: 'device-compatibility-guide',
    category: 'Device Compatibility',
    status: 'Published',
    date: 'Aug 18, 2026',
  },
  {
    id: 'art-5',
    title: 'Data Roaming Settings & Avoiding Extra Charges',
    slug: 'data-roaming-troubleshooting',
    category: 'Troubleshooting',
    status: 'Draft',
    date: 'Aug 12, 2026',
  },
  {
    id: 'art-6',
    title: 'Payment Methods & Refund Policy',
    slug: 'payment-methods-refunds',
    category: 'Billing',
    status: 'Draft',
    date: 'Aug 08, 2026',
  },
];

const INITIAL_CATEGORIES: HelpCategory[] = [
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
    title: 'Billing',
    subtitle: 'Payment methods, receipts, data top-up and refund policies',
    slug: 'billing',
    articleCount: 5,
    iconName: 'CreditCard',
  },
];

export default function HelpCenterCMSPage() {
  const [activeTab, setActiveTab] = useState<'articles' | 'categories'>('articles');
  const [articles, setArticles] = useState<HelpArticle[]>(INITIAL_ARTICLES);
  const [categories, setCategories] = useState<HelpCategory[]>(INITIAL_CATEGORIES);
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);

  // Fetch real data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedArticles, fetchedCategories] = await Promise.all([
          getHelpArticles(),
          getHelpCategories(),
        ]);
        if (fetchedArticles && fetchedArticles.length > 0) {
          setArticles(
            fetchedArticles.map((a: any) => ({
              id: a.id,
              title: a.title,
              slug: a.slug,
              category: a.category?.title || 'General',
              status: a.status === 'PUBLISHED' ? 'Published' : 'Draft',
              date: new Date(a.publishDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
            }))
          );
        }
        if (fetchedCategories && fetchedCategories.length > 0) {
          setCategories(
            fetchedCategories.map((c: any) => ({
              id: c.id,
              title: c.title,
              subtitle: c.subtitle || 'Browse help articles and guides',
              slug: c.slug,
              articleCount: c._count?.articles || 0,
              iconName: c.icon || 'HelpCircle',
            }))
          );
        }
      } catch (err) {
        console.error('Failed to fetch help center data:', err);
      }
    }
    loadData();
  }, []);

  // Filters for Articles tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Category Form State
  const [catTitle, setCatTitle] = useState('');
  const [catSubtitle, setCatSubtitle] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [iconInputMode, setIconInputMode] = useState<'select' | 'upload'>('select');
  const [selectedLibraryIcon, setSelectedLibraryIcon] = useState<string>('book');

  // Handle title input change and auto-slugify
  const handleCatTitleChange = (value: string) => {
    setCatTitle(value);
    setCatSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  // Handle add category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle.trim() || isSubmittingCat) return;
    setIsSubmittingCat(true);

    const slug =
      catSlug.trim() ||
      catTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const selectedIcon = iconInputMode === 'select' ? selectedLibraryIcon : 'UploadCloud';

    try {
      const res = await createHelpCategory({
        title: catTitle.trim(),
        subtitle: catSubtitle.trim() || undefined,
        slug,
        icon: selectedIcon,
      });

      if (res.success && res.category) {
        setCategories((prev) => [
          ...prev,
          {
            id: res.category!.id,
            title: res.category!.title,
            subtitle: res.category!.subtitle || 'Browse help articles and guides',
            slug: res.category!.slug,
            articleCount: 0,
            iconName: res.category!.icon || 'HelpCircle',
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to create help category:', err);
    } finally {
      setIsSubmittingCat(false);
      setCatTitle('');
      setCatSubtitle('');
      setCatSlug('');
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      try {
        await deleteHelpCategory(id);
      } catch (e) {
        console.error('Error deleting help category:', e);
      }
    }
  };

  // Handle delete article
  const handleDeleteArticle = async (id: string) => {
    if (confirm('Are you sure you want to delete this support article?')) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      try {
        await deleteHelpArticle(id);
      } catch (e) {
        console.error('Error deleting help article:', e);
      }
    }
  };

  // Filtered articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || article.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' || article.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const renderIcon = (name: string) => {
    const IconComp = ICON_COMPONENT_MAP[name] || HelpCircle;
    return <IconComp className="w-5 h-5 text-[#F88B35]" />;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 2. Top Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Help Center CMS
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage support documentation and categories.
          </p>
        </div>

        <Link
          href="/admin/help-center/create"
          className="bg-[#F88B35] hover:bg-[#e07a2f] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors inline-flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create Article</span>
        </Link>
      </div>

      {/* Tabs Bar */}
      <div className="flex gap-8 border-b border-gray-200 mt-6 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('articles')}
          className={`pb-3 text-sm font-bold cursor-pointer transition-colors relative ${
            activeTab === 'articles'
              ? 'text-[#F88B35] border-b-2 border-[#F88B35]'
              : 'text-gray-500 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          All Articles ({articles.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`pb-3 text-sm font-bold cursor-pointer transition-colors relative ${
            activeTab === 'categories'
              ? 'text-[#F88B35] border-b-2 border-[#F88B35]'
              : 'text-gray-500 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          Categories ({categories.length})
        </button>
      </div>

      {/* 3. Tab 1: All Articles (Table & Filters) */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md min-w-[240px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] focus:ring-1 focus:ring-[#F88B35] transition-all shadow-xs"
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm w-48 text-gray-700 focus:outline-none focus:border-[#F88B35] shadow-xs transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm w-40 text-gray-700 focus:outline-none focus:border-[#F88B35] shadow-xs transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Data Table */}
          <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">
                      Article Title
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      Slug
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-400"
                      >
                        No support articles match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((article) => (
                      <tr
                        key={article.id}
                        className="hover:bg-gray-50/80 transition-colors group"
                      >
                        {/* Article Title */}
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900 block line-clamp-1 max-w-[340px]">
                            {article.title}
                          </span>
                        </td>

                        {/* Slug */}
                        <td className="px-6 py-4 text-gray-400 font-mono text-xs max-w-[180px] truncate">
                          /{article.slug}
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium inline-block">
                            {article.category}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {article.status === 'Published' ? (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                              Published
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                              <span className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                              Draft
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                          {article.date}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href="/admin/help-center/create"
                              title="Edit article"
                              className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDeleteArticle(article.id)}
                              title="Delete article"
                              className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Tab 2: Categories (Split Layout Integration) */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (Add Category - col-span-1) */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 h-max shadow-sm col-span-1">
            <h2 className="font-bold text-gray-900 text-base mb-4">
              Add New Category
            </h2>

            <form onSubmit={handleAddCategory}>
              {/* Title */}
              <div>
                <label
                  htmlFor="tab-cat-title"
                  className="text-xs font-semibold text-gray-600 mb-1.5 block"
                >
                  Title
                </label>
                <input
                  id="tab-cat-title"
                  type="text"
                  required
                  placeholder="e.g. Troubleshooting"
                  value={catTitle}
                  onChange={(e) => handleCatTitleChange(e.target.value)}
                  className="bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 w-full text-sm mb-4 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Short Description / Subtitle */}
              <div>
                <label
                  htmlFor="tab-cat-subtitle"
                  className="text-xs font-semibold text-gray-600 mb-1.5 block"
                >
                  Short Description / Subtitle
                </label>
                <input
                  id="tab-cat-subtitle"
                  type="text"
                  placeholder="e.g. Fix internet and connection issues"
                  value={catSubtitle}
                  onChange={(e) => setCatSubtitle(e.target.value)}
                  className="bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 w-full text-sm mb-4 outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Slug */}
              <div>
                <label
                  htmlFor="tab-cat-slug"
                  className="text-xs font-semibold text-gray-600 mb-1.5 block"
                >
                  Slug
                </label>
                <input
                  id="tab-cat-slug"
                  type="text"
                  required
                  placeholder="e.g. troubleshooting"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 w-full text-sm mb-4 outline-none transition-all font-mono text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Category Icon */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                  Category Icon
                </label>

                {/* Segmented Control Toggle */}
                <div className="flex items-center bg-[#F7F7F7] p-1 rounded-lg mb-3 w-full">
                  <button
                    type="button"
                    onClick={() => setIconInputMode('select')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md text-center cursor-pointer transition-all ${
                      iconInputMode === 'select'
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Select
                  </button>
                  <button
                    type="button"
                    onClick={() => setIconInputMode('upload')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md text-center cursor-pointer transition-all ${
                      iconInputMode === 'upload'
                        ? 'bg-white shadow-sm text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Upload
                  </button>
                </div>

                {/* Mode: 'select' */}
                {iconInputMode === 'select' && (
                  <div className="grid grid-cols-5 gap-2 max-h-[120px] overflow-y-auto p-1 custom-scrollbar">
                    {libraryIcons.map((iconName) => {
                      const IconComponent = ICON_COMPONENT_MAP[iconName] || HelpCircle;
                      const isSelected = selectedLibraryIcon === iconName;
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setSelectedLibraryIcon(iconName)}
                          className={`flex items-center justify-center p-2.5 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#F88B35] bg-[#FFF9F5] text-[#F88B35]'
                              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          title={iconName}
                        >
                          <IconComponent className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Mode: 'upload' */}
                {iconInputMode === 'upload' && (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-[#F88B35] bg-[#F7F7F7] hover:bg-white transition-all group">
                    <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[#F88B35] mx-auto mb-1.5 transition-colors" />
                    <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 block transition-colors">
                      Upload SVG Icon
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      SVG line art recommended (24x24)
                    </span>
                  </div>
                )}
              </div>

              {/* Submit */}
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
                      {/* Category Info */}
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
      )}
    </div>
  );
}
