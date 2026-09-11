import React from 'react';
import Link from 'next/link';
import { ChevronRight, Users, Search, Eye } from 'lucide-react';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AdminCustomersPage({ params }: Props) {
  const { locale } = await params;

  // Step 1: Real Database Fetching with relational order count
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header & Breadcrumbs */}
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
          <span className="text-gray-900 font-semibold">Customers</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
          Customers
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          View registered users, monitor purchase history, and manage accounts.
        </p>
      </div>

      {/* Table Controls: Dynamic Total Count Header & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-800">{users.length} Total Customers</span>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] shadow-xs transition-colors"
          />
        </div>
      </div>

      {/* Step 2 & 3: The Data Table UI with Dynamic Data Binding */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Registration Date
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Total Orders
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
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No registered customers found in database.
                  </td>
                </tr>
              ) : (
                users.map((customer) => {
                  // Avatar Initials from first name and last name
                  const fullName = customer.name?.trim() || customer.email.split('@')[0] || 'Customer';
                  const nameParts = fullName.split(' ').filter(Boolean);
                  const firstInitial = nameParts[0]?.[0] || '';
                  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1]?.[0] : nameParts[0]?.[1] || '';
                  const initials = `${firstInitial}${lastInitial}`.toUpperCase() || 'CU';

                  // Format registration date matching "Sep 9, 2026" visual style
                  const formattedDate = new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(new Date(customer.createdAt));

                  // Dynamic orders count singular/plural
                  const orderCount = customer._count?.orders ?? 0;
                  const ordersText = orderCount === 1 ? '1 order' : `${orderCount} orders`;

                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      {/* Customer Column: Initials Circle + Name & Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-[#FFF9F5] border border-[#F88B35]/30 text-[#F88B35] font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-gray-900 text-sm">
                              {fullName}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {customer.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Registration Date Column */}
                      <td className="px-6 py-4 text-xs text-gray-600 font-medium">
                        {formattedDate}
                      </td>

                      {/* Total Orders Column */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
                          {ordersText}
                        </span>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      </td>

                      {/* Step 3: Actions Column with Eye Link */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/${locale}/admin/customers/${customer.id}`}
                            title="View customer details"
                            className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-3.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing <strong className="text-gray-700">{users.length}</strong> of{' '}
            <strong className="text-gray-700">{users.length}</strong> registered customers
          </span>
        </div>
      </div>
    </div>
  );
}
