'use client';

import React, { useState, useTransition } from 'react';
import {
  Package,
  ChevronRight,
  User as UserIcon,
  Mail,
  BellOff,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { updateAccount } from '@/actions/update-account';

export interface AccountUserData {
  id: string;
  name: string;
  email: string;
  marketingConsent: boolean;
  orderCount: number;
}

interface AccountSettingsFormProps {
  user: AccountUserData;
}

export default function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const [fullName, setFullName] = useState(user.name || '');
  const [email] = useState(user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [marketingEmails, setMarketingEmails] = useState(Boolean(user.marketingConsent));

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast('Name is required.', 'error');
      return;
    }

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        showToast('New password and confirmation do not match.', 'error');
        return;
      }
      if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters long.', 'error');
        return;
      }
    }

    startTransition(async () => {
      const result = await updateAccount({
        name: fullName,
        marketingConsent: marketingEmails,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
        confirmPassword: confirmPassword || undefined,
      });

      if (!result.success) {
        showToast(result.error || 'Failed to update account.', 'error');
      } else {
        showToast(result.message || 'Account settings saved successfully.', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        router.refresh();
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-[12px] shadow-lg border text-sm font-medium transition-all duration-300 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 ${
            toast.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Title */}
      <h1 className="text-[32px] font-bold text-[#0C0C0D] mb-6 tracking-tight">Account</h1>

      {/* Section 1: Order History */}
      <Link
        href={`/${locale}/my-esims`}
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
              <p className="text-sm text-slate-500 mt-0.5">
                {user.orderCount} {user.orderCount === 1 ? 'order' : 'orders'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#FD521B] transition-all" />
        </div>
      </Link>

      <form onSubmit={handleSaveChanges}>
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

          {/* Email Input (readOnly) */}
          <div>
            <label className="text-[12px] font-medium text-slate-500 mb-2 block">Email</label>
            <div className="bg-[#F7F7F7] h-[48px] rounded-[10px] px-4 flex items-center gap-3 w-full border border-transparent opacity-85">
              <Mail className="text-slate-500 w-5 h-5 shrink-0" />
              <input
                type="email"
                value={email}
                readOnly
                placeholder="samdan@gmail.com"
                className="bg-transparent outline-none w-full text-[14px] text-[#0C0C0D] placeholder-slate-400 cursor-not-allowed"
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
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
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
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
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
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#FD521B] text-white font-bold h-[48px] px-8 rounded-[10px] hover:shadow-md transition-all cursor-pointer mb-8 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Section 5: Delete Account */}
      <div className="bg-white border border-[#E8E5DD] rounded-[16px] p-6 shadow-xs mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-bold text-[#0C0C0D] mb-1">Delete Account</h3>
            <p className="text-[14px] text-slate-500 max-w-md">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <button
            type="button"
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
