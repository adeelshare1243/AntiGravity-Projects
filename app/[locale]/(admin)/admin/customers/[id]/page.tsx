import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, User, Mail, Calendar, ShoppingBag, ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default async function CustomerDetailsPage({ params }: Props) {
  const { id, locale } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          package: true,
        },
      },
      _count: {
        select: { orders: true },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const nameParts = (user.name || user.email.split('@')[0] || '').trim().split(' ').filter(Boolean);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const fullName = user.name || `${firstName} ${lastName}`.trim() || user.email;

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(user.createdAt));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div>
        <nav
          aria-label="Breadcrumb"
          className="text-sm font-medium text-gray-500 flex items-center gap-1.5"
        >
          <Link
            href={`/${locale}/admin`}
            className="hover:text-gray-900 transition-colors"
          >
            Admin
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <Link
            href={`/${locale}/admin/customers`}
            className="hover:text-gray-900 transition-colors"
          >
            Customers
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-900 font-semibold">{fullName}</span>
        </nav>
      </div>

      {/* Main Details Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <Link
              href={`/${locale}/admin/customers`}
              className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Customers</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Customer Details: {firstName} {lastName}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Account identifier: <span className="font-mono text-gray-700">{user.id}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Active Customer
            </span>
          </div>
        </div>

        {/* Customer Profile Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 text-[#F88B35] flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Full Name</span>
              <span className="text-sm font-bold text-gray-900">{fullName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</span>
              <span className="text-sm font-bold text-gray-900">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Registered On</span>
              <span className="text-sm font-bold text-gray-900">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Purchase History Count */}
        <div className="pt-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
            Order History ({user._count.orders} {user._count.orders === 1 ? 'Order' : 'Orders'})
          </h2>
          {user.orders.length === 0 ? (
            <p className="text-xs text-gray-500">This customer has not placed any orders yet.</p>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {user.orders.map((ord) => (
                <div key={ord.id} className="p-4 flex items-center justify-between text-xs hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="font-bold text-gray-900">
                        {ord.package?.destinationName || 'eSIM'} ({ord.package?.dataAmountMB ? `${ord.package.dataAmountMB / 1024}GB` : 'Data'})
                      </span>
                      <span className="text-gray-500 block text-[11px]">
                        Order #{ord.id.slice(0, 8).toUpperCase()} · {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900 text-sm">${ord.totalAmount.toFixed(2)}</span>
                    <span className="block text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">{ord.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
