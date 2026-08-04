import React from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import { Calendar, Clock, ArrowLeft, Share2, Bookmark, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-surface-cream text-dark-900 flex flex-col justify-between">
      <div>
        <Navbar />

        <article className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-grey-500 hover:text-[#FF5A36] mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {/* Header */}
          <div className="mb-8">
            <span className="inline-block bg-[#FF5A36]/10 text-[#FF5A36] text-xs font-bold px-3 py-1 rounded-lg mb-4">
              Travel Guides
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D0E25] mb-4 leading-tight">
              Best eSIM for International Travel (2026): Providers, Plans and Comparison
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-grey-500 pb-6 border-b border-grey-200">
              <span className="text-dark-900 font-bold">By Sarah Jenkins</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Aug 2, 2026</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 6 min read</span>
            </div>
          </div>

          {/* Main Hero Image */}
          <div className="rounded-3xl overflow-hidden mb-10 h-80 sm:h-96 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80"
              alt="International Travel eSIM"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none text-dark-800 space-y-6 text-sm sm:text-base leading-relaxed">
            <p className="font-semibold text-dark-900 text-lg leading-relaxed">
              Planning an international vacation or business trip? Staying connected without paying astronomical roaming fees from your home carrier has transformed completely thanks to travel eSIMs.
            </p>

            <h2 className="text-2xl font-bold text-[#0D0E25] pt-4">What is a Travel eSIM?</h2>
            <p>
              An eSIM (embedded Subscriber Identity Module) allows you to activate a cellular plan from a local or regional mobile provider without having to use a physical SIM card. You can install an eSIM on your phone via a simple QR code scan or in-app button press.
            </p>

            <div className="bg-white p-6 rounded-2xl border border-grey-200 my-6 shadow-xs">
              <h3 className="font-bold text-[#0D0E25] mb-3">Key Benefits of Using Soovia eSIM Abroad:</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-grey-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#17C653]" /> <span>Instant delivery via email & QR code</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#17C653]" /> <span>Zero physical SIM swapping or airport queues</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#17C653]" /> <span>Keep your primary phone number active for 2FA SMS</span></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#17C653]" /> <span>High-speed 4G/5G data coverage in 190+ countries</span></li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#0D0E25] pt-4">How to Pick the Best eSIM Data Plan</h2>
            <p>
              When choosing an eSIM for your trip, consider whether you need a single-country pass (like Japan or Turkey) or a regional multi-country pass (like Europe 30+ Countries or Asia Regional).
            </p>
          </div>

          {/* CTA Box */}
          <div className="mt-12 bg-[#0D0E25] text-white p-8 rounded-3xl text-center">
            <h3 className="text-2xl font-extrabold text-white mb-2">Ready to Travel Connected?</h3>
            <p className="text-grey-300 text-xs sm:text-sm mb-6 max-w-md mx-auto">Get your international eSIM plan in 60 seconds with instant activation.</p>
            <Link href="/destinations" className="inline-block bg-[#FF5A36] hover:bg-[#E04822] text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-md">
              Browse All eSIM Destinations →
            </Link>
          </div>
        </article>
      </div>

      <Footer />
    </main>
  );
}
