'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface AnalyticsSettingsPayload {
  gaMeasurementId?: string | null;
  metaPixelId?: string | null;
  tiktokPixelId?: string | null;
  googleAdsId?: string | null;
  searchConsoleTag?: string | null;
  customHeadScripts?: string | null;
}

export interface AnalyticsActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch singleton Analytics & Tracking Settings
 */
export async function getAnalyticsSettings(): Promise<AnalyticsActionResult<AnalyticsSettingsPayload>> {
  try {
    let settings = await prisma.analyticsSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.analyticsSettings.create({
        data: {
          id: 'default',
        },
      });
    }

    return {
      success: true,
      data: {
        gaMeasurementId: settings.gaMeasurementId || '',
        metaPixelId: settings.metaPixelId || '',
        tiktokPixelId: settings.tiktokPixelId || '',
        googleAdsId: settings.googleAdsId || '',
        searchConsoleTag: settings.searchConsoleTag || '',
        customHeadScripts: settings.customHeadScripts || '',
      },
    };
  } catch (err: any) {
    console.error('[getAnalyticsSettings] Error:', err);
    return { success: false, error: err?.message || 'Failed to fetch analytics settings.' };
  }
}

/**
 * Server Action: Update or Upsert Analytics & Tracking Settings
 */
export async function updateAnalyticsSettings(
  payload: AnalyticsSettingsPayload
): Promise<AnalyticsActionResult<AnalyticsSettingsPayload>> {
  try {
    const updated = await prisma.analyticsSettings.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        gaMeasurementId: payload.gaMeasurementId?.trim() || null,
        metaPixelId: payload.metaPixelId?.trim() || null,
        tiktokPixelId: payload.tiktokPixelId?.trim() || null,
        googleAdsId: payload.googleAdsId?.trim() || null,
        searchConsoleTag: payload.searchConsoleTag?.trim() || null,
        customHeadScripts: payload.customHeadScripts?.trim() || null,
      },
      update: {
        gaMeasurementId: payload.gaMeasurementId?.trim() || null,
        metaPixelId: payload.metaPixelId?.trim() || null,
        tiktokPixelId: payload.tiktokPixelId?.trim() || null,
        googleAdsId: payload.googleAdsId?.trim() || null,
        searchConsoleTag: payload.searchConsoleTag?.trim() || null,
        customHeadScripts: payload.customHeadScripts?.trim() || null,
      },
    });

    // Revalidate whole site layout so injector reflects new scripts immediately
    revalidatePath('/', 'layout');
    revalidatePath('/[locale]', 'layout');
    revalidatePath('/admin/scripts');
    revalidatePath('/[locale]/admin/scripts', 'page');

    return {
      success: true,
      data: {
        gaMeasurementId: updated.gaMeasurementId || '',
        metaPixelId: updated.metaPixelId || '',
        tiktokPixelId: updated.tiktokPixelId || '',
        googleAdsId: updated.googleAdsId || '',
        searchConsoleTag: updated.searchConsoleTag || '',
        customHeadScripts: updated.customHeadScripts || '',
      },
    };
  } catch (err: any) {
    console.error('[updateAnalyticsSettings] Error:', err);
    return { success: false, error: err?.message || 'Failed to save analytics settings.' };
  }
}
