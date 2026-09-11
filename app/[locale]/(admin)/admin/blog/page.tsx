'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Pencil,
  Zap,
  Trash2,
  X,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  getBlogPosts,
  getBlogCategories,
  createBlogCategory,
  deleteBlogPost,
  deleteBlogCategory,
} from '@/actions/admin';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'Published' | 'Draft';
  date: string;
  image?: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Top 10 International Travel eSIM Tips for 2026',
    slug: 'top-10-travel-esim-tips-2026',
    category: 'Travel Guides',
    status: 'Published',
    date: 'Aug 28, 2026',
  },
  {
    id: 'post-2',
    title: 'How to Avoid Roaming Charges While Traveling Abroad',
    slug: 'how-to-avoid-roaming-charges',
    category: 'eSIM Tips',
    status: 'Published',
    date: 'Aug 24, 2026',
  },
  {
    id: 'post-3',
    title: 'Dual SIM Setup: Using Physical SIM + eSIM Simultaneously',
    slug: 'dual-sim-setup-guide',
    category: 'Connectivity',
    status: 'Draft',
    date: 'Aug 20, 2026',
  },
  {
    id: 'post-4',
    title: 'Soovia Expands 5G Coverage to 30 New Asian Destinations',
    slug: '5g-coverage-expansion-asia',
    category: 'Company',
    status: 'Published',
    date: 'Aug 15, 2026',
  },
  {
    id: 'post-5',
    title: 'Troubleshooting APN Settings on Newer Samsung Galaxy Devices',
    slug: 'troubleshooting-apn-samsung-galaxy',
    category: 'eSIM Tips',
    status: 'Draft',
    date: 'Aug 10, 2026',
  },
];

const INITIAL_CATEGORIES: BlogCategory[] = [
  { id: 'cat-1', name: 'Travel Guides', slug: 'travel-guides', count: 14 },
  { id: 'cat-2', name: 'eSIM Tips', slug: 'esim-tips', count: 9 },
  { id: 'cat-3', name: 'Connectivity', slug: 'connectivity', count: 6 },
  { id: 'cat-4', name: 'Company', slug: 'company', count: 4 },
  { id: 'cat-5', name: 'Product Updates', slug: 'product-updates', count: 3 },
];

