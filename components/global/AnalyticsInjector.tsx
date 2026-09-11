import React from 'react';
import Script from 'next/script';
import { prisma } from '@/lib/prisma';

/**
 * Helper to strip HTML comments and <script> tags from custom script strings
 */
function cleanCustomScripts(raw?: string | null): string {
  if (!raw) return '';
  return raw
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?script[^>]*>/gi, '')
    .trim();
}

/**
 * Head-specific injector for meta verification tags
 */
export async function AnalyticsHeadInjector() {
  try {
    const settings = await prisma.analyticsSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) return null;

    const { searchConsoleTag } = settings;
    if (!searchConsoleTag) return null;

    // Extract site verification content if full meta tag was entered
    const metaMatch = searchConsoleTag?.match(/content=["']([^"']+)["']/i);
    const verificationContent = metaMatch ? metaMatch[1] : (searchConsoleTag?.startsWith('<') ? null : searchConsoleTag);

    if (!verificationContent) return null;

    return (
      <meta name="google-site-verification" content={verificationContent} />
    );
  } catch (err) {
    console.error('[AnalyticsHeadInjector] Error:', err);
    return null;
  }
}

/**
 * Main Global Analytics Injector Component
 * Renders GA4, Meta Pixel, TikTok Pixel, Google Ads, and Custom Scripts
 */
export default async function AnalyticsInjector() {
  try {
    const settings = await prisma.analyticsSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) return null;

    const {
      gaMeasurementId,
      metaPixelId,
      tiktokPixelId,
      googleAdsId,
      customHeadScripts,
    } = settings;

    const cleanedCustomScripts = cleanCustomScripts(customHeadScripts);

    return (
      <>
        {/* 1. Google Analytics (GA4) Tag */}
        {gaMeasurementId && (
          <>
            <Script
              id="ga-external"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-inline" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaMeasurementId}');`}
            </Script>
          </>
        )}

        {/* 2. Google Ads Conversion Tracking */}
        {googleAdsId && (
          <Script id="google-ads-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('config', '${googleAdsId}');`}
          </Script>
        )}

        {/* 3. Meta / Facebook Pixel */}
        {metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        {/* 4. TikTok Pixel */}
        {tiktokPixelId && (
          <Script id="tiktok-pixel" strategy="afterInteractive">
            {`
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var c=document.createElement("script");c.type="text/javascript",c.async=!0,c.src=r+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(c,a)};
                ttq.load('${tiktokPixelId}');
                ttq.page();
              }(window, document, 'ttq');
            `}
          </Script>
        )}

        {/* 5. Custom Injected Scripts */}
        {cleanedCustomScripts && (
          <Script
            id="custom-injected-scripts"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: cleanedCustomScripts }}
          />
        )}
      </>
    );
  } catch (err) {
    console.error('[AnalyticsInjector] Error:', err);
    return null;
  }
}
