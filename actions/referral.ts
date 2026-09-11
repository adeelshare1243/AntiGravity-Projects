'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ReferralStatus } from '@prisma/client';

export interface ReferralSettingsPayload {
  referralRewardAmount: number;
  referralDiscountAmount: number;
  isReferralProgramActive: boolean;
}

export interface ReferralActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch or initialize global Referral Program settings
 */
export async function getReferralSettings() {
  try {
    let settings = await prisma.referralSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!settings) {
      settings = await prisma.referralSettings.create({
        data: {
          referralRewardAmount: 5.0,
          referralDiscountAmount: 10.0,
          isReferralProgramActive: true,
        },
      });
    }

    return {
      success: true,
      data: {
        id: settings.id,
        referralRewardAmount: Number(settings.referralRewardAmount),
        referralDiscountAmount: Number(settings.referralDiscountAmount),
        isReferralProgramActive: settings.isReferralProgramActive,
      },
    };
  } catch (err: any) {
    console.error('[getReferralSettings] Error:', err);
    return { success: false, error: err?.message || 'Failed to fetch referral settings' };
  }
}

/**
 * Server Action: Update Referral Program Settings
 */
export async function updateReferralSettings(
  payload: ReferralSettingsPayload
): Promise<ReferralActionResult> {
  try {
    const reward = Number(payload.referralRewardAmount);
    const discount = Number(payload.referralDiscountAmount);

    if (isNaN(reward) || reward < 0) {
      return { success: false, error: 'Referrer reward must be a valid positive number.' };
    }

    if (isNaN(discount) || discount < 0) {
      return { success: false, error: 'Referred user discount must be a valid positive number.' };
    }

    let existing = await prisma.referralSettings.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    let updated;
    if (existing) {
      updated = await prisma.referralSettings.update({
        where: { id: existing.id },
        data: {
          referralRewardAmount: reward,
          referralDiscountAmount: discount,
          isReferralProgramActive: Boolean(payload.isReferralProgramActive),
        },
      });
    } else {
      updated = await prisma.referralSettings.create({
        data: {
          referralRewardAmount: reward,
          referralDiscountAmount: discount,
          isReferralProgramActive: Boolean(payload.isReferralProgramActive),
        },
      });
    }

    revalidatePath('/admin/referrals');
    revalidatePath('/[locale]/admin/referrals', 'page');

    return {
      success: true,
      data: {
        id: updated.id,
        referralRewardAmount: Number(updated.referralRewardAmount),
        referralDiscountAmount: Number(updated.referralDiscountAmount),
        isReferralProgramActive: updated.isReferralProgramActive,
      },
    };
  } catch (err: any) {
    console.error('[updateReferralSettings] Error:', err);
    return { success: false, error: err?.message || 'Failed to update referral settings.' };
  }
}

/**
 * Server Action: Update Referral Status (e.g. mark COMPLETED or VOIDED)
 */
export async function updateReferralStatus(
  id: string,
  status: ReferralStatus
): Promise<ReferralActionResult> {
  try {
    const updated = await prisma.referral.update({
      where: { id },
      data: { status },
    });

    revalidatePath('/admin/referrals');
    revalidatePath('/[locale]/admin/referrals', 'page');

    return { success: true, data: updated };
  } catch (err: any) {
    console.error('[updateReferralStatus] Error:', err);
    return { success: false, error: err?.message || 'Failed to update referral status.' };
  }
}
