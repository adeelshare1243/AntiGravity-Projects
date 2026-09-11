'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link2,
  Code,
  AlertTriangle,
  CheckCircle2,
  Check,
  ChevronDown,
} from 'lucide-react';

const authors = [
  'Muhammad Talha Iftikhar',
  'Soovia Editorial Team',
  'Sarah Jenkins',
  'Alex Chen',
];

export default function CreateHelpArticlePage() {
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [savedStatus, setSavedStatus] = useState<string | null>(null);
  const [publishDate, setPublishDate] = useState('2026-08-31');
  const [selectedAuthor, setSelectedAuthor] = useState('Muhammad Talha Iftikhar');

  const handleSaveDraft = () => {
    setSavedStatus('Draft saved');
    setTimeout(() => setSavedStatus(null), 2500);
  };

  const handlePublish = () => {
    setSavedStatus('Article published');
    setTimeout(() => setSavedStatus(null), 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="text-sm font-medium text-gray-500 flex items-center gap-1.5"
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
            <span className="text-gray-900 font-semibold">Create Article</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">
            Write Support Article
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {savedStatus && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
              <Check className="w-3 h-3" /> {savedStatus}
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            className="bg-[#F88B35] hover:bg-[#e07a2f] text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer"
          >
            Publish
          </button>
        </div>
      </div>

      {/* 2. Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Editor Canvas - lg:col-span-2) */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col lg:col-span-2">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Article Title..."
            className="w-full text-3xl font-black text-gray-900 placeholder-gray-300 px-8 py-6 border-b border-gray-100 outline-none tracking-tight"
          />

          {/* Mock WYSIWYG Toolbar */}
          <div className="flex flex-wrap items-center gap-1.5 p-3 border-b border-gray-100 bg-gray-50/50 select-none">
            {/* Standard Formatting */}
            <button
              type="button"
              title="Bold"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded cursor-pointer transition-colors"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Italic"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded cursor-pointer transition-colors"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Underline"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded cursor-pointer transition-colors"
            >
              <Underline className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-gray-200 mx-1" />

            {/* Headings */}
            <button
              type="button"
              title="Heading 1"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded cursor-pointer transition-colors"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Heading 2"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded cursor-pointer transition-colors"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-gray-200 mx-1" />

            {/* Lists & Links */}
            <button
              type="button"
              title="Numbered List"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded cursor-pointer transition-colors"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Bulleted List"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded cursor-pointer transition-colors"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Insert Link"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded cursor-pointer transition-colors"
            >
              <Link2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Inline Code"
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded cursor-pointer transition-colors"
            >
              <Code className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-gray-200 mx-1" />

            {/* Custom Help Center Block Callouts */}
            <button
              type="button"
              title="Insert Orange Warning Box"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#d06d1f] bg-[#F88B35]/10 border border-[#F88B35]/30 hover:bg-[#F88B35]/20 rounded-lg cursor-pointer transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Warning Box</span>
            </button>
            <button
              type="button"
              title="Insert Green Success Box"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Success Box</span>
            </button>
          </div>

          {/* Content Area */}
          <div
            className="w-full min-h-[500px] p-8 text-lg text-gray-600 outline-none leading-relaxed"
            contentEditable
            suppressContentEditableWarning
          >
            Write step-by-step instructions here...
          </div>
        </div>

        {/* Right Column (Settings Sidebar - lg:col-span-1) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Card 1: Publishing */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              Publishing
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="article-category"
                  className="text-xs font-semibold text-gray-600 mb-1.5 block"
                >
                  Category
                </label>
                <select
                  id="article-category"
                  defaultValue="troubleshooting"
                  className="bg-[#F7F7F7] border border-gray-200 rounded-lg p-2.5 w-full text-sm text-gray-800 focus:bg-white focus:outline-none focus:border-[#F88B35] transition-colors"
                >
                  <option value="troubleshooting">Troubleshooting</option>
                  <option value="installation">eSIM Installation</option>
                  <option value="getting-started">Getting Started</option>
                  <option value="billing">Billing &amp; Top-ups</option>
                  <option value="device-compatibility">Device Compatibility</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="article-status"
                  className="text-xs font-semibold text-gray-600 mb-1.5 block"
                >
                  Status
                </label>
                <select
                  id="article-status"
                  defaultValue="draft"
                  className="bg-[#F7F7F7] border border-gray-200 rounded-lg p-2.5 w-full text-sm text-gray-800 focus:bg-white focus:outline-none focus:border-[#F88B35] transition-colors"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Author Dropdown */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-xs font-bold text-gray-700">Author</label>
                <div className="relative">
                  <select
                    value={selectedAuthor}
                    onChange={(e) => setSelectedAuthor(e.target.value)}
                    className="bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 w-full text-sm outline-none transition-all appearance-none cursor-pointer pr-10 text-gray-700"
                  >
                    {authors.map((author) => (
                      <option key={author} value={author}>
                        {author}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Publish Date UI */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-xs font-bold text-gray-700">Publish Date</label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 w-full text-sm outline-none transition-all cursor-pointer text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Card 2: SEO Meta */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              SEO Meta
            </h3>

            <div className="space-y-4">
              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="meta-title"
                    className="text-xs font-semibold text-gray-600"
                  >
                    Meta Title
                  </label>
                  <span
                    className={`text-[11px] font-medium ${
                      metaTitle.length > 60 ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    {metaTitle.length}/60
                  </span>
                </div>
                <input
                  id="meta-title"
                  type="text"
                  value={metaTitle}
                  maxLength={70}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="e.g. How to Configure APN Settings on Android"
                  className="w-full bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="meta-desc"
                    className="text-xs font-semibold text-gray-600"
                  >
                    Meta Description
                  </label>
                  <span
                    className={`text-[11px] font-medium ${
                      metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    {metaDescription.length}/160
                  </span>
                </div>
                <textarea
                  id="meta-desc"
                  value={metaDescription}
                  maxLength={180}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Quick summary explaining what issue this article resolves..."
                  className="w-full bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 text-sm h-28 resize-none outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
