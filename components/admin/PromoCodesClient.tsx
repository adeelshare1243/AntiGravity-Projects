'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Tag,
  Plus,
  Search,
  Pencil,
  Trash2,
  Copy,
  Check,
  Percent,
  DollarSign,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { deletePromoCode } from '@/actions/promo-code';
import { DiscountType } from '@prisma/client';

export interface PromoCodeItem {
  id: string;
  code: string;
  type: DiscountType;
  discountValue: number;
  maxUses: number | null;
  usesCount: number;
  startDate: Date | string;
  endDate: Date | string | null;
  isActive: boolean;
  createdAt: Date | string;
}

interface Props {
  initialCodes: PromoCodeItem[];
}

export default function PromoCodesClient({ initialCodes }: Props) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  const [codes, setCodes] = useState<PromoCodeItem[]>(initialCodes);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Helper to determine real status
  const getPromoStatus = (promo: PromoCodeItem): 'Active' | 'Expired' | 'Depleted' | 'Disabled' => {
    if (!promo.isActive) return 'Disabled';
    if (promo.endDate && new Date(promo.endDate).getTime() < Date.now()) return 'Expired';
    if (promo.maxUses !== null && promo.usesCount >= promo.maxUses) return 'Depleted';
    return 'Active';
  };

  // Quick Copy Promo Code
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Delete Action
  const handleDelete = (id: string, codeName: string) => {
    if (!window.confirm(`Are you sure you want to delete promo code "${codeName}"?`)) {
      return;
    }

    startTransition(async () => {
      const res = await deletePromoCode(id);
      if (res.success) {
        setCodes((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert(res.error || 'Failed to delete promo code.');
      }
    });
  };

  // Compute Metrics
  const totalActive = codes.filter((c) => getPromoStatus(c) === 'Active').length;
  const totalUses = codes.reduce((acc, c) => acc + c.usesCount, 0);
  const expiredCount = codes.filter((c) => getPromoStatus(c) === 'Expired').length;
  const depletedCount = codes.filter((c) => getPromoStatus(c) === 'Depleted').length;

  // Filter Logic
  const filteredCodes = codes.filter((item) => {
    const status = getPromoStatus(item);
    const matchesSearch =
      item.code.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      String(item.discountValue).includes(searchQuery.trim());

    if (!matchesSearch) return false;
    if (statusFilter === 'All') return true;
    return status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Status Badge UI matching Orders table
  const renderStatusBadge = (status: 'Active' | 'Expired' | 'Depleted' | 'Disabled') => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Expired
          </span>
        );
      case 'Depleted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            Depleted
          </span>
        );
      case 'Disabled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Disabled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Page Header & Action Button */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="text-sm font-medium text-gray-500 flex items-center gap-1.5 mb-1">
            <Link href={`/${locale}/admin`} className="hover:text-gray-900 transition-colors">
              Admin
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Promo Codes</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Promo Codes</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage promotional discounts, voucher redemptions, and active marketing campaigns.
          </p>
        </div>

        <Link
          href={`/${locale}/admin/promo-codes/add`}
          className="bg-[#F88B35] hover:bg-[#e07a2f] text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Promo Code</span>
        </Link>
      </div>

      {/* 2. Analytics KPI Cards (Reused exact layout from Orders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-sm font-bold text-gray-500 mb-2 block">Active Codes</span>
            <div className="text-2xl font-black text-gray-900 mb-2">{totalActive}</div>
          </div>
          <span className="text-emerald-600 text-xs font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Ready for checkout
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-sm font-bold text-gray-500 mb-2 block">Total Redemptions</span>
            <div className="text-2xl font-black text-gray-900 mb-2">{totalUses}</div>
          </div>
          <span className="text-gray-500 text-xs font-medium flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Across all campaigns
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-sm font-bold text-gray-500 mb-2 block">Depleted Codes</span>
            <div className="text-2xl font-black text-gray-900 mb-2">{depletedCount}</div>
          </div>
          <span className="text-purple-600 text-xs font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Reached maximum uses
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-sm font-bold text-gray-500 mb-2 block">Expired Campaigns</span>
            <div className="text-2xl font-black text-gray-900 mb-2">{expiredCount}</div>
          </div>
          <span className="text-amber-600 text-xs font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Passed expiration window
          </span>
        </div>
      </div>

      {/* 3. Table Controls & Filters (Reused from Orders) */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by promo code or discount value..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] shadow-xs transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm w-full sm:w-48 text-gray-700 focus:outline-none focus:border-[#F88B35] shadow-xs transition-colors cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Depleted">Depleted</option>
          <option value="Disabled">Disabled</option>
        </select>
      </div>

      {/* 4. Promo Codes Table (Reusing exact Orders/Customers table layout) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  Code
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Discount
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Usage (Count / Max)
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Expiry Date
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No promo codes match your criteria.
                  </td>
                </tr>
              ) : (
                filteredCodes.map((promo) => {
                  const status = getPromoStatus(promo);
                  const isExpired = status === 'Expired';
                  const isDepleted = status === 'Depleted';

                  // Format discount value: "20%" or "$5.00"
                  const discountFormatted =
                    promo.type === DiscountType.PERCENTAGE
                      ? `${promo.discountValue}%`
                      : `$${promo.discountValue.toFixed(2)}`;

                  // Format Expiry Date
                  const expiryText = promo.endDate
                    ? new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }).format(new Date(promo.endDate))
                    : 'Never (No Expiry)';

                  const usagePercentage = promo.maxUses
                    ? Math.min(100, Math.round((promo.usesCount / promo.maxUses) * 100))
                    : null;

                  return (
                    <tr key={promo.id} className="hover:bg-gray-50/80 transition-colors group">
                      {/* Code with Copy Button */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#FFF9F5] border border-[#F88B35]/30 text-[#F88B35] flex items-center justify-center shrink-0">
                            <Tag className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-gray-900 text-sm tracking-wide">
                                {promo.code}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(promo.id, promo.code)}
                                title="Copy code"
                                className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors cursor-pointer"
                              >
                                {copiedCodeId === promo.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <span className="text-[11px] text-gray-400 block">
                              Created on{' '}
                              {new Intl.DateTimeFormat('en-US', {
                                month: 'short',
                                day: 'numeric',
                              }).format(new Date(promo.createdAt))}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Discount Badge */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <div className="flex items-center gap-1.5">
                          {promo.type === DiscountType.PERCENTAGE ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-black bg-orange-50 text-[#F88B35] border border-orange-200">
                              <Percent className="w-3 h-3" />
                              {discountFormatted} OFF
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <DollarSign className="w-3 h-3" />
                              {discountFormatted} FLAT
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Usage (Count / Max) */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-gray-800">
                            {promo.usesCount}{' '}
                            <span className="text-gray-400 font-normal">
                              / {promo.maxUses !== null ? promo.maxUses : 'Unlimited'}
                            </span>
                          </div>
                          {usagePercentage !== null && (
                            <div className="w-28 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  usagePercentage >= 100
                                    ? 'bg-purple-500'
                                    : usagePercentage >= 80
                                    ? 'bg-amber-500'
                                    : 'bg-[#F88B35]'
                                }`}
                                style={{ width: `${usagePercentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Expiry Date */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className={isExpired ? 'text-amber-600 font-semibold' : ''}>
                            {expiryText}
                          </span>
                        </div>
                      </td>

                      {/* Status Pills */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        {renderStatusBadge(status)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/${locale}/admin/promo-codes/${promo.id}/edit`}
                            title="Edit Promo Code"
                            className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(promo.id, promo.code)}
                            title="Delete Promo Code"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
