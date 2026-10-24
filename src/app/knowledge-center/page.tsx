import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '@/lib/db';
import type { Metadata } from 'next';
import { CANONICAL_DOMAIN, getBreadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Peptide Knowledge Center — Scientific Research & Reference Guides | Biotech Peptides',
  description:
    'Comprehensive reference guides on peptide synthesis, lyophilization protocols, purity analysis, and storage guidelines for scientific laboratory research.',
  alternates: {
    canonical: `${CANONICAL_DOMAIN}/knowledge-center/`,
  },
  openGraph: {
    title: 'Peptide Knowledge Center — Scientific Research & Reference Guides | Biotech Peptides',
    description:
      'Reference guides on peptide synthesis, lyophilization protocols, and laboratory research storage guidelines.',
    url: `${CANONICAL_DOMAIN}/knowledge-center/`,
    siteName: 'Biotech Peptides',
    images: [
      {
        url: `${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`,
        width: 1400,
        height: 536,
        alt: 'Biotech Peptides Knowledge Center',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peptide Knowledge Center | Biotech Peptides',
    description: 'Scientific reference guides on peptide synthesis and laboratory protocols.',
    images: [`${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`],
  },
};

export default function KnowledgeCenterPage() {
  const { posts } = getPosts({ category: 'Knowledge Center', limit: 30 });

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Knowledge Center', url: '/knowledge-center/' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black uppercase text-gray-900 tracking-tight">
            Peptide Knowledge Center
          </h1>
          <p className="text-[15px] text-gray-600 mt-2 max-w-2xl mx-auto">
            Scientific guides, biochemical specifications, and research protocols. All content is intended strictly for educational and in-vitro laboratory research purposes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <article
              key={post.id}
              className="bg-white border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              {post.featured_image && (
                <Link href={`/${post.slug}/`} className="block relative aspect-16/9 bg-gray-100">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </Link>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 hover:text-[#0c71c3] transition-colors mb-3">
                  <Link href={`/${post.slug}/`}>
                    {post.title}
                  </Link>
                </h2>

                <div
                  className="text-[14px] text-gray-600 line-clamp-3 mb-4 flex-1"
                  dangerouslySetInnerHTML={{ __html: post.excerpt || '' }}
                />

                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href={`/${post.slug}/`}
                    className="text-[13px] font-bold uppercase tracking-wider text-[#0c71c3] hover:underline"
                  >
                    Read Article →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
