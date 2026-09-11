'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Eye, Users } from 'lucide-react';

export interface CustomerItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  orderCount: number;
  status: 'Active' | 'Inactive';
}

interface CustomersTableProps {
  customers: CustomerItem[];
  locale: string;
}

export default function CustomersTable({ customers, locale }: CustomersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter customers by search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase().trim();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Search Bar on Top Right */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-800">{filteredCustomers.length}</span>
          <span>{filteredCustomers.length === 1 ? 'Customer' : 'Total Customers'}</span>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name or email..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] shadow-xs transition-colors"
          />
        </div>
      </div>

      {/* Data Table Card */}
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
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                    {searchQuery.trim()
                      ? `No customers found matching "${searchQuery}".`
                      : 'No registered customers found in database.'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    {/* Customer Column: Initials Avatar + Name & Email */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-[#FFF9F5] border border-[#F88B35]/30 text-[#F88B35] font-bold text-xs flex items-center justify-center shrink-0">
                          {customer.avatar}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-gray-900 text-sm">
                            {customer.name}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {customer.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="px-6 py-4 text-xs text-gray-600 font-medium">
                      {customer.createdAt}
                    </td>

                    {/* Total Orders */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
                        {customer.orderCount} {customer.orderCount === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>

                    {/* Actions Column */}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-3.5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing <strong className="text-gray-700">{filteredCustomers.length}</strong> of{' '}
            <strong className="text-gray-700">{customers.length}</strong> registered users
          </span>
        </div>
      </div>
    </div>
  );
}
