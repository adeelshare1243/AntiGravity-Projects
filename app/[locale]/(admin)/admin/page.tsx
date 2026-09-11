import React from 'react';
import {
  Calendar,
  ChevronDown,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Smartphone,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const metadata = {
  title: 'Dashboard Overview | Admin Panel | Soovia eSIM',
  description: 'KPI scorecards, revenue trends, top destinations, recent transactions, and provider inventory.',
};

const RECENT_TRANSACTIONS = [
  {
    id: 'ORD-8421',
    customer: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    destination: 'Japan (Unlimited)',
    amount: '$18.50',
    status: 'Completed',
    date: '10 mins ago',
  },
  {
    id: 'ORD-8420',
    customer: 'Mark Davis',
    email: 'm.davis@example.com',
    destination: 'Europe (33 countries - 10GB)',
    amount: '$24.00',
    status: 'Completed',
    date: '35 mins ago',
  },
  {
    id: 'ORD-8419',
    customer: 'Alex Rivera',
    email: 'arivera@example.com',
    destination: 'United States (5GB)',
    amount: '$12.00',
    status: 'Pending',
    date: '1 hour ago',
  },
  {
    id: 'ORD-8418',
    customer: 'Elena Rostova',
    email: 'elena.r@example.com',
    destination: 'Turkey (3GB)',
    amount: '$7.50',
    status: 'Completed',
    date: '2 hours ago',
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time analytics, transactions, and provider inventory monitoring.
          </p>
        </div>

        <button
          type="button"
          className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-colors w-fit cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>Last 30 Days</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>

      {/* 2. Tier 1: KPI Scorecards (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF9F5] border border-[#F88B35]/20 flex items-center justify-center text-[#F88B35]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-gray-900 tracking-tight">
              $12,450.00
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/60 text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +15% this month
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-gray-900 tracking-tight">
              842
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/60 text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +5% this month
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Users */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Users
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFF9F5] border border-[#F88B35]/20 flex items-center justify-center text-[#F88B35]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-gray-900 tracking-tight">
              1,204
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="bg-[#FFF9F5] text-[#F88B35] border border-[#F88B35]/20 text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                +124 new signups
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Active eSIMs */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Active eSIMs
            </span>
            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-gray-900 tracking-tight">
              315
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Currently consuming data
            </p>
          </div>
        </div>
      </div>

      {/* 3. Tier 2: Charts Section (2 Columns, 2:1 ratio) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart (Span 2) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm lg:col-span-2 min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">
              Revenue &amp; Signups Trend
            </h2>
            <span className="text-xs font-medium text-gray-400">
              Daily aggregates
            </span>
          </div>
          <div className="flex-1 min-h-[220px] bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400 select-none">
            Area Chart Placeholder (Recharts)
          </div>
        </div>

        {/* Donut Chart (Span 1) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">
              Top Destinations
            </h2>
            <span className="text-xs font-medium text-gray-400">
              By volume
            </span>
          </div>
          <div className="flex-1 min-h-[220px] bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400 select-none">
            Donut Chart Placeholder
          </div>
        </div>
      </div>

      {/* 4. Tier 3: Operations & Inventory (2 Columns, 2:1 ratio) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table (Span 2) */}
        <div className="bg-white rounded-2xl p-0 border border-gray-200 shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">
              Recent Transactions
            </h3>
            <span className="text-xs text-gray-400">Showing latest orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Destination
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {RECENT_TRANSACTIONS.map((tx) => {
                  const isCompleted = tx.status === 'Completed';
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {tx.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">
                          {tx.customer}
                        </div>
                        <div className="text-xs text-gray-400">{tx.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {tx.destination}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {tx.amount}
                      </td>
                      <td className="px-6 py-4">
                        {isCompleted ? (
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        ) : (
                          <span className="bg-[#FFF9F5] text-[#F88B35] border border-[#F88B35]/20 px-2.5 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Provider Inventory (Span 1) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">
                Inventory by Provider
              </h3>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Live
              </span>
            </div>

            <div className="flex flex-col gap-5 mt-2">
              {/* Provider Block 1 (eSIM Go) */}
              <div className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 text-sm">
                    eSIM Go
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  142 Destinations • 530 Packages
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-[#F88B35] h-1.5 rounded-full w-[80%]" />
                </div>
              </div>

              {/* Provider Block 2 (Airalo) */}
              <div className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 text-sm">
                    Airalo
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  85 Destinations • 210 Packages
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gray-400 h-1.5 rounded-full w-[40%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-6 flex items-center justify-between text-xs text-gray-400">
            <span>Sync status: Operational</span>
            <span className="text-gray-900 font-semibold">100% SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
