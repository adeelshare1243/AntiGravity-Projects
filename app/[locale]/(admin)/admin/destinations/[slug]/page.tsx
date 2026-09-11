import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  ArrowLeft,
  Globe2,
  Layers,
  DollarSign,
  Wifi,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function AdminDestinationDetailPage({ params }: Props) {
  const { slug, locale } = await params;

  // Fetch destination by slug or uppercase ISO code
  const destination = await prisma.destination.findFirst({
    where: {
      OR: [
        { slug },
        { isoCode: slug.toUpperCase() },
      ],
    },
    include: {
      packages: {
        include: {
          supplier: true,
        },
        orderBy: {
          dataAmountMB: 'asc',
        },
      },
    },
  });

  if (!destination) {
    notFound();
  }

  const packages = destination.packages;

  // Helper to format data
  const formatDataMB = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(0)} GB`;
    }
    return `${mb} MB`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
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
            href={`/${locale}/admin/destinations`}
            className="hover:text-gray-900 transition-colors"
          >
            Destinations &amp; Packages
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-900 font-semibold">{destination.name}</span>
        </nav>

        {/* Header with Flag and Destination Title */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mt-2">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/admin/destinations`}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-3">
              {destination.flagUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={destination.flagUrl}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-xs shrink-0"
                />
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    {destination.name}
                  </h1>
                  <span className="text-xs font-mono font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                    {destination.isoCode}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Type: <span className="capitalize font-semibold text-gray-700">{destination.type}</span> &bull;{' '}
                  <span className="font-semibold text-gray-700">{packages.length} Packages</span> in catalog
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Package Inventory Data Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Provider Plans &amp; Wholesale Rates
            </h2>
            <p className="text-xs text-gray-500">
              Active eSIM allocations synced from Airalo, eSIM Go, and other connected upstream suppliers.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-center">
            {packages.length} Plans Available
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/70 border-b border-gray-200 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  Plan / Data Amount
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Validity
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Wholesale Cost
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Retail Price
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Provider / Network
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {packages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No active packages configured for this destination yet.
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => {
                  const providerName =
                    pkg.supplierName || pkg.supplier?.name || 'eSIM Go';

                  return (
                    <tr
                      key={pkg.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      {/* Plan / Data Amount */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-sm">
                            {formatDataMB(pkg.dataAmountMB)}
                          </span>
                          <span className="text-[11px] font-mono text-gray-400">
                            {pkg.supplierPackageId}
                          </span>
                        </div>
                      </td>

                      {/* Validity */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle text-gray-700">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{pkg.validityDays} Days</span>
                        </div>
                      </td>

                      {/* Wholesale Cost */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle text-xs font-mono font-medium text-gray-600">
                        ${pkg.wholesaleCostUSD.toFixed(2)} USD
                      </td>

                      {/* Retail Price */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <span className="font-bold text-gray-900 text-sm">
                          ${pkg.retailPriceUSD.toFixed(2)} USD
                        </span>
                      </td>

                      {/* Provider / Network */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 text-xs">
                            {providerName}
                          </span>
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Wifi className="w-3 h-3 text-[#F88B35]" />
                            {pkg.networkType || '4G/5G/LTE'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 border-b border-gray-100 last:border-0 align-middle">
                        {pkg.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                            Inactive
                          </span>
                        )}
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
