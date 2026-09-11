import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import MyEsimsClient from '@/components/account/MyEsimsClient';
import { redirect } from 'next/navigation';
import { fulfillCheckoutSuccess } from '@/actions/checkout';

export default async function Page(props: {
  searchParams?: Promise<{ session_id?: string; success?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  // If redirected from successful checkout, fulfill order and referral reward idempotently
  const searchParams = await props.searchParams;
  if (searchParams?.session_id && searchParams?.success === 'true') {
    try {
      await fulfillCheckoutSuccess(searchParams.session_id);
    } catch (err) {
      console.error('[my-esims/page] Checkout success fulfillment error:', err);
    }
  }

  // Fetch customer record from Prisma
  let user = await prisma.user.findUnique({
    where: { id: authUser.id },
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
    });
  }

  // Auto-generate referral code if not present (e.g. 3 uppercase letters + 3 random digits)
  if (!user.referralCode) {
    const namePart = (user.name || user.email || 'USR')
      .replace(/[^a-zA-Z]/g, '')
      .slice(0, 3)
      .toUpperCase()
      .padEnd(3, 'X');
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const generatedCode = `${namePart}${randomDigits}`;

    try {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { referralCode: generatedCode },
      });
    } catch {
      // In case of rare collision, fallback with timestamp suffix
      const fallbackCode = `${namePart}${Date.now().toString().slice(-4)}`;
      user = await prisma.user.update({
        where: { id: user.id },
        data: { referralCode: fallbackCode },
      });
    }
  }

  // Fetch purchased eSIMs from Prisma
  const purchasedEsims = await prisma.userEsim.findMany({
    where: { userId: authUser.id },
    include: {
      order: {
        include: {
          package: {
            include: {
              destination: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const formattedEsims = purchasedEsims.map((esim) => {
    const pkg = esim.order?.package;
    const dest = pkg?.destination;
    const dataAmountMB = pkg?.dataAmountMB || 10240;
    const totalGB = Math.max(1, Math.round(dataAmountMB / 1024));
    const usedGB = esim.installed ? Math.min(totalGB, 1.2) : 0;
    const remainingGB = Math.max(0, totalGB - usedGB);

    return {
      id: esim.id,
      iccid: esim.iccid,
      status: esim.status,
      installed: esim.installed,
      country: dest?.name || pkg?.destinationName || 'Global eSIM',
      flagCode: (dest?.isoCode || 'us').toLowerCase(),
      flagUrl: dest?.flagUrl || `https://flagcdn.com/w40/${(dest?.isoCode || 'us').toLowerCase()}.png`,
      coverage: dest?.name || 'Global',
      dataTotal: `${totalGB} GB`,
      validity: `${pkg?.validityDays || 30} Days`,
      dataUsed: usedGB,
      dataMax: totalGB,
      totalData: totalGB,
      remainingData: remainingGB,
      percentLeft: `${Math.round((remainingGB / totalGB) * 100)}%`,
      package: {
        dataAmount: `${totalGB} GB`,
        validityDays: pkg?.validityDays || 30,
        destination: {
          name: dest?.name || 'Global eSIM',
          flagUrl: dest?.flagUrl,
          isoCode: dest?.isoCode,
        },
      },
    };
  });

  return (
    <MyEsimsClient
      referralCode={user.referralCode || 'SOOVIA1'}
      walletBalance={user.walletBalance ?? 0}
      esims={formattedEsims}
    />
  );
}
