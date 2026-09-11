import React from 'react';
import Navbar from '@/components/storefront/Navbar';
import HeroSection from '@/components/storefront/HeroSection';
import PopularDestinations from '@/components/storefront/PopularDestinations';
import HowItWorks from '@/components/storefront/HowItWorks';
import FeaturesGrid from '@/components/storefront/FeaturesGrid';
import TrustAndReviews from '@/components/storefront/TrustAndReviews';
import FaqSection from '@/components/storefront/FaqSection';
import Footer from '@/components/storefront/Footer';
import CartDrawer from '@/components/storefront/CartDrawer';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { getDestinationRegion } from '@/lib/destination-regions';

export const metadata = {
  title: 'Soovia eSIM | Instant International eSIM Data for 190+ Countries',
  description: 'Fast international eSIM data with zero roaming fees. Activate instantly on your smartphone and stay connected worldwide.',
};

const IMPORTANT_ISOS = [
  // Top 9 Popular
  'GB', 'DE', 'CH', 'JP', 'TH', 'US', 'CA', 'AE', 'SA',
  // Key regional destinations
  'FR', 'IT', 'ES', 'NL', 'PT', 'SG', 'KR', 'VN', 'ID', 'MY', 'IN',
  'MX', 'CR', 'PA', 'BR', 'AR', 'CO', 'CL', 'PE', 'JM', 'DO', 'BS',
  'AW', 'PR', 'ZA', 'EG', 'MA', 'KE', 'TZ', 'NG', 'QA', 'KW', 'OM',
  'TR', 'AU', 'NZ', 'FJ', 'GU',
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch the most important destinations and active packages from Prisma
  const rawDestinations = await prisma.destination.findMany({
    where: {
      isoCode: {
        in: IMPORTANT_ISOS,
        mode: 'insensitive',
      },
    },
    include: {
      packages: {
        where: { isActive: true },
        select: { retailPriceUSD: true },
      },
    },
  });

  // Sort so the top popular countries appear first
  rawDestinations.sort((a, b) => {
    const idxA = IMPORTANT_ISOS.indexOf(a.isoCode.toUpperCase());
    const idxB = IMPORTANT_ISOS.indexOf(b.isoCode.toUpperCase());
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
  });

  // Calculate starting price and create clean array of destination items
  const destinations = rawDestinations.map((dest) => {
    const activePackages = dest.packages || [];
    const startingPrice =
      activePackages.length > 0
        ? Math.min(...activePackages.map((p: any) => p.retailPriceUSD ?? p.price))
        : 3.3;

    const slug =
      dest.slug ||
      dest.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') ||
      dest.isoCode.toLowerCase();

    const flagUrl =
      dest.flagUrl ||
      `https://hatscripts.github.io/circle-flags/flags/${dest.isoCode.slice(0, 2).toLowerCase()}.svg`;

    const region = getDestinationRegion(dest.isoCode, dest.name, dest.type);

    return {
      id: dest.id,
      name: dest.name,
      slug,
      flagUrl,
      region,
      startingPrice,
    };
  });

  return (
    <main className="min-h-screen bg-white text-[#111111] flex flex-col justify-between">
      <div>
        <Navbar user={user} />
        <HeroSection />
        <PopularDestinations destinations={destinations} />
        <HowItWorks />
        <FeaturesGrid />
        <TrustAndReviews />
        <FaqSection />
      </div>

      <Footer />
      <CartDrawer />
    </main>
  );
}
