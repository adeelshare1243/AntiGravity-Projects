'use client';

import React from 'react';
import HeroSection from '@/components/destination/HeroSection';
import PackageList from '@/components/destination/PackageList';
import TrustBadges from '@/components/destination/TrustBadges';
import Specifications from '@/components/destination/Specifications';
import Testimonials from '@/components/destination/Testimonials';
import DataGuide from '@/components/destination/DataGuide';
import ComparisonTable from '@/components/destination/ComparisonTable';
import HowItWorks from '@/components/destination/HowItWorks';
import NearbyDestinations from '@/components/destination/NearbyDestinations';
import FAQSection from '@/components/destination/FAQSection';

export interface DestinationPackage {
  id: string;
  dataAmount: string;
  validityDays: number;
  price: string;
  numericPrice?: number;
  networkTypes?: string[];
  isPopular?: boolean;
  isUnlimited?: boolean;
}

export interface DestinationData {
  id: string;
  name: string;
  slug: string;
  isoCode: string;
  flagUrl: string;
  imageUrl: string;
  packages: DestinationPackage[];
}

interface DestinationPurchaseClientProps {
  destination: DestinationData;
}

export default function DestinationPurchaseClient({
  destination,
}: DestinationPurchaseClientProps) {
  const isGlobal =
    destination.slug === 'global' ||
    destination.isoCode?.toUpperCase() === 'GLOBAL' ||
    destination.isoCode?.toUpperCase() === 'WORLD';

  const isEurope =
    destination.slug === 'europe' ||
    destination.isoCode?.toUpperCase() === 'EU' ||
    destination.name.toLowerCase() === 'europe';

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1062px] mx-auto px-4 flex flex-col gap-16 md:gap-24 my-6 sm:my-8 pb-16">
        {/* 1. Hero Section (Banner + 3 Top Trust Badges) */}
        <HeroSection
          destinationName={destination.name}
          flagUrl={destination.flagUrl}
          bannerUrl={destination.imageUrl}
          plansCount={destination.packages?.length || 4}
          isGlobal={isGlobal}
          isEurope={isEurope}
        />

        {/* 2. Packages List (Standard & Unlimited Tabs, Custom Unlimited Slider, Checkout Bar) */}
        <PackageList
          destinationName={destination.name}
          destinationSlug={destination.slug}
          flagUrl={destination.flagUrl}
          packages={destination.packages}
          isGlobal={isGlobal}
        />

        {/* 3. Payment Logos & 3 Value / Guarantee Badges */}
        <TrustBadges />

        {/* 4. Technical Specifications Table */}
        <Specifications
          destinationName={destination.name}
          isGlobal={isGlobal}
          isEurope={isEurope}
        />

        {/* 5. Trustpilot & Testimonials Carousel */}
        <Testimonials />

        {/* 6. Data Usage Calculator / Guide */}
        <DataGuide destinationName={destination.name} />

        {/* 7. Comparison Table */}
        <ComparisonTable destinationName={destination.name} />

        {/* 8. How eSIM Works (3 Step Cards with Phone Mockups) */}
        <HowItWorks />

        {/* 9. Nearby Destinations */}
        <NearbyDestinations />

        {/* 10. Destination FAQ */}
        <FAQSection
          destinationName={destination.name}
          isGlobal={isGlobal}
        />
      </div>
    </div>
  );
}
