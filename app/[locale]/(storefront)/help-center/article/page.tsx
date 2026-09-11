import React from 'react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import ArticleTableOfContents, { TocItem } from '@/components/help-center/ArticleTableOfContents';

export const metadata = {
  title: 'How to Configure APN Settings on Android | Help Center | Soovia eSIM',
  description:
    'A step-by-step guide to configure APN settings on Android to fix internet connection issues in 2 minutes.',
};

const TOC_ITEMS: TocItem[] = [
  { id: 'apn-overview', title: 'Configure APN Settings on Android' },
  { id: 'step-1', title: 'Step 1: Get Your APN' },
  { id: 'step-2', title: 'Step 2: Open Android APN Settings' },
  { id: 'step-3', title: 'Step 3: Add New APN' },
  { id: 'step-4', title: 'Step 4: Select and Restart' },
  { id: 'still-not-working', title: 'Still Not Working?' },
];

export default function HelpCenterArticlePage() {
  return (
    <div className="bg-white min-h-screen flex flex-col justify-between font-sans antialiased text-[#252F4A]">
      <Navbar />

      <main className="w-full flex-grow">
        {/* Page Wrapper & Layout */}
        <div className="max-w-[1140px] mx-auto px-4 py-8 lg:py-12">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_280px] gap-12 xl:gap-16">
            
            {/* Left Main Content Column */}
            <article className="min-w-0">
              {/* 1. Top Meta Section */}
              <header className="mb-8">
                {/* Breadcrumbs */}
                <nav
                  aria-label="Breadcrumb"
                  className="text-sm font-medium text-gray-500 mb-8 flex items-center flex-wrap gap-2"
                >
                  <Link
                    href="/help-center"
                    className="hover:text-gray-900 transition-colors"
                  >
                    Help Center
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <Link
                    href="/help-center/troubleshooting"
                    className="hover:text-gray-900 transition-colors"
                  >
                    Troubleshooting
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-900 font-semibold">APN Settings</span>
                </nav>

                {/* Category Tag */}
                <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-3 block">
                  TROUBLESHOOTING
                </span>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
                  How to Configure APN Settings on Android
                </h1>

                {/* Subtitle */}
                <p className="text-base md:text-lg text-gray-500 mb-10 leading-relaxed">
                  A step-by-step guide to configure APN settings on Android to fix internet connection issues in 2 minutes.
                </p>

                <div className="w-full h-px bg-[#E8EAEF]" />
              </header>

              {/* 2. Core Content & Typography */}
              <div className="article-content">
                {/* Section Overview */}
                <section id="apn-overview" className="scroll-mt-28">
                  <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">
                    Configure APN Settings on Android
                  </h2>
                  <p className="text-base text-gray-700 leading-relaxed mb-6">
                    If you have signal bars but no internet connection, you need to configure your APN settings manually. This takes 2 minutes.
                  </p>
                </section>

                {/* Step 1 */}
                <section id="step-1" className="scroll-mt-28">
                  <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">
                    Step 1: Get Your APN
                  </h2>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-8">
                    <li>Log in to your Soovia account</li>
                    <li>
                      Go to <span className="font-semibold text-gray-900">My eSIMs → View Details</span>
                    </li>
                    <li>
                      Find your <span className="font-semibold text-gray-900">APN value</span> (shown below the QR code)
                    </li>
                    <li>Write it down or screenshot it</li>
                  </ol>
                </section>

                {/* Step 2 */}
                <section id="step-2" className="scroll-mt-28">
                  <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">
                    Step 2: Open Android APN Settings
                  </h2>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-8">
                    <li>
                      Open <span className="font-semibold text-gray-900">Settings</span>
                    </li>
                    <li>
                      Tap <span className="font-semibold text-gray-900">Network &amp; Internet</span> (or <span className="font-semibold text-gray-900">Connections</span> on Samsung)
                    </li>
                    <li>
                      Tap <span className="font-semibold text-gray-900">SIMs</span> or <span className="font-semibold text-gray-900">Mobile Networks</span>
                    </li>
                    <li>
                      Tap your <span className="font-semibold text-gray-900">eSIM</span>
                    </li>
                    <li>
                      Tap <span className="font-semibold text-gray-900">Access Point Names</span>
                    </li>
                  </ol>
                </section>

                {/* Step 3 */}
                <section id="step-3" className="scroll-mt-28">
                  <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">
                    Step 3: Add New APN
                  </h2>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
                    <li>
                      Tap the <span className="font-semibold text-gray-900">+ icon</span> (top right)
                    </li>
                    <li>
                      Fill in these fields only:
                      <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-gray-600">
                        <li>
                          <span className="font-semibold text-gray-900">Name:</span> Soovia
                        </li>
                        <li>
                          <span className="font-semibold text-gray-900">APN:</span> Your APN value (from Step 1)
                        </li>
                      </ul>
                    </li>
                    <li>Leave all other fields blank</li>
                    <li>
                      Tap <span className="font-semibold text-gray-900">⋮ (three dots) → Save</span>
                    </li>
                  </ol>

                  {/* Warning Box (Orange) */}
                  <div className="border border-[#F88B35]/30 bg-[#F88B35]/5 rounded-xl p-4 flex items-start gap-3 my-6">
                    <AlertTriangle className="w-5 h-5 text-[#F88B35] mt-0.5 shrink-0" />
                    <p className="text-sm text-[#d06d1f] font-medium leading-relaxed">
                      <span className="font-bold">Samsung users:</span> Settings → Connections → Mobile Networks → Access Point Names
                    </p>
                  </div>
                </section>

                {/* Step 4 */}
                <section id="step-4" className="scroll-mt-28">
                  <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">
                    Step 4: Select and Restart
                  </h2>
                  <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
                    <li>
                      Tap the <span className="font-semibold text-gray-900">circle/radio button</span> next to your new APN to select it
                    </li>
                    <li>Go back to Settings</li>
                    <li>Restart your Android phone</li>
                    <li>Wait 1-2 minutes</li>
                  </ol>

                  {/* Success Box (Green) */}
                  <div className="bg-[#ecfdf5] border border-[#d1fae5] rounded-xl p-4 flex items-center gap-3 my-6">
                    <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0" />
                    <p className="text-sm text-[#065f46] font-medium">
                      <span className="font-bold">Done!</span> You should see 4G/5G and have internet access. Try opening Chrome.
                    </p>
                  </div>
                </section>

                {/* 3. "Still Not Working?" Gray Box */}
                <section
                  id="still-not-working"
                  className="bg-[#F7F7F7] rounded-[20px] p-6 md:p-8 flex flex-col gap-6 mt-12 mb-12 border border-gray-100 scroll-mt-28"
                >
                  <h2 className="text-xl font-bold text-gray-900">
                    Still Not Working?
                  </h2>

                  {/* Inner Block 1 */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-bold text-gray-900">
                      Check Data Roaming
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center flex-wrap gap-2">
                      <span>Settings</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>Network &amp; Internet</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>SIMs</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>[Your eSIM]</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>
                        Turn ON <span className="font-semibold text-gray-900">Roaming</span>
                      </span>
                    </p>
                  </div>

                  <div className="w-full h-px bg-gray-200" />

                  {/* Inner Block 2 */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-bold text-gray-900">
                      Toggle Airplane Mode
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center flex-wrap gap-2">
                      <span>Turn Airplane Mode ON</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>Wait 10 seconds</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>Turn OFF</span>
                    </p>
                  </div>

                  <div className="w-full h-px bg-gray-200" />

                  {/* Inner Block 3 */}
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-bold text-gray-900">
                      Need Help?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Contact{' '}
                      <a
                        href="mailto:support@soovia.com"
                        className="text-[#F88B35] font-semibold hover:underline"
                      >
                        support@soovia.com
                      </a>{' '}
                      or use the Soovia app.
                    </p>
                  </div>
                </section>

                {/* 4. "Still have a question?" CTA Banner */}
                <div className="bg-[#F88B35] rounded-[24px] p-8 md:p-12 flex flex-col items-center text-center mt-8 shadow-md">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Still have a question?
                  </h2>
                  <p className="text-white/90 mb-8 max-w-md">
                    Our support team is here to help you 24/7.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link
                      href="/faq"
                      className="bg-white text-[#F88B35] px-8 py-3 rounded-[12px] font-bold transition-colors hover:bg-gray-50 shadow-sm"
                    >
                      FAQ
                    </Link>
                    <Link
                      href="/support"
                      className="bg-transparent border border-white text-white px-8 py-3 rounded-[12px] font-bold transition-colors hover:bg-white/10"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Right Column: Sticky Table of Contents */}
            <ArticleTableOfContents items={TOC_ITEMS} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