export default function BlogManagementPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts');
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [categories, setCategories] = useState<BlogCategory[]>(INITIAL_CATEGORIES);
  const [isSubmittingCat, setIsSubmittingCat] = useState(false);

  // Fetch real data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedPosts, fetchedCategories] = await Promise.all([
          getBlogPosts(),
          getBlogCategories(),
        ]);
        if (fetchedPosts && fetchedPosts.length > 0) {
          setPosts(
            fetchedPosts.map((p: any) => ({
              id: p.id,
              title: p.title,
              slug: p.slug,
              category: p.category?.title || 'Uncategorized',
              status: p.status === 'PUBLISHED' ? 'Published' : 'Draft',
              date: new Date(p.publishDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              image: p.featuredImage || undefined,
            }))
          );
        }
        if (fetchedCategories && fetchedCategories.length > 0) {
          setCategories(
            fetchedCategories.map((c: any) => ({
              id: c.id,
              name: c.title,
              slug: c.slug,
              count: c._count?.posts || 0,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to fetch blog data:', err);
      }
    }
    loadData();
  }, []);

  // Filters for Posts tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Quick Edit Drawer State
  const [quickEditPost, setQuickEditPost] = useState<BlogPost | null>(null);
  const [quickEditForm, setQuickEditForm] = useState<{
    title: string;
    slug: string;
    category: string;
    status: 'Published' | 'Draft';
  }>({
    title: '',
    slug: '',
    category: '',
    status: 'Draft',
  });

  // Add Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  // Handle open Quick Edit
  const handleOpenQuickEdit = (post: BlogPost) => {
    setQuickEditPost(post);
    setQuickEditForm({
      title: post.title,
      slug: post.slug,
      category: post.category,
      status: post.status,
    });
  };

  // Handle save Quick Edit
  const handleSaveQuickEdit = () => {
    if (!quickEditPost) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === quickEditPost.id
          ? {
              ...p,
              title: quickEditForm.title,
              slug: quickEditForm.slug,
              category: quickEditForm.category,
              status: quickEditForm.status,
            }
          : p
      )
    );
    setQuickEditPost(null);
  };

  // Handle delete post
  const handleDeletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      try {
        await deleteBlogPost(id);
      } catch (e) {
        console.error('Error deleting post:', e);
      }
    }
  };

  // Handle add category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || isSubmittingCat) return;
    setIsSubmittingCat(true);

    const slug =
      newCatSlug.trim() ||
      newCatName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    try {
      const res = await createBlogCategory({
        title: newCatName.trim(),
        slug,
      });

      if (res.success && res.category) {
        setCategories((prev) => [
          ...prev,
          {
            id: res.category!.id,
            name: res.category!.title,
            slug: res.category!.slug,
            count: 0,
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to create category:', err);
    } finally {
      setIsSubmittingCat(false);
      setNewCatName('');
      setNewCatSlug('');
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      try {
        await deleteBlogCategory(id);
      } catch (e) {
        console.error('Error deleting category:', e);
      }
    }
  };

  // Auto-slugify on category name change
  const handleCategoryNameChange = (val: string) => {
    setNewCatName(val);
    setNewCatSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || post.category === selectedCategory;
    const matchesStatus =
      selectedStatus === 'all' || post.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 2. Top Header & Action */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Blog Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create, edit, organize articles, and manage categories.
          </p>
        </div>

        <Link
          href="/admin/blog/create"
          className="bg-[#F88B35] hover:bg-[#e07a2f] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors inline-flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Post</span>
        </Link>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex gap-8 border-b border-gray-200 mt-6 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`pb-3 text-sm font-bold cursor-pointer transition-colors relative ${
            activeTab === 'posts'
              ? 'text-[#F88B35] border-b-2 border-[#F88B35]'
              : 'text-gray-500 hover:text-gray-900 border-b-2 border-transparent'
          }`}
        >
          All Posts ({posts.length})
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

      {/* 3. Tab 1: All Posts */}
      {activeTab === 'posts' && (
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
                placeholder="Search articles by title or slug..."
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
                <option key={cat.id} value={cat.name}>
                  {cat.name}
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
                      Post
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
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-400"
                      >
                        No blog posts match your current search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post) => (
                      <tr
                        key={post.id}
                        className="hover:bg-gray-50/80 transition-colors group"
                      >
                        {/* Post (Image + Title) */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-md object-cover flex items-center justify-center text-gray-400 shrink-0">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <span className="font-bold text-gray-900 line-clamp-1 max-w-[280px]">
                              {post.title}
                            </span>
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="px-6 py-4 text-gray-400 font-mono text-xs max-w-[180px] truncate">
                          /{post.slug}
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium inline-block">
                            {post.category}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {post.status === 'Published' ? (
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
                          {post.date}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit */}
                            <Link
                              href="/admin/blog/create"
                              title="Edit post"
                              className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>

                            {/* Quick Edit */}
                            <button
                              type="button"
                              onClick={() => handleOpenQuickEdit(post)}
                              title="Quick Edit"
                              className="p-1.5 text-gray-400 hover:text-[#F88B35] hover:bg-[#FFF9F5] rounded-lg transition-colors cursor-pointer"
                            >
                              <Zap className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              title="Delete post"
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

      {/* 4. Tab 2: Categories (Split Layout) */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Col: Add Category */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 h-max shadow-sm col-span-1">
            <h2 className="font-bold text-gray-900 text-base mb-4">
              Add New Category
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label
                  htmlFor="new-category-name"
                  className="text-xs font-semibold text-gray-600 mb-1.5 block"
                >
                  Name
                </label>
                <input
                  id="new-category-name"
                  type="text"
                  required
                  placeholder="e.g. Roaming Advice"
                  value={newCatName}
                  onChange={(e) => handleCategoryNameChange(e.target.value)}
                  className="w-full bg-[#F7F7F7] border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:bg-white focus:outline-none focus:border-[#F88B35] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="new-category-slug"
                  className="text-xs font-semibold text-gray-600 mb-1.5 block"
                >
                  Slug
                </label>
                <input
                  id="new-category-slug"
                  type="text"
                  required
                  placeholder="e.g. roaming-advice"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full bg-[#F7F7F7] border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-800 font-mono focus:bg-white focus:outline-none focus:border-[#F88B35] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#F88B35] hover:bg-[#e07a2f] text-white font-bold py-2.5 rounded-lg text-sm shadow-sm transition-colors mt-4 cursor-pointer"
              >
                Add Category
              </button>
            </form>
          </div>

          {/* Right Col: Categories Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm col-span-1 lg:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      Slug
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      Count
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
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {cat.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">
                        /{cat.slug}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs">
                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                          {cat.count} {cat.count === 1 ? 'post' : 'posts'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id)}
                          title="Delete category"
                          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Quick Edit Drawer */}
      {quickEditPost !== null && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setQuickEditPost(null)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-[400px] bg-white shadow-2xl p-6 z-50 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Quick Edit
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Update essential post metadata immediately
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickEditPost(null)}
                  className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Form */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label
                    htmlFor="quick-title"
                    className="text-xs font-semibold text-gray-600 mb-1.5 block"
                  >
                    Title
                  </label>
                  <input
                    id="quick-title"
                    type="text"
                    value={quickEditForm.title}
                    onChange={(e) =>
                      setQuickEditForm({ ...quickEditForm, title: e.target.value })
                    }
                    className="w-full bg-[#F7F7F7] border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#F88B35] transition-colors"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label
                    htmlFor="quick-slug"
                    className="text-xs font-semibold text-gray-600 mb-1.5 block"
                  >
                    Slug
                  </label>
                  <input
                    id="quick-slug"
                    type="text"
                    value={quickEditForm.slug}
                    onChange={(e) =>
                      setQuickEditForm({ ...quickEditForm, slug: e.target.value })
                    }
                    className="w-full bg-[#F7F7F7] border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 font-mono focus:bg-white focus:outline-none focus:border-[#F88B35] transition-colors"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="quick-category"
                    className="text-xs font-semibold text-gray-600 mb-1.5 block"
                  >
                    Category
                  </label>
                  <select
                    id="quick-category"
                    value={quickEditForm.category}
                    onChange={(e) =>
                      setQuickEditForm({
                        ...quickEditForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full bg-[#F7F7F7] border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#F88B35] transition-colors"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="quick-status"
                    className="text-xs font-semibold text-gray-600 mb-1.5 block"
                  >
                    Status
                  </label>
                  <select
                    id="quick-status"
                    value={quickEditForm.status}
                    onChange={(e) =>
                      setQuickEditForm({
                        ...quickEditForm,
                        status: e.target.value as 'Published' | 'Draft',
                      })
                    }
                    className="w-full bg-[#F7F7F7] border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#F88B35] transition-colors"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setQuickEditPost(null)}
                className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickEdit}
                className="bg-[#F88B35] hover:bg-[#e07a2f] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
