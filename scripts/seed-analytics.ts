import { prisma } from '../lib/prisma';

async function seedAnalytics() {
  const existing = await prisma.analyticsSettings.findUnique({
    where: { id: 'default' },
  });

  if (!existing) {
    await prisma.analyticsSettings.create({
      data: {
        id: 'default',
        gaMeasurementId: 'G-9X7J82KL4P',
        metaPixelId: '847109283746192',
        tiktokPixelId: '',
        googleAdsId: 'AW-1082947192',
        searchConsoleTag: '<meta name="google-site-verification" content="dK8sF92JkLm4N1pQrStUv" />',
        customHeadScripts: `<!-- Hotjar Tracking Code for Soovia eSIM -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:3829104,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>`,
      },
    });
    console.log('Seeded default AnalyticsSettings row.');
  } else {
    console.log('AnalyticsSettings default row already exists.');
  }
}

seedAnalytics()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
