import React from 'react';
import { prisma } from '@/lib/prisma';
import ReferralsClient from '@/components/admin/ReferralsClient';

export const dynamic = 'force-dynamic';

export default async function AdminReferralsPage() {
  // 1. Fetch or initialize settings
  let settings = await prisma.referralSettings.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  if (!settings) {
    settings = await prisma.referralSettings.create({
      data: {
        referralRewardAmount: 5.0,
        referralDiscountAmount: 10.0,
        isReferralProgramActive: true,
      },
    });
  }

  // 2. Fetch all referrals with relational user details
  const referrals = await prisma.referral.findMany({
    include: {
      referrer: {
        select: { id: true, name: true, email: true },
      },
      referredUser: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <ReferralsClient
      initialReferrals={referrals}
      settings={{
        referralRewardAmount: Number(settings.referralRewardAmount),
        referralDiscountAmount: Number(settings.referralDiscountAmount),
        isReferralProgramActive: settings.isReferralProgramActive,
      }}
    />
  );
}
