import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // WordPress used trailing slashes on every URL; keep them so existing links & SEO equity are preserved.
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  serverExternalPackages: ['@prisma/client', 'nodemailer'],
  async redirects() {
    return [
      // Observed on the live site: /shop/ and /checkout/ (empty cart) redirect.
      { source: '/shop/', destination: '/buy-peptides/', permanent: true },
      { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/wp-sitemap.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/product-sitemap.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/post-sitemap.xml', destination: '/sitemap.xml', permanent: true },
      { source: '/page-sitemap.xml', destination: '/sitemap.xml', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/wp-content/uploads/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
