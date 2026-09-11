import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

function normalizeDataAmount(rawMB: number, isUnlimited: boolean): string {
  if (isUnlimited || rawMB === -1) return 'Unlimited';
  if (rawMB < 1000) return `${rawMB} MB`;

  const gb = rawMB / 1024;
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
  return `${nearest} GB`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pkgId = searchParams.get('pkgId');
    const destSlug = searchParams.get('destSlug')?.toLowerCase().trim();
    const daysParam = searchParams.get('days');
    const priceParam = searchParams.get('price');

    if (!pkgId && !destSlug) {
      return NextResponse.json({ error: 'Missing package ID or destination slug' }, { status: 400 });
    }

    let packageRecord: any = null;
    let destinationRecord: any = null;

    // 1. Try finding package by UUID directly if valid UUID
    const isUuid = pkgId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pkgId);
    if (isUuid) {
      packageRecord = await prisma.unifiedPackage.findUnique({
        where: { id: pkgId! },
        include: { destination: true },
      });
      if (packageRecord) {
        destinationRecord = packageRecord.destination;
      }
    }

    // 2. If destination not found yet, query using destSlug
    if (!destinationRecord && destSlug) {
      destinationRecord = await prisma.destination.findFirst({
        where: {
          OR: [
            { isoCode: { equals: destSlug, mode: 'insensitive' } },
            { name: { equals: destSlug.replace(/-/g, ' '), mode: 'insensitive' } },
            { name: { equals: destSlug, mode: 'insensitive' } },
            ...(destSlug === 'europe' ? [{ isoCode: 'EU' }] : []),
            ...(destSlug === 'global' ? [{ isoCode: 'GLOBAL' }, { isoCode: 'WORLD' }, { type: 'global' }] : []),
          ],
        },
        include: {
          packages: {
            where: { isActive: true },
            orderBy: { retailPriceUSD: 'asc' },
          },
        },
      });

      // If packageRecord wasn't found by UUID, try to find in destination's packages
      if (destinationRecord && !packageRecord) {
        if (pkgId) {
          packageRecord = destinationRecord.packages.find((p: any) => p.id === pkgId);
        }
        // If still not matched and unlimited requested, check matching validityDays
        if (!packageRecord && daysParam) {
          const daysNum = parseInt(daysParam, 10);
          packageRecord = destinationRecord.packages.find(
            (p: any) => p.isUnlimited && p.validityDays === daysNum,
          );
        }
      }
    }

    if (!destinationRecord) {
      return NextResponse.json({ error: 'Destination not found' }, { status: 404 });
    }

    // Resolve flag URL
    const flagUrl =
      destinationRecord.flagUrl ||
      (destinationRecord.isoCode
        ? `https://hatscripts.github.io/circle-flags/flags/${destinationRecord.isoCode.slice(0, 2).toLowerCase()}.svg`
        : '/assets/flags/gb.svg');

    // Build package response object
    let finalPackage: {
      id: string;
      dataAmount: string;
      validityDays: number;
      price: number;
    };

    if (packageRecord) {
      finalPackage = {
        id: packageRecord.id,
        dataAmount: normalizeDataAmount(packageRecord.dataAmountMB, packageRecord.isUnlimited),
        validityDays: packageRecord.validityDays,
        price: packageRecord.retailPriceUSD,
      };
    } else {
      // Fallback for custom slider or synthetic unlimited
      finalPackage = {
        id: pkgId || 'custom-unlimited',
        dataAmount: 'Unlimited',
        validityDays: daysParam ? parseInt(daysParam, 10) : 7,
        price: priceParam ? parseFloat(priceParam) : 16.23,
      };
    }

    return NextResponse.json({
      destination: {
        id: destinationRecord.id,
        name: destinationRecord.name,
        isoCode: destinationRecord.isoCode,
        flagUrl,
      },
      package: finalPackage,
    });
  } catch (error) {
    console.error('[/api/checkout/package] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch package details' }, { status: 500 });
  }
}
