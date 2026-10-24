import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '@/lib/db';
import type { Metadata } from 'next';
import { CANONICAL_DOMAIN, getBreadcrumbSchema } from '@/lib/seo';

interface PageProps {
  searchParams: Promise<{ page?: string; s?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const isSearch = Boolean(params.s);

  return {
    title: isSearch
      ? `Search Research Articles: "${params.s}" | Biotech Peptides`
      : 'Peptide Research News & Scientific Articles | Biotech Peptides',
    description:
      'Educational research peptide articles, analytical testing guides, and biochemical insights published for laboratory and scientific researchers.',
    alternates: {
      canonical: `${CANONICAL_DOMAIN}/news/`,
    },
    robots: isSearch ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: 'Peptide Research News & Scientific Articles | Biotech Peptides',
      description:
        'Educational research peptide articles, analytical testing guides, and biochemical insights.',
      url: `${CANONICAL_DOMAIN}/news/`,
      siteName: 'Biotech Peptides',
      images: [
        {
          url: `${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`,
          width: 1400,
          height: 536,
          alt: 'Biotech Peptides Research News',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Peptide Research News & Scientific Articles | Biotech Peptides',
      description: 'Educational research articles and laboratory insights.',
      images: [`${CANONICAL_DOMAIN}/wp-content/uploads/2020/12/biotech-peptides-social.jpg`],
    },
  };
}

export default async function NewsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10) || 1;
  const search = params.s;

  const { posts, totalPages } = getPosts({
    page,
    limit: 12,
    search,
  });

  const breadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'News & Research', url: '/news/' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
        {/* Header & Search */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black uppercase text-gray-900 tracking-tight">
            Peptide Blog & Research Articles
          </h1>
          <p className="text-[15px] text-gray-600 mt-2 max-w-2xl mx-auto">
            All articles, biochemical reviews, and shared publications are strictly for educational and scientific research purposes only.
          </p>

          {/* Search */}
          <div className="max-w-[480px] mx-auto mt-6">
            <form method="GET" action="/news/" className="flex">
              <input
                type="text"
                name="s"
                defaultValue={search || ''}
                placeholder="Search News & Research"
                className="flex-1 border border-gray-300 p-2.5 text-[14px] focus:outline-hidden focus:border-[#0c71c3]"
              />
              <button
                type="submit"
                className="bg-[#0c71c3] hover:bg-[#0a5ea3] text-white px-5 font-bold uppercase text-[13px] tracking-wider transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 border border-gray-200">
            <p className="text-gray-600 text-[15px]">No research articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => {
              const dateStr = new Date(post.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
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
                    <div className="text-[12px] font-semibold text-gray-400 mb-2">
                      {dateStr}
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 hover:text-[#0c71c3] transition-colors mb-3 line-clamp-2">
                      <Link href={`/${post.slug}/`}>
                        {post.title}
                      </Link>
                    </h2>

                    <div
                      className="text-[13px] text-gray-600 line-clamp-3 mb-4 flex-1"
                      dangerouslySetInnerHTML={{ __html: post.excerpt || '' }}
                    />

                    <div className="pt-3 border-t border-gray-100">
                      <Link
                        href={`/${post.slug}/`}
                        className="text-[12px] font-bold uppercase tracking-wider text-[#0c71c3] hover:underline"
                      >
                        Read Article →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <Link
                key={pg}
                href={`/news/?page=${pg}${search ? `&s=${encodeURIComponent(search)}` : ''}`}
                className={`w-9 h-9 flex items-center justify-center text-[13px] font-bold border transition-colors ${
                  pg === page
                    ? 'bg-[#0c71c3] border-[#0c71c3] text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {pg}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
