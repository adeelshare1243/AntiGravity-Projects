import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  if (locale && locale !== 'en') {
    redirect(`/${locale}/my-esims`);
  }
  redirect('/my-esims');
}
