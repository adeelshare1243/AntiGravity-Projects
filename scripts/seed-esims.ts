import { prisma } from '../lib/prisma';

async function seedUserEsims() {
  const existingCount = await prisma.userEsim.count();
  if (existingCount > 0) {
    console.log(`Already have ${existingCount} eSIMs.`);
    return;
  }

  console.log('Seeding initial UserEsim records...');
  const orders = await prisma.order.findMany({
    take: 8,
    include: {
      user: true,
      package: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (orders.length === 0) {
    console.log('No orders found to associate with eSIMs.');
    return;
  }

  const sampleIccids = [
    '8944500123456789012',
    '8944500987654321098',
    '8944500554433221100',
    '8944500667788990011',
    '8944500112233445566',
    '8944500778899001122',
    '8944500334455667788',
    '8944500445566778899',
  ];

  const statuses = ['active', 'installed', 'pending', 'expired', 'active', 'installed'];

  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    const iccid = sampleIccids[i] || `8944500${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const status = statuses[i % statuses.length];
    const installed = status === 'installed' || status === 'active';

    await prisma.userEsim.create({
      data: {
        userId: order.userId,
        orderId: order.id,
        iccid,
        apn: 'globaldata',
        smdpAddress: 'rsp.esim-go.com',
        activationCode: `LPA:1$rsp.esim-go.com$${iccid.slice(-10)}`,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=LPA:1$rsp.esim-go.com$${iccid}`,
        status,
        installed,
        createdAt: new Date(Date.now() - i * 3600 * 1000 * 18),
      },
    });
  }

  console.log(`Successfully seeded ${orders.length} user eSIM profiles.`);
}

seedUserEsims()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
