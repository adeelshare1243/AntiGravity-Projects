'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface PaymentGatewayData {
  id?: string;
  provider: 'STRIPE' | 'PAYPAL';
  publicKey?: string | null;
  secretKey?: string | null;
  webhookSecret?: string | null;
  isActive: boolean;
  environment: string;
}

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch all payment gateways from the database
 */
export async function getPaymentGateways(): Promise<ActionResult<PaymentGatewayData[]>> {
  try {
    const gateways = await prisma.paymentGateway.findMany({
      orderBy: { provider: 'asc' },
    });

    return {
      success: true,
      data: gateways.map((g) => ({
        id: g.id,
        provider: g.provider as 'STRIPE' | 'PAYPAL',
        publicKey: g.publicKey || '',
        secretKey: g.secretKey || '',
        webhookSecret: g.webhookSecret || '',
        isActive: g.isActive,
        environment: g.environment || 'sandbox',
      })),
    };
  } catch (err: any) {
    console.error('[getPaymentGateways] Error:', err);
    return { success: false, error: err?.message || 'Failed to fetch gateways' };
  }
}

/**
 * Update or create settings for a specific Payment Gateway
 */
export async function updateGatewaySettings(
  payload: PaymentGatewayData
): Promise<ActionResult<PaymentGatewayData>> {
  try {
    const { provider, publicKey, secretKey, webhookSecret, isActive, environment } = payload;

    if (!provider || (provider !== 'STRIPE' && provider !== 'PAYPAL')) {
      return { success: false, error: 'Invalid payment provider.' };
    }

    // Upsert the gateway record in Prisma
    const updated = await prisma.paymentGateway.upsert({
      where: { provider },
      update: {
        publicKey: publicKey?.trim() || null,
        secretKey: secretKey?.trim() || null,
        webhookSecret: webhookSecret?.trim() || null,
        isActive: Boolean(isActive),
        environment: environment || 'sandbox',
      },
      create: {
        provider,
        publicKey: publicKey?.trim() || null,
        secretKey: secretKey?.trim() || null,
        webhookSecret: webhookSecret?.trim() || null,
        isActive: Boolean(isActive),
        environment: environment || 'sandbox',
      },
    });

    // Revalidate relevant paths
    revalidatePath('/admin/payment-apis');
    revalidatePath('/[locale]/admin/payment-apis');
    revalidatePath('/admin/integrations');
    revalidatePath('/[locale]/admin/integrations');

    return {
      success: true,
      data: {
        id: updated.id,
        provider: updated.provider as 'STRIPE' | 'PAYPAL',
        publicKey: updated.publicKey || '',
        secretKey: updated.secretKey || '',
        webhookSecret: updated.webhookSecret || '',
        isActive: updated.isActive,
        environment: updated.environment,
      },
    };
  } catch (err: any) {
    console.error('[updateGatewaySettings] Error:', err);
    return { success: false, error: err?.message || 'Failed to update gateway settings.' };
  }
}
