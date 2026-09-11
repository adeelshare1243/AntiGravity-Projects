'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { AdminRole } from '@prisma/client';

export interface TeamMemberPayload {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: AdminRole;
  permissions?: Record<string, boolean>;
}

export interface TeamMemberResult {
  success: boolean;
  user?: any;
  error?: string;
}

/**
 * Server Action: Create a new Team Member
 */
export async function createTeamMember(
  data: TeamMemberPayload
): Promise<TeamMemberResult> {
  const normalizedEmail = data.email?.toLowerCase().trim();

  if (!normalizedEmail || !data.firstName || !data.lastName) {
    return { success: false, error: 'First name, last name, and email are required.' };
  }

  try {
    // 1. Check if user already exists in AdminUser table
    const existing = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return { success: false, error: 'An admin member with this email already exists.' };
    }

    // 2. If password provided, register in Supabase Auth
    if (data.password) {
      try {
        const supabase = await createClient();
        await supabase.auth.signUp({
          email: normalizedEmail,
          password: data.password,
          options: {
            data: {
              first_name: data.firstName.trim(),
              last_name: data.lastName.trim(),
              role: data.role,
            },
          },
        });
      } catch (authErr) {
        console.warn('[createTeamMember] Supabase Auth sign up warning:', authErr);
      }
    }

    // 3. Create AdminUser in Prisma
    const user = await prisma.adminUser.create({
      data: {
        email: normalizedEmail,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        role: data.role || AdminRole.SUPPORT,
        permissions: data.permissions || undefined,
        lastActive: new Date(),
      },
    });

    revalidatePath('/admin/team-roles');
    revalidatePath('/[locale]/admin/team-roles');
    return { success: true, user };
  } catch (error: any) {
    console.error('[createTeamMember] Error:', error);
    return { success: false, error: error?.message || 'Failed to create team member.' };
  }
}

/**
 * Server Action: Update an existing Team Member
 */
export async function updateTeamMember(
  id: string,
  data: Partial<TeamMemberPayload>
): Promise<TeamMemberResult> {
  if (!id) {
    return { success: false, error: 'User ID is required.' };
  }

  try {
    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: 'Team member not found.' };
    }

    const normalizedEmail = data.email ? data.email.toLowerCase().trim() : existing.email;

    // Check email collision if email changed
    if (normalizedEmail !== existing.email) {
      const collision = await prisma.adminUser.findUnique({
        where: { email: normalizedEmail },
      });
      if (collision) {
        return { success: false, error: 'This email is already in use by another member.' };
      }
    }

    // If password provided, update credentials in Supabase Auth
    if (data.password) {
      try {
        const supabase = await createClient();
        // Update user if session is available or via admin
        await supabase.auth.updateUser({
          password: data.password,
        }).catch((e) => console.warn('[updateTeamMember] Supabase Auth update warning:', e));
      } catch (authErr) {
        console.warn('[updateTeamMember] Supabase Auth password update warning:', authErr);
      }
    }

    // Update in Prisma
    const updatePayload: any = {};
    if (data.firstName !== undefined) updatePayload.firstName = data.firstName.trim();
    if (data.lastName !== undefined) updatePayload.lastName = data.lastName.trim();
    if (data.email !== undefined) updatePayload.email = normalizedEmail;
    if (data.role !== undefined) updatePayload.role = data.role;
    if (data.permissions !== undefined) updatePayload.permissions = data.permissions;

    const user = await prisma.adminUser.update({
      where: { id },
      data: updatePayload,
    });

    revalidatePath('/admin/team-roles');
    revalidatePath('/[locale]/admin/team-roles');
    return { success: true, user };
  } catch (error: any) {
    console.error('[updateTeamMember] Error:', error);
    return { success: false, error: error?.message || 'Failed to update team member.' };
  }
}
