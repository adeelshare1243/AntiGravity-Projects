'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DollarSign, Users, Globe2, Activity, Server, ShieldCheck, ArrowUpRight, TrendingUp, RefreshCw, Filter } from 'lucide-react';

const MOCK_SALES = [
  { id: 'ORD-9821', user: 'Sarah Jenkins', package: 'Japan Unlimited 7 Days', amount: '$18.50', status: 'Completed', provider: 'Airalo API', date: 'Just now' },
  { id: 'ORD-9820', user: 'Mark Davis', package: 'Europe 10 GB 30 Days', amount: '$24.00', status: 'Completed', provider: 'eSIM Go', date: '12 mins ago' },
  { id: 'ORD-9819', user: 'Alex Rivera', package: 'USA 5 GB 15 Days', amount: '$12.00', status: 'Completed', provider: 'Redtea Mobile', date: '45 mins ago' },
  { id: 'ORD-9818', user: 'Elena Rostova', package: 'Turkey 3 GB 7 Days', amount: '$7.50', status: 'Completed', provider: 'Airalo API', date: '2 hours ago' },
];

const PROVIDER_ADAPTERS = [
  { name: 'Airalo Partner API', status: 'Online', latency: '42ms', activeESims: '1,420', margin: '38%' },
  { name: 'eSIM Go Matrix', status: 'Online', latency: '65ms', activeESims: '980', margin: '42%' },
  { name: 'Redtea Mobile Adapter', status: 'Online', latency: '38ms', activeESims: '650', margin: '35%' },
  { name: 'DENT Wireless API', status: 'Standby', latency: '120ms', activeESims: '110', margin: '30%' },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Users' | 'Providers' | 'Pricing'>('Overview');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A36] flex items-center justify-center font-bold text-white shadow-md">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-lg leading-none">eSIM Superadmin</h1>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">Platform Control & Provider Adapter Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Activity className="w-3.5 h-3.5" /> All 4 Providers Operational
            </span>
            <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 transition-colors">
              Exit to Storefront →
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 max-w-7xl mx-auto space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Sales (MTD)</span>
                <DollarSign className="w-4 h-4 text-[#FF5A36]" />
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">$48,290.00</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs last month
              </div>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active eSIM Profiles</span>
                <Server className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">3,160</div>
              <div className="text-xs font-bold text-slate-400">Across 190+ destinations</div>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Registered Customers</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">12,480</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +340 new this week
              </div>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700">
              <div className="flex items-center justify-between text-[#FF5A36] mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Avg Gross Margin</span>
                <Activity className="w-4 h-4 text-[#FF5A36]" />
              </div>
              <div className="text-3xl font-extrabold text-white mb-1">39.2%</div>
              <div className="text-xs font-bold text-slate-400">Dynamic pricing enabled</div>
            </div>
          </div>

          {/* Provider Adapters Health */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">eSIM Provider API Adapters</h2>
              <button className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {PROVIDER_ADAPTERS.map((provider) => (
                <div key={provider.name} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">{provider.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      {provider.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1 mt-3">
                    <div className="flex justify-between"><span>Latency:</span> <span className="font-mono text-slate-200">{provider.latency}</span></div>
                    <div className="flex justify-between"><span>Active Lines:</span> <span className="font-semibold text-slate-200">{provider.activeESims}</span></div>
                    <div className="flex justify-between"><span>Gross Margin:</span> <span className="font-bold text-emerald-400">{provider.margin}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Recent Transactions */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Recent Purchases & Orders</h2>
              <span className="text-xs text-slate-400 font-semibold">Live order stream</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 uppercase font-bold text-[11px]">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Package Name</th>
                    <th className="pb-3">Provider</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-300 font-medium">
                  {MOCK_SALES.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3.5 font-mono text-white font-bold">{sale.id}</td>
                      <td className="py-3.5">{sale.user}</td>
                      <td className="py-3.5 font-semibold text-white">{sale.package}</td>
                      <td className="py-3.5 text-slate-400">{sale.provider}</td>
                      <td className="py-3.5 font-bold text-emerald-400">{sale.amount}</td>
                      <td className="py-3.5">
                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {sale.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-400">{sale.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
