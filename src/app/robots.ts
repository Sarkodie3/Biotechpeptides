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
        // Crawlers must fetch noindex pages to see their meta directives.
        // robots.txt is not access control.
        disallow: ['/api/'],
      },
    ],
    sitemap: `${CANONICAL_DOMAIN}/sitemap.xml`,
    host: CANONICAL_DOMAIN,
  };
}
