import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import DestinationPurchaseClient, {
  DestinationData,
  DestinationPackage,
} from '@/components/destination/DestinationPurchaseClient';

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();

  const destination = await prisma.destination.findFirst({
    where: {
      OR: [
        { slug: { equals: decodedSlug, mode: 'insensitive' } },
        { isoCode: { equals: decodedSlug, mode: 'insensitive' } },
        { name: { equals: decodedSlug.replace(/-/g, ' '), mode: 'insensitive' } },
        { name: { equals: decodedSlug, mode: 'insensitive' } },
        ...(decodedSlug === 'europe' ? [{ isoCode: 'EU' }] : []),
        ...(decodedSlug === 'global'
          ? [{ isoCode: 'GLOBAL' }, { isoCode: 'WORLD' }, { type: 'global' }]
          : []),
      ],
    },
    select: { name: true },
  });

  const destName =
    destination?.name ||
    slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  return {
    title: `eSIM for ${destName} | High-Speed 5G/4G Data Plans | Soovia eSIM`,
    description: `Instant eSIM data plans for ${destName}. Stay connected with high-speed 5G/4G local networks, instant QR delivery, and 24/7 support.`,
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const lowercaseSlug = decodedSlug.toLowerCase();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Enforce lowercase URL for SEO and UX
  if (decodedSlug !== lowercaseSlug) {
    redirect(`/${locale}/destinations/${lowercaseSlug}`);
  }

  // 1. Data Fetching with Prisma
  const destination = await prisma.destination.findFirst({
    where: {
      OR: [
        { slug: { equals: lowercaseSlug, mode: 'insensitive' } },
        { isoCode: { equals: lowercaseSlug, mode: 'insensitive' } },
        { name: { equals: lowercaseSlug.replace(/-/g, ' '), mode: 'insensitive' } },
        { name: { equals: lowercaseSlug, mode: 'insensitive' } },
        ...(lowercaseSlug === 'europe' ? [{ isoCode: 'EU' }] : []),
        ...(lowercaseSlug === 'global'
          ? [{ isoCode: 'GLOBAL' }, { isoCode: 'WORLD' }, { type: 'global' }]
          : []),
      ],
    },
    include: {
      packages: {
        where: { isActive: true },
        orderBy: { retailPriceUSD: 'asc' },
      },
    },
  });

  if (!destination) {
    notFound();
  }

  // ─── Helper: round raw GB values to standard marketing sizes ───────────────
  function normalizeDataAmount(rawMB: number, isUnlimited: boolean): string {
    if (isUnlimited || rawMB === -1) return 'Unlimited';

    if (rawMB < 1000) {
      // Keep as MB (e.g. 500 MB)
      return `${rawMB} MB`;
    }

    // Convert to GB
    const gb = rawMB / 1024;

    // Snap to nearest standard marketing tier
    // Covers: 1, 2, 3, 5, 10, 15, 20, 25, 30, 50, 100 GB
    const tiers = [0.5, 1, 2, 3, 5, 10, 15, 20, 25, 30, 50, 100];
    let nearest = tiers[0];
    let minDiff = Math.abs(gb - tiers[0]);
    for (const tier of tiers) {
      const diff = Math.abs(gb - tier);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = tier;
      }
    }

    return nearest === 0.5 ? '500 MB' : `${nearest} GB`;
  }

  type DestinationWithPackages = NonNullable<typeof destination>;
  type PackageItem = DestinationWithPackages['packages'][number];

  function deduplicatePackages(
    pkgs: PackageItem[],
  ): PackageItem[] {
    const seen = new Map<string, PackageItem>();

    for (const pkg of pkgs) {
      const normalizedAmount = normalizeDataAmount(
        pkg.dataAmountMB,
        pkg.isUnlimited || pkg.dataAmountMB === -1,
      );
      const key = `${normalizedAmount}-${pkg.validityDays}d`;
      const existing = seen.get(key);

      if (!existing || pkg.retailPriceUSD < existing.retailPriceUSD) {
        seen.set(key, pkg);
      }
    }

    // Return in original price-ascending order
    return Array.from(seen.values()).sort(
      (a, b) => a.retailPriceUSD - b.retailPriceUSD,
    );
  }

  // 2. Sanitize: deduplicate then normalize display amounts
  const rawPackages = destination.packages || [];
  const dedupedPackages = deduplicatePackages(rawPackages);

  const formattedPackages: DestinationPackage[] = dedupedPackages.map(
    (pkg, idx) => {
      const isUnlimitedPkg = pkg.isUnlimited || pkg.dataAmountMB === -1;
      const dataAmount = normalizeDataAmount(pkg.dataAmountMB, isUnlimitedPkg);

      // Mark "popular" as the plan whose normalized size is 10 GB (or index 1 as fallback)
      const isPopular = dataAmount === '10 GB' || (!dedupedPackages.some((p) => {
        const a = normalizeDataAmount(p.dataAmountMB, p.isUnlimited || p.dataAmountMB === -1);
        return a === '10 GB';
      }) && idx === 1);

      return {
        id: pkg.id,
        dataAmount,
        validityDays: pkg.validityDays,
        price: pkg.retailPriceUSD.toFixed(2),
        numericPrice: pkg.retailPriceUSD,
        networkTypes: ['4G/LTE', '5G'],
        isPopular,
        isUnlimited: isUnlimitedPkg,
      };
    },
  );

  const defaultFallbackPackages: DestinationPackage[] = [
    {
      id: 'pkg-1gb-7d',
      dataAmount: '1 GB',
      validityDays: 7,
      price: '4.50',
      numericPrice: 4.5,
      networkTypes: ['4G/LTE', '5G'],
      isPopular: false,
      isUnlimited: false,
    },
    {
      id: 'pkg-3gb-30d',
      dataAmount: '3 GB',
      validityDays: 30,
      price: '9.50',
      numericPrice: 9.5,
      networkTypes: ['4G/LTE', '5G'],
      isPopular: true,
      isUnlimited: false,
    },
    {
      id: 'pkg-5gb-30d',
      dataAmount: '5 GB',
      validityDays: 30,
      price: '14.00',
      numericPrice: 14.0,
      networkTypes: ['4G/LTE', '5G'],
      isPopular: false,
      isUnlimited: false,
    },
    {
      id: 'pkg-10gb-30d',
      dataAmount: '10 GB',
      validityDays: 30,
      price: '22.50',
      numericPrice: 22.5,
      networkTypes: ['4G/LTE', '5G'],
      isPopular: false,
      isUnlimited: false,
    },
    {
      id: 'pkg-20gb-30d',
      dataAmount: '20 GB',
      validityDays: 30,
      price: '34.00',
      numericPrice: 34.0,
      networkTypes: ['4G/LTE', '5G'],
      isPopular: false,
      isUnlimited: false,
    },
    {
      id: 'pkg-unlimited-7d',
      dataAmount: 'Unlimited',
      validityDays: 7,
      price: '29.00',
      numericPrice: 29.0,
      networkTypes: ['4G/LTE', '5G'],
      isPopular: false,
      isUnlimited: true,
    },
    {
      id: 'pkg-unlimited-15d',
      dataAmount: 'Unlimited',
      validityDays: 15,
      price: '48.00',
      numericPrice: 48.0,
      networkTypes: ['4G/LTE', '5G'],
      isPopular: false,
      isUnlimited: true,
    },
  ];

  const packages =
    formattedPackages.length > 0 ? formattedPackages : defaultFallbackPackages;

  const destinationData: DestinationData = {
    id: destination.id,
    name: destination.name,
    slug: lowercaseSlug,
    isoCode: destination.isoCode,
    flagUrl:
      destination.flagUrl ||
      `https://hatscripts.github.io/circle-flags/flags/${destination.isoCode.slice(0, 2).toLowerCase()}.svg`,
    imageUrl:
      destination.bannerUrl ||
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    packages,
  };

  return (
    <main className="min-h-screen bg-white text-[#252F4A] flex flex-col justify-between font-sans antialiased">
      <div>
        <Navbar user={user} />
        <DestinationPurchaseClient destination={destinationData} />
      </div>
      <Footer />
    </main>
  );
}
