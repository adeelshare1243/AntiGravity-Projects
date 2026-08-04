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

export const metadata = {
  title: 'Soovia eSIM | Instant International eSIM Data for 190+ Countries',
  description: 'Fast international eSIM data with zero roaming fees. Activate instantly on your smartphone and stay connected worldwide.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-[#111111] flex flex-col justify-between">
      <div>
        <Navbar />
        <HeroSection />
        <PopularDestinations />
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
