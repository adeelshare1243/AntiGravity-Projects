import React from 'react';
import Link from 'next/link';
import { ChevronRight, CreditCard, ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import PaymentGatewayCard from '@/components/admin/PaymentGatewayCard';
import { PaymentGatewayData } from '@/actions/payment-gateway';

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function PaymentApisPage({ params }: Props) {
  const { locale } = await params;

  // Query payment gateway settings from the database
  const gateways = await prisma.paymentGateway.findMany();

  const stripeData: PaymentGatewayData = {
    id: gateways.find((g) => g.provider === 'STRIPE')?.id,
    provider: 'STRIPE',
    publicKey: gateways.find((g) => g.provider === 'STRIPE')?.publicKey || '',
    secretKey: gateways.find((g) => g.provider === 'STRIPE')?.secretKey || '',
    webhookSecret: gateways.find((g) => g.provider === 'STRIPE')?.webhookSecret || '',
    isActive: gateways.find((g) => g.provider === 'STRIPE')?.isActive ?? true,
    environment: gateways.find((g) => g.provider === 'STRIPE')?.environment || 'sandbox',
  };

  const paypalData: PaymentGatewayData = {
    id: gateways.find((g) => g.provider === 'PAYPAL')?.id,
    provider: 'PAYPAL',
    publicKey: gateways.find((g) => g.provider === 'PAYPAL')?.publicKey || '',
    secretKey: gateways.find((g) => g.provider === 'PAYPAL')?.secretKey || '',
    webhookSecret: gateways.find((g) => g.provider === 'PAYPAL')?.webhookSecret || '',
    isActive: gateways.find((g) => g.provider === 'PAYPAL')?.isActive ?? false,
    environment: gateways.find((g) => g.provider === 'PAYPAL')?.environment || 'sandbox',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Breadcrumbs */}
      <div>
        <nav
          aria-label="Breadcrumb"
          className="text-sm font-medium text-gray-500 flex items-center gap-1.5"
        >
          <Link
            href={`/${locale}/admin`}
            className="hover:text-gray-900 transition-colors"
          >
            Admin
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-900 font-semibold">Payment &amp; APIs</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">
          Payment &amp; APIs Configuration
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage database-stored credentials for Stripe and PayPal, toggle environments between sandbox and production, and control active checkout payment gateways.
        </p>
      </div>

      {/* Gateway Cards Grid */}
      <div className="space-y-6">
        {/* Stripe Configuration Card */}
        <PaymentGatewayCard
          initialData={stripeData}
          title="Stripe Configuration"
          subtitle="Accept Visa, MasterCard, American Express, Apple Pay, and Google Pay."
          publicKeyLabel="Publishable Key (pk_test / pk_live)"
          publicKeyPlaceholder="pk_test_..."
          secretKeyLabel="Secret Key (sk_test / sk_live)"
          secretKeyPlaceholder="sk_test_..."
          webhookSecretPlaceholder="whsec_..."
          badgeIcon={
            <div className="w-10 h-10 rounded-lg bg-[#635BFF]/10 border border-[#635BFF]/20 text-[#635BFF] flex items-center justify-center font-black text-sm">
              S
            </div>
          }
        />

        {/* PayPal Configuration Card */}
        <PaymentGatewayCard
          initialData={paypalData}
          title="PayPal Configuration"
          subtitle="Accept PayPal Wallet balances, Pay in 4 installments, and local PayPal payment options."
          publicKeyLabel="Client ID"
          publicKeyPlaceholder="AYSq3RDG5SVI8mTUUWq..."
          secretKeyLabel="Secret Key"
          secretKeyPlaceholder="EDlGOX2CJA58z..."
          webhookSecretPlaceholder="WH-..."
          badgeIcon={
            <div className="w-10 h-10 rounded-lg bg-[#003087]/10 border border-[#003087]/20 text-[#003087] flex items-center justify-center font-black text-sm">
              P
            </div>
          }
        />
      </div>
    </div>
  );
}
