import { prisma } from '../lib/prisma';

async function seedMarketing() {
  console.log('Checking Marketing data...');

  // 1. Referral Settings
  const settingsCount = await prisma.referralSettings.count();
  if (settingsCount === 0) {
    await prisma.referralSettings.create({
      data: {
        referralRewardAmount: 5.0,
        referralDiscountAmount: 10.0,
        isReferralProgramActive: true,
      },
    });
    console.log('Created default ReferralSettings.');
  }

  // 2. Promo Codes
  const promoCount = await prisma.promoCode.count();
  if (promoCount === 0) {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7);

    await prisma.promoCode.createMany({
      data: [
        {
          code: 'SUMMER20',
          type: 'PERCENTAGE',
          discountValue: 20,
          maxUses: 100,
          usesCount: 18,
          startDate: new Date(),
          endDate: futureDate,
          isActive: true,
        },
        {
          code: 'WELCOME5',
          type: 'FIXED_AMOUNT',
          discountValue: 5.0,
          maxUses: null,
          usesCount: 43,
          startDate: new Date(),
          endDate: null,
          isActive: true,
        },
        {
          code: 'FLASH50',
          type: 'PERCENTAGE',
          discountValue: 50,
          maxUses: 50,
          usesCount: 50,
          startDate: new Date(),
          endDate: futureDate,
          isActive: true,
        },
        {
          code: 'EXPIRED15',
          type: 'PERCENTAGE',
          discountValue: 15,
          maxUses: 200,
          usesCount: 30,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: pastDate,
          isActive: true,
        },
      ],
    });
    console.log('Seeded sample promo codes.');
  }

  // 3. Referrals
  const referralCount = await prisma.referral.count();
  if (referralCount === 0) {
    const users = await prisma.user.findMany({ take: 4 });
    if (users.length >= 2) {
      await prisma.referral.create({
        data: {
          referrerId: users[0].id,
          referredUserId: users[1].id,
          rewardAmount: 5.0,
          status: 'COMPLETED',
        },
      });

      if (users.length >= 4) {
        await prisma.referral.create({
          data: {
            referrerId: users[2].id,
            referredUserId: users[3].id,
            rewardAmount: 5.0,
            status: 'PENDING',
          },
        });
      }
      console.log('Seeded sample referrals.');
    }
  }

  console.log('Marketing seed complete!');
}

seedMarketing()
  .catch((e) => console.error('Error seeding marketing:', e))
  .finally(() => prisma.$disconnect());
