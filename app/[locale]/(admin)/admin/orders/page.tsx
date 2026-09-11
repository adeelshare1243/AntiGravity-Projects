'use client';

import React, { useState } from 'react';
import {
  Download,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  X,
  Smartphone,
  CreditCard,
  Globe,
  ExternalLink,
} from 'lucide-react';

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  destination: string;
  packageDetails: string;
  date: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  iccid?: string;
  provider?: string;
  paymentMethod?: string;
}

const ORDERS_MOCK_DATA: OrderItem[] = [
  {
    id: 'ord-1',
    orderNumber: '#ORD-7392',
    customerName: 'Liam Vance',
    customerEmail: 'liam.v@gmail.com',
    destination: 'United Kingdom',
    packageDetails: '10GB - 30 Days',
    date: 'Aug 31, 2026, 14:30',
    amount: '$24.00',
    status: 'Completed',
    iccid: '8944500123456789012',
    provider: 'eSIM Go (Vodafone UK)',
    paymentMethod: 'Apple Pay',
  },
  {
    id: 'ord-2',
    orderNumber: '#ORD-7391',
    customerName: 'Sophia Martinez',
    customerEmail: 'sophia.m@outlook.com',
    destination: 'Japan',
    packageDetails: '5GB - 15 Days',
    date: 'Aug 31, 2026, 13:15',
    amount: '$18.50',
    status: 'Completed',
    iccid: '8944500987654321098',
    provider: 'Airalo (Softbank JP)',
    paymentMethod: 'Credit Card (Visa)',
  },
  {
    id: 'ord-3',
    orderNumber: '#ORD-7390',
    customerName: 'Lucas Dubois',
    customerEmail: 'lucas.d@free.fr',
    destination: 'United States',
    packageDetails: '20GB - 30 Days',
    date: 'Aug 31, 2026, 12:45',
    amount: '$38.00',
    status: 'Pending',
    iccid: '8944500554433221100',
    provider: 'eSIM Go (T-Mobile USA)',
    paymentMethod: 'Google Pay',
  },
  {
    id: 'ord-4',
    orderNumber: '#ORD-7389',
    customerName: 'Emma Watson',
    customerEmail: 'emma.w@icloud.com',
    destination: 'Turkey',
    packageDetails: '3GB - 7 Days',
    date: 'Aug 31, 2026, 11:20',
    amount: '$9.00',
    status: 'Completed',
    iccid: '8944500667788990011',
    provider: 'Airalo (Turkcell)',
    paymentMethod: 'Credit Card (Mastercard)',
  },
  {
    id: 'ord-5',
    orderNumber: '#ORD-7388',
    customerName: 'Chen Wei',
    customerEmail: 'chen.wei@qq.com',
    destination: 'Switzerland',
    packageDetails: '10GB - 30 Days',
    date: 'Aug 31, 2026, 10:05',
    amount: '$28.00',
    status: 'Failed',
    iccid: 'N/A',
    provider: 'eSIM Go (Swisscom)',
    paymentMethod: 'Credit Card (UnionPay)',
  },
  {
    id: 'ord-6',
    orderNumber: '#ORD-7387',
    customerName: 'Noah Becker',
    customerEmail: 'noah.b@web.de',
    destination: 'Germany',
    packageDetails: '5GB - 15 Days',
    date: 'Aug 30, 2026, 19:40',
    amount: '$15.00',
    status: 'Completed',
    iccid: '8944500332211445566',
    provider: 'eSIM Go (Telekom DE)',
    paymentMethod: 'PayPal',
  },
  {
    id: 'ord-7',
    orderNumber: '#ORD-7386',
    customerName: 'Isabella Rossi',
    customerEmail: 'isabella.r@gmail.com',
    destination: 'Spain',
    packageDetails: '10GB - 30 Days',
    date: 'Aug 30, 2026, 18:12',
    amount: '$22.00',
    status: 'Refunded',
    iccid: '8944500778899112233',
    provider: 'Airalo (Movistar ES)',
    paymentMethod: 'Credit Card (Visa)',
  },
  {
    id: 'ord-8',
    orderNumber: '#ORD-7385',
    customerName: 'Ethan Miller',
    customerEmail: 'ethan.m@techcorp.io',
    destination: 'United Arab Emirates',
    packageDetails: '5GB - 7 Days',
    date: 'Aug 30, 2026, 16:55',
    amount: '$20.00',
    status: 'Completed',
    iccid: '8944500998877665544',
    provider: 'Airalo (Etisalat UAE)',
    paymentMethod: 'Apple Pay',
  },
];

