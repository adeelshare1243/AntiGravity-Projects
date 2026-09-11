import React from 'react';
import Link from 'next/link';
import { ChevronRight, Smartphone, Search, Eye, Globe } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    q?: string;
  }>;
}

export default async function AdminEsimsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = (await searchParams) || {};
  const query = q?.trim() || '';

  // Phase 1: Database Fetching & Relations (Server Component)
  const esims = await prisma.userEsim.findMany({
    where: query
      ? {
          OR: [
            { iccid: { contains: query, mode: 'insensitive' } },
            { user: { email: { contains: query, mode: 'insensitive' } } },
            { user: { name: { contains: query, mode: 'insensitive' } } },
          ],
        }
      : undefined,
    include: {
      user: true,
      order: {
        include: {
          package: {
            include: {
              supplier: true,
              destination: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Helper for Status Pill Badges
  const renderStatusBadge = (statusStr: string, installed: boolean) => {
    const s = statusStr.toLowerCase();
    if (s === 'active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    }
    if (s === 'installed' || (installed && s !== 'expired')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Installed
        </span>
      );
    }
    if (s === 'expired' || s === 'depleted') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Depleted / Expired
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Unassigned / Pending
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Phase 2: Page Header & Breadcrumbs */}
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
          <span className="text-gray-900 font-semibold">eSIM Management</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
          eSIM Management
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor active ICCIDs, track data usage, and manage provider allocations.
        </p>
      </div>

      {/* Table Controls: Count Badge & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Smartphone className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-800">{esims.length} Issued Profiles</span>
        </div>

        <form method="GET" className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            name="q"
            type="text"
            defaultValue={query}
            placeholder="Search by ICCID or customer email..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] shadow-xs transition-colors"
          />
        </form>
      </div>

      {/* Phase 3 & 4: The Data Table UI with Dynamic Data Binding */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  ICCID
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Provider &amp; Plan
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
              {esims.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No eSIM records found matching your criteria.
                  </td>
                </tr>
              ) : (
                esims.map((esim) => {
                  // Customer details & Initials
                  const user = esim.user;
                  const fullName = user.name?.trim() || user.email.split('@')[0] || 'Customer';
                  const nameParts = fullName.split(' ').filter(Boolean);
                  const firstInitial = nameParts[0]?.[0] || '';
                  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1]?.[0] : nameParts[0]?.[1] || '';
                  const initials = `${firstInitial}${lastInitial}`.toUpperCase() || 'ES';

                  // Provider & Plan calculations
                  const pkg = esim.order?.package;
                  const providerName =
                    pkg?.supplierName ||
                    pkg?.supplier?.name ||
                    'eSIM Go (Vodafone)';

                  const planDetails = pkg
                    ? `${(pkg.dataAmountMB / 1024).toFixed(0)}GB - ${pkg.validityDays} Days`
                    : '10GB - 30 Days';

                  const destinationName =
                    pkg?.destinationName ||
                    pkg?.destination?.name ||
                    'International';

                  // Date formatted
                  const formattedDate = new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(new Date(esim.createdAt));

                  return (
                    <tr
                      key={esim.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      {/* ICCID Column */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-bold text-gray-900 tracking-wide">
                            {esim.iccid}
                          </span>
                          <span className="text-[11px] text-gray-400 mt-0.5">
                            Provisioned {formattedDate}
                          </span>
                        </div>
                      </td>

                      {/* Customer Column */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-full bg-[#FFF9F5] border border-[#F88B35]/30 text-[#F88B35] font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-gray-900 text-sm">
                              {fullName}
                            </span>
                            <span className="text-xs text-gray-500 truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Provider & Plan Column */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-[#F88B35] shrink-0" />
                            {providerName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {destinationName} &bull; {planDetails}
                          </span>
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        {renderStatusBadge(esim.status, esim.installed)}
                      </td>

                      {/* Phase 5: Action Links */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle text-right">
                        <Link
                          href={`/${locale}/admin/esims/${esim.iccid}`}
                          title="View eSIM Details"
                          className="p-1.5 text-gray-400 hover:text-[#F88B35] hover:bg-[#FFF9F5] rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center border border-transparent hover:border-[#F88B35]/20"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
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
