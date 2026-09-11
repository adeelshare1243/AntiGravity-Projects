'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface AdminAuthResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action: Authenticate an Administrator
 * 1. Authenticates credentials via Supabase Auth.
 * 2. Strictly verifies admin privileges in Prisma's AdminUser table.
 * 3. Immediately signs out unauthorized users to revoke the session.
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<AdminAuthResult> {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const supabase = await createClient();

    // 1. Authenticate credentials via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data?.user) {
      return {
        success: false,
        error: error?.message || 'Invalid login credentials.',
      };
    }

    const userId = data.user.id;

    // 2. Query Prisma to verify user exists in AdminUser table
    let adminUser = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: normalizedEmail },
        ],
      },
    });

    // If no admin users exist yet in database, seed this first user as SUPERADMIN
    if (!adminUser && (await prisma.adminUser.count()) === 0) {
      adminUser = await prisma.adminUser.create({
        data: {
          id: userId,
          email: normalizedEmail,
          firstName: 'Super',
          lastName: 'Admin',
          role: 'SUPERADMIN',
          lastActive: new Date(),
        },
      });
    }

    // 3. Role authorization check: Revoke session if user is not an administrator
    if (!adminUser) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'Unauthorized: Admin access required.',
      };
    }

    // 4. Update admin user's lastActive timestamp & sync user ID if needed
    await prisma.adminUser
      .update({
        where: { id: adminUser.id },
        data: {
          id: userId,
          lastActive: new Date(),
        },
      })
      .catch(() => {
        return prisma.adminUser
          .update({
            where: { id: adminUser.id },
            data: { lastActive: new Date() },
          })
          .catch(() => {});
      });

    revalidatePath('/admin', 'layout');
    revalidatePath('/[locale]/admin', 'layout');

    return { success: true };
  } catch (err: unknown) {
    console.error('[loginAdmin] Error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'An unexpected error occurred during authentication.',
    };
  }
}

/**
 * Backward compatibility alias
 */
export async function authenticateAdmin(email: string, password: string) {
  const res = await loginAdmin(email, password);
  return {
    success: res.success,
    message: res.error,
  };
}
