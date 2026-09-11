'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Users,
  Search,
  DollarSign,
  CheckCircle2,
  Clock,
  Ban,
  Share2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import ReferralSettingsCard from './ReferralSettingsCard';
import { ReferralStatus } from '@prisma/client';

export interface ReferralUserSummary {
  id: string;
  name: string | null;
  email: string;
}

export interface ReferralRecordItem {
  id: string;
  referrerId: string;
  referrer: ReferralUserSummary;
  referredUserId: string;
  referredUser: ReferralUserSummary;
  rewardAmount: number;
  status: ReferralStatus;
  createdAt: Date | string;
}

interface Props {
  initialReferrals: ReferralRecordItem[];
  settings: {
    referralRewardAmount: number;
    referralDiscountAmount: number;
    isReferralProgramActive: boolean;
  };
}

export default function ReferralsClient({ initialReferrals, settings }: Props) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const [referrals, setReferrals] = useState<ReferralRecordItem[]>(initialReferrals);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Compute metrics
  const completedCount = referrals.filter((r) => r.status === ReferralStatus.COMPLETED).length;
  const pendingCount = referrals.filter((r) => r.status === ReferralStatus.PENDING).length;
  const totalRewardsEarned = referrals
    .filter((r) => r.status === ReferralStatus.COMPLETED)
    .reduce((sum, r) => sum + r.rewardAmount, 0);

  // Filter
  const filteredReferrals = referrals.filter((r) => {
    const referrerText = `${r.referrer.name || ''} ${r.referrer.email}`.toLowerCase();
    const referredText = `${r.referredUser.name || ''} ${r.referredUser.email}`.toLowerCase();
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = referrerText.includes(query) || referredText.includes(query);
    if (!matchesSearch) return false;

    if (statusFilter === 'All') return true;
    return r.status === statusFilter;
  });

  // Initials helper
  const getInitials = (user: ReferralUserSummary) => {
    const fullName = user.name?.trim() || user.email.split('@')[0] || 'User';
    const parts = fullName.split(' ').filter(Boolean);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1] || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  const getDisplayName = (user: ReferralUserSummary) => {
    return user.name?.trim() || user.email.split('@')[0];
  };

  // Status Badge UI
  const renderStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case ReferralStatus.COMPLETED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );
      case ReferralStatus.PENDING:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        );
      case ReferralStatus.VOIDED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Voided
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Page Header & Breadcrumbs */}
      <div>
        <div className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mb-1">
          <Link href={`/${locale}/admin`} className="hover:text-gray-900 transition-colors">
            Admin
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-semibold">Referrals</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Referrals & Rewards</h1>
        <p className="text-xs text-gray-500 mt-1">
          Track word-of-mouth customer acquisition, advocate payouts, and conversion milestones.
        </p>
      </div>

      {/* 2. Top Referral Program Settings Card */}
      <ReferralSettingsCard initialSettings={settings} />

      {/* 3. Program Analytics Summary (Matching Orders & Customers KPI cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-sm font-bold text-gray-500 mb-2 block">Total Referrals</span>
            <div className="text-2xl font-black text-gray-900 mb-2">{referrals.length}</div>
          </div>
          <span className="text-gray-500 text-xs font-medium flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5" /> Direct user invitations
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-sm font-bold text-gray-500 mb-2 block">Completed Conversions</span>
            <div className="text-2xl font-black text-emerald-600 mb-2">{completedCount}</div>
          </div>
          <span className="text-emerald-600 text-xs font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Successfully placed first order
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-sm font-bold text-gray-500 mb-2 block">Rewards Distributed</span>
            <div className="text-2xl font-black text-gray-900 mb-2">
              ${totalRewardsEarned.toFixed(2)}
            </div>
          </div>
          <span className="text-[#F88B35] text-xs font-medium flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" /> Payout credits earned by advocates
          </span>
        </div>
      </div>

      {/* 4. Table Controls: Total Count Header & Search Bar (Exact Customers style) */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-800">
            {filteredReferrals.length} Tracked Invites
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by referrer or invited user..."
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] shadow-xs transition-colors"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#F88B35] shadow-xs transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value={ReferralStatus.COMPLETED}>Completed</option>
            <option value={ReferralStatus.PENDING}>Pending</option>
            <option value={ReferralStatus.VOIDED}>Voided</option>
          </select>
        </div>
      </div>

      {/* 5. Referrals Table (Reusing exact Customers table layout) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  Referrer
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Referred User
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Date Joined
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Reward Earned
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReferrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No referral records found.
                  </td>
                </tr>
              ) : (
                filteredReferrals.map((item) => {
                  const referrerInitials = getInitials(item.referrer);
                  const referredInitials = getInitials(item.referredUser);

                  const dateJoined = new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(new Date(item.createdAt));

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
                      {/* Referrer (Avatar + Name & Email) */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-full bg-[#FFF9F5] border border-[#F88B35]/30 text-[#F88B35] font-bold text-xs flex items-center justify-center shrink-0">
                            {referrerInitials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-gray-900 text-sm">
                              {getDisplayName(item.referrer)}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {item.referrer.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Referred User (Avatar + Name & Email) */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                            {referredInitials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-gray-900 text-sm">
                              {getDisplayName(item.referredUser)}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {item.referredUser.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date Joined */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle text-gray-600">
                        {dateJoined}
                      </td>

                      {/* Reward Earned */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <span className="font-bold text-gray-900 text-sm">
                          ${item.rewardAmount.toFixed(2)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        {renderStatusBadge(item.status)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
