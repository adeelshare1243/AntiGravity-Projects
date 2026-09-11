import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PromoCodeForm from '@/components/admin/PromoCodeForm';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function EditPromoCodePage({ params }: Props) {
  const { locale, id } = await params;

  const promo = await prisma.promoCode.findUnique({
    where: { id },
  });

  if (!promo) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          !
        </div>
        <h2 className="text-xl font-bold text-gray-900">Promo Code Not Found</h2>
        <p className="text-sm text-gray-500">
          The requested promo code could not be found or has been deleted.
        </p>
        <Link
          href={`/${locale}/admin/promo-codes`}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#F88B35] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Promo Codes
        </Link>
      </div>
    );
  }

  return (
    <PromoCodeForm
      initialData={{
        id: promo.id,
        code: promo.code,
        type: promo.type,
        discountValue: promo.discountValue,
        maxUses: promo.maxUses,
        startDate: promo.startDate,
        endDate: promo.endDate,
        isActive: promo.isActive,
      }}
    />
  );
}
