'use server';

import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export interface CheckoutPayload {
  packageId?: string;
  destinationName?: string;
  packageName?: string;
  amount: number;
  currency?: string;
  locale?: string;
  origin?: string;
  userId?: string;
}

export interface CheckoutResult {
  success: boolean;
  url?: string;
  provider?: string;
  error?: string;
}

/**
 * Server Action: Process checkout by dynamically initializing Stripe or PayPal
 * using credentials fetched directly from the database.
 */
export async function processCheckout(payload: CheckoutPayload): Promise<CheckoutResult> {
  try {
    // 1. Fetch the active payment gateway from Prisma
    const gateway = await prisma.paymentGateway.findFirst({
      where: { isActive: true },
    });

    if (!gateway) {
      return {
        success: false,
        error: 'No active payment gateway is currently configured. Please configure Stripe or PayPal in the Admin Panel.',
      };
    }

    const origin = payload.origin || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const locale = payload.locale || 'en';
    const amountVal = Math.max(0.5, Number(payload.amount) || 1.0);

    // Identify customer to check and apply SooviaMoney wallet balance
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    const activeUserId = payload.userId || authUser?.id;

    let userWalletBalance = 0;
    let customerRecord: { id: string; email: string; walletBalance: number; referredBy: string | null } | null = null;

    if (activeUserId) {
      customerRecord = await prisma.user.findUnique({
        where: { id: activeUserId },
        select: { id: true, email: true, walletBalance: true, referredBy: true },
      });
      if (customerRecord) {
        userWalletBalance = customerRecord.walletBalance || 0;
      }
    }

    // 2. STRIPE CHECKOUT
    if (gateway.provider === 'STRIPE') {
      const secretKey = gateway.secretKey?.trim();
      if (!secretKey) {
        return {
          success: false,
          error: 'Stripe is marked active, but Secret Key is missing in the database. Please update settings in Admin > Payment & APIs.',
        };
      }

      // Dynamically initialize Stripe SDK with database secret key
      const stripe = new Stripe(secretKey, {
        apiVersion: '2025-02-24.acacia' as any,
      });

      // Calculate SooviaMoney wallet discount if walletBalance > 0
      let walletDiscount = 0;
      let stripeDiscounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined = undefined;

      if (userWalletBalance > 0 && customerRecord) {
        // Can apply up to cart amount
        walletDiscount = Math.min(userWalletBalance, amountVal);

        if (walletDiscount > 0) {
          const coupon = await stripe.coupons.create({
            amount_off: Math.round(walletDiscount * 100),
            currency: (payload.currency || 'usd').toLowerCase(),
            duration: 'once',
            name: `SooviaMoney Balance (-$${walletDiscount.toFixed(2)})`,
          });
          stripeDiscounts = [{ coupon: coupon.id }];

          // Update the user's Prisma walletBalance to reflect the spent amount
          await prisma.user.update({
            where: { id: customerRecord.id },
            data: {
              walletBalance: {
                decrement: walletDiscount,
              },
            },
          });
        }
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: (payload.currency || 'usd').toLowerCase(),
              product_data: {
                name: `${payload.destinationName || 'eSIM'} — ${payload.packageName || 'Data Plan'}`,
                description: `High-speed global eSIM data for ${payload.destinationName || 'eSIM'}`,
              },
              unit_amount: Math.round(amountVal * 100),
            },
            quantity: 1,
          },
        ],
        ...(stripeDiscounts ? { discounts: stripeDiscounts } : {}),
        mode: 'payment',
        success_url: `${origin}/${locale}/my-esims?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: `${origin}/${locale}/checkout?cancelled=true`,
        metadata: {
          userId: customerRecord?.id || '',
          packageId: payload.packageId || '',
          destinationName: payload.destinationName || '',
          walletDeducted: walletDiscount > 0 ? walletDiscount.toFixed(2) : '0',
          originalAmount: amountVal.toFixed(2),
        },
      });

      if (!session.url) {
        return { success: false, error: 'Failed to create Stripe checkout session.' };
      }

      return {
        success: true,
        url: session.url,
        provider: 'STRIPE',
      };
    }

    // 3. PAYPAL CHECKOUT
    if (gateway.provider === 'PAYPAL') {
      const clientId = gateway.publicKey?.trim();
      const secret = gateway.secretKey?.trim();

      if (!clientId || !secret) {
        return {
          success: false,
          error: 'PayPal is marked active, but Client ID or Secret is missing in the database. Please update settings in Admin > Payment & APIs.',
        };
      }

      const paypalBase = gateway.environment === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

      // Step A: Request PayPal OAuth token
      const basicAuth = Buffer.from(`${clientId}:${secret}`).toString('base64');
      const tokenResponse = await fetch(`${paypalBase}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        return {
          success: false,
          error: `PayPal credentials verification failed. Check Client ID and Secret in Admin. (${tokenResponse.status})`,
        };
      }

      const tokenJson = await tokenResponse.json();
      const accessToken = tokenJson.access_token;

      // Step B: Create PayPal Order
      const orderResponse = await fetch(`${paypalBase}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              description: `${payload.destinationName || 'eSIM'} — ${payload.packageName || 'Data Plan'}`,
              amount: {
                currency_code: (payload.currency || 'USD').toUpperCase(),
                value: amountVal.toFixed(2),
              },
            },
          ],
          application_context: {
            brand_name: 'Soovia eSIM',
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            return_url: `${origin}/${locale}/my-esims?paypal_success=true`,
            cancel_url: `${origin}/${locale}/checkout?paypal_cancelled=true`,
          },
        }),
      });

      if (!orderResponse.ok) {
        return {
          success: false,
          error: `Failed to create PayPal Order. Check currency and permissions. (${orderResponse.status})`,
        };
      }

      const orderJson = await orderResponse.json();
      const approvalLink = orderJson.links?.find((link: any) => link.rel === 'approve');

      if (!approvalLink?.href) {
        return {
          success: false,
          error: 'PayPal did not return an approval checkout URL.',
        };
      }

      return {
        success: true,
        url: approvalLink.href,
        provider: 'PAYPAL',
      };
    }

    return {
      success: false,
      error: `Unsupported payment provider: ${gateway.provider}`,
    };
  } catch (err: any) {
    console.error('[processCheckout] Error:', err);
    return {
      success: false,
      error: err?.message || 'An unexpected error occurred while initializing payment checkout.',
    };
  }
}

/**
 * Post-purchase Referral Reward Fulfillment
 * - Identifies buyer and checks if this is their first order
 * - If buyer has a valid referredBy code, awards $2.00 SM to the referrer
 */
export async function fulfillReferralReward(buyerId: string) {
  try {
    // 1. Fetch the user who just bought the eSIM
    const buyer = await prisma.user.findUnique({
      where: { id: buyerId },
      select: { id: true, email: true, referredBy: true },
    });

    if (!buyer || !buyer.referredBy) {
      return { success: false, reason: 'No referrer found for buyer' };
    }

    // 2. Check if this is their first order
    const completedOrdersCount = await prisma.order.count({
      where: {
        userId: buyer.id,
        status: 'COMPLETED',
      },
    });

    // Check if referral reward was already granted for this buyer
    const existingReferral = await prisma.referral.findFirst({
      where: {
        referredUserId: buyer.id,
        status: 'COMPLETED',
      },
    });

    if (existingReferral) {
      return { success: false, reason: 'Referral reward already granted' };
    }

    if (completedOrdersCount > 1) {
      return { success: false, reason: 'Not a first order' };
    }

    // 3. Find original referrer using that code
    const referrer = await prisma.user.findFirst({
      where: { referralCode: buyer.referredBy.trim().toUpperCase() },
      select: { id: true, email: true, referralCode: true, walletBalance: true },
    });

    if (!referrer || referrer.id === buyer.id) {
      return { success: false, reason: 'Referrer not found or cannot refer self' };
    }

    // 4. Determine reward amount (default $2.00)
    const settings = await prisma.referralSettings.findFirst();
    const rewardAmount = settings?.referralRewardAmount ?? 2.0;

    // 5. Use a Prisma transaction to increment referrer's walletBalance by $2.00 and log referral
    await prisma.$transaction([
      prisma.user.update({
        where: { id: referrer.id },
        data: {
          walletBalance: {
            increment: rewardAmount,
          },
        },
      }),
      prisma.referral.create({
        data: {
          referrerId: referrer.id,
          referredUserId: buyer.id,
          rewardAmount,
          status: 'COMPLETED',
        },
      }),
    ]);

    // Send/log email notification
    console.log(
      `[Referral Reward Notification] Sent to ${referrer.email}: "You earned $${rewardAmount.toFixed(2)} SM! Your invited friend ${buyer.email} made their first purchase."`
    );

    return {
      success: true,
      rewardAmount,
      referrerEmail: referrer.email,
    };
  } catch (error: any) {
    console.error('[fulfillReferralReward] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during referral reward',
    };
  }
}

/**
 * Verify and fulfill a successful Stripe checkout session idempotently
 */
export async function fulfillCheckoutSuccess(sessionId: string) {
  try {
    if (!sessionId) return { success: false, error: 'Session ID required' };

    // Check if order was already completed for this Stripe session
    const existingOrder = await prisma.order.findFirst({
      where: { stripeSessionId: sessionId },
    });

    if (existingOrder && existingOrder.status === 'COMPLETED') {
      return { success: true, alreadyFulfilled: true, orderId: existingOrder.id };
    }

    // Retrieve active Stripe gateway
    const gateway = await prisma.paymentGateway.findFirst({
      where: { provider: 'STRIPE', isActive: true },
    });

    if (!gateway?.secretKey) {
      return { success: false, error: 'Stripe gateway configuration not found' };
    }

    const stripe = new Stripe(gateway.secretKey.trim(), {
      apiVersion: '2025-02-24.acacia' as any,
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return { success: false, error: 'Payment not completed' };
    }

    const userId = session.metadata?.userId;
    const packageId = session.metadata?.packageId;
    const totalAmount = (session.amount_total || 0) / 100;
    const currency = (session.currency || 'usd').toUpperCase();

    let orderId: string | undefined = undefined;

    if (userId) {
      // Find package to link to order (if packageId is valid UUID or find default)
      let resolvedPackageId = packageId;
      if (!resolvedPackageId) {
        const fallbackPkg = await prisma.unifiedPackage.findFirst({ select: { id: true } });
        resolvedPackageId = fallbackPkg?.id;
      }

      if (resolvedPackageId) {
        const order = await prisma.order.create({
          data: {
            userId,
            packageId: resolvedPackageId,
            totalAmount,
            currency,
            status: 'COMPLETED',
            stripeSessionId: sessionId,
          },
        });
        orderId = order.id;
      }

      // Fulfill referral reward for first-time purchases
      await fulfillReferralReward(userId);
    }

    return { success: true, orderId };
  } catch (err: any) {
    console.error('[fulfillCheckoutSuccess] Error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown fulfillment error',
    };
  }
}
