import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
// Revalidate every 5 minutes — destinations list changes infrequently
export const revalidate = 300;

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isoCode: true,
        flagUrl: true,
        packages: {
          where: { isActive: true },
          select: { retailPriceUSD: true },
          orderBy: { retailPriceUSD: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    const result = destinations.map((dest) => {
      // Use DB slug or fallback to URL-safe slug from the destination name
      const slug =
        dest.slug ||
        dest.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

      // ISO code → circle-flags CDN (first 2 chars, lowercase)
      const flagUrl =
        dest.flagUrl ||
        `https://hatscripts.github.io/circle-flags/flags/${dest.isoCode.slice(0, 2).toLowerCase()}.svg`;

      const planCount = dest.packages.length;
      const lowestPrice =
        dest.packages.length > 0
          ? `$${dest.packages[0].retailPriceUSD.toFixed(2)}`
          : null;

      return {
        id: dest.id,
        name: dest.name,
        slug,
        isoCode: dest.isoCode,
        flagUrl,
        planCount,
        startingPrice: lowestPrice,
      };
    });

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    });
  } catch (error) {
    console.error('[/api/destinations/search] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}
