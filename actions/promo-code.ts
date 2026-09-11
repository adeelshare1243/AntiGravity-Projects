'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { DiscountType } from '@prisma/client';

export interface PromoCodePayload {
  code: string;
  type: DiscountType;
  discountValue: number;
  maxUses?: number | null;
  startDate?: string | Date;
  endDate?: string | Date | null;
  isActive?: boolean;
}

export interface PromoActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Validate promo code string: must be uppercase, no whitespace
 */
function validateCodeFormat(code: string): { valid: boolean; normalized: string; error?: string } {
  const trimmed = code.trim();
  if (!trimmed) {
    return { valid: false, normalized: '', error: 'Promo code cannot be empty.' };
  }
  if (/\s/.test(trimmed)) {
    return { valid: false, normalized: '', error: 'Promo code cannot contain any spaces.' };
  }
  const normalized = trimmed.toUpperCase();
  if (!/^[A-Z0-9_\-]+$/.test(normalized)) {
    return { valid: false, normalized, error: 'Promo code can only contain letters, numbers, hyphens, and underscores.' };
  }
  return { valid: true, normalized };
}

/**
 * Server Action: Create Promo Code
 */
export async function createPromoCode(payload: PromoCodePayload): Promise<PromoActionResult> {
  try {
    const { valid, normalized, error } = validateCodeFormat(payload.code);
    if (!valid) {
      return { success: false, error };
    }

    if (!payload.discountValue || Number(payload.discountValue) <= 0) {
      return { success: false, error: 'Discount value must be greater than 0.' };
    }

    if (payload.type === DiscountType.PERCENTAGE && Number(payload.discountValue) > 100) {
      return { success: false, error: 'Percentage discount cannot exceed 100%.' };
    }

    const existing = await prisma.promoCode.findUnique({
      where: { code: normalized },
    });

    if (existing) {
      return { success: false, error: `Promo code "${normalized}" already exists.` };
    }

    const promoCode = await prisma.promoCode.create({
      data: {
        code: normalized,
        type: payload.type,
        discountValue: Number(payload.discountValue),
        maxUses: payload.maxUses ? Number(payload.maxUses) : null,
        startDate: payload.startDate ? new Date(payload.startDate) : new Date(),
        endDate: payload.endDate ? new Date(payload.endDate) : null,
        isActive: payload.isActive ?? true,
      },
    });

    revalidatePath('/admin/promo-codes');
    revalidatePath('/[locale]/admin/promo-codes', 'page');

    return { success: true, data: promoCode };
  } catch (err: any) {
    console.error('[createPromoCode] Error:', err);
    return { success: false, error: err?.message || 'Failed to create promo code.' };
  }
}

/**
 * Server Action: Update Promo Code
 */
export async function updatePromoCode(id: string, payload: PromoCodePayload): Promise<PromoActionResult> {
  try {
    if (!id) {
      return { success: false, error: 'Missing promo code ID.' };
    }

    const { valid, normalized, error } = validateCodeFormat(payload.code);
    if (!valid) {
      return { success: false, error };
    }

    if (!payload.discountValue || Number(payload.discountValue) <= 0) {
      return { success: false, error: 'Discount value must be greater than 0.' };
    }

    if (payload.type === DiscountType.PERCENTAGE && Number(payload.discountValue) > 100) {
      return { success: false, error: 'Percentage discount cannot exceed 100%.' };
    }

    // Check duplicate code if code was changed
    const existing = await prisma.promoCode.findFirst({
      where: {
        code: normalized,
        NOT: { id },
      },
    });

    if (existing) {
      return { success: false, error: `Promo code "${normalized}" is already taken by another entry.` };
    }

    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: {
        code: normalized,
        type: payload.type,
        discountValue: Number(payload.discountValue),
        maxUses: payload.maxUses ? Number(payload.maxUses) : null,
        startDate: payload.startDate ? new Date(payload.startDate) : undefined,
        endDate: payload.endDate ? new Date(payload.endDate) : null,
        isActive: payload.isActive ?? true,
      },
    });

    revalidatePath('/admin/promo-codes');
    revalidatePath('/[locale]/admin/promo-codes', 'page');

    return { success: true, data: promoCode };
  } catch (err: any) {
    console.error('[updatePromoCode] Error:', err);
    return { success: false, error: err?.message || 'Failed to update promo code.' };
  }
}

/**
 * Server Action: Delete Promo Code
 */
export async function deletePromoCode(id: string): Promise<PromoActionResult> {
  try {
    if (!id) {
      return { success: false, error: 'Missing promo code ID.' };
    }

    await prisma.promoCode.delete({
      where: { id },
    });

    revalidatePath('/admin/promo-codes');
    revalidatePath('/[locale]/admin/promo-codes', 'page');

    return { success: true };
  } catch (err: any) {
    console.error('[deletePromoCode] Error:', err);
    return { success: false, error: err?.message || 'Failed to delete promo code.' };
  }
}

/**
 * Fetch Promo Code by ID for edit form
 */
export async function getPromoCodeById(id: string) {
  try {
    const promo = await prisma.promoCode.findUnique({
      where: { id },
    });
    return promo;
  } catch (err) {
    console.error('[getPromoCodeById] Error:', err);
    return null;
  }
}
