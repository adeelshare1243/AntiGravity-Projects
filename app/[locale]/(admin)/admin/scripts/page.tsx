'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Code2, Activity, ShieldCheck, Loader2 } from 'lucide-react';
import { getAnalyticsSettings, updateAnalyticsSettings } from '@/actions/analytics';

export default function AnalyticsScriptsPage() {
  const [ga4Id, setGa4Id] = useState('');
  const [metaPixelId, setMetaPixelId] = useState('');
  const [tiktokPixelId, setTiktokPixelId] = useState('');
  const [googleAdsId, setGoogleAdsId] = useState('');
  const [searchConsoleTag, setSearchConsoleTag] = useState('');
  const [customHeadScripts, setCustomHeadScripts] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  // Load database settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await getAnalyticsSettings();
        if (res.success && res.data) {
          setGa4Id(res.data.gaMeasurementId || '');
          setMetaPixelId(res.data.metaPixelId || '');
          setTiktokPixelId(res.data.tiktokPixelId || '');
          setGoogleAdsId(res.data.googleAdsId || '');
          setSearchConsoleTag(res.data.searchConsoleTag || '');
          setCustomHeadScripts(res.data.customHeadScripts || '');
        }
      } catch (err) {
        console.error('Failed to load analytics settings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedStatus(null);

    try {
      const res = await updateAnalyticsSettings({
        gaMeasurementId: ga4Id,
        metaPixelId,
        tiktokPixelId,
        googleAdsId,
        searchConsoleTag,
        customHeadScripts,
      });

      if (res.success) {
        setSavedStatus('Changes saved successfully');
        setTimeout(() => {
          setSavedStatus(null);
        }, 3000);
      } else {
        alert(res.error || 'Failed to save analytics settings.');
      }
    } catch (err: any) {
      alert(err?.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Analytics &amp; Scripts
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure conversion tracking, marketing pixels, and custom third-party tags.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedStatus && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              {savedStatus}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="bg-[#F88B35] hover:bg-[#e07a2f] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 items-start">
        {/* Left Column (Context - col-span-1) */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFF9F5] border border-[#F88B35]/20 flex items-center justify-center text-[#F88B35]">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-gray-900">
              Tracking &amp; Privacy
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Manage your tracking pixels and analytics tools. Enter the specific Measurement IDs for native integrations, or use the custom scripts box for third-party tools.
            </p>
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>GDPR &amp; Cookie Consent compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#F88B35] shrink-0" />
                <span>Asynchronous script injection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Inputs - col-span-2 flex flex-col gap-6) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          {/* Card 1: Native Integrations */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <h2 className="font-bold text-gray-900 text-base">
              Standard Tracking IDs
            </h2>

            <div className="space-y-4">
              {/* Input 1: GA4 */}
              <div>
                <label
                  htmlFor="ga4-id"
                  className="text-xs font-bold text-gray-700 mb-1.5 block"
                >
                  Google Analytics (GA4) Measurement ID
                </label>
                <input
                  id="ga4-id"
                  type="text"
                  value={ga4Id}
                  onChange={(e) => setGa4Id(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 text-sm transition-all outline-none font-mono text-gray-600"
                />
              </div>

              {/* Input 2: Meta */}
              <div>
                <label
                  htmlFor="meta-pixel"
                  className="text-xs font-bold text-gray-700 mb-1.5 block"
                >
                  Meta / Facebook Pixel ID
                </label>
                <input
                  id="meta-pixel"
                  type="text"
                  value={metaPixelId}
                  onChange={(e) => setMetaPixelId(e.target.value)}
                  placeholder="123456789012345"
                  className="w-full bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 text-sm transition-all outline-none font-mono text-gray-600"
                />
              </div>

              {/* Input 3: TikTok */}
              <div>
                <label
                  htmlFor="tiktok-pixel"
                  className="text-xs font-bold text-gray-700 mb-1.5 block"
                >
                  TikTok Pixel ID
                </label>
                <input
                  id="tiktok-pixel"
                  type="text"
                  value={tiktokPixelId}
                  onChange={(e) => setTiktokPixelId(e.target.value)}
                  placeholder="e.g. C8X9L2K34M1N0P"
                  className="w-full bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 text-sm transition-all outline-none font-mono text-gray-600"
                />
              </div>

              {/* Input 4: Google Ads */}
              <div>
                <label
                  htmlFor="google-ads"
                  className="text-xs font-bold text-gray-700 mb-1.5 block"
                >
                  Google Ads Conversion ID
                </label>
                <input
                  id="google-ads"
                  type="text"
                  value={googleAdsId}
                  onChange={(e) => setGoogleAdsId(e.target.value)}
                  placeholder="e.g. AW-1234567890"
                  className="w-full bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 text-sm transition-all outline-none font-mono text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Webmaster Tools */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 text-base mb-4">
              Search Console Verification
            </h2>

            <div>
              <label
                htmlFor="search-console-tag"
                className="text-xs font-bold text-gray-700 mb-1.5 block"
              >
                Google Search Console HTML Tag
              </label>
              <input
                id="search-console-tag"
                type="text"
                value={searchConsoleTag}
                onChange={(e) => setSearchConsoleTag(e.target.value)}
                placeholder='<meta name="google-site-verification" content="..." />'
                className="w-full bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-2.5 text-sm transition-all outline-none font-mono text-gray-600"
              />
            </div>
          </div>

          {/* Card 3: Custom Header Scripts */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 text-base">
              Custom &lt;head&gt; Scripts
            </h2>
            <p className="text-xs text-gray-500 mb-3 mt-1">
              Inject custom JavaScript or CSS globally.
            </p>

            <textarea
              value={customHeadScripts}
              onChange={(e) => setCustomHeadScripts(e.target.value)}
              placeholder="<!-- Paste custom scripts here -->"
              rows={8}
              className="w-full bg-[#F7F7F7] border border-transparent focus:border-[#F88B35] focus:bg-white rounded-lg p-3 text-sm transition-all outline-none font-mono text-gray-600 h-48 resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
