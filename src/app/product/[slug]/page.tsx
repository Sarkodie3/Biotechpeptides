import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts } from '@/lib/db';
import ProductDetailClient from '@/components/ProductDetailClient';
import type { Metadata } from 'next';
import { CANONICAL_DOMAIN, cleanText, getBreadcrumbSchema } from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Biotech Peptides',
      robots: { index: false, follow: false },
    };
  }

  const cleanName = cleanText(product.name);
  let images: Array<{ src?: string }> = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch {}

  const rawImage = images[0]?.src || '/wp-content/uploads/2020/12/biotech-peptides-social.jpg';
  const imageUrl = rawImage.startsWith('http') ? rawImage : `${CANONICAL_DOMAIN}${rawImage}`;

  const rawDesc = cleanText(product.short_description || product.description || '');
  const description = rawDesc.length > 30
    ? rawDesc.slice(0, 155).trim() + '...'
    : `${cleanName} high-purity research peptide (>99% purity HPLC-MS tested). Synthesized & lyophilized in the USA for laboratory in-vitro research use.`;

  const canonicalUrl = `${CANONICAL_DOMAIN}/product/${product.slug}/`;

  return {
    title: `${cleanName} — Buy Research Peptide (>99% Purity) | Biotech Peptides`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${cleanName} — High Purity Research Peptide | Biotech Peptides`,
      description,
      url: canonicalUrl,
      siteName: 'Biotech Peptides',
      images: [
        {
          url: imageUrl,
          alt: `${cleanName} Research Peptide Vial`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cleanName} | Biotech Peptides`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const cleanName = cleanText(product.name);

  let categories: Array<{ name: string; slug: string }> = [];
  try {
    categories = JSON.parse(product.categories || '[]');
  } catch {}

  const primaryCategory = categories[0] || { name: 'Peptides', slug: 'peptides' };
  const catSlug = primaryCategory.slug;

  const { products: related } = getAllProducts({
    category: catSlug,
    limit: 6,
  });

  const filteredRelated = related.filter((p) => p.id !== product.id);

  let images: Array<{ src?: string }> = [];
  try {
    images = JSON.parse(product.images || '[]');
  } catch {}

  const imageList = images
    .map((img) => (img?.src ? (img.src.startsWith('http') ? img.src : `${CANONICAL_DOMAIN}${img.src}`) : null))
    .filter((u): u is string => Boolean(u));

  if (imageList.length === 0) {
    imageList.push(`${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`);
  }

  const rawShortDesc = cleanText(product.short_description || product.description || '');
  const productDescription = rawShortDesc.length > 20
    ? rawShortDesc
    : `${cleanName} is synthesized and lyophilized in the USA for laboratory in-vitro research use only. Verified >99% purity by analytical HPLC-MS testing.`;

  const productUrl = `${CANONICAL_DOMAIN}/product/${product.slug}/`;

  // Structured Data: Product & Offer Schema
  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: cleanName,
    image: imageList,
    description: productDescription,
    sku: product.sku || `BP-${product.id}`,
    category: primaryCategory.name || 'Research Peptides',
    brand: {
      '@type': 'Brand',
      name: 'Biotech Peptides',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'USD',
      price: product.price ? Number(product.price).toFixed(2) : '0.00',
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Biotech Peptides',
        url: CANONICAL_DOMAIN,
      },
    },
  };

  // Structured Data: BreadcrumbList Schema
  const categoryPath = catSlug === 'blends' ? '/product-category/blends/' : '/product-category/peptides/';
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: primaryCategory.name || 'Peptides', url: categoryPath },
    { name: cleanName, url: `/product/${product.slug}/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={filteredRelated} />
    </>
  );
}
