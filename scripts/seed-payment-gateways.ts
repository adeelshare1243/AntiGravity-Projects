import { prisma } from '../lib/prisma';

async function main() {
  console.log('Seeding PaymentGateway records...');

  const stripe = await prisma.paymentGateway.upsert({
    where: { provider: 'STRIPE' },
    update: {},
    create: {
      provider: 'STRIPE',
      publicKey: '',
      secretKey: '',
      webhookSecret: '',
      isActive: true,
      environment: 'sandbox',
    },
  });

  const paypal = await prisma.paymentGateway.upsert({
    where: { provider: 'PAYPAL' },
    update: {},
    create: {
      provider: 'PAYPAL',
      publicKey: '',
      secretKey: '',
      webhookSecret: '',
      isActive: false,
      environment: 'sandbox',
    },
  });

  console.log('Seeded gateways:', { stripe: stripe.provider, paypal: paypal.provider });
}

main()
  .catch((e) => {
    console.error('Error seeding gateways:', e);
  })
  .finally(() => prisma.$disconnect());
