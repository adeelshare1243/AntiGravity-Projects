'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export interface CustomerAuthResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action: Register a new customer
 * Sanitized to return only serializable string errors and simple success payloads
 */
export async function registerCustomer(
  fullName: string,
  email: string,
  password: string,
  marketingConsent: boolean = false,
  referredBy?: string
): Promise<CustomerAuthResult> {
  const normalizedEmail = email?.trim().toLowerCase();
  const trimmedName = fullName?.trim();

  if (!trimmedName || !normalizedEmail || !password) {
    return { success: false, error: 'Full name, email, and password are required.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  try {
    const supabase = await createClient();

    // 1. Call the Supabase Auth client to register the credentials
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: trimmedName,
        },
      },
    });

    // 2. If there is an auth error, return the string message to the client
    if (error) {
      return {
        success: false,
        error: error.message || 'Registration failed.',
      };
    }

    if (!data?.user) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }

    // 3. Extract the newly created secure data.user.id
    const userId = data.user.id;

    // 4. Validate referredBy code if provided
    let validReferrerCode: string | null = null;
    if (referredBy?.trim()) {
      const cleanRef = referredBy.trim().toUpperCase();
      const referrer = await prisma.user.findFirst({
        where: { referralCode: cleanRef },
        select: { referralCode: true },
      });
      if (referrer?.referralCode) {
        validReferrerCode = referrer.referralCode;
      }
    }

    // 5. Use Prisma to create the public profile record using that exact ID
    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          email: normalizedEmail,
          name: trimmedName,
          fullName: trimmedName,
          authProvider: 'email',
          marketingConsent: Boolean(marketingConsent),
          status: 'ACTIVE',
          ...(validReferrerCode ? { referredBy: validReferrerCode } : {}),
        },
        create: {
          id: userId,
          email: normalizedEmail,
          name: trimmedName,
          fullName: trimmedName,
          authProvider: 'email',
          marketingConsent: Boolean(marketingConsent),
          status: 'ACTIVE',
          referredBy: validReferrerCode,
        },
      });
    } catch (dbErr) {
      console.error('[registerCustomer] Database profile sync warning:', dbErr);
    }

    // 6. Return a success object
    return { success: true };
  } catch (error: unknown) {
    console.error('[registerCustomer] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Server Action: Log in an existing customer
 * Sanitized to return only serializable string errors and simple success payloads
 */
export async function loginCustomer(
  email: string,
  password: string
): Promise<CustomerAuthResult> {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const supabase = await createClient();

    // 1. Authenticate credentials via Supabase Auth (sets HTTP-only session cookie)
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (authError || !data?.user) {
      return {
        success: false,
        error: authError?.message || 'Invalid email or password',
      };
    }

    // 2. Ensure Prisma customer profile exists
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!existingUser) {
        const userMetaName = data.user.user_metadata?.full_name || data.user.user_metadata?.name;
        await prisma.user.create({
          data: {
            id: data.user.id,
            email: normalizedEmail,
            name: userMetaName || normalizedEmail.split('@')[0],
            fullName: userMetaName || normalizedEmail.split('@')[0],
            authProvider: 'email',
            status: 'ACTIVE',
          },
        });
      }
    } catch (dbErr) {
      console.error('[loginCustomer] Database profile sync warning:', dbErr);
    }

    // Return strictly a simple serializable object without raw user or Date objects
    return { success: true };
  } catch (error: unknown) {
    console.error('[loginCustomer] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * Server Action: Log out the active customer session
 */
export async function logoutCustomer(): Promise<CustomerAuthResult> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return { success: true };
  } catch (error: unknown) {
    console.error('[logoutCustomer] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
