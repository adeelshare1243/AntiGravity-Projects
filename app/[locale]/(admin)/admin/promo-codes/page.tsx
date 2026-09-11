import React from 'react';
import { prisma } from '@/lib/prisma';
import PromoCodesClient from '@/components/admin/PromoCodesClient';

export const dynamic = 'force-dynamic';

export default async function AdminPromoCodesPage() {
  const promoCodes = await prisma.promoCode.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <PromoCodesClient initialCodes={promoCodes} />;
}
