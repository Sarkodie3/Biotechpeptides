import type { MetadataRoute } from 'next';
import { CANONICAL_DOMAIN } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/wp-content/uploads/',
          '/_next/static/',
          '/buy-peptides/',
          '/product-category/',
          '/product/',
          '/news/',
          '/knowledge-center/',
          '/contact-us/',
          '/about/',
          '/shipping/',
          '/privacy-policy/',
          '/terms-and-conditions/',
          '/accessibility/',
          '/dr-usman/',
          '/refunds-and-returns/',
        ],
        disallow: [
          '/cart/',
          '/checkout/',
          '/my-account/',
          '/success-page/',
          '/api/',
          '/*?*s=',
          '/*?*orderby=',
          '/*?*in_stock=',
        ],
      },
    ],
    sitemap: `${CANONICAL_DOMAIN}/sitemap.xml`,
    host: CANONICAL_DOMAIN,
  };
}
