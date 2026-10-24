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
  title: 'Buy Research Peptides Online — Made in the USA | Biotech Peptides',
  description:
    'Browse our comprehensive catalog of 80+ high-purity research peptides and synergistic blends synthesized in the USA. Verified >99% purity with batch HPLC-MS Certificates of Analysis.',
  alternates: {
    canonical: `${CANONICAL_DOMAIN}/buy-peptides/`,
  },
  openGraph: {
    title: 'Buy Research Peptides Online — Made in the USA | Biotech Peptides',
    description:
      'Explore laboratory-grade research peptides and multi-compound blends synthesized and lyophilized in the USA with HPLC-MS verification.',
    url: `${CANONICAL_DOMAIN}/buy-peptides/`,
    siteName: 'Biotech Peptides',
    images: [
      {
        url: `${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`,
        width: 1400,
        height: 536,
        alt: 'Biotech Peptides Research Catalog',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy Research Peptides Online — Made in the USA | Biotech Peptides',
    description: 'High-purity lyophilized research peptides and blends synthesized in the USA.',
    images: [`${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`],
  },
};

export default async function BuyPeptidesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10) || 1;
  const sort = params.orderby;
  const inStockOnly = params.in_stock === '1';

  const { products, total, totalPages } = getAllProducts({
    page,
    limit: 28,
    sort,
    inStockOnly,
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Buy Peptides', url: '/buy-peptides/' },
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
        categoryTitle="Buy Research Peptides Online — Made in the USA"
        categorySubtitle="Synthesized & lyophilized in the USA with independent HPLC-MS analytical testing for verified laboratory research."
      />
    </>
  );
}
