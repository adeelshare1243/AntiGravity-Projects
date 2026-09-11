import React from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Globe2,
  Search,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ProfitMarginInput from '@/components/admin/ProfitMarginInput';
import ManualSyncButton from '@/components/admin/ManualSyncButton';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    locale: string;
  }>;
  searchParams?: Promise<{
    q?: string;
    page?: string;
  }>;
}

export default async function AdminDestinationsPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const resolvedSearchParams = (await searchParams) || {};
  const query = resolvedSearchParams.q?.trim() || '';
  const currentPage = Math.max(1, parseInt(resolvedSearchParams.page || '1', 10));
  const pageSize = 20;

  // Search filter
  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' as const } },
          { isoCode: { contains: query, mode: 'insensitive' as const } },
          { type: { contains: query, mode: 'insensitive' as const } },
        ],
      }
    : {};

  // Phase 1: Database Fetching with Relational Count, Store Settings & Pagination
  const [totalCount, destinations, storeSettings] = await Promise.all([
    prisma.destination.count({ where }),
    prisma.destination.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        isoCode: true,
        type: true,
        flagUrl: true,
        _count: {
          select: { packages: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.storeSettings.findFirst(),
  ]);

  const globalProfitMargin = storeSettings?.globalProfitMargin ?? 25.0;

  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Capitalize helper
  const formatType = (typeStr: string) => {
    if (!typeStr) return 'Country';
    return typeStr.charAt(0).toUpperCase() + typeStr.slice(1).toLowerCase();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Phase 2: Breadcrumbs & Header */}
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
          <span className="text-gray-900 font-semibold">Destinations &amp; Packages</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
          Destinations &amp; Packages
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your global catalog, view active eSIM plans, and monitor provider sync status.
        </p>
      </div>

      {/* Top Action Controls: Search Bar & Manual Sync Button */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Globe2 className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-800">
            {totalCount} Total Destinations
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Global Dynamic Margin Control */}
          <ProfitMarginInput initialMargin={globalProfitMargin} />

          {/* Search Form */}
          <form method="GET" className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              name="q"
              type="text"
              defaultValue={query}
              placeholder="Search country name or code..."
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F88B35] shadow-xs transition-colors"
            />
          </form>

          {/* Secondary Action: Manual API Sync */}
          <ManualSyncButton />
        </div>
      </div>

      {/* Phase 3 & 4: Data Table UI with Dynamic Binding */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  Destination
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Region/Type
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Total Packages
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
              {destinations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400 text-sm"
                  >
                    No destinations match your search criteria.
                  </td>
                </tr>
              ) : (
                destinations.map((destination) => {
                  const packageCount = destination._count.packages;
                  const hasInventory = packageCount > 0;
                  const destinationSlug =
                    destination.slug || destination.isoCode.toLowerCase();

                  return (
                    <tr
                      key={destination.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      {/* Destination Column (Flag + Name + ISO) */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <div className="flex items-center gap-3">
                          {destination.flagUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={destination.flagUrl}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border border-gray-100 shrink-0 shadow-xs"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs shrink-0">
                              {destination.isoCode}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-sm">
                              {destination.name}
                            </span>
                            <span className="text-[11px] font-mono text-gray-400">
                              ISO: {destination.isoCode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Region / Type Column */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <span className="text-gray-700 font-medium text-xs">
                          {formatType(destination.type)}
                        </span>
                      </td>

                      {/* Total Packages Column */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        {hasInventory ? (
                          <span className="font-bold text-gray-900 text-sm">
                            {packageCount} Packages
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            0 Packages (No Inventory)
                          </span>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        {hasInventory ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            Offline
                          </span>
                        )}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle text-right">
                        <Link
                          href={`/${locale}/admin/destinations/${destinationSlug}`}
                          title={`View ${destination.name} catalog`}
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

        {/* Pagination Bar */}
        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/40 text-xs text-gray-500">
            <div>
              Showing <span className="font-bold text-gray-900">{startItem}</span> to{' '}
              <span className="font-bold text-gray-900">{endItem}</span> of{' '}
              <span className="font-bold text-gray-900">{totalCount}</span> destinations
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}/admin/destinations?page=${currentPage - 1}${
                  query ? `&q=${encodeURIComponent(query)}` : ''
                }`}
                aria-disabled={currentPage <= 1}
                className={`px-3 py-1.5 rounded-lg border border-gray-200 font-bold flex items-center gap-1 transition-colors ${
                  currentPage <= 1
                    ? 'pointer-events-none opacity-40 bg-gray-100 text-gray-400'
                    : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </Link>

              <span className="px-2 font-semibold text-gray-700">
                Page {currentPage} of {totalPages || 1}
              </span>

              <Link
                href={`/${locale}/admin/destinations?page=${currentPage + 1}${
                  query ? `&q=${encodeURIComponent(query)}` : ''
                }`}
                aria-disabled={currentPage >= totalPages}
                className={`px-3 py-1.5 rounded-lg border border-gray-200 font-bold flex items-center gap-1 transition-colors ${
                  currentPage >= totalPages
                    ? 'pointer-events-none opacity-40 bg-gray-100 text-gray-400'
                    : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer shadow-xs'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
