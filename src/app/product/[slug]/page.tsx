import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts } from '@/lib/db';
import ProductDetailClient from '@/components/ProductDetailClient';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found - Biotech Peptides',
    };
  }

  let images: any[] = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch {}

  const primaryImage = images[0]?.src || '/wp-content/uploads/2020/12/biotech-peptides-social.jpg';

  return {
    title: `Buy ${product.name} - Biotech Peptides`,
    description: `Buy ${product.name} research peptides at 99% purity, synthesized and lyophilized in the USA.`,
    openGraph: {
      title: `Buy ${product.name} - Biotech Peptides`,
      description: `Buy ${product.name} research peptides at 99% purity, synthesized and lyophilized in the USA.`,
      images: [{ url: primaryImage }],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  let categories: any[] = [];
  try {
    categories = JSON.parse(product.categories || '[]');
  } catch {}

  const catSlug = categories[0]?.slug;

  const { products: related } = getAllProducts({
    category: catSlug,
    limit: 6,
  });

  const filteredRelated = related.filter((p) => p.id !== product.id);

  // Structured Data (JSON-LD)
  let images: any[] = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch {}

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: images.map((i) => i.src),
    description: product.short_description || product.name,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      url: `https://biotechpeptides.com/product/${product.slug}/`,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Biotech Peptides',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={filteredRelated} />
    </>
  );
}
