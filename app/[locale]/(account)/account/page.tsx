import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AccountSettingsForm from '@/components/account/AccountSettingsForm';

export const metadata = {
  title: 'Account Settings | Soovia eSIM',
  description: 'Manage your account profile, communication preferences, and security settings.',
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  // Query Prisma for the user's profile and order count
  let user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });

  // If user record doesn't exist yet in public.User, initialize it
  if (!user) {
    const rawName =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      authUser.email?.split('@')[0] ||
      'User';

    user = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email!,
        name: rawName,
        fullName: rawName,
        authProvider: authUser.app_metadata?.provider || 'email',
        status: 'ACTIVE',
      },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });
  }

  const userData = {
    id: user.id,
    name: user.fullName || user.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
    email: user.email || authUser.email || '',
    marketingConsent: Boolean(user.marketingConsent),
    orderCount: user._count?.orders ?? 0,
  };

  return <AccountSettingsForm user={userData} />;
}
