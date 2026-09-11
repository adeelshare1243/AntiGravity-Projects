import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/my-account',
        destination: '/account',
        permanent: false,
      },
      {
        source: '/my-account/account',
        destination: '/account',
        permanent: false,
      },
      {
        source: '/my-account/my-esims',
        destination: '/my-esims',
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
