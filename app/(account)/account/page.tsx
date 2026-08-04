'use client';

import React, { useState } from 'react';
import {
  Package,
  ChevronRight,
  User as UserIcon,
  Mail,
  BellOff,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const [fullName, setFullName] = useState('Daniel Sam');
  const [email, setEmail] = useState('samdan@gmail.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Page Title */}
      <h1 className="text-[32px] font-bold text-[#0C0C0D] mb-6 tracking-tight">Account</h1>

      {/* Section 1: Order History */}
      <Link
        href="/orders"
        className="block bg-white border border-[#E8E5DD] rounded-[16px] p-6 mb-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[10px] bg-[#FFF9F5] text-[#FD521B] flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#0C0C0D] text-[16px] group-hover:text-[#FD521B] transition-colors">
                Order History
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">0 orders</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#FD521B] transition-all" />
        </div>
      </Link>

      {/* Section 2: Profile */}
      <div className="bg-white border border-[#E8E5DD] rounded-[16px] p-6 mb-6 shadow-xs">
        <h2 className="text-[20px] font-bold text-[#0C0C0D] mb-6">Profile</h2>

        {/* Full Name Input */}
        <div className="mb-4">
          <label className="text-[12px] font-medium text-slate-500 mb-2 block">Full Name</label>
          <div className="bg-[#F7F7F7] h-[48px] rounded-[10px] px-4 flex items-center gap-3 w-full border border-transparent focus-within:border-[#FD521B] transition-colors">
            <UserIcon className="text-slate-500 w-5 h-5 shrink-0" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Daniel Sam"
              className="bg-transparent outline-none w-full text-[14px] text-[#0C0C0D] placeholder-slate-400"
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label className="text-[12px] font-medium text-slate-500 mb-2 block">Email</label>
          <div className="bg-[#F7F7F7] h-[48px] rounded-[10px] px-4 flex items-center gap-3 w-full border border-transparent focus-within:border-[#FD521B] transition-colors">
            <Mail className="text-slate-500 w-5 h-5 shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="samdan@gmail.com"
              className="bg-transparent outline-none w-full text-[14px] text-[#0C0C0D] placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Communication Preferences */}
      <div className="bg-white border border-[#E8E5DD] rounded-[16px] p-6 mb-6 shadow-xs">
        <h2 className="text-[20px] font-bold text-[#0C0C0D] mb-1">Communication Preferences</h2>
        <p className="text-[14px] text-slate-500 mb-4">
          Manage how we communicate with you about offers and updates.
        </p>

        <div className="bg-[#F7F7F7] rounded-[10px] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#252F4A] text-white rounded-[8px] flex items-center justify-center shrink-0">
              <BellOff className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#0C0C0D] text-sm">Marketing Emails</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Receive exclusive offers, travel tips, and news.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => setMarketingEmails(!marketingEmails)}
            className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
              marketingEmails ? 'bg-[#FD521B]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                marketingEmails ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Section 4: Change Password */}
      <div className="bg-white border border-[#E8E5DD] rounded-[16px] p-6 mb-6 shadow-xs">
        <h2 className="text-[20px] font-bold text-[#0C0C0D] mb-6">Change Password</h2>

        {/* Current Password */}
        <div className="mb-4">
          <label className="text-[12px] font-medium text-slate-500 mb-2 block">Current Password</label>
          <div className="bg-[#F7F7F7] h-[48px] rounded-[10px] px-4 flex items-center gap-3 w-full border border-transparent focus-within:border-[#FD521B] transition-colors">
            <Lock className="text-slate-500 w-5 h-5 shrink-0" />
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-transparent outline-none w-full text-[14px] text-[#0C0C0D] placeholder-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="text-slate-400 hover:text-slate-600"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="text-[12px] font-medium text-slate-500 mb-2 block">New Password</label>
          <div className="bg-[#F7F7F7] h-[48px] rounded-[10px] px-4 flex items-center gap-3 w-full border border-transparent focus-within:border-[#FD521B] transition-colors">
            <Lock className="text-slate-500 w-5 h-5 shrink-0" />
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-transparent outline-none w-full text-[14px] text-[#0C0C0D] placeholder-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="text-slate-400 hover:text-slate-600"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="text-[12px] font-medium text-slate-500 mb-2 block">Confirm New Password</label>
          <div className="bg-[#F7F7F7] h-[48px] rounded-[10px] px-4 flex items-center gap-3 w-full border border-transparent focus-within:border-[#FD521B] transition-colors">
            <Lock className="text-slate-500 w-5 h-5 shrink-0" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-transparent outline-none w-full text-[14px] text-[#0C0C0D] placeholder-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Save Changes Button */}
      <button className="bg-[#FD521B] text-white font-bold h-[48px] px-8 rounded-[10px] hover:shadow-md transition-all cursor-pointer mb-8 flex items-center justify-center">
        Save Changes
      </button>

      {/* Section 5: Delete Account */}
      <div className="bg-white border border-[#E8E5DD] rounded-[16px] p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-bold text-[#0C0C0D] mb-1">Delete Account</h3>
            <p className="text-[14px] text-slate-500 max-w-md">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => alert('Account deletion requested.')}
            className="border border-[#FF2A42] text-[#FF2A42] font-medium px-6 py-2 rounded-[10px] hover:bg-red-50 transition-colors cursor-pointer text-sm shrink-0"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
