import { getAllProducts } from '@/lib/db';
import CatalogView from '@/components/CatalogView';
import type { Metadata } from 'next';
import { CANONICAL_DOMAIN, getBreadcrumbSchema } from '@/lib/seo';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    orderby?: string;
    in_stock?: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Peptide Blends — Synergistic Formulations',
  description:
    'Explore synergistic multi-peptide blends and dual-compound research formulations synthesized and lyophilized in the USA. Verified >99% purity by HPLC-MS analysis.',
  alternates: {
    canonical: `${CANONICAL_DOMAIN}/product-category/blends/`,
  },
  openGraph: {
    title: 'Peptide Blends for Laboratory Research — Synergistic Formulations | Biotech Peptides',
    description:
      'Explore synergistic peptide blend formulations synthesized in the USA. Verified >99% purity with third-party analytical HPLC-MS testing.',
    url: `${CANONICAL_DOMAIN}/product-category/blends/`,
    siteName: 'Biotech Peptides',
    images: [
      {
        url: `${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`,
        width: 1400,
        height: 536,
        alt: 'Biotech Peptides Blends Catalog',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peptide Blends for Laboratory Research — Synergistic Formulations | Biotech Peptides',
    description: 'High-purity lyophilized synergistic peptide blends synthesized in the USA.',
    images: [`${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`],
  },
};

export default async function BlendsCategoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10) || 1;
  const sort = params.orderby;
  const inStockOnly = params.in_stock === '1';

  const { products, total, totalPages } = getAllProducts({
    category: 'blends',
    page,
    limit: 28,
    sort,
    inStockOnly,
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Peptide Blends', url: '/product-category/blends/' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <CatalogView
        initialProducts={products}
        total={total}
        currentPage={page}
        totalPages={totalPages}
        categoryFilter="blends"
        categoryTitle="Peptide Blends"
        categorySubtitle="Synergistic Multi-Component Lyophilized Blends"
      />
    </>
  );
}
