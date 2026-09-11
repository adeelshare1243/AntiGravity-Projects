import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { fulfillReferralReward } from '@/actions/checkout';

/**
 * Stripe Webhook Handler
 * Listens for checkout.session.completed event and fulfills orders and referral rewards
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');

    // Retrieve active Stripe gateway credentials
    const gateway = await prisma.paymentGateway.findFirst({
      where: { provider: 'STRIPE', isActive: true },
    });

    if (!gateway?.secretKey) {
      return NextResponse.json(
        { error: 'Stripe gateway configuration not found or inactive.' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(gateway.secretKey.trim(), {
      apiVersion: '2025-02-24.acacia' as any,
    });

    let event: Stripe.Event;

    // Verify webhook signature if webhookSecret is configured
    if (signature && gateway.webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          signature,
          gateway.webhookSecret.trim()
        );
      } catch (err: any) {
        console.error('[Stripe Webhook] Signature verification failed:', err.message);
        return NextResponse.json(
          { error: `Webhook signature verification failed: ${err.message}` },
          { status: 400 }
        );
      }
    } else {
      event = JSON.parse(rawBody) as Stripe.Event;
    }

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const packageId = session.metadata?.packageId;
      const totalAmount = (session.amount_total || 0) / 100;
      const currency = (session.currency || 'usd').toUpperCase();

      // Check if order was already recorded (idempotency guard)
      const existingOrder = await prisma.order.findFirst({
        where: { stripeSessionId: session.id },
      });

      if (!existingOrder && userId) {
        let resolvedPackageId = packageId;
        if (!resolvedPackageId) {
          const fallbackPkg = await prisma.unifiedPackage.findFirst({
            select: { id: true },
          });
          resolvedPackageId = fallbackPkg?.id;
        }

        if (resolvedPackageId) {
          await prisma.order.create({
            data: {
              userId,
              packageId: resolvedPackageId,
              totalAmount,
              currency,
              status: 'COMPLETED',
              stripeSessionId: session.id,
            },
          });
        }

        // Fulfill referral reward for first-time buyer
        await fulfillReferralReward(userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Stripe Webhook] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Webhook Error' },
      { status: 500 }
    );
  }
}
