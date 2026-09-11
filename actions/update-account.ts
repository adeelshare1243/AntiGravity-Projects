'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface UpdateAccountPayload {
  name: string;
  marketingConsent: boolean;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface UpdateAccountResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function updateAccount(payload: UpdateAccountPayload): Promise<UpdateAccountResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return { success: false, error: 'Unauthorized. Please sign in to save changes.' };
    }

    const trimmedName = payload.name?.trim();
    if (!trimmedName) {
      return { success: false, error: 'Name is required.' };
    }

    // 1. Password update (optional)
    if (payload.newPassword || payload.confirmPassword) {
      if (payload.newPassword !== payload.confirmPassword) {
        return { success: false, error: 'New password and confirmation do not match.' };
      }
      if ((payload.newPassword?.length || 0) < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }

      // If current password provided, verify with signInWithPassword
      if (payload.currentPassword && authUser.email) {
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: authUser.email,
          password: payload.currentPassword,
        });
        if (verifyError) {
          return { success: false, error: 'Current password is incorrect.' };
        }
      }

      const { error: passwordError } = await supabase.auth.updateUser({
        password: payload.newPassword,
      });

      if (passwordError) {
        return { success: false, error: passwordError.message || 'Failed to update password.' };
      }
    }

    // 2. Profile & Communication update in Supabase metadata and Prisma
    await supabase.auth.updateUser({
      data: {
        full_name: trimmedName,
        name: trimmedName,
      },
    });

    await prisma.user.upsert({
      where: { id: authUser.id },
      update: {
        name: trimmedName,
        fullName: trimmedName,
        marketingConsent: Boolean(payload.marketingConsent),
      },
      create: {
        id: authUser.id,
        email: authUser.email || '',
        name: trimmedName,
        fullName: trimmedName,
        marketingConsent: Boolean(payload.marketingConsent),
      },
    });

    revalidatePath('/account');
    revalidatePath('/[locale]/account', 'page');

    return { success: true, message: 'Account settings updated successfully.' };
  } catch (error: unknown) {
    console.error('[updateAccount] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update account settings.',
    };
  }
}
