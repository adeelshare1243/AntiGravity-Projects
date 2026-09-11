import { prisma } from '../lib/prisma';

async function seedCustomers() {
  const existingCount = await prisma.user.count();
  if (existingCount > 0) {
    console.log(`Already have ${existingCount} customers.`);
    return;
  }

  console.log('Seeding initial customers...');
  const pkg = await prisma.unifiedPackage.findFirst();

  const usersData = [
    {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      authProvider: 'email',
    },
    {
      name: 'Marcus Vance',
      email: 'marcus.v@globetrotter.io',
      authProvider: 'google',
    },
    {
      name: 'Elena Rostova',
      email: 'elena.rostova@traveler.eu',
      authProvider: 'email',
    },
    {
      name: 'David Kim',
      email: 'david.kim@seoulventures.kr',
      authProvider: 'apple',
    },
    {
      name: 'Amara Okafor',
      email: 'amara.okafor@techvoyage.com',
      authProvider: 'email',
    },
  ];

  for (let i = 0; i < usersData.length; i++) {
    const u = usersData[i];
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        authProvider: u.authProvider,
      },
    });

    // Create 1-3 sample orders for each user if a package exists
    if (pkg) {
      const orderCount = (i % 3) + 1;
      for (let j = 0; j < orderCount; j++) {
        await prisma.order.create({
          data: {
            userId: user.id,
            packageId: pkg.id,
            totalAmount: Number(pkg.retailPriceUSD || 15.0),
            currency: 'USD',
            status: 'COMPLETED',
          },
        });
      }
    }
  }

  console.log('Successfully seeded 5 sample customers with orders.');
}

seedCustomers()
  .catch((e) => console.error('Error seeding customers:', e))
  .finally(() => prisma.$disconnect());
