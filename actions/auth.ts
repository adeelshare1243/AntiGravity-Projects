'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface AuthResult {
  success: boolean;
  message?: string;
}

/**
 * Server Action: Authenticate an Administrator
 */
export async function authenticateAdmin(
  email: string,
  password: string
): Promise<AuthResult> {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return { success: false, message: 'Email and password are required.' };
  }

  try {
    // 1. Query Prisma to verify user exists in AdminUser table
    let adminUser = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    // If no admin users exist in database yet, seed the first user as SUPERADMIN
    if (!adminUser && (await prisma.adminUser.count()) === 0) {
      adminUser = await prisma.adminUser.create({
        data: {
          email: normalizedEmail,
          firstName: 'Super',
          lastName: 'Admin',
          role: 'SUPERADMIN',
          lastActive: new Date(),
        },
      });
    }

    if (!adminUser) {
      return { success: false, message: 'Invalid email or password' };
    }

    // 2. Authenticate credentials via Supabase Auth
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data?.user) {
      return {
        success: false,
        message: error?.message || 'Invalid email or password',
      };
    }

    // 3. Update admin user's lastActive timestamp
    await prisma.adminUser
      .update({
        where: { id: adminUser.id },
        data: { lastActive: new Date() },
      })
      .catch(() => {});

    revalidatePath('/admin', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('[authenticateAdmin] Error:', error);
    return {
      success: false,
      message: error?.message || 'An unexpected error occurred during authentication.',
    };
  }
}
