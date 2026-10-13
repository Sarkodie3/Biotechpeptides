import { getAllProducts } from '@/lib/db';
import CatalogView from '@/components/CatalogView';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    orderby?: string;
    in_stock?: string;
  }>;
}

export const metadata = {
  title: 'Buy Peptides Online With a Credit Card - Biotech Peptides',
  description:
    'Buy peptides online, with a credit card! Our mission is to provide laboratories and researchers with the highest-quality peptides possible.',
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

  return (
    <CatalogView
      initialProducts={products}
      total={total}
      currentPage={page}
      totalPages={totalPages}
      categoryFilter="peptides"
      categoryTitle="Peptides"
      categorySubtitle="High-Purity Lyophilized Research Peptides"
    />
  );
}
