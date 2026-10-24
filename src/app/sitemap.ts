import type { MetadataRoute } from 'next';
import { getAllProductSlugs, getAllPostSlugs, getPublicPageSlugs } from '@/lib/db';
import { CANONICAL_DOMAIN } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Core Primary Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${CANONICAL_DOMAIN}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${CANONICAL_DOMAIN}/buy-peptides/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${CANONICAL_DOMAIN}/product-category/peptides/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${CANONICAL_DOMAIN}/product-category/blends/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${CANONICAL_DOMAIN}/news/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${CANONICAL_DOMAIN}/knowledge-center/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${CANONICAL_DOMAIN}/contact-us/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. All 89 Products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = getAllProductSlugs();
    productRoutes = products.map((p) => ({
      url: `${CANONICAL_DOMAIN}/product/${p.slug}/`,
      lastModified: p.created_at ? new Date(p.created_at) : now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Error generating product sitemap entries:', err);
  }

  // 3. All 186 Research Posts
  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = getAllPostSlugs();
    postRoutes = posts.map((post) => ({
      url: `${CANONICAL_DOMAIN}/${post.slug}/`,
      lastModified: post.date ? new Date(post.date) : now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Error generating post sitemap entries:', err);
  }

  // 4. Eligible Public Institutional Pages
  let pageRoutes: MetadataRoute.Sitemap = [];
  try {
    const pages = getPublicPageSlugs();
    // Exclude pages that are already registered above
    const alreadyRegistered = new Set([
      'buy-peptides',
      'news',
      'knowledge-center',
      'contact-us',
    ]);

    pageRoutes = pages
      .filter((pg) => !alreadyRegistered.has(pg.slug))
      .map((pg) => ({
        url: `${CANONICAL_DOMAIN}/${pg.slug}/`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
  } catch (err) {
    console.error('Error generating page sitemap entries:', err);
  }

  // Merge and deduplicate by URL
  const seenUrls = new Set<string>();
  const combined = [
    ...staticRoutes,
    ...productRoutes,
    ...postRoutes,
    ...pageRoutes,
  ].filter((entry) => {
    if (seenUrls.has(entry.url)) return false;
    seenUrls.add(entry.url);
    return true;
  });

  return combined;
}