export default function OrdersManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filter logic
  const filteredOrders = ORDERS_MOCK_DATA.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All Statuses' || order.status === statusFilter;

    // Mock Date Filter
    let matchesDate = true;
    if (dateFilter === 'Today') {
      matchesDate = order.date.includes('Aug 31');
    } else if (dateFilter === 'Last 7 Days') {
      matchesDate = true;
    } else if (dateFilter === 'This Month') {
      matchesDate = order.date.includes('Aug');
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Generate CSV string
      const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Destination', 'Package', 'Date', 'Amount', 'Status'];
      const rows = filteredOrders.map((o) => [
        o.orderNumber,
        `"${o.customerName}"`,
        o.customerEmail,
        `"${o.destination}"`,
        `"${o.packageDetails}"`,
        `"${o.date}"`,
        o.amount,
        o.status,
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `orders-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 600);
  };

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            Completed
          </span>
        );
      case 'Pending':
        return (
          <span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
            Pending
          </span>
        );
      case 'Failed':
        return (
          <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            Failed
          </span>
        );
      case 'Refunded':
        return (
          <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            Refunded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Orders Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time customer transactions, fulfillment logs, and eSIM provisioning statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={isExporting}
          className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer w-fit"
        >
          <Download className="w-4 h-4 text-gray-500" />
          <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
        </button>
      </div>

      {/* 2. Analytics KPI Cards (Top Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1 (Total Revenue) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-sm font-bold text-gray-500 mb-2 block">
              Total Revenue
            </span>
            <div className="text-2xl font-black text-gray-900 mb-2">
              $45,231.00
            </div>
          </div>
          <span className="text-emerald-500 text-xs font-medium">
            +12% vs last month
          </span>
        </div>

        {/* Card 2 (Total Orders) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-sm font-bold text-gray-500 mb-2 block">
              Total Orders
            </span>
            <div className="text-2xl font-black text-gray-900 mb-2">
              2,845
            </div>
          </div>
          <span className="text-gray-500 text-xs font-medium">
            All time
          </span>
        </div>

        {/* Card 3 (Pending) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-sm font-bold text-gray-500 mb-2 block">
              Pending / Processing
            </span>
            <div className="text-2xl font-black text-gray-900 mb-2">
              12
            </div>
          </div>
          <span className="text-orange-500 text-xs font-medium">
            Awaiting API confirmation
          </span>
        </div>

        {/* Card 4 (Refunded) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-sm font-bold text-gray-500 mb-2 block">
              Refunded / Failed
            </span>
            <div className="text-2xl font-black text-gray-900 mb-2">
              34
            </div>
          </div>
          <span className="text-red-500 text-xs font-medium">
            Requires attention
          </span>
        </div>
      </div>

      {/* 3. Table Controls & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Email, or Name..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#F88B35] shadow-xs transition-colors"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm w-full sm:w-48 text-gray-700 focus:outline-none focus:border-[#F88B35] shadow-xs transition-colors cursor-pointer"
        >
          <option value="All Statuses">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm w-full sm:w-48 text-gray-700 focus:outline-none focus:border-[#F88B35] shadow-xs transition-colors cursor-pointer"
        >
          <option value="All Time">All Time</option>
          <option value="Today">Today</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="This Month">This Month</option>
        </select>
      </div>

      {/* 4. Orders Data Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4">
                Order ID
              </th>
              <th scope="col" className="px-6 py-4">
                Customer
              </th>
              <th scope="col" className="px-6 py-4">
                Package
              </th>
              <th scope="col" className="px-6 py-4">
                Date
              </th>
              <th scope="col" className="px-6 py-4">
                Amount
              </th>
              <th scope="col" className="px-6 py-4">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  No orders match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/80 transition-colors group"
                >
                  {/* Order ID */}
                  <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                    <span className="font-mono text-gray-900 font-semibold">
                      {order.orderNumber}
                    </span>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">
                        {order.customerName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.customerEmail}
                      </span>
                    </div>
                  </td>

                  {/* Package */}
                  <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900">
                        {order.destination}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.packageDetails}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle text-gray-600">
                    {order.date}
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle font-bold text-gray-900">
                    {order.amount}
                  </td>

                  {/* Status Pills */}
                  <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                    {getStatusBadge(order.status)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#F88B35] hover:text-[#e07a2f] font-bold text-xs cursor-pointer transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Slide-Out Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative space-y-6">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Order Details
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-0.5">
                  {selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-[#F7F7F7] p-4 rounded-xl">
                <div>
                  <span className="text-xs text-gray-400 block mb-1">Customer</span>
                  <span className="font-bold text-gray-900 block">{selectedOrder.customerName}</span>
                  <span className="text-xs text-gray-500 block truncate">{selectedOrder.customerEmail}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-1">Status &amp; Total</span>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                  <span className="text-base font-black text-gray-900 block mt-1">{selectedOrder.amount}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Destination</span>
                  <span className="font-bold text-gray-900 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#F88B35]" />
                    {selectedOrder.destination}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Data Plan</span>
                  <span className="font-bold text-gray-900">{selectedOrder.packageDetails}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">eSIM ICCID</span>
                  <span className="font-mono text-xs font-semibold text-gray-700">{selectedOrder.iccid}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Upstream Provider</span>
                  <span className="font-semibold text-gray-800">{selectedOrder.provider}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Payment Gateway</span>
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                    {selectedOrder.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
              {selectedOrder.status === 'Completed' && (
                <button
                  type="button"
                  onClick={() => alert(`Resending eSIM installation QR code to ${selectedOrder.customerEmail}`)}
                  className="bg-[#F88B35] hover:bg-[#e07a2f] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  Resend eSIM QR
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
