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
  title: 'Research Peptides Catalog — Single Compounds',
  description:
    'Explore 70+ single research peptides synthesized and lyophilized in the USA. Verified >99% purity by HPLC-MS with third-party analytical Certificates of Analysis.',
  alternates: {
    canonical: `${CANONICAL_DOMAIN}/product-category/peptides/`,
  },
  openGraph: {
    title: 'Research Peptides Catalog — High-Purity Lyophilized Compounds | Biotech Peptides',
    description:
      'Buy high-purity single research peptides synthesized in the USA. Verified >99% purity with third-party analytical HPLC-MS testing.',
    url: `${CANONICAL_DOMAIN}/product-category/peptides/`,
    siteName: 'Biotech Peptides',
    images: [
      {
        url: `${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`,
        width: 1400,
        height: 536,
        alt: 'Biotech Peptides Single Peptides Catalog',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Research Peptides Catalog — High-Purity Lyophilized Compounds | Biotech Peptides',
    description: 'High-purity lyophilized single research peptides synthesized in the USA.',
    images: [`${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`],
  },
};

export default async function PeptidesCategoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10) || 1;
  const sort = params.orderby;
  const inStockOnly = params.in_stock === '1';

  const { products, total, totalPages } = getAllProducts({
    category: 'peptides',
    page,
    limit: 28,
    sort,
    inStockOnly,
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Peptides', url: '/product-category/peptides/' },
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
        categoryFilter="peptides"
        categoryTitle="Single Research Peptides"
        categorySubtitle="High-Purity Lyophilized Research Peptides Synthesized in the USA"
      />
    </>
  );
}
