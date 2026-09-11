import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  ArrowLeft,
  Smartphone,
  User,
  Mail,
  Calendar,
  ShoppingBag,
  Globe,
  QrCode,
  Key,
  Wifi,
  Layers,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{
    iccid: string;
    locale: string;
  }>;
}

export default async function EsimDetailPage({ params }: Props) {
  const { iccid, locale } = await params;

  const esim = await prisma.userEsim.findUnique({
    where: { iccid },
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
  });

  if (!esim) {
    notFound();
  }

  const pkg = esim.order?.package;
  const providerName = pkg?.supplierName || pkg?.supplier?.name || 'eSIM Go';
  const destinationName = pkg?.destinationName || pkg?.destination?.name || 'Global';
  const planDetails = pkg
    ? `${(pkg.dataAmountMB / 1024).toFixed(0)}GB - ${pkg.validityDays} Days`
    : '10GB - 30 Days';

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(esim.createdAt));

  const renderStatusBadge = (statusStr: string, installed: boolean) => {
    const s = statusStr.toLowerCase();
    if (s === 'active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    }
    if (s === 'installed' || (installed && s !== 'expired')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Installed
        </span>
      );
    }
    if (s === 'expired' || s === 'depleted') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Depleted / Expired
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Unassigned / Pending
      </span>
    );
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
            href={`/${locale}/admin/esims`}
            className="hover:text-gray-900 transition-colors"
          >
            eSIM Management
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-900 font-semibold truncate max-w-xs">{esim.iccid}</span>
        </nav>

        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mt-2">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/admin/esims`}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-gray-900 font-mono tracking-tight">
                  {esim.iccid}
                </h1>
                {renderStatusBadge(esim.status, esim.installed)}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Provisioned on {formattedDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Technical eSIM Profile & QR Code */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#F88B35]" />
              <span>eSIM Provisioning Credentials</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  ICCID (Card Identifier)
                </span>
                <span className="font-mono text-sm font-bold text-gray-900 block bg-gray-50 p-2.5 rounded-lg border border-gray-200 select-all">
                  {esim.iccid}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  SM-DP+ Address
                </span>
                <span className="font-mono text-sm font-semibold text-gray-800 block bg-gray-50 p-2.5 rounded-lg border border-gray-200 select-all">
                  {esim.smdpAddress || 'rsp.esim-go.com'}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Activation Code / LPA String
                </span>
                <span className="font-mono text-xs font-semibold text-gray-800 block bg-gray-50 p-2.5 rounded-lg border border-gray-200 select-all break-all">
                  {esim.activationCode || `LPA:1$rsp.esim-go.com$${esim.iccid}`}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  APN (Access Point Name)
                </span>
                <span className="text-sm font-semibold text-gray-800 block bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                  {esim.apn || 'globaldata'}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Installation State
                </span>
                <span className="text-sm font-semibold text-gray-800 block bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                  {esim.installed ? 'Device Profile Downloaded' : 'Awaiting Scanning / Download'}
                </span>
              </div>
            </div>

            {/* QR Code section */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-6">
              {esim.qrCodeUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={esim.qrCodeUrl}
                  alt="eSIM QR Code"
                  className="w-36 h-36 border border-gray-200 rounded-xl p-2 bg-white shadow-xs"
                />
              ) : (
                <div className="w-36 h-36 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <QrCode className="w-12 h-12" />
                </div>
              )}
              <div className="text-center sm:text-left space-y-1">
                <span className="font-bold text-gray-900 text-sm block">Direct Scan QR Code</span>
                <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                  Customers can scan this QR code directly from their iOS or Android camera settings to download this eSIM profile.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Associated Order */}
        <div className="col-span-1 space-y-6">
          {/* Customer Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Customer Info
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#FFF9F5] border border-[#F88B35]/30 text-[#F88B35] font-bold text-sm flex items-center justify-center shrink-0">
                {(esim.user.name?.[0] || esim.user.email[0]).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="font-bold text-gray-900 text-sm block">
                  {esim.user.name || 'Customer'}
                </span>
                <span className="text-xs text-gray-500 truncate block">
                  {esim.user.email}
                </span>
              </div>
            </div>
            <Link
              href={`/${locale}/admin/customers/${esim.user.id}`}
              className="text-[#F88B35] hover:underline text-xs font-bold inline-block pt-1"
            >
              View Customer Profile &rarr;
            </Link>
          </div>

          {/* Associated Plan Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Allocated Plan
            </h3>
            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-400">Provider</span>
                <span className="font-bold text-gray-900">{providerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-400">Destination</span>
                <span className="font-bold text-gray-900">{destinationName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-400">Data &amp; Validity</span>
                <span className="font-bold text-gray-900">{planDetails}</span>
              </div>
              {esim.order && (
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-400">Order ID</span>
                  <span className="font-mono text-gray-900 font-bold">{esim.order.id.slice(0, 8)}...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
